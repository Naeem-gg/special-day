export interface StyleEvent {
  name: string
  time: string
  location: string
  description?: string
}

export interface StylePhoto {
  url: string
  publicId: string
}

export interface StyleProps {
  brideName: string
  groomName: string
  date: Date
  venue: string
  events: StyleEvent[]
  gallery: StylePhoto[]
  musicUrl?: string
  isPreview?: boolean
  isThumbnail?: boolean
  invitationId?: number
  ourStory?: string
  mapUrl?: string
  tier?: 'basic' | 'standard' | 'premium'
  autoOpen?: boolean
  inline?: boolean
}

export interface StyleMeta {
  slug: string
  name: string
  description: string
  tier: 'basic' | 'standard' | 'premium'
  palette: string[] // CSS colors for thumbnail
  emoji: string
}

export const STYLES: StyleMeta[] = [
  // --- BASIC (7) ---
  {
    slug: 'rose-gold',
    name: 'Rose Gold Luxury',
    description: 'Soft petals, champagne warmth & an elegant serif romance.',
    tier: 'basic',
    palette: ['#FAF0E6', '#B76E79', '#D4AF37'],
    emoji: '🌹',
  },
  {
    slug: 'botanical',
    name: 'Botanical Garden',
    description: 'Earthy greens, hand-drawn vines & a natural outdoor soul.',
    tier: 'basic',
    palette: ['#F2F7EE', '#2D5A27', '#8FAF7E'],
    emoji: '🌿',
  },
  {
    slug: 'sakura',
    name: 'Sakura Dream',
    description: 'Japanese minimalism, blush petals & brushstroke elegance.',
    tier: 'basic',
    palette: ['#FFF0F5', '#FFB7C5', '#D4B4FD'],
    emoji: '🌸',
  },
  {
    slug: 'minimal-modern',
    name: 'Minimal Modern',
    description: 'Clean white space, architectural lines & contemporary chic.',
    tier: 'basic',
    palette: ['#FFFFFF', '#1A1A1A', '#F5F5F5'],
    emoji: '🏢',
  },
  {
    slug: 'lavender-mist',
    name: 'Lavender Mist',
    description: 'Dreamy purples, soft gradients & a whisper of spring.',
    tier: 'basic',
    palette: ['#F3E5F5', '#9575CD', '#E1BEE7'],
    emoji: '🪻',
  },
  {
    slug: 'sunset-breeze',
    name: 'Sunset Breeze',
    description: 'Golden hour warmth, casual scripts & seaside serenity.',
    tier: 'basic',
    palette: ['#FFF8E1', '#FFB300', '#FF7043'],
    emoji: '🌅',
  },
  {
    slug: 'classic-script',
    name: 'Classic Script',
    description: 'Traditional calligraphy, timeless black & white elegance.',
    tier: 'basic',
    palette: ['#FFFFFF', '#000000', '#E0E0E0'],
    emoji: '✒️',
  },

  // --- STANDARD (7) ---
  {
    slug: 'azure-ocean',
    name: 'Azure Ocean',
    description: 'Coastal waves, turquoise depths & Mediterranean sunshine.',
    tier: 'standard',
    palette: ['#EBF8FF', '#0A3F6B', '#4ECDC4'],
    emoji: '🌊',
  },
  {
    slug: 'emerald-forest',
    name: 'Emerald Forest',
    description: 'Dark emerald, copper accents & glowing firefly magic.',
    tier: 'standard',
    palette: ['#1A3C34', '#B87333', '#F0EAD6'],
    emoji: '🌲',
  },
  {
    slug: 'cinematic',
    name: 'Cinematic Film',
    description: 'Vintage Hollywood, film grain & a silver-screen romance.',
    tier: 'standard',
    palette: ['#F0EAD6', '#2B2B2B', '#C0A060'],
    emoji: '🎬',
  },
  {
    slug: 'vintage-chic',
    name: 'Vintage Chic',
    description: 'Sepia tones, lace textures & nostalgic typewriter keys.',
    tier: 'standard',
    palette: ['#F5E6D3', '#8D6E63', '#A1887F'],
    emoji: '📻',
  },
  {
    slug: 'desert-sand',
    name: 'Desert Sand',
    description: 'Warm terracotta, boho patterns & dried pampas grass.',
    tier: 'standard',
    palette: ['#FDF5E6', '#D2691E', '#BC8F8F'],
    emoji: '🌵',
  },
  {
    slug: 'amethyst-glance',
    name: 'Amethyst Glance',
    description: 'Crystalline structures, purple depths & silver highlights.',
    tier: 'standard',
    palette: ['#301934', '#9370DB', '#C0C0C0'],
    emoji: '💎',
  },
  {
    slug: 'arctic-frost',
    name: 'Arctic Frost',
    description: 'Cool ice blues, geometric glints & winter wonderland vibes.',
    tier: 'standard',
    palette: ['#F0F8FF', '#B0E0E6', '#4682B4'],
    emoji: '❄️',
  },

  // --- PREMIUM (7) ---
  {
    slug: 'midnight-noir',
    name: 'Midnight Noir',
    description: 'Jet black luxury, gold light & a starfield of wishes.',
    tier: 'premium',
    palette: ['#0D0D0D', '#C9A84C', '#1A1A1A'],
    emoji: '🖤',
  },
  {
    slug: 'royal-gold',
    name: 'Royal Gold',
    description: 'Velvet burgundy, antique gold & regal ornate splendour.',
    tier: 'premium',
    palette: ['#6B1A2B', '#D4AF37', '#FFFBF5'],
    emoji: '👑',
  },
  {
    slug: 'celestial',
    name: 'Celestial Stars',
    description: 'Galaxy cosmos, meteor showers & a love written in the stars.',
    tier: 'premium',
    palette: ['#0A0E2A', '#6C3BA6', '#FFD700'],
    emoji: '✨',
  },
  {
    slug: 'sacred-ivory',
    name: 'Sacred Ivory',
    description: 'Cream elegance, gold leaf accents & timeless sacred beauty.',
    tier: 'premium',
    palette: ['#FFFDF5', '#D4AF37', '#8B4513'],
    emoji: '🕊️',
  },
  {
    slug: 'diamond-regal',
    name: 'Diamond Regal',
    description: 'Brilliant sparkles, platinum edges & ultimate prestige.',
    tier: 'premium',
    palette: ['#111111', '#E5E4E2', '#FFFFFF'],
    emoji: '💍',
  },
  {
    slug: 'enchanted-garden',
    name: 'Enchanted Garden',
    description: 'Living florals, glowing vines & a fairy-tale atmosphere.',
    tier: 'premium',
    palette: ['#0B2010', '#D4AF37', '#228B22'],
    emoji: '🧚',
  },
  {
    slug: 'opulent-ruby',
    name: 'Opulent Ruby',
    description: 'Deep crimson silk, heavy gold & passionate regal romance.',
    tier: 'premium',
    palette: ['#4A0404', '#D4AF37', '#800000'],
    emoji: '🏮',
  },
]

export const TIER_STYLES: Record<string, string[]> = {
  basic: STYLES.filter((t) => t.tier === 'basic').map((t) => t.slug),
  standard: STYLES.filter((t) => t.tier === 'basic' || t.tier === 'standard').map(
    (t) => t.slug
  ),
  premium: STYLES.map((t) => t.slug),
}


