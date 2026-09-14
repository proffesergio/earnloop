import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";

function configuredAdminEmails(): Set<string> {
  return new Set(
    (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function isAllowlistedAdminEmail(email: string | undefined): boolean {
  return email ? configuredAdminEmails().has(email.trim().toLowerCase()) : false;
}

export async function getAdminSession() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user || !isAllowlistedAdminEmail(data.user.email)) {
    return null;
  }

  return { supabase, user: data.user };
}
