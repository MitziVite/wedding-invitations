import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionIllustration } from "@/components/ui/SectionIllustration";
import { EventDetails } from "@/components/ui/EventDetails";
import { weddingContent } from "@/content/copy/es";

export function CeremonySection() {
  const { ceremony } = weddingContent;
  return (
    <Section id="ceremonia" tone="champagne">
      <SectionHeading eyebrow={ceremony.eyebrow} title={ceremony.title} />
      <SectionIllustration src={ceremony.imageSrc} alt={ceremony.imageAlt} />
      <EventDetails
        time={ceremony.time}
        place={ceremony.place}
        address={ceremony.address}
        note={ceremony.note}
        mapUrl={ceremony.mapUrl}
      />
    </Section>
  );
}
