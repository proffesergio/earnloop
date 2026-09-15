"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Mode = "password" | "link" | "otp";

const tabs: Array<{ id: Mode; label: string }> = [
  { id: "password", label: "Password" },
  { id: "link", label: "Magic link / code" },
];

export default function AdminLoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [isCodeMode, setIsCodeMode] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSending(true);
    setStatus(null);

    try {
      const response = await fetch("/api/admin/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, mode: isCodeMode ? "otp" : "link", token }),
      });
      const payload = (await response.json()) as { message?: string; error?: string; redirectTo?: string };
      setStatus(payload.message ?? payload.error ?? "Unable to send the magic link.");
      if (response.ok && isCodeMode && payload.redirectTo) router.push(payload.redirectTo);
    } finally {
      setIsSending(false);
    }
  }

  async function submitPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSending(true);
    setStatus(null);

    try {
      const response = await fetch("/api/admin/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const payload = (await response.json()) as { message?: string; error?: string; redirectTo?: string };
      setStatus(payload.message ?? payload.error ?? "Unable to sign in.");
      if (response.ok && payload.redirectTo) router.push(payload.redirectTo);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="mt-6">
      <div className="flex rounded-xl border border-white/10 bg-[#07090c] p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setMode(tab.id);
              setStatus(null);
              setIsCodeMode(false);
            }}
            className={`flex-1 rounded-lg px-3 py-2 text-sm ${mode === tab.id ? "bg-cyan-300/10 font-semibold text-cyan-200" : "text-slate-400 hover:text-white"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {mode === "password" ? (
        <form onSubmit={submitPassword} className="mt-5 space-y-4">
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
          <label className="block text-sm text-slate-300">
            Password
            <input
              required
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none focus:border-cyan-300/50"
              placeholder="Your permanent admin password"
            />
          </label>
          <button
            type="submit"
            disabled={isSending}
            className="w-full rounded-xl bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950 disabled:cursor-wait disabled:opacity-60"
          >
            {isSending ? "Signing in…" : "Sign in with password"}
          </button>
          <p className="text-xs leading-5 text-slate-500">
            New account? Sign in once with the magic link below, then set a permanent password from the control room.
          </p>
        </form>
      ) : (
        <form onSubmit={submit} className="mt-5 space-y-4">
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
            {isSending ? (isCodeMode ? "Verifying code…" : "Sending code…") : isCodeMode ? "Verify code" : "Email me a sign-in code"}
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
            onClick={() => {
              setIsCodeMode((value) => !value);
              setStatus(null);
            }}
            className="w-full text-sm text-cyan-200 hover:text-white"
          >
            {isCodeMode ? "Need a new code?" : "Already have the code? Paste it here"}
          </button>
        </form>
      )}

      {status ? <p className="mt-4 text-sm leading-6 text-slate-400">{status}</p> : null}
      <p className="mt-4 text-xs leading-5 text-slate-500">
        Access is checked on the server against ADMIN_EMAILS. Sessions are kept in cookies and refreshed automatically; set a password to stop relying on emailed codes.
      </p>
    </div>
  );
}