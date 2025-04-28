
import { Language, Region } from "@/types/language";

export const detectBrowserLanguage = (): { lang: Language; region: Region } => {
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
