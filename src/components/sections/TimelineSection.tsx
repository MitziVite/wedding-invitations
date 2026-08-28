import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WeddingItinerary } from "@/components/itinerary/WeddingItinerary";
import { weddingContent } from "@/content/copy/es";
import type { ItineraryEventData } from "@/components/itinerary/ItineraryEvent";

export function TimelineSection() {
  const { timeline } = weddingContent;
  // Strips the `readonly` from `weddingContent`'s `as const` array so it's
  // assignable to WeddingItinerary's plain mutable prop type.
  const events: ItineraryEventData[] = [...timeline.events];

  return (
    <Section id="itinerario" tone="blush">
      <SectionHeading eyebrow={timeline.eyebrow} title={timeline.title} />
      <WeddingItinerary events={events} />
    </Section>
  );
}
