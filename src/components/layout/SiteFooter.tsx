"use client";

import { useWeddingContent } from "@/content/LanguageProvider";

export function SiteFooter() {
  const { footer } = useWeddingContent();
  return (
    <footer className="w-full bg-dark-cocoa px-6 py-10 text-center">
      <p className="font-display text-xl tracking-wide text-soft-white">{footer}</p>
    </footer>
  );
}
