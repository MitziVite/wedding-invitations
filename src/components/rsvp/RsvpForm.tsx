"use client";

import { useState, type FormEvent } from "react";
import { weddingContent } from "@/content/copy/es";
import { MAX_CHILDREN } from "@/lib/rsvp/schema";

type Status = "form" | "submitting" | "success";

const inputClass =
  "w-full rounded-sm border border-taupe/30 bg-warm-ivory px-4 py-2.5 font-body text-espresso placeholder:text-espresso/40 focus:ring-2 focus:ring-gold focus:outline-none";
const labelClass = "font-body text-sm text-espresso/70";

export function RsvpForm() {
  const { rsvp } = weddingContent;
  const [status, setStatus] = useState<Status>("form");
  const [renderedAt] = useState(() => Date.now());

  const [attending, setAttending] = useState<"yes" | "no" | null>(null);
  const [plusOneName, setPlusOneName] = useState("");
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
          plusOneName: attending === "yes" ? plusOneName : "",
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

  const contactNote = (
    <p className="mt-6 max-w-sm text-center font-body text-sm text-espresso/70">
      {rsvp.guestQuestionNote}
      <span className="mt-2 flex justify-center gap-4">
        {Object.values(rsvp.whatsapp).map((contact) => (
          <a
            key={contact.name}
            href={contact.url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-gold/50 underline-offset-4 hover:text-dusty-blue"
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
    <div className="mt-8 flex w-full flex-col items-center">
      <form onSubmit={handleSubmit} className="mt-6 flex w-full max-w-sm flex-col gap-5">
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

        <fieldset className="flex flex-col gap-2">
          <legend className={labelClass}>{rsvp.attendingLabel}</legend>
          <div className="flex gap-3">
            {(["yes", "no"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setAttending(value)}
                aria-pressed={attending === value}
                className={`flex-1 rounded-sm border px-4 py-2.5 font-body text-sm transition-colors ${
                  attending === value
                    ? "border-gold bg-gold text-espresso"
                    : "border-dusty-blue/40 bg-transparent text-dusty-blue hover:bg-soft-white"
                }`}
              >
                {value === "yes" ? rsvp.attendingYes : rsvp.attendingNo}
              </button>
            ))}
          </div>
        </fieldset>

        {attending === "yes" && (
          <>
            <label className="flex flex-col gap-2">
              <span className={labelClass}>{rsvp.plusOneLabel}</span>
              <input
                className={inputClass}
                value={plusOneName}
                onChange={(e) => setPlusOneName(e.target.value)}
                placeholder={rsvp.plusOneNamePlaceholder}
              />
            </label>

            <div className="flex flex-col gap-2">
              <span className={labelClass}>{rsvp.childrenLabel}</span>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => stepChildren(-1)}
                  disabled={childrenCount <= 0}
                  aria-label={rsvp.childrenDecrease}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-dusty-blue/40 font-body text-lg text-dusty-blue transition-colors hover:bg-soft-white disabled:cursor-not-allowed disabled:opacity-40"
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
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-dusty-blue/40 font-body text-lg text-dusty-blue transition-colors hover:bg-soft-white disabled:cursor-not-allowed disabled:opacity-40"
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
          className="rounded-sm border border-gold bg-gold px-6 py-3 font-body text-sm tracking-wide text-espresso uppercase transition-colors hover:bg-gold/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "submitting" ? rsvp.submitting : rsvp.submitCta}
        </button>
      </form>

      {contactNote}
    </div>
  );
}
