import { db } from '@/lib/db'
import { coupons, invitations } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-utils'

export async function GET() {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth

  try {
    const allCoupons = await db.query.coupons.findMany({
      orderBy: [desc(coupons.createdAt)],
    })
    return NextResponse.json(allCoupons)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth

  try {
    const body = await req.json()
    const { code, discountType, discountValue, expiresAt, usageLimit, active } = body

    if (!code || !discountType || discountValue === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const insertData: Record<string, unknown> = {
      code: code.toUpperCase(),
      discountType,
      discountValue,
      usageLimit,
      active: active !== undefined ? active : true,
    }

    if (expiresAt) {
      insertData.expiresAt = new Date(expiresAt)
    }

    const [newCoupon] = await db.insert(coupons).values(insertData as any).returning()

    return NextResponse.json(newCoupon)
  } catch (error) {
    console.error('Create Coupon Error:', error)
    return NextResponse.json({ error: 'Failed to create coupon' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth

  try {
    const body = await req.json()
    const { id, code, discountType, discountValue, expiresAt, usageLimit, active } = body

    if (!id || !code || !discountType || discountValue === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const [updatedCoupon] = await db
      .update(coupons)
      .set({
        code: code.toUpperCase(),
        discountType,
        discountValue,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        usageLimit,
        active: active !== undefined ? active : true,
      })
      .where(eq(coupons.id, id))
      .returning()

    return NextResponse.json(updatedCoupon)
  } catch (error) {
    console.error('Update Coupon Error:', error)
    return NextResponse.json({ error: 'Failed to update coupon' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    await db.update(invitations).set({ couponId: null }).where(eq(invitations.couponId, id))
    await db.delete(coupons).where(eq(coupons.id, id))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete Coupon Error:', error)
    return NextResponse.json({ error: 'Failed to delete coupon' }, { status: 500 })
  }
}
