
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import en from "../locales/en.json";
import ru from "../locales/ru.json";
import uz from "../locales/uz.json";

type Language = "en" | "ru" | "uz";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => any;
}

const translations = {
  en,
  ru,
  uz,
};

const getBrowserLanguage = (): Language => {
  if (typeof window === "undefined") return "ru"; // Default to Russian on server
  const lang = navigator.language.split("-")[0];
  return (lang === "ru" || lang === "en" || lang === "uz" ? lang : "ru") as Language;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("ru"); // Default to Russian

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language") as Language | null;
    const initialLanguage = storedLanguage || getBrowserLanguage();
    setLanguageState(initialLanguage);
    document.documentElement.lang = initialLanguage;
  }, []);

  const setLanguage = (lang: Language) => {
    localStorage.setItem("language", lang);
    setLanguageState(lang);
    document.documentElement.lang = lang;
    window.dispatchEvent(new CustomEvent("lang_toggle", { detail: { language: lang } }));
  };

  const t = (key: string) => {
    const keys = key.split(".");
    let value = translations[language];
    
    for (const k of keys) {
      if (value[k] === undefined) {
        console.warn(`Missing translation key: ${key} for language: ${language}`);
        return key;
      }
      value = value[k];
    }
    
    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
