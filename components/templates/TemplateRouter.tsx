'use client'

import dynamic from 'next/dynamic'
import { STYLES, type StyleProps } from './types'

const RoseGoldTemplate = dynamic(() => import('./RoseGoldTemplate'))
const BotanicalTemplate = dynamic(() => import('./BotanicalTemplate'))
const SakuraDreamTemplate = dynamic(() => import('./SakuraDreamTemplate'))
const AzureOceanTemplate = dynamic(() => import('./AzureOceanTemplate'))
const EmeraldForestTemplate = dynamic(() => import('./EmeraldForestTemplate'))
const CinematicFilmTemplate = dynamic(() => import('./CinematicFilmTemplate'))
const MidnightNoirTemplate = dynamic(() => import('./MidnightNoirTemplate'))
const RoyalGoldTemplate = dynamic(() => import('./RoyalGoldTemplate'))
const CelestialTemplate = dynamic(() => import('./CelestialTemplate'))
const SacredIvoryTemplate = dynamic(() => import('./SacredIvoryTemplate'))

// New Basic
const MinimalModernTemplate = dynamic(() => import('./MinimalModernTemplate'))
const LavenderMistTemplate = dynamic(() => import('./LavenderMistTemplate'))
const SunsetBreezeTemplate = dynamic(() => import('./SunsetBreezeTemplate'))
const ClassicScriptTemplate = dynamic(() => import('./ClassicScriptTemplate'))

// New Standard
const VintageChicTemplate = dynamic(() => import('./VintageChicTemplate'))
const DesertSandTemplate = dynamic(() => import('./DesertSandTemplate'))
const AmethystGlanceTemplate = dynamic(() => import('./AmethystGlanceTemplate'))
const ArcticFrostTemplate = dynamic(() => import('./ArcticFrostTemplate'))

// New Premium
const DiamondRegalTemplate = dynamic(() => import('./DiamondRegalTemplate'))
const EnchantedGardenTemplate = dynamic(() => import('./EnchantedGardenTemplate'))
const OpulentRubyTemplate = dynamic(() => import('./OpulentRubyTemplate'))

const STYLE_MAP: Record<string, React.ComponentType<StyleProps>> = {
  'rose-gold': RoseGoldTemplate,
  botanical: BotanicalTemplate,
  sakura: SakuraDreamTemplate,
  'minimal-modern': MinimalModernTemplate,
  'lavender-mist': LavenderMistTemplate,
  'sunset-breeze': SunsetBreezeTemplate,
  'classic-script': ClassicScriptTemplate,

  'azure-ocean': AzureOceanTemplate,
  'emerald-forest': EmeraldForestTemplate,
  cinematic: CinematicFilmTemplate,
  'vintage-chic': VintageChicTemplate,
  'desert-sand': DesertSandTemplate,
  'amethyst-glance': AmethystGlanceTemplate,
  'arctic-frost': ArcticFrostTemplate,

  'midnight-noir': MidnightNoirTemplate,
  'royal-gold': RoyalGoldTemplate,
  celestial: CelestialTemplate,
  'sacred-ivory': SacredIvoryTemplate,
  'diamond-regal': DiamondRegalTemplate,
  'enchanted-garden': EnchantedGardenTemplate,
  'opulent-ruby': OpulentRubyTemplate,
}

import React from 'react'
import Link from 'next/link'
import EnvelopeIntro from '../invitation/EnvelopeIntro'
import DoorIntro from '../invitation/DoorIntro'
import CurtainIntro from '../invitation/CurtainIntro'

export default function StyleRouter({
  style,
  ...props
}: StyleProps & { style: string }) {
  const Component = STYLE_MAP[style] ?? RoseGoldTemplate
  const meta = STYLES.find((t) => t.slug === style)
  const isPremium = meta?.tier === 'premium'

  const renderIntro = () => {
    if (!isPremium || props.isThumbnail) return null

    // Assign different animations to different themes
    const doorThemes = [
      'royal-gold',
      'midnight-noir',
      'sacred-ivory',
      'diamond-regal',
      'opulent-ruby',
      'minimal-modern',
      'cinematic',
    ]
    const curtainThemes = [
      'sakura',
      'azure-ocean',
      'botanical',
      'enchanted-garden',
      'lavender-mist',
      'rose-gold',
      'amethyst-glance',
    ]

    if (doorThemes.includes(style)) {
      return (
        <DoorIntro
          brideName={props.brideName}
          groomName={props.groomName}
          variant={style}
          autoOpen={props.autoOpen}
          inline={props.inline}
        />
      )
    }

    if (curtainThemes.includes(style)) {
      return (
        <CurtainIntro
          brideName={props.brideName}
          groomName={props.groomName}
          variant={style}
          autoOpen={props.autoOpen}
          inline={props.inline}
        />
      )
    }

    // Default to Envelope for others
    return (
      <EnvelopeIntro
        brideName={props.brideName}
        groomName={props.groomName}
        variant={style}
        autoOpen={props.autoOpen}
        inline={props.inline}
      />
    )
  }

  return (
    <>
      {renderIntro()}
      <Component {...props} tier={meta?.tier} ourStory={props.ourStory} mapUrl={props.mapUrl} />

      {/* ── Brand Promotional Footer ────────────── */}
      {!props.isThumbnail && (
        <footer className="py-12 px-6 text-center bg-transparent relative z-10">
          <div className="max-w-xs mx-auto">
            <div className="h-px w-full bg-linear-to-r from-transparent via-gray-200 to-transparent mb-8" />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">
              Design Your Journey
            </p>
            <Link href="https://dnvites.app" target="_blank" className="group inline-block">
              <p className="text-sm font-medium text-gray-600 group-hover:text-[#F43F8F] transition-colors duration-300">
                Create your own digital wedding invite at{' '}
                <span className="font-bold border-b border-gray-200 group-hover:border-[#F43F8F]">
                  dnvites.app
                </span>
              </p>
            </Link>
            <p className="mt-6 text-[10px] italic text-gray-300">Made with love by DNvites</p>
          </div>
        </footer>
      )}
    </>
  )
}

export { STYLE_MAP }

