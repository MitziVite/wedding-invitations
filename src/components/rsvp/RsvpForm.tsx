"use client";

import { useState, type FormEvent } from "react";
import { weddingContent } from "@/content/copy/es";
import { MAX_CHILDREN } from "@/lib/rsvp/schema";

type Status = "form" | "submitting" | "success";

const inputClass =
  "w-full rounded-lg border border-taupe/30 bg-warm-ivory px-4 py-3.5 font-body text-espresso placeholder:text-espresso/40 transition-colors focus:border-gold focus:ring-2 focus:ring-gold/50 focus:outline-none";
const labelClass = "font-body text-sm text-espresso/80";

/** Small check mark used inside the selected attendance card. */
function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 shrink-0 text-espresso" aria-hidden="true">
      <path d="M4 10.5l3.5 3.5L16 6" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function RsvpForm() {
  const { rsvp } = weddingContent;
  const [status, setStatus] = useState<Status>("form");
  const [renderedAt] = useState(() => Date.now());

  const [attending, setAttending] = useState<"yes" | "no" | null>(null);
  const [hasPlusOne, setHasPlusOne] = useState<"yes" | "no" | null>(null);
  const [plusOneName, setPlusOneName] = useState("");

  function selectPlusOne(value: "yes" | "no") {
    setHasPlusOne(value);
    if (value === "no") setPlusOneName("");
  }
  const [childrenCount, setChildrenCount] = useState(0);
  const [message, setMessage] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [submitError, setSubmitError] = useState("");

  function stepChildren(delta: number) {
    setChildrenCount((count) => Math.min(MAX_CHILDREN, Math.max(0, count + delta)));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!attending) return;
    setStatus("submitting");
    setSubmitError("");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactName,
          contactEmail,
          attending,
          plusOneName: attending === "yes" && hasPlusOne === "yes" ? plusOneName : "",
          childrenCount: attending === "yes" ? childrenCount : 0,
          message,
          honeypot,
          formRenderedAt: renderedAt,
        }),
      });
      const data = await res.json();
      if (!data.ok) {
        setSubmitError(rsvp.errorBody);
        setStatus("form");
        return;
      }
      setStatus("success");
    } catch {
      setSubmitError(rsvp.errorBody);
      setStatus("form");
    }
  }

  // Secondary help area — deliberately smaller/quieter than the form above
  // it, with generous top margin so it reads as an aside, not part of the
  // form's own visual weight.
  const contactNote = (
    <p className="mt-10 max-w-sm text-center font-body text-xs leading-relaxed text-espresso/60">
      {rsvp.guestQuestionNote}
      <span className="mt-2 flex justify-center gap-4">
        {Object.values(rsvp.whatsapp).map((contact) => (
          <a
            key={contact.name}
            href={contact.url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-gold/50 underline-offset-4 hover:text-espresso"
          >
            {contact.name}
          </a>
        ))}
      </span>
    </p>
  );

  if (status === "success") {
    return (
      <div className="mt-8 flex flex-col items-center text-center" role="status" aria-live="polite">
        <p className="font-display text-2xl text-espresso">{rsvp.successTitle}</p>
        <p className="mt-2 max-w-sm font-body text-espresso/80">{rsvp.successBody}</p>
      </div>
    );
  }

  return (
    <div className="mt-10 flex w-full flex-col items-center">
      {/* Very subtle translucent surface — a warmer tint than the sage
          section behind it, not a heavy card (soft border, no strong
          shadow) — so the form gets real visual presence without breaking
          out of the section's palette. */}
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-6 rounded-3xl border border-gold/15 bg-warm-ivory/40 px-5 py-8 shadow-sm shadow-espresso/5 sm:px-10 sm:py-10"
      >
        {/* Honeypot — visually hidden, never filled by a real guest. */}
        <input
          type="text"
          name="company"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] h-0 w-0 opacity-0"
        />

        {/* The attendance decision is the form's first and most dominant
            interaction — a display-font question instead of a small muted
            label, with two large selectable cards rather than compact
            buttons. */}
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-1 font-display text-xl text-espresso">{rsvp.attendingLabel}</legend>
          <div className="flex flex-col gap-3 sm:flex-row">
            {(["yes", "no"] as const).map((value) => {
              const selected = attending === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setAttending(value)}
                  aria-pressed={selected}
                  className={`flex min-h-[3.25rem] flex-1 items-center justify-center gap-2 rounded-xl border px-5 py-4 font-body text-base transition-colors sm:min-h-[3.75rem] ${
                    selected
                      ? "border-gold bg-gold/20 text-espresso font-medium"
                      : "border-taupe/35 bg-transparent text-espresso/70 hover:border-gold/50 hover:bg-warm-ivory/60"
                  }`}
                >
                  {selected && <CheckIcon />}
                  {value === "yes" ? rsvp.attendingYes : rsvp.attendingNo}
                </button>
              );
            })}
          </div>
        </fieldset>

        {attending === "yes" && (
          <>
            <div className="flex flex-col gap-2">
              <span className={labelClass}>{rsvp.plusOneLabel}</span>
              <div className="flex gap-3">
                {(["yes", "no"] as const).map((value) => {
                  const selected = hasPlusOne === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => selectPlusOne(value)}
                      aria-pressed={selected}
                      className={`flex-1 rounded-lg border px-4 py-3 font-body text-sm transition-colors ${
                        selected
                          ? "border-gold bg-gold/20 text-espresso font-medium"
                          : "border-taupe/35 bg-transparent text-espresso/70 hover:border-gold/50 hover:bg-warm-ivory/60"
                      }`}
                    >
                      {value === "yes" ? rsvp.plusOneYes : rsvp.plusOneNo}
                    </button>
                  );
                })}
              </div>
              {hasPlusOne === "yes" && (
                <input
                  required
                  className={inputClass}
                  value={plusOneName}
                  onChange={(e) => setPlusOneName(e.target.value)}
                  placeholder={rsvp.plusOneNamePlaceholder}
                />
              )}
            </div>

            <div className="flex flex-col gap-2">
              <span className={labelClass}>{rsvp.childrenLabel}</span>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => stepChildren(-1)}
                  disabled={childrenCount <= 0}
                  aria-label={rsvp.childrenDecrease}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-taupe/35 font-body text-lg text-espresso transition-colors hover:border-gold/50 hover:bg-warm-ivory/60 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  −
                </button>
                <span className="w-6 text-center font-display text-xl text-espresso tabular-nums">
                  {childrenCount}
                </span>
                <button
                  type="button"
                  onClick={() => stepChildren(1)}
                  disabled={childrenCount >= MAX_CHILDREN}
                  aria-label={rsvp.childrenIncrease}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-taupe/35 font-body text-lg text-espresso transition-colors hover:border-gold/50 hover:bg-warm-ivory/60 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  +
                </button>
              </div>
            </div>

            <label className="flex flex-col gap-2">
              <span className={labelClass}>{rsvp.messageLabel}</span>
              <textarea
                className={inputClass}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={rsvp.messagePlaceholder}
                rows={3}
              />
            </label>
          </>
        )}

        <label className="flex flex-col gap-2">
          <span className={labelClass}>{rsvp.contactNameLabel}</span>
          <input
            required
            className={inputClass}
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className={labelClass}>{rsvp.contactEmailLabel}</span>
          <input
            type="email"
            className={inputClass}
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
          />
        </label>

        {submitError && (
          <p className="font-body text-sm font-semibold text-espresso" role="alert">
            {submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={!attending || status === "submitting"}
          className="mt-1 rounded-lg border border-gold bg-gold px-6 py-4 font-body text-sm tracking-[0.15em] text-espresso uppercase transition-colors hover:bg-gold/85 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "submitting" ? rsvp.submitting : rsvp.submitCta}
        </button>
      </form>

      {contactNote}
    </div>
  );
}
