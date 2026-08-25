import type { Metadata } from "next";
import { Cormorant_Garamond, Raleway, Bodoni_Moda, Allura } from "next/font/google";
import { BackgroundMusicProvider } from "@/components/audio/BackgroundMusicProvider";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
});

// The couple's monogram: J and M in Bodoni Moda, the ampersand in Allura.
const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  weight: ["500", "600"],
});
const allura = Allura({
  variable: "--font-allura",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "M & J — Nuestra boda",
  description: "Invitación de boda de M & J — 7 de noviembre de 2026.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${cormorant.variable} ${raleway.variable} ${bodoniModa.variable} ${allura.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ivory text-coffee">
        <BackgroundMusicProvider>{children}</BackgroundMusicProvider>
      </body>
    </html>
  );
}
