import { Section } from "@/components/ui/Section";
import { Ornament } from "@/components/ui/Ornament";
import { weddingContent } from "@/content/copy/es";

export function ThankYouSection() {
  const { thankYou } = weddingContent;
  return (
    <Section id="gracias" tone="cocoa">
      <div className="flex flex-col items-center text-center">
        <h2 className="font-display text-5xl text-ivory sm:text-6xl">{thankYou.heading}</h2>
        <Ornament className="my-7" />
        <p className="max-w-md font-body leading-relaxed text-ivory/85">{thankYou.body}</p>
        <p className="mt-6 font-display text-3xl text-gold italic">{thankYou.signature}</p>
      </div>
    </Section>
  );
}
