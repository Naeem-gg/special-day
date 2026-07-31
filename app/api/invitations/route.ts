import { NextResponse } from 'next/server'

/**
 * Public invitation creation is disabled — invites are created only via
 * verified payment flow (`/api/payments/verify`).
 */
export async function POST() {
  return NextResponse.json(
    {
      error:
        'Direct invitation creation is disabled. Use the checkout / payment verification flow.',
    },
    { status: 403 }
  )
}
