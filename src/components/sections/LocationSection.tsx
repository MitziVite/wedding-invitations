import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LinkButton } from "@/components/ui/LinkButton";
import { weddingContent } from "@/content/copy/es";

export function LocationSection() {
  const { location } = weddingContent;
  return (
    <Section id="ubicacion" tone="ivory">
      <SectionHeading eyebrow={location.eyebrow} title={location.title} />
      <p className="mx-auto mt-6 max-w-md text-center font-body leading-relaxed text-coffee/85">
        {location.body}
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        {location.links.map((link) => (
          <LinkButton key={link.label} href={link.url} variant="outline">
            {link.label}
          </LinkButton>
        ))}
      </div>
    </Section>
  );
}
