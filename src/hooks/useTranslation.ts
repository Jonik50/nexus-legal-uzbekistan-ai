
import { Language, defaultFallbacks } from "@/types/language";

export const useTranslation = (
  translations: Record<Language, Record<string, any>>,
  language: Language
) => {
  const t = (key: string): string | string[] | number | boolean | null => {
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
              // Return null for missing values
              return null;
            }
          }
          
          // Try English as fallback
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
              return sanitizeTranslationValue(enResult);
            }
          }
          
          // If not found anywhere, return null
          return null;
        }
      }
      
      return sanitizeTranslationValue(result);
      
    } catch (error) {
      console.error(`Error accessing translation for key: ${key}`, error);
      return null;
    }
  };

  // Helper function to ensure we only return allowed types
  const sanitizeTranslationValue = (value: any): string | string[] | number | boolean | null => {
    if (value === null || value === undefined) {
      return null;
    }

    // Handle primitives
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return value;
    }

    // Handle arrays
    if (Array.isArray(value)) {
      return value;
    }

    // Handle objects by converting them to empty string
    if (typeof value === 'object') {
      return '';
    }

    // Default fallback
    return null;
  };

  return { t };
};

