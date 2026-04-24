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
import EnvelopeIntro from "../invitation/EnvelopeIntro";

export default function TemplateRouter({ template, ...props }: TemplateProps & { template: string }) {
  const Component = TEMPLATE_MAP[template] ?? RoseGoldTemplate;
  const meta = TEMPLATES.find(t => t.slug === template);
  const isPremium = meta?.tier === "premium";

  return (
    <>
      {isPremium && !props.isThumbnail && (
        <EnvelopeIntro 
          brideName={props.brideName} 
          groomName={props.groomName} 
          variant={template} 
          autoOpen={props.autoOpen} 
          inline={props.inline}
        />
      )}
      <Component {...props} tier={meta?.tier} />
    </>
  );
}

export { TEMPLATE_MAP };
