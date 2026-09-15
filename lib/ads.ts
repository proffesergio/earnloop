import { z } from "zod";

export type AdSlotVariant = "leaderboard" | "in-article" | "sidebar";

export type AdsConfig = {
  client: string | null;
  slots: Record<AdSlotVariant, string | null>;
};

export type AdSettings = {
  client: string;
  slots: Record<AdSlotVariant, string>;
  admobAndroid: string;
  admobIos: string;
};

export const adSettingsSchema = z.object({
  client: z.string().trim().max(80).optional().default(""),
  slots: z.object({
    leaderboard: z.string().trim().max(60).default(""),
    "in-article": z.string().trim().max(60).default(""),
    sidebar: z.string().trim().max(60).default(""),
  }),
  admobAndroid: z.string().trim().max(80).optional().default(""),
  admobIos: z.string().trim().max(80).optional().default(""),
});

export const AD_SETTINGS_KEY = "ads";

export function getAdsConfig(): AdsConfig {
  const envSlot = (value: string | undefined): string | null => {
    const trimmed = value?.trim();
    return trimmed ? trimmed : null;
  };

  return {
    client: envSlot(process.env.NEXT_PUBLIC_ADSENSE_CLIENT),
    slots: {
      leaderboard: envSlot(process.env.NEXT_PUBLIC_ADSENSE_SLOT_LEADERBOARD),
      "in-article": envSlot(process.env.NEXT_PUBLIC_ADSENSE_SLOT_IN_ARTICLE),
      sidebar: envSlot(process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR),
    },
  };
}