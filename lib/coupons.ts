import { db } from '@/lib/db'
import { coupons } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'
import { getGiftTierRestriction } from '@/lib/invitation-limits'

export type CouponRow = typeof coupons.$inferSelect

export type CouponValidationError =
  | 'not_found'
  | 'inactive'
  | 'expired'
  | 'usage_limit'
  | 'tier_mismatch'

/**
 * Load and validate a coupon for checkout. Optionally enforce GIFT-* tier lock.
 */
export async function validateCouponForCheckout(
  couponIdOrCode: { id?: number; code?: string },
  tierSlug?: string
): Promise<{ coupon: CouponRow } | { error: CouponValidationError }> {
  let coupon: CouponRow | undefined

  if (couponIdOrCode.id) {
    coupon = await db.query.coupons.findFirst({
      where: eq(coupons.id, couponIdOrCode.id),
    })
  } else if (couponIdOrCode.code) {
    coupon = await db.query.coupons.findFirst({
      where: and(eq(coupons.code, couponIdOrCode.code.toUpperCase()), eq(coupons.active, true)),
    })
  }

  if (!coupon) return { error: 'not_found' }
  if (!coupon.active) return { error: 'inactive' }

  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return { error: 'expired' }
  }

  if (coupon.usageLimit != null && coupon.usedCount >= coupon.usageLimit) {
    return { error: 'usage_limit' }
  }

  if (tierSlug) {
    const restriction = getGiftTierRestriction(coupon.code)
    if (restriction && restriction !== tierSlug.toLowerCase()) {
      return { error: 'tier_mismatch' }
    }
  }

  return { coupon }
}

export function applyCouponDiscount(baseAmount: number, coupon: CouponRow): number {
  if (coupon.discountType === 'percentage') {
    return Math.round(baseAmount * (1 - coupon.discountValue / 100))
  }
  return Math.max(0, baseAmount - coupon.discountValue)
}

export function isFullCoverageCoupon(coupon: CouponRow, price: number): boolean {
  if (coupon.discountType === 'percentage' && coupon.discountValue === 100) return true
  if (coupon.discountType === 'fixed' && coupon.discountValue >= price) return true
  return false
}
