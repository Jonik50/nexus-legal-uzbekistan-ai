
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import en from "../locales/en.json";
import ru from "../locales/ru.json";
import uz from "../locales/uz.json";
import { formatRussianText } from "@/utils/typography";

type Language = "en" | "ru" | "uz";
type Region = "UZ" | "RU" | "OTHER";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => any;
  region: Region;
  formatPhone: (phone: string) => string;
  formatDate: (date: Date | string) => string;
}

const translations = {
  en,
  ru,
  uz,
};

// Enhanced browser language detection with region support
const detectBrowserLanguage = (): { lang: Language; region: Region } => {
  if (typeof window === "undefined") return { lang: "ru", region: "UZ" }; // Default when SSR
  
  // Detect language first
  const navLang = navigator.language;
  const lang = navLang.split("-")[0];
  const detectedLang = (lang === "ru" || lang === "en" || lang === "uz" ? lang : "ru") as Language;
  
  // Detect region
  const countryCode = navLang.includes("-") ? navLang.split("-")[1].toUpperCase() : "";
  let detectedRegion: Region = "OTHER";
  
  if (countryCode === "UZ" || countryCode === "RU") {
    detectedRegion = countryCode as Region;
  } else {
    // Try to get region from timezone as fallback
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezone === "Asia/Tashkent") {
      detectedRegion = "UZ";
    } else if (timezone.includes("Moscow") || timezone.includes("Petersburg")) {
      detectedRegion = "RU";
    }
  }
  
  // If region is Uzbekistan but language isn't explicitly set, default to Russian
  if (detectedRegion === "UZ" && !["uz", "ru"].includes(detectedLang)) {
    return { lang: "ru", region: detectedRegion };
  }
  
  return { lang: detectedLang, region: detectedRegion };
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("ru"); // Default to Russian
  const [region, setRegion] = useState<Region>("UZ"); // Default to Uzbekistan
  
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

  // Enhanced translation function with typography improvements for Russian
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
    
    // Apply Russian typography improvements for text strings only
    if (language === "ru" && typeof value === "string") {
      return formatRussianText(value);
    }
    
    return value;
  };

  // Format phone numbers according to region
  const formatPhone = (phone: string): string => {
    // Basic formatting for Uzbekistan: +998 XX XXX-XX-XX
    if (!phone) return "";
    
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, "");
    
    if (digits.startsWith("998") && digits.length === 12) {
      return `+998 ${digits.slice(3, 5)} ${digits.slice(5, 8)}-${digits.slice(8, 10)}-${digits.slice(10, 12)}`;
    }
    
    // Basic formatting for other numbers if can't format specifically
    if (digits.length >= 10) {
      return `+${digits.slice(0, digits.length - 10)} ${digits.slice(-10, -7)} ${digits.slice(-7, -4)}-${digits.slice(-4)}`;
    }
    
    return phone; // Return original if can't format
  };

  // Format dates according to language preferences
  const formatDate = (date: Date | string): string => {
    if (!date) return "";
    
    const dateObj = typeof date === "string" ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return String(date); // Return original if invalid date
    }
    
    try {
      if (language === "ru") {
        // Russian format: DD.MM.YYYY
        return new Intl.DateTimeFormat("ru-RU").format(dateObj);
      } else if (language === "uz") {
        // Uzbek format: DD.MM.YYYY
        return new Intl.DateTimeFormat("uz-UZ").format(dateObj);
      } else {
        // English format: MM/DD/YYYY
        return new Intl.DateTimeFormat("en-US").format(dateObj);
      }
    } catch (error) {
      console.error("Error formatting date:", error);
      return String(date); // Fallback to original
    }
  };

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
