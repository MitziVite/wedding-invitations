import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { weddingContent } from "@/content/copy/es";

export function DressCodeSection() {
  const { dressCode } = weddingContent;
  return (
    <Section id="vestimenta" tone="champagne">
      <SectionHeading eyebrow={dressCode.eyebrow} title={dressCode.title} />
      <p className="mx-auto mt-6 max-w-md text-center font-body leading-relaxed text-coffee/85">
        {dressCode.body}
      </p>
    </Section>
  );
}
