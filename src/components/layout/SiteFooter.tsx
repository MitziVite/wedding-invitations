import { weddingContent } from "@/content/copy/es";

export function SiteFooter() {
  return (
    <footer className="w-full bg-dark-cocoa px-6 py-10 text-center">
      <p className="font-display text-xl tracking-wide text-soft-white">{weddingContent.footer}</p>
    </footer>
  );
}
