"use client";

import { FormEvent, useState } from "react";
import { KeyRound } from "lucide-react";

export default function SetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    if (password !== confirm) {
      setMessage("Passwords do not match.");
      setSaving(false);
      return;
    }

    try {
      const response = await fetch("/api/admin/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const payload = (await response.json()) as { message?: string; error?: string };
      setMessage(payload.message ?? payload.error ?? "Unable to update the password.");
      if (response.ok) {
        setPassword("");
        setConfirm("");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0e1318] p-6">
      <div className="flex items-center gap-3">
        <KeyRound className="size-5 text-cyan-300" />
        <h2 className="text-lg font-semibold">Permanent password</h2>
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-400">
        Set a password once and sign in with email + password from then on — no more emailed codes that expire. Changing it here updates your Supabase account password.
      </p>
      <form onSubmit={submit} className="mt-5 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
        <input
          required
          type="password"
          autoComplete="new-password"
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="New password (min 8 characters)"
          className="h-11 rounded-xl border border-white/10 bg-[#07090c] px-3 text-sm text-white outline-none focus:border-cyan-300/50"
        />
        <input
          required
          type="password"
          autoComplete="new-password"
          minLength={8}
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          placeholder="Repeat password"
          className="h-11 rounded-xl border border-white/10 bg-[#07090c] px-3 text-sm text-white outline-none focus:border-cyan-300/50"
        />
        <button
          type="submit"
          disabled={saving}
          className="h-11 rounded-xl bg-cyan-300 px-4 text-sm font-semibold text-slate-950 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Set password"}
        </button>
      </form>
      {message ? <p className="mt-3 text-sm text-slate-300">{message}</p> : null}
    </div>
  );
}