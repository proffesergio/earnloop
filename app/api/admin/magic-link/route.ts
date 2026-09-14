import { NextResponse } from "next/server";
import { isAllowlistedAdminEmail } from "@/lib/admin-auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const email =
    typeof body === "object" && body !== null && "email" in body && typeof body.email === "string"
      ? body.email.trim().toLowerCase()
      : "";

  if (!email || !isAllowlistedAdminEmail(email)) {
    return NextResponse.json({ error: "That email is not configured for admin access." }, { status: 403 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) {
    return NextResponse.json({ error: "NEXT_PUBLIC_SITE_URL is not configured." }, { status: 500 });
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${siteUrl.replace(/\/$/, "")}/auth/callback?next=/admin`,
      shouldCreateUser: true,
    },
  });

  if (error) {
    return NextResponse.json({ error: "Supabase could not send the magic link." }, { status: 502 });
  }

  return NextResponse.json({ message: "Check your inbox for the admin sign-in link." });
}
