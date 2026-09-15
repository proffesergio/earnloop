import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Admin access required." }, { status: 401 });

  const body: unknown = await request.json().catch(() => null);
  const password =
    typeof body === "object" && body !== null && "password" in body && typeof body.password === "string"
      ? body.password
      : "";

  if (password.length < 8 || password.length > 128) {
    return NextResponse.json({ error: "Password must be between 8 and 128 characters." }, { status: 400 });
  }

  const { error } = await session.supabase.auth.updateUser({ password });
  if (error) {
    return NextResponse.json({ error: "Could not update the password." }, { status: 502 });
  }

  await createSupabaseAdminClient()
    .from("admin_audit")
    .insert({ actor: session.user.id, action: "update", entity: "admin", entity_id: session.user.id });

  return NextResponse.json({ message: "Password updated. Use email + password from now on." });
}