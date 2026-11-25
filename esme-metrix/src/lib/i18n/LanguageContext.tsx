"use client";

import React, { createContext, useCallback, useContext, useEffect, useSyncExternalStore } from "react";
import { AppLanguage, DEFAULT_LANGUAGE, LANGUAGE_STORAGE_KEY } from "./types";

const LANG_EVENT = "esme-language-change";

function readStoredLanguage(): AppLanguage {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;
  try {
    const raw = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return raw === "ar" ? "ar" : "en";
  } catch {
    return DEFAULT_LANGUAGE;
  }
}

function subscribeLanguage(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handleStorage = (event: StorageEvent) => {
    if (!event.key || event.key === LANGUAGE_STORAGE_KEY) {
      callback();
    }
  };
  const handleCustom = () => callback();

  window.addEventListener("storage", handleStorage);
  window.addEventListener(LANG_EVENT, handleCustom);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(LANG_EVENT, handleCustom);
  };
}

function getServerLanguageSnapshot(): AppLanguage {
  return DEFAULT_LANGUAGE;
}

export function persistLanguage(nextLang: AppLanguage): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLang);
  } catch {
    // Ignore storage quota / privacy mode errors
  }
  document.documentElement.lang = nextLang;
  document.documentElement.dir = nextLang === "ar" ? "rtl" : "ltr";
  window.dispatchEvent(new CustomEvent(LANG_EVENT, { detail: nextLang }));
}

interface LanguageContextValue {
  lang: AppLanguage;
  isRtl: boolean;
  setLang: (lang: AppLanguage) => void;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: DEFAULT_LANGUAGE,
  isRtl: false,
  setLang: persistLanguage,
  toggleLang: () => {
    persistLanguage(readStoredLanguage() === "ar" ? "en" : "ar");
  },
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const lang = useSyncExternalStore(
    subscribeLanguage,
    readStoredLanguage,
    getServerLanguageSnapshot
  );

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const setLang = useCallback((nextLang: AppLanguage) => {
    persistLanguage(nextLang);
  }, []);

  const toggleLang = useCallback(() => {
    persistLanguage(lang === "ar" ? "en" : "ar");
  }, [lang]);

  return (
    <LanguageContext.Provider
      value={{
        lang,
        isRtl: lang === "ar",
        setLang,
        toggleLang,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  return useContext(LanguageContext);
}
