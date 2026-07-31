import { NextRequest, NextResponse } from 'next/server'
import { validateCouponForCheckout } from '@/lib/coupons'
import { getGiftTierRestriction } from '@/lib/invitation-limits'

export async function POST(req: NextRequest) {
  try {
    const { code, tier } = await req.json()

    if (!code) {
      return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 })
    }

    const result = await validateCouponForCheckout(
      { code },
      tier ? String(tier).toLowerCase() : undefined
    )

    if ('error' in result) {
      const messages: Record<string, string> = {
        not_found: 'Invalid coupon code',
        inactive: 'Invalid coupon code',
        expired: 'Coupon has expired',
        usage_limit: 'Coupon usage limit reached',
        tier_mismatch: 'This gift coupon is not valid for the selected plan',
      }
      const status = result.error === 'not_found' ? 404 : 400
      return NextResponse.json({ error: messages[result.error] || 'Invalid coupon' }, { status })
    }

    const { coupon } = result

    return NextResponse.json({
      success: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        tierRestriction: getGiftTierRestriction(coupon.code),
      },
    })
  } catch (error) {
    console.error('Coupon Validation Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
