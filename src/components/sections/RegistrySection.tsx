import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LinkButton } from "@/components/ui/LinkButton";
import { weddingContent } from "@/content/copy/es";

export function RegistrySection() {
  const { registry } = weddingContent;
  return (
    <Section id="regalos" tone="ivory">
      <SectionHeading eyebrow={registry.eyebrow} title={registry.title} />
      <p className="mx-auto mt-6 max-w-md text-center font-body leading-relaxed text-espresso/85">
        {registry.body}
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
        {registry.options.map((opt) => (
          <LinkButton key={opt.label} href={opt.url} variant="outline">
            {opt.label}
          </LinkButton>
        ))}
      </div>
    </Section>
  );
}
