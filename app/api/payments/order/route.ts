import { db } from '@/lib/db'
import { tiers, invitations } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { razorpay } from '@/lib/razorpay'
import { applyCouponDiscount, validateCouponForCheckout } from '@/lib/coupons'
import { assertCurrency, toRazorpayAmount } from '@/lib/currency'

export async function POST(req: NextRequest) {
  try {
    const { tierSlug, couponCode, currency: rawCurrency = 'INR', invitationSlug } = await req.json()
    const currency = assertCurrency(rawCurrency)

    const [tier] = await db.select().from(tiers).where(eq(tiers.slug, tierSlug))
    if (!tier) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })
    }

    // Canonical pricing stays in INR
    let baseAmountInr = tier.price

    if (invitationSlug) {
      const existingInvite = await db.query.invitations.findFirst({
        where: eq(invitations.slug, invitationSlug),
      })
      if (existingInvite) {
        baseAmountInr = Math.max(0, tier.price - (existingInvite.paidAmount || 0))
      }
    }

    if (couponCode) {
      const result = await validateCouponForCheckout(
        { code: couponCode },
        (tierSlug || '').toLowerCase()
      )

      if ('error' in result) {
        const messages: Record<string, string> = {
          not_found: 'Invalid coupon code',
          inactive: 'Invalid or inactive coupon',
          expired: 'Coupon has expired',
          usage_limit: 'Coupon usage limit reached',
          tier_mismatch: 'This gift coupon is not valid for the selected plan',
        }
        return NextResponse.json(
          { error: messages[result.error] || 'Invalid coupon' },
          { status: 400 }
        )
      }

      baseAmountInr = applyCouponDiscount(baseAmountInr, result.coupon)
    }

    const razorpayAmount = toRazorpayAmount(baseAmountInr, currency)

    if (razorpayAmount.amount === 0) {
      return NextResponse.json({
        orderId: 'FREE_' + Date.now(),
        amount: 0,
        currency: razorpayAmount.currency,
        amountInr: baseAmountInr,
        isFree: true,
      })
    }

    const order = await razorpay.orders.create({
      amount: razorpayAmount.amount,
      currency: razorpayAmount.currency,
      receipt: `receipt_${Date.now()}`,
    })

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      amountInr: baseAmountInr,
    })
  } catch (error: any) {
    console.error('Razorpay Order Error:', error)
    const errorMessage = error.error?.description || error.message || 'Failed to initiate payment'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
