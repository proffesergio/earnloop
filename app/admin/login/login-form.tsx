"use client";

import { FormEvent, useState } from "react";

export default function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSending(true);
    setStatus(null);

    const response = await fetch("/api/admin/magic-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const payload = (await response.json()) as { message?: string; error?: string };
    setStatus(payload.message ?? payload.error ?? "Unable to send the magic link.");
    setIsSending(false);
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-4">
      <label className="block text-sm text-slate-300">
        Admin email
        <input
          required
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none focus:border-cyan-300/50"
          placeholder="owner@example.com"
        />
      </label>
      <button
        type="submit"
        disabled={isSending}
        className="w-full rounded-xl bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950 disabled:cursor-wait disabled:opacity-60"
      >
        {isSending ? "Sending link…" : "Email me a magic link"}
      </button>
      {status ? <p className="text-sm leading-6 text-slate-400">{status}</p> : null}
      <p className="text-xs leading-5 text-slate-500">
        Access is checked on the server against ADMIN_EMAILS. The allowlist is never sent to the browser.
      </p>
    </form>
  );
}
