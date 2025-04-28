
import { defaultFallbacks } from "@/types/language";
import { formatRussianText } from "@/utils/typography";

export const useTranslation = (translations: Record<string, any>, language: string) => {
  const t = (key: string) => {
    try {
      if (!key) {
        console.warn("Empty translation key requested");
        return "";
      }
      
      const keys = key.split(".");
      let value = translations[language];
      let currentPath = "";
      
      for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        currentPath += (currentPath ? "." : "") + k;
        
        if (value === undefined || value === null) {
          console.warn(`Translation path broken at ${currentPath} for language: ${language}`);
          
          // Try fallbacks from other languages
          for (const fallbackLang of ["en", "ru", "uz"].filter(l => l !== language)) {
            let fallbackValue = translations[fallbackLang as string];
            let fallbackValid = true;
            
            // Try to follow the same path in the fallback language
            for (let j = 0; j <= i; j++) {
              if (fallbackValue && fallbackValue[keys[j]] !== undefined) {
                fallbackValue = fallbackValue[keys[j]];
              } else {
                fallbackValid = false;
                break;
              }
            }
            
            if (fallbackValid) {
              console.info(`Using fallback from ${fallbackLang} for ${currentPath}`);
              value = fallbackValue;
              break;
            }
          }
          
          // If still undefined, check default fallbacks
          if (value === undefined || value === null) {
            const topLevelKey = keys[0];
            if (defaultFallbacks[topLevelKey]) {
              let fallbackValue = defaultFallbacks[topLevelKey];
              let fallbackPath = keys.slice(1);
              
              for (const pathPart of fallbackPath) {
                if (fallbackValue && fallbackValue[pathPart] !== undefined) {
                  fallbackValue = fallbackValue[pathPart];
                } else {
                  fallbackValue = undefined;
                  break;
                }
              }
              
              if (fallbackValue !== undefined) {
                console.info(`Using default fallback for ${currentPath}`);
                return fallbackValue;
              }
            }
            
            return key;
          }
        }
        
        if (value[k] === undefined) {
          console.warn(`Missing translation key: ${currentPath} for language: ${language}`);
          return key;
        }
        
        value = value[k];
      }
      
      // Apply Russian typography improvements for text strings only
      if (language === "ru" && typeof value === "string") {
        return formatRussianText(value);
      }
      
      return value;
    } catch (error) {
      console.error(`Error retrieving translation for key: ${key}`, error);
      return key;
    }
  };

  return { t };
};
