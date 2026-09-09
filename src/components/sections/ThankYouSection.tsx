"use client";

import { Section } from "@/components/ui/Section";
import { Ornament } from "@/components/ui/Ornament";
import { useWeddingContent } from "@/content/LanguageProvider";

export function ThankYouSection() {
  const { thankYou } = useWeddingContent();
  return (
    <Section
      id="gracias"
      tone="cocoa"
      florals={[
        { variant: "sprig", corner: "top-left" },
        { variant: "flower", corner: "bottom-right" },
      ]}
    >
      <div className="flex flex-col items-center text-center">
        <h2 className="font-display text-5xl text-ivory sm:text-6xl">{thankYou.heading}</h2>
        <Ornament className="my-7" />
        <p className="max-w-md font-body leading-relaxed text-ivory/85">{thankYou.body}</p>
        <p className="mt-6 font-display text-3xl text-gold italic">{thankYou.signature}</p>
      </div>
    </Section>
  );
}
