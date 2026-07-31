'use client'

import { Currency } from '@/lib/currency'

export function CurrencyToggle({
  currency,
  onChange,
  className = '',
}: {
  currency: Currency
  onChange: (c: Currency) => void
  className?: string
}) {
  return (
    <div
      className={`inline-flex items-center rounded-full border border-rose-200 bg-white p-0.5 shadow-sm ${className}`}
      role="group"
      aria-label="Currency"
    >
      {(['INR', 'USD'] as Currency[]).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => onChange(code)}
          className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
            currency === code
              ? 'bg-[#F43F8F] text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          {code === 'INR' ? '₹ INR' : '$ USD'}
        </button>
      ))}
    </div>
  )
}
