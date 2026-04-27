import Razorpay from 'razorpay'

if (typeof window !== 'undefined') {
  throw new Error('Razorpay client should only be used on the server.')
}

// Allow falling back to NEXT_PUBLIC_RAZORPAY_KEY_ID if RAZORPAY_KEY_ID is not explicitly set
const keyId = (process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '').trim()
const keySecret = (process.env.RAZORPAY_KEY_SECRET || '').trim()

if (!keyId || !keySecret) {
  console.warn('⚠️ Razorpay API credentials are missing in environment variables.')
}

export const razorpay = new Razorpay({
  key_id: keyId || 'missing_key_id',
  key_secret: keySecret || 'missing_key_secret',
})
