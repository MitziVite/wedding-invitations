import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RsvpForm } from "@/components/rsvp/RsvpForm";
import { weddingContent } from "@/content/copy/es";

export function RsvpSection() {
  const { rsvp } = weddingContent;
  return (
    <Section id="rsvp" tone="celadon">
      <SectionHeading eyebrow={rsvp.eyebrow} title={rsvp.title} />
      <p className="mx-auto mt-6 max-w-md text-center font-body leading-relaxed text-espresso/80">{rsvp.body}</p>
      <RsvpForm />
    </Section>
  );
}
