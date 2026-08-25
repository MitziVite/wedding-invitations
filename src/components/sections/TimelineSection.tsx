import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { weddingContent } from "@/content/copy/es";

export function TimelineSection() {
  const { timeline } = weddingContent;
  return (
    <Section id="itinerario" tone="blush">
      <SectionHeading eyebrow={timeline.eyebrow} title={timeline.title} />
      <ul className="relative mx-auto mt-10 flex max-w-sm flex-col gap-7">
        <span className="absolute top-1.5 bottom-1.5 left-[3px] w-px bg-gold/30" aria-hidden="true" />
        {timeline.events.map((e) => (
          <li key={e.label} className="relative pl-7">
            <span
              className="absolute top-1.5 left-0 h-1.5 w-1.5 rotate-45 bg-gold"
              aria-hidden="true"
            />
            <p className="font-body text-xs tracking-[0.14em] text-wine tabular-nums uppercase">
              {e.time}
            </p>
            <p className="mt-1 font-display text-xl text-coffee">{e.label}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
