import { SECTIONS } from "@/content/sections.config";
import { SiteFooter } from "@/components/layout/SiteFooter";

/** Renders the ordered content sections below the hero, then the footer. */
export function WeddingSections() {
  return (
    <>
      {SECTIONS.map(({ key, Component }) => (
        <Component key={key} />
      ))}
      <SiteFooter />
    </>
  );
}
