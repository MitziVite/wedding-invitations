import type { ComponentType } from "react";
import { WelcomeCard } from "@/components/sections/WelcomeCard";
import { CeremonySection } from "@/components/sections/CeremonySection";
import { ReceptionSection } from "@/components/sections/ReceptionSection";
import { TimelineSection } from "@/components/sections/TimelineSection";
import { LocationSection } from "@/components/sections/LocationSection";
import { DressCodeSection } from "@/components/sections/DressCodeSection";
import { RsvpSection } from "@/components/sections/RsvpSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { RegistrySection } from "@/components/sections/RegistrySection";
import { ThankYouSection } from "@/components/sections/ThankYouSection";

interface SectionEntry {
  key: string;
  Component: ComponentType;
}

/**
 * The ordered list of content sections rendered below the hero. Reorder,
 * add, or remove sections by editing this single array — the page just maps
 * over it.
 */
export const SECTIONS: SectionEntry[] = [
  { key: "welcome", Component: WelcomeCard },
  { key: "ceremony", Component: CeremonySection },
  { key: "reception", Component: ReceptionSection },
  { key: "timeline", Component: TimelineSection },
  { key: "location", Component: LocationSection },
  { key: "dressCode", Component: DressCodeSection },
  { key: "rsvp", Component: RsvpSection },
  { key: "faq", Component: FaqSection },
  { key: "registry", Component: RegistrySection },
  { key: "thankYou", Component: ThankYouSection },
];
