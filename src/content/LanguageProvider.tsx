"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { weddingContent as es } from "./copy/es";
import { weddingContent as en } from "./copy/en";
import type { WeddingContent } from "./copy/types";

export type Language = "es" | "en";

const CONTENT: Record<Language, WeddingContent> = { es, en };
const STORAGE_KEY = "invite-language";

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

/**
 * Defaults to "es" on both server and first client render (matching it) to
 * avoid a hydration mismatch, then syncs from localStorage a tick later in
 * an effect — invisible in practice since the envelope fully covers the
 * page until a language has already been chosen or restored.
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("es");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- restoring the persisted choice only after mount, deliberately skipped on the initial (SSR-matching) render to avoid a hydration mismatch
    if (stored === "en" || stored === "es") setLanguageState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  function setLanguage(lang: Language) {
    setLanguageState(lang);
    window.localStorage.setItem(STORAGE_KEY, lang);
  }

  return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}

/** Convenience hook for components that only need the resolved copy, not the switcher itself. */
export function useWeddingContent(): WeddingContent {
  const { language } = useLanguage();
  return CONTENT[language];
}
