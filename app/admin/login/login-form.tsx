"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [isCodeMode, setIsCodeMode] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSending(true);
    setStatus(null);

    const response = await fetch("/api/admin/magic-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, mode: isCodeMode ? "otp" : "link", token }),
    });
    const payload = (await response.json()) as { message?: string; error?: string };
    setStatus(payload.message ?? payload.error ?? "Unable to send the magic link.");
    setIsSending(false);
    if (response.ok && isCodeMode) router.push("/admin");
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
        {isSending ? (isCodeMode ? "Verifying code…" : "Sending code…") : (isCodeMode ? "Verify code" : "Email me a sign-in code")}
      </button>
      {isCodeMode ? (
        <label className="block text-sm text-slate-300">
          Six-digit code
          <input
            required
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            value={token}
            onChange={(event) => setToken(event.target.value.replace(/\D/g, ""))}
            className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm tracking-[0.35em] text-white outline-none focus:border-cyan-300/50"
            placeholder="123456"
          />
        </label>
      ) : null}
      <button
        type="button"
        onClick={() => { setIsCodeMode((value) => !value); setStatus(null); }}
        className="w-full text-sm text-cyan-200 hover:text-white"
      >
        {isCodeMode ? "Need a new code?" : "Already have the code? Paste it here"}
      </button>
      {status ? <p className="text-sm leading-6 text-slate-400">{status}</p> : null}
      <p className="text-xs leading-5 text-slate-500">
        Access is checked on the server against ADMIN_EMAILS. The email link and code expire after use.
      </p>
    </form>
  );
}
