import { copy } from "@/content/copy/es";

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-24">
      <section className="w-full max-w-md rounded-md border border-gold bg-wine px-8 py-10 text-center">
        <p className="mb-4 font-body text-xs tracking-[0.2em] text-champagne uppercase">
          {copy.eyebrow}
        </p>
        <h1 className="mb-2 font-display text-4xl text-ivory">
          {copy.siteTitle}
        </h1>
        <p className="mb-6 font-body text-champagne">{copy.date}</p>
        <div className="mx-auto mb-6 h-0.5 w-10 bg-gold" />
        <p className="mb-8 font-body text-sm leading-relaxed text-ivory">
          {copy.intro}
        </p>
        <button
          type="button"
          className="rounded-sm border border-blush bg-blush px-6 py-3 font-body text-sm tracking-wide text-coffee uppercase"
        >
          {copy.rsvpCta}
        </button>
      </section>
    </main>
  );
}
