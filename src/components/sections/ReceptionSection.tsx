import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionIllustration } from "@/components/ui/SectionIllustration";
import { EventDetails } from "@/components/ui/EventDetails";
import { weddingContent } from "@/content/copy/es";

export function ReceptionSection() {
  const { reception } = weddingContent;
  return (
    <Section id="recepcion" tone="ivory">
      <SectionHeading eyebrow={reception.eyebrow} title={reception.title} />
      <SectionIllustration src={reception.imageSrc} alt={reception.imageAlt} />
      <EventDetails
        time={reception.time}
        place={reception.place}
        address={reception.address}
        note={reception.note}
        mapUrl={reception.mapUrl}
      />
    </Section>
  );
}
