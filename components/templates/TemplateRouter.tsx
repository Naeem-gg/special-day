"use client";

import dynamic from "next/dynamic";
import { TEMPLATES, type TemplateProps } from "./types";

const RoseGoldTemplate = dynamic(() => import("./RoseGoldTemplate"));
const BotanicalTemplate = dynamic(() => import("./BotanicalTemplate"));
const SakuraDreamTemplate = dynamic(() => import("./SakuraDreamTemplate"));
const AzureOceanTemplate = dynamic(() => import("./AzureOceanTemplate"));
const EmeraldForestTemplate = dynamic(() => import("./EmeraldForestTemplate"));
const CinematicFilmTemplate = dynamic(() => import("./CinematicFilmTemplate"));
const MidnightNoirTemplate = dynamic(() => import("./MidnightNoirTemplate"));
const RoyalGoldTemplate = dynamic(() => import("./RoyalGoldTemplate"));
const CelestialTemplate = dynamic(() => import("./CelestialTemplate"));
const SacredIvoryTemplate = dynamic(() => import("./SacredIvoryTemplate"));

const TEMPLATE_MAP: Record<string, React.ComponentType<TemplateProps>> = {
  "rose-gold": RoseGoldTemplate,
  "botanical": BotanicalTemplate,
  "sakura": SakuraDreamTemplate,
  "azure-ocean": AzureOceanTemplate,
  "emerald-forest": EmeraldForestTemplate,
  "cinematic": CinematicFilmTemplate,
  "midnight-noir": MidnightNoirTemplate,
  "royal-gold": RoyalGoldTemplate,
  "celestial": CelestialTemplate,
  "sacred-ivory": SacredIvoryTemplate,
};

import React from "react";
import Link from "next/link";
import EnvelopeIntro from "../invitation/EnvelopeIntro";
import DoorIntro from "../invitation/DoorIntro";
import CurtainIntro from "../invitation/CurtainIntro";

export default function TemplateRouter({ template, ...props }: TemplateProps & { template: string }) {
  const Component = TEMPLATE_MAP[template] ?? RoseGoldTemplate;
  const meta = TEMPLATES.find(t => t.slug === template);
  const isPremium = meta?.tier === "premium";

  const renderIntro = () => {
    if (!isPremium || props.isThumbnail) return null;

    // Assign different animations to different themes
    const doorThemes = ["royal-gold", "midnight-noir", "sacred-ivory"];
    const curtainThemes = ["sakura", "azure-ocean", "botanical"];
    
    if (doorThemes.includes(template)) {
      return (
        <DoorIntro 
          brideName={props.brideName} 
          groomName={props.groomName} 
          variant={template} 
          autoOpen={props.autoOpen} 
          inline={props.inline}
        />
      );
    }

    if (curtainThemes.includes(template)) {
      return (
        <CurtainIntro 
          brideName={props.brideName} 
          groomName={props.groomName} 
          variant={template} 
          autoOpen={props.autoOpen} 
          inline={props.inline}
        />
      );
    }

    // Default to Envelope for others
    return (
      <EnvelopeIntro 
        brideName={props.brideName} 
        groomName={props.groomName} 
        variant={template} 
        autoOpen={props.autoOpen} 
        inline={props.inline}
      />
    );
  };

  return (
    <>
      {renderIntro()}
      <Component 
        {...props} 
        tier={meta?.tier} 
        ourStory={props.ourStory} 
        mapUrl={props.mapUrl} 
      />
      
      {/* ── Brand Promotional Footer ────────────── */}
      {!props.isThumbnail && (
        <footer className="py-12 px-6 text-center bg-transparent relative z-10">
          <div className="max-w-xs mx-auto">
            <div className="h-px w-full bg-linear-to-r from-transparent via-gray-200 to-transparent mb-8" />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">
              Design Your Journey
            </p>
            <Link 
              href="https://dnvites.app" 
              target="_blank"
              className="group inline-block"
            >
              <p className="text-sm font-medium text-gray-600 group-hover:text-[#F43F8F] transition-colors duration-300">
                Create your own digital wedding invite at <span className="font-bold border-b border-gray-200 group-hover:border-[#F43F8F]">dnvites.app</span>
              </p>
            </Link>
            <p className="mt-6 text-[10px] italic text-gray-300">
              Made with love by DNvites
            </p>
          </div>
        </footer>
      )}
    </>
  );
}

export { TEMPLATE_MAP };
