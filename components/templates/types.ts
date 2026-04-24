export interface TemplateEvent {
  name: string;
  time: string;
  location: string;
  description?: string;
}

export interface TemplatePhoto {
  url: string;
  publicId: string;
}

export interface TemplateProps {
  brideName: string;
  groomName: string;
  date: Date;
  venue: string;
  events: TemplateEvent[];
  gallery: TemplatePhoto[];
  musicUrl?: string;
  isPreview?: boolean;
  isThumbnail?: boolean;
  invitationId?: number;
  tier?: "basic" | "standard" | "premium";
  autoOpen?: boolean;
  inline?: boolean;
}

export interface TemplateMeta {
  slug: string;
  name: string;
  description: string;
  tier: "basic" | "standard" | "premium";
  palette: string[]; // CSS colors for thumbnail
  emoji: string;
}

export const TEMPLATES: TemplateMeta[] = [
  {
    slug: "rose-gold",
    name: "Rose Gold Luxury",
    description: "Soft petals, champagne warmth & an elegant serif romance.",
    tier: "basic",
    palette: ["#FAF0E6", "#B76E79", "#D4AF37"],
    emoji: "🌹",
  },
  {
    slug: "botanical",
    name: "Botanical Garden",
    description: "Earthy greens, hand-drawn vines & a natural outdoor soul.",
    tier: "basic",
    palette: ["#F2F7EE", "#2D5A27", "#8FAF7E"],
    emoji: "🌿",
  },
  {
    slug: "sakura",
    name: "Sakura Dream",
    description: "Japanese minimalism, blush petals & brushstroke elegance.",
    tier: "basic",
    palette: ["#FFF0F5", "#FFB7C5", "#D4B4FD"],
    emoji: "🌸",
  },
  {
    slug: "azure-ocean",
    name: "Azure Ocean",
    description: "Coastal waves, turquoise depths & Mediterranean sunshine.",
    tier: "standard",
    palette: ["#EBF8FF", "#0A3F6B", "#4ECDC4"],
    emoji: "🌊",
  },
  {
    slug: "emerald-forest",
    name: "Emerald Forest",
    description: "Dark emerald, copper accents & glowing firefly magic.",
    tier: "standard",
    palette: ["#1A3C34", "#B87333", "#F0EAD6"],
    emoji: "🌲",
  },
  {
    slug: "cinematic",
    name: "Cinematic Film",
    description: "Vintage Hollywood, film grain & a silver-screen romance.",
    tier: "standard",
    palette: ["#F0EAD6", "#2B2B2B", "#C0A060"],
    emoji: "🎬",
  },
  {
    slug: "midnight-noir",
    name: "Midnight Noir",
    description: "Jet black luxury, gold light & a starfield of wishes.",
    tier: "premium",
    palette: ["#0D0D0D", "#C9A84C", "#1A1A1A"],
    emoji: "🖤",
  },
  {
    slug: "royal-gold",
    name: "Royal Gold",
    description: "Velvet burgundy, antique gold & regal ornate splendour.",
    tier: "premium",
    palette: ["#6B1A2B", "#D4AF37", "#FFFBF5"],
    emoji: "👑",
  },
  {
    slug: "celestial",
    name: "Celestial Stars",
    description: "Galaxy cosmos, meteor showers & a love written in the stars.",
    tier: "premium",
    palette: ["#0A0E2A", "#6C3BA6", "#FFD700"],
    emoji: "✨",
  },
  {
    slug: "sacred-ivory",
    name: "Sacred Ivory",
    description: "Cream elegance, gold leaf accents & timeless sacred beauty.",
    tier: "premium",
    palette: ["#FFFDF5", "#D4AF37", "#8B4513"],
    emoji: "🕊️",
  },
];

export const TIER_TEMPLATES: Record<string, string[]> = {
  basic: ["rose-gold", "botanical", "sakura"],
  standard: ["rose-gold", "botanical", "sakura", "azure-ocean", "emerald-forest", "cinematic"],
  premium: ["rose-gold", "botanical", "sakura", "azure-ocean", "emerald-forest", "cinematic", "midnight-noir", "royal-gold", "celestial", "sacred-ivory"],
};
