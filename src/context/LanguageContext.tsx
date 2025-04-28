
import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, Region, LanguageContextType } from "@/types/language";
import { detectBrowserLanguage } from "@/utils/languageDetection";
import { useTranslation } from "@/hooks/useTranslation";
import { useFormatting } from "@/hooks/useFormatting";
import en from "../locales/en/index";
import ru from "../locales/ru/index";
import uz from "../locales/uz/index";

const translations = { en, ru, uz };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("ru");
  const [region, setRegion] = useState<Region>("UZ");
  
  useEffect(() => {
    const storedLanguage = localStorage.getItem("language") as Language | null;
    const storedRegion = localStorage.getItem("region") as Region | null;
    
    const { lang: detectedLang, region: detectedRegion } = detectBrowserLanguage();
    const initialLanguage = storedLanguage || detectedLang;
    const initialRegion = storedRegion || detectedRegion;
    
    setLanguageState(initialLanguage);
    setRegion(initialRegion);
    document.documentElement.lang = initialLanguage;
  }, []);

  const setLanguage = (lang: Language) => {
    localStorage.setItem("language", lang);
    setLanguageState(lang);
    document.documentElement.lang = lang;
    window.dispatchEvent(new CustomEvent("lang_toggle", { detail: { language: lang } }));
  };

  const { t } = useTranslation(translations, language);
  const { formatPhone, formatDate } = useFormatting(language);

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      t, 
      region,
      formatPhone,
      formatDate
    }}>
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
