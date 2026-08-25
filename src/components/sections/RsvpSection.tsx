import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { weddingContent } from "@/content/copy/es";

export function RsvpSection() {
  const { rsvp } = weddingContent;
  return (
    <Section id="rsvp" tone="wine">
      <SectionHeading eyebrow={rsvp.eyebrow} title={rsvp.title} onDark />
      <p className="mx-auto mt-6 max-w-md text-center font-body leading-relaxed text-ivory/90">
        {rsvp.body}
      </p>
      {/* Placeholder — the real form is wired up in Phase 5. */}
      <div className="mt-8 flex flex-col items-center gap-3">
        <button
          type="button"
          disabled
          className="cursor-not-allowed rounded-sm border border-blush/60 bg-blush/30 px-6 py-3 font-body text-sm tracking-wide text-ivory/70 uppercase"
        >
          {rsvp.cta}
        </button>
        <p className="font-body text-xs tracking-wide text-champagne/80 italic">{rsvp.note}</p>
      </div>
    </Section>
  );
}
