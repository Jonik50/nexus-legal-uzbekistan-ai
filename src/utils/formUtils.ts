
import { SelectOption, TranslatedOptions } from "@/types/form";
import { toast } from "sonner";

/**
 * Safely transforms translation options into SelectOption format with improved error handling
 */
export const getTranslatedOptions = (
  rawOptions: any,
  translationKey: string,
  defaultOptions: SelectOption[] = []
): TranslatedOptions => {
  // Handle missing translations
  if (!rawOptions) {
    console.warn(`Missing translation for options: ${translationKey}`);
    return defaultOptions.length > 0 ? defaultOptions : null;
  }

  // Ensure we're working with an array
  if (!Array.isArray(rawOptions)) {
    console.error(`Invalid options format for ${translationKey}:`, rawOptions);
    return defaultOptions.length > 0 ? defaultOptions : null;
  }

  try {
    // Transform options to expected format
    return rawOptions.map((option: string) => ({
      value: option,
      label: option
    }));
  } catch (error) {
    console.error(`Error processing options for ${translationKey}:`, error);
    return defaultOptions.length > 0 ? defaultOptions : null;
  }
};

/**
 * Determines if a form field has a validation error
 */
export const hasFormError = (field: string, errors: Record<string, any>): boolean => {
  return !!errors[field];
};

/**
 * Safely tries to get a translation with fallback
 */
export const safeTranslation = (
  translationFn: (key: string) => any,
  key: string,
  fallback: string
): string => {
  try {
    const translated = translationFn(key);
    return translated && typeof translated === "string" ? translated : fallback;
  } catch (error) {
    console.warn(`Translation error for key: ${key}`, error);
    return fallback;
  }
};

/**
 * Handles form submission errors with user feedback
 */
export const handleFormError = (error: any): void => {
  console.error("Form submission error:", error);
  toast.error(
    error?.message || "An error occurred. Please try again."
  );
};
