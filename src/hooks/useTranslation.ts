
import { Language, defaultFallbacks } from "@/types/language";

export const useTranslation = (
  translations: Record<Language, Record<string, any>>,
  language: Language
) => {
  const t = (key: string): any => {
    try {
      // Get current language translations
      const translationObj = translations[language];
      
      // Handle nested keys with dot notation
      const keys = key.split('.');
      let result = translationObj;
      
      // Navigate through nested structure
      for (const k of keys) {
        if (result && typeof result === 'object' && k in result) {
          result = result[k];
        } else {
          // Key not found in current language, try fallbacks
          
          // Check if this is a known structure with defaults
          if (keys.length > 1) {
            const topLevelKey = keys[0];
            if (topLevelKey in defaultFallbacks) {
              // Return the appropriate default structure
              let fallbackValue = defaultFallbacks[topLevelKey as keyof typeof defaultFallbacks];
              
              // Try to navigate to the specific nested key in fallbacks
              for (let i = 1; i < keys.length; i++) {
                if (fallbackValue && typeof fallbackValue === 'object' && keys[i] in fallbackValue) {
                  fallbackValue = fallbackValue[keys[i] as keyof typeof fallbackValue];
                } else {
                  // If we can't find the exact nested key, return the whole fallback object
                  break;
                }
              }
              
              return fallbackValue;
            }
          }
          
          // If not found in fallbacks, try English as fallback
          if (language !== 'en' && translations['en']) {
            let enResult = translations['en'];
            let fallbackFound = true;
            
            for (const k of keys) {
              if (enResult && typeof enResult === 'object' && k in enResult) {
                enResult = enResult[k];
              } else {
                fallbackFound = false;
                break;
              }
            }
            
            if (fallbackFound) {
              return enResult;
            }
          }
          
          // Return empty string or default value as last resort
          console.warn(`Translation key not found: ${key}`);
          
          // Return different defaults based on context
          if (key.includes('.items') || key.includes('.rows') || key.includes('.headers')) {
            return [];
          } else if (key.includes('.cta')) {
            return '';
          } else {
            return key;
          }
        }
      }
      
      return result;
    } catch (error) {
      console.error(`Error accessing translation for key: ${key}`, error);
      // Return different defaults based on context
      if (key.includes('.items') || key.includes('.rows') || key.includes('.headers')) {
        return [];
      } else {
        return key;
      }
    }
  };

  return { t };
};
