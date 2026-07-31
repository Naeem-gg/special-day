export type Currency = 'INR' | 'USD'

export interface Pricing {
  amount: number
  symbol: string
  code: Currency
}

const ALLOWED: ReadonlySet<string> = new Set(['INR', 'USD'])

/** Normalize unknown input to INR | USD. */
export function assertCurrency(value: unknown): Currency {
  const code = String(value || 'INR').toUpperCase()
  return ALLOWED.has(code) ? (code as Currency) : 'INR'
}

export const getDisplayPrice = (inrAmount: number, targetCurrency: Currency): Pricing => {
  const currency = assertCurrency(targetCurrency)

  if (currency === 'INR') {
    return { amount: Math.max(0, Math.round(inrAmount)), symbol: '₹', code: 'INR' }
  }

  // Fixed Premium International Pricing (sticker prices)
  if (inrAmount === 399) return { amount: 4.99, symbol: '$', code: 'USD' }
  if (inrAmount === 799) return { amount: 9.99, symbol: '$', code: 'USD' }
  if (inrAmount === 999) return { amount: 12.99, symbol: '$', code: 'USD' }
  if (inrAmount === 0) return { amount: 0, symbol: '$', code: 'USD' }

  // Fallback conversion for upgrades / partial amounts (approx 1 USD = 83 INR)
  const converted = Math.max(0, Math.ceil(inrAmount / 83 - 0.01) + 0.99)
  return { amount: Math.round(converted * 100) / 100, symbol: '$', code: 'USD' }
}

/** Format for UI: ₹399 or $4.99 */
export function formatMoney(inrAmount: number, currency: Currency): string {
  const { symbol, amount, code } = getDisplayPrice(inrAmount, currency)
  if (code === 'USD') {
    return `${symbol}${amount.toFixed(2)}`
  }
  return `${symbol}${amount}`
}

/**
 * Razorpay expects integer minor units (paise / cents).
 * `inrAmount` is always the canonical INR charge from the DB/pricing logic.
 */
export function toRazorpayAmount(
  inrAmount: number,
  currency: Currency
): { amount: number; currency: Currency; displayAmount: number } {
  const pricing = getDisplayPrice(inrAmount, assertCurrency(currency))
  return {
    amount: Math.round(pricing.amount * 100),
    currency: pricing.code,
    displayAmount: pricing.amount,
  }
}

export const detectCurrency = async (): Promise<Currency> => {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''

    if (tz.includes('Asia/Kolkata') || tz.includes('Asia/Calcutta')) {
      return 'INR'
    }

    // US (and most Americas) visitors → USD
    if (tz.startsWith('America/')) {
      return 'USD'
    }

    const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(4000) })
    if (res.ok) {
      const data = await res.json()
      if (data.country_code === 'IN') return 'INR'
      if (data.country_code === 'US') return 'USD'
      // Other countries: default USD for international cards on Razorpay
      if (data.country_code) return 'USD'
    }
  } catch {
    // Fail silently
  }
  return 'INR'
}
