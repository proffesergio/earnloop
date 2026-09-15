import { NextResponse } from "next/server";
import { isAllowlistedAdminEmail } from "@/lib/admin-auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const email =
    typeof body === "object" && body !== null && "email" in body && typeof body.email === "string"
      ? body.email.trim().toLowerCase()
      : "";
  const password =
    typeof body === "object" && body !== null && "password" in body && typeof body.password === "string"
      ? body.password
      : "";

  if (!email || !isAllowlistedAdminEmail(email)) {
    return NextResponse.json({ error: "That email is not configured for admin access." }, { status: 403 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user || !isAllowlistedAdminEmail(data.user.email)) {
    return NextResponse.json(
      { error: "Invalid email or password. First-time setup? Sign in once with the magic link and set a permanent password in the control room." },
      { status: 401 },
    );
  }

  return NextResponse.json({ message: "Signed in.", redirectTo: "/admin" });
}