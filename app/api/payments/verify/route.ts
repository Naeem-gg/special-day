import { db } from '@/lib/db'
import { invitations, coupons, tiers as tiersTable } from '@/lib/db/schema'
import { and, eq, sql } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { sendPurchaseReceipt } from '@/lib/mail'
import { razorpay } from '@/lib/razorpay'
import { getUserSession } from '@/lib/auth-utils'
import { applyCouponDiscount, validateCouponForCheckout } from '@/lib/coupons'
import {
  clampGallery,
  getGalleryLimit,
  MAX_FREE_BASIC_PER_EMAIL,
} from '@/lib/invitation-limits'
import { assertCurrency, toRazorpayAmount } from '@/lib/currency'

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      invitationData,
      bypassPayment,
    } = await req.json()

    if (!invitationData || typeof invitationData !== 'object') {
      return NextResponse.json({ error: 'Missing invitation data' }, { status: 400 })
    }

    const tierSlug = (invitationData.tier || 'basic').toLowerCase()
    const session = await getUserSession()

    // Prefer authenticated email over client-supplied when available
    if (session?.email) {
      invitationData.userEmail = session.email
    }

    const [dbTier] = await db.select().from(tiersTable).where(eq(tiersTable.slug, tierSlug))
    if (!dbTier) {
      return NextResponse.json({ error: 'Invalid tier in invitation data' }, { status: 400 })
    }

    let expectedAmount = dbTier.price
    let validatedCouponId: number | null = invitationData.couponId || null

    // Upgrade: deduct previously paid amount + verify ownership
    let existingInvite: typeof invitations.$inferSelect | undefined
    if (invitationData.isUpgrade && invitationData.slug) {
      existingInvite = await db.query.invitations.findFirst({
        where: eq(invitations.slug, invitationData.slug),
      })
      if (!existingInvite) {
        return NextResponse.json({ error: 'Invitation to upgrade not found' }, { status: 404 })
      }

      const ownerEmail = existingInvite.userEmail?.toLowerCase()
      const sessionEmail = session?.email ? String(session.email).toLowerCase() : ''
      if (!ownerEmail || !sessionEmail || ownerEmail !== sessionEmail) {
        return NextResponse.json(
          { error: 'Please log in as the invitation owner to upgrade' },
          { status: 403 }
        )
      }

      expectedAmount = Math.max(0, expectedAmount - (existingInvite.paidAmount || 0))
    }

    if (validatedCouponId) {
      const result = await validateCouponForCheckout({ id: validatedCouponId }, tierSlug)
      if ('error' in result) {
        const messages: Record<string, string> = {
          not_found: 'Invalid coupon',
          inactive: 'Invalid or inactive coupon',
          expired: 'Coupon has expired',
          usage_limit: 'Coupon usage limit reached',
          tier_mismatch: 'This gift coupon is not valid for the selected plan',
        }
        return NextResponse.json({ error: messages[result.error] || 'Invalid coupon' }, { status: 403 })
      }
      expectedAmount = applyCouponDiscount(expectedAmount, result.coupon)
    }

    // Gallery limits
    if (invitationData.gallery && Array.isArray(invitationData.gallery)) {
      if (invitationData.gallery.length > getGalleryLimit(tierSlug)) {
        return NextResponse.json(
          { error: `This plan allows up to ${getGalleryLimit(tierSlug)} photo(s)` },
          { status: 400 }
        )
      }
      invitationData.gallery = clampGallery(invitationData.gallery, tierSlug)
    }

    // Server-authoritative amount charged this transaction
    let chargeAmount = expectedAmount

    if (!bypassPayment) {
      if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
        return NextResponse.json({ error: 'Missing required payment parameters' }, { status: 400 })
      }

      const secret = (process.env.RAZORPAY_KEY_SECRET || '').trim()
      const hmac = crypto.createHmac('sha256', secret)
      hmac.update(razorpay_order_id + '|' + razorpay_payment_id)
      const generated_signature = hmac.digest('hex')

      if (generated_signature !== razorpay_signature) {
        return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 })
      }

      const payment = await razorpay.payments.fetch(razorpay_payment_id)
      const paidCurrency = assertCurrency(payment.currency)
      const expected = toRazorpayAmount(chargeAmount, paidCurrency)

      if (
        String(payment.currency || '').toUpperCase() !== expected.currency ||
        Number(payment.amount) !== expected.amount
      ) {
        console.error('PRICE MANIPULATION DETECTED:', {
          paid: payment.amount,
          paidCurrency: payment.currency,
          expectedAmount: expected.amount,
          expectedCurrency: expected.currency,
          chargeAmountInr: chargeAmount,
          user: invitationData.userEmail,
        })
        return NextResponse.json({ error: 'Price mismatch. Payment rejected.' }, { status: 400 })
      }
    } else if (chargeAmount > 0) {
      // Free-basic promo only when no coupon fully covers the price
      const isFreeBasicPromo =
        tierSlug === 'basic' &&
        !invitationData.isUpgrade &&
        !invitationData.isGift &&
        !validatedCouponId

      if (!isFreeBasicPromo) {
        return NextResponse.json(
          { error: 'Payment required — coupon does not cover the full amount' },
          { status: 403 }
        )
      }

      const email = (invitationData.userEmail || '').trim().toLowerCase()
      if (!email || !email.includes('@')) {
        return NextResponse.json(
          { error: 'Email is required for free invitations' },
          { status: 400 }
        )
      }

      const existingFree = await db
        .select({ id: invitations.id })
        .from(invitations)
        .where(
          and(
            sql`lower(${invitations.userEmail}) = ${email}`,
            eq(invitations.tier, 'basic'),
            eq(invitations.paidAmount, 0)
          )
        )

      if (existingFree.length >= MAX_FREE_BASIC_PER_EMAIL) {
        return NextResponse.json(
          {
            error: `Free basic limit reached (${MAX_FREE_BASIC_PER_EMAIL} per email). Please upgrade or use a different email.`,
          },
          { status: 403 }
        )
      }

      chargeAmount = 0
    }
    // else chargeAmount === 0: coupon or free upgrade — already validated

    // ── Gift flow ──
    if (invitationData.isGift) {
      const { userEmail, senderName } = invitationData

      const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase()
      const giftCode = `GIFT-${tierSlug.toUpperCase()}-${randomSuffix}`

      const [newCoupon] = await db
        .insert(coupons)
        .values({
          code: giftCode,
          discountType: 'percentage',
          discountValue: 100,
          usageLimit: 1,
          active: true,
        })
        .returning()

      if (validatedCouponId) {
        await db
          .update(coupons)
          .set({ usedCount: sql`${coupons.usedCount} + 1` })
          .where(eq(coupons.id, validatedCouponId))
      }

      if (userEmail) {
        const { sendGiftCoupon } = await import('@/lib/mail')
        sendGiftCoupon({
          to: userEmail,
          planName: tierSlug,
          couponCode: giftCode,
          senderName: senderName || 'A friend',
        }).catch((err) => console.error('Failed to send gift email:', err))
      }

      return NextResponse.json({
        success: true,
        isGift: true,
        giftCode: newCoupon.code,
      })
    }

    const {
      slug,
      brideName,
      groomName,
      date,
      venue,
      events,
      gallery,
      musicUrl,
      backgroundImage,
      template,
      userEmail,
      isUpgrade,
      ourStory,
      mapUrl,
      rsvpButtonText,
    } = invitationData

    if (!slug || !brideName || !groomName || !date || !venue) {
      return NextResponse.json({ error: 'Missing required invitation fields' }, { status: 400 })
    }

    let resultInvitation

    if (isUpgrade) {
      const newPaidAmount = (existingInvite!.paidAmount || 0) + chargeAmount

      const [updatedInvitation] = await db
        .update(invitations)
        .set({
          tier: tierSlug,
          template: template || existingInvite!.template,
          paidAmount: newPaidAmount,
          razorpayOrderId: razorpay_order_id || existingInvite!.razorpayOrderId,
          razorpayPaymentId: razorpay_payment_id || existingInvite!.razorpayPaymentId,
          brideName: brideName !== undefined ? brideName : existingInvite!.brideName,
          groomName: groomName !== undefined ? groomName : existingInvite!.groomName,
          date: date ? new Date(date) : existingInvite!.date,
          venue: venue !== undefined ? venue : existingInvite!.venue,
          events: events || existingInvite!.events,
          gallery: gallery
            ? clampGallery(gallery, tierSlug)
            : existingInvite!.gallery,
          musicUrl: musicUrl !== undefined ? musicUrl : existingInvite!.musicUrl,
          ourStory: ourStory !== undefined ? ourStory : existingInvite!.ourStory,
          mapUrl: mapUrl !== undefined ? mapUrl : existingInvite!.mapUrl,
          couponId: validatedCouponId || existingInvite!.couponId,
        })
        .where(eq(invitations.id, existingInvite!.id))
        .returning()

      resultInvitation = updatedInvitation
    } else {
      const [newInvitation] = await db
        .insert(invitations)
        .values({
          slug,
          brideName,
          groomName,
          userEmail,
          date: new Date(date),
          venue,
          events: events || [],
          gallery: clampGallery(gallery || [], tierSlug),
          musicUrl,
          backgroundImage,
          tier: tierSlug,
          template: template || 'rose-gold',
          couponId: validatedCouponId,
          discountApplied: Math.max(0, dbTier.price - chargeAmount),
          paidAmount: chargeAmount,
          razorpayOrderId: razorpay_order_id || 'FREE',
          razorpayPaymentId: razorpay_payment_id || 'FREE',
          ourStory: ourStory || null,
          mapUrl: mapUrl || null,
          rsvpButtonText: rsvpButtonText || 'RSVP Now',
        })
        .returning()

      resultInvitation = newInvitation
    }

    if (validatedCouponId) {
      await db
        .update(coupons)
        .set({ usedCount: sql`${coupons.usedCount} + 1` })
        .where(eq(coupons.id, validatedCouponId))
    }

    if (userEmail) {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dnvites.com'
      const orderSuffix = razorpay_order_id
        ? razorpay_order_id.replace('order_', '').substring(0, 8).toUpperCase()
        : Math.random().toString(36).substring(2, 10).toUpperCase()
      const displayOrderId = `#DNV${orderSuffix}`

      sendPurchaseReceipt({
        to: userEmail,
        brideName,
        groomName,
        planName: tierSlug,
        amountPaid: chargeAmount,
        orderId: displayOrderId,
        invitationLink: `${baseUrl}/invite/${slug}`,
      }).catch((err) => console.error('Failed to send receipt:', err))
    }

    return NextResponse.json({ success: true, data: resultInvitation })
  } catch (error) {
    console.error('Payment Verification Error:', error)
    return NextResponse.json(
      { error: 'Failed to verify payment and save invitation' },
      { status: 500 }
    )
  }
}
