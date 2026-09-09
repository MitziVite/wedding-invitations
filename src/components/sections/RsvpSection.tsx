"use client";

import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RsvpForm } from "@/components/rsvp/RsvpForm";
import { useWeddingContent } from "@/content/LanguageProvider";

export function RsvpSection() {
  const { rsvp } = useWeddingContent();
  return (
    <Section id="rsvp" tone="celadon" maxWidth="max-w-xl" paddingY="py-8 sm:py-24" fullHeight>
      <SectionHeading eyebrow={rsvp.eyebrow} title={rsvp.title} />
      <p className="mx-auto mt-4 max-w-md text-center font-body leading-relaxed text-espresso/80 sm:mt-6">{rsvp.body}</p>
      <RsvpForm />
    </Section>
  );
}
