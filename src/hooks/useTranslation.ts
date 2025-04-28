
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
              // Return the appropriate default structure
              let fallbackValue = defaultFallbacks[topLevelKey as keyof typeof defaultFallbacks];
              
              // Try to navigate to the specific nested key in fallbacks
              for (let i = 1; i < keys.length; i++) {
                if (fallbackValue && typeof fallbackValue === 'object' && keys[i] in fallbackValue) {
                  fallbackValue = fallbackValue[keys[i] as keyof typeof fallbackValue];
                } else {
                  // If we can't find the exact nested key, return appropriate default
                  break;
                }
              }
              
              // Convert objects to appropriate return types
              if (Array.isArray(fallbackValue)) {
                return fallbackValue;
              } else if (typeof fallbackValue === 'object' && fallbackValue !== null) {
                // Object fallbacks should return empty arrays or strings based on context
                if (key.includes('.items') || key.includes('.points') || key.includes('.rows') || 
                    key.includes('.headers') || key.includes('.features') || key.includes('.clients')) {
                  return [];
                } else {
                  return '';
                }
              } else {
                // Return primitives directly
                return fallbackValue ?? '';
              }
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
              // Convert the fallback result to appropriate return type
              if (Array.isArray(enResult)) {
                return enResult;
              } else if (typeof enResult === 'object' && enResult !== null) {
                if (key.includes('.items') || key.includes('.points') || key.includes('.rows') || 
                    key.includes('.headers') || key.includes('.features') || key.includes('.clients')) {
                  return [];
                } else {
                  return '';
                }
              } else {
                return enResult ?? '';
              }
            }
          }
          
          // Return appropriate defaults based on context and key naming
          if (key.includes('.items') || key.includes('.points') || key.includes('.rows') || 
              key.includes('.headers') || key.includes('.features') || key.includes('.clients')) {
            return [];
          } else {
            return '';
          }
        }
      }
      
      // Final safety check - ensure we don't return raw objects
      if (result === null || result === undefined) {
        return '';
      }
      
      // Handle arrays and objects safely
      if (Array.isArray(result)) {
        return result;
      } else if (typeof result === 'object') {
        console.warn(`Translation key returns an object instead of a primitive: ${key}`);
        
        // Return empty array for array-like keys
        if (key.includes('.items') || key.includes('.rows') || key.includes('.headers') || 
            key.includes('.points') || key.includes('.features') || key.includes('.clients')) {
          return [];
        } else {
          // For other keys that should be strings
          return '';
        }
      }
      
      // Return primitives directly
      return result;
    } catch (error) {
      console.error(`Error accessing translation for key: ${key}`, error);
      // Return appropriate defaults based on context
      if (key.includes('.items') || key.includes('.rows') || key.includes('.headers') || 
          key.includes('.points') || key.includes('.features') || key.includes('.clients')) {
        return [];
      } else {
        return '';
      }
    }
  };

  return { t };
};
