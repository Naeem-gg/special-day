export type InvitationTier = 'basic' | 'standard' | 'premium'

const GALLERY_LIMITS: Record<string, number> = {
  basic: 1,
  standard: 5,
  premium: 10,
}

/** Max gallery photos allowed for a purchased tier. */
export function getGalleryLimit(tier: string | null | undefined): number {
  return GALLERY_LIMITS[(tier || 'basic').toLowerCase()] ?? 1
}

export function clampGallery<T>(gallery: T[] | null | undefined, tier: string): T[] {
  const items = Array.isArray(gallery) ? gallery : []
  return items.slice(0, getGalleryLimit(tier))
}

/**
 * Hosting window:
 * - premium (Gold): lifetime (never expires)
 * - basic / standard: 1 year from creation
 */
export function isInvitationExpired(
  createdAt: Date | string,
  tier: string | null | undefined
): boolean {
  if ((tier || '').toLowerCase() === 'premium') return false
  const created = new Date(createdAt)
  if (Number.isNaN(created.getTime())) return false
  const expires = new Date(created)
  expires.setFullYear(expires.getFullYear() + 1)
  return new Date() > expires
}

/** Free basic promo: max invites per email without a paid order. */
export const MAX_FREE_BASIC_PER_EMAIL = 3

export function getGiftTierRestriction(code: string): string | null {
  if (!code.toUpperCase().startsWith('GIFT-')) return null
  const parts = code.toUpperCase().split('-')
  if (parts.length >= 3 && parts[1]) {
    return parts[1].toLowerCase()
  }
  return null
}
