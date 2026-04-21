"use client";

import dynamic from "next/dynamic";
import type { TemplateProps } from "./types";

const RoseGoldTemplate = dynamic(() => import("./RoseGoldTemplate"));
const BotanicalTemplate = dynamic(() => import("./BotanicalTemplate"));
const SakuraDreamTemplate = dynamic(() => import("./SakuraDreamTemplate"));
const AzureOceanTemplate = dynamic(() => import("./AzureOceanTemplate"));
const EmeraldForestTemplate = dynamic(() => import("./EmeraldForestTemplate"));
const CinematicFilmTemplate = dynamic(() => import("./CinematicFilmTemplate"));
const MidnightNoirTemplate = dynamic(() => import("./MidnightNoirTemplate"));
const RoyalGoldTemplate = dynamic(() => import("./RoyalGoldTemplate"));
const CelestialTemplate = dynamic(() => import("./CelestialTemplate"));

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
};

import React from "react";

export default function TemplateRouter({ template, ...props }: TemplateProps & { template: string }) {
  const Component = TEMPLATE_MAP[template] ?? RoseGoldTemplate;
  return <Component {...props} />;
}

export { TEMPLATE_MAP };
