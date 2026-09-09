"use client";

import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useWeddingContent } from "@/content/LanguageProvider";

export function FaqSection() {
  const { faq } = useWeddingContent();
  return (
    <Section id="faq" tone="ivory" paddingY="py-8 sm:py-24" fullHeight textured>
      <SectionHeading eyebrow={faq.eyebrow} title={faq.title} />
      <div className="mx-auto mt-6 flex max-w-xl flex-col divide-y divide-gold/25 border-y border-gold/25 sm:mt-10">
        {faq.items.map((item) => (
          <details key={item.q} className="group py-3 sm:py-4">
            <summary className="flex cursor-pointer items-center justify-between gap-4 font-display text-lg text-espresso marker:content-none sm:text-xl">
              {item.q}
              <span className="shrink-0 text-espresso/60 transition-transform group-open:rotate-45" aria-hidden="true">
                +
              </span>
            </summary>
            <p className="mt-2 font-body text-sm leading-relaxed text-espresso/80 sm:mt-3 sm:text-base">{item.a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
