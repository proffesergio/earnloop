"use client";

import { CheckCircle2 } from "lucide-react";
import { SOURCE_VERIFICATION_CHECKS, isVerifiedSource, type SourceVerification } from "@/lib/source-verification";

export function SourceVerificationField({
  verification,
  onChange,
  className = "sm:col-span-2",
}: {
  verification: SourceVerification;
  onChange: (verification: SourceVerification) => void;
  className?: string;
}) {
  const verified = isVerifiedSource(verification);

  function toggle(check: string) {
    const has = verification.checks.includes(check);
    const checks = has
      ? verification.checks.filter((item) => item !== check)
      : [...verification.checks, check];
    const complete = SOURCE_VERIFICATION_CHECKS.every((item) => checks.includes(item));
    onChange({
      verified: complete,
      checkedOn: complete ? new Date().toISOString().slice(0, 10) : verification.checkedOn,
      checks,
    });
  }

  return (
    <div className={`rounded-xl border bg-black/20 p-4 ${className} ${verified ? "border-lime-300/25" : "border-amber-300/25"}`}>
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">Source verification</p>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
            verified ? "bg-lime-300/15 text-lime-200" : "bg-amber-300/15 text-amber-200"
          }`}
        >
          {verified ? `Verified on ${verification.checkedOn}` : "Not verified — required to publish"}
        </span>
      </div>
      <p className="mt-2 text-xs leading-5 text-slate-500">
        Before publish, confirm each check against the live official page. Listing is blocked until every item below is ticked.
      </p>
      <ul className="mt-3 space-y-2">
        {SOURCE_VERIFICATION_CHECKS.map((check) => (
          <li key={check}>
            <label className="flex items-start gap-2.5 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={verification.checks.includes(check)}
                onChange={() => toggle(check)}
                className="mt-0.5 size-4 shrink-0 accent-lime-300"
              />
              <span className="leading-6">{check}</span>
            </label>
          </li>
        ))}
      </ul>
      {verified ? (
        <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-lime-200">
          <CheckCircle2 className="size-3.5" /> This listing can be published with the Verified source badge.
        </p>
      ) : null}
    </div>
  );
}

export function VerificationStatusLabel({ verification }: { verification: SourceVerification }) {
  const verified = isVerifiedSource(verification);
  return (
    <span
      className={`ml-2 rounded-full px-2 py-0.5 text-[10px] ${
        verified ? "bg-lime-300/15 text-lime-200" : "bg-amber-300/15 text-amber-200"
      }`}
    >
      {verified ? `✓ source verified ${verification.checkedOn}` : "⚠ source unverified"}
    </span>
  );
}