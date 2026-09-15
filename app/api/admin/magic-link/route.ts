import { NextResponse } from "next/server";
import { isAllowlistedAdminEmail } from "@/lib/admin-auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getPublicOrigin } from "@/lib/site-url";

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const email =
    typeof body === "object" && body !== null && "email" in body && typeof body.email === "string"
      ? body.email.trim().toLowerCase()
      : "";

  if (!email || !isAllowlistedAdminEmail(email)) {
    return NextResponse.json({ error: "That email is not configured for admin access." }, { status: 403 });
  }

  const supabase = await createSupabaseServerClient();
  const origin = getPublicOrigin(request);
  const wantsOtp = typeof body === "object" && body !== null && "mode" in body && body.mode === "otp";
  const token = typeof body === "object" && body !== null && "token" in body && typeof body.token === "string"
    ? body.token.replace(/\s/g, "")
    : "";

  if (wantsOtp) {
    if (!/^\d{6}$/.test(token)) {
      return NextResponse.json({ error: "Enter the six-digit code from your email." }, { status: 400 });
    }

    const { data, error } = await supabase.auth.verifyOtp({ email, token, type: "email" });
    if (error || !data.user || !isAllowlistedAdminEmail(data.user.email)) {
      return NextResponse.json({ error: "That code is invalid or has expired." }, { status: 401 });
    }

    return NextResponse.json({ message: "Code verified.", redirectTo: "/admin" });
  }

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=/admin`,
      shouldCreateUser: true,
    },
  });

  if (error) {
    return NextResponse.json({ error: "Supabase could not send the magic link." }, { status: 502 });
  }

  return NextResponse.json({ message: "Check your inbox for the sign-in link and six-digit code." });
}
