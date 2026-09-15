import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function getSiteSetting<T>(key: string): Promise<T | null> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();

  if (error) return null;
  return (data?.value as T | null) ?? null;
}

export async function upsertSiteSetting(key: string, value: unknown): Promise<string | null> {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("site_settings")
    .upsert(
      { key, value, updated_at: new Date().toISOString() },
      { onConflict: "key", ignoreDuplicates: false }
    );

  return error?.message ?? null;
}