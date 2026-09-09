"use client";

import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WeddingItinerary } from "@/components/itinerary/WeddingItinerary";
import { useWeddingContent } from "@/content/LanguageProvider";

export function TimelineSection() {
  const { timeline } = useWeddingContent();
  const events = timeline.events;

  return (
    <Section id="itinerario" tone="blush" paddingY="py-4 sm:py-10" fullHeight>
      <SectionHeading eyebrow={timeline.eyebrow} title={timeline.title} />
      <WeddingItinerary events={events} />
    </Section>
  );
}
