import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { weddingContent } from "@/content/copy/es";

export function FaqSection() {
  const { faq } = weddingContent;
  return (
    <Section id="faq" tone="ivory">
      <SectionHeading eyebrow={faq.eyebrow} title={faq.title} />
      <div className="mx-auto mt-10 flex max-w-xl flex-col divide-y divide-gold/25 border-y border-gold/25">
        {faq.items.map((item) => (
          <details key={item.q} className="group py-4">
            <summary className="flex cursor-pointer items-center justify-between gap-4 font-display text-xl text-espresso marker:content-none">
              {item.q}
              <span className="shrink-0 text-espresso/60 transition-transform group-open:rotate-45" aria-hidden="true">
                +
              </span>
            </summary>
            <p className="mt-3 font-body leading-relaxed text-espresso/80">{item.a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
