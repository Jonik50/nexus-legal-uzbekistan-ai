
import { Language } from "@/types/language";

export const useFormatting = (language: Language) => {
  // Format phone numbers according to region
  const formatPhone = (phone: string): string => {
    if (!phone) return "";
    
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, "");
    
    if (digits.startsWith("998") && digits.length === 12) {
      return `+998 ${digits.slice(3, 5)} ${digits.slice(5, 8)}-${digits.slice(8, 10)}-${digits.slice(10, 12)}`;
    }
    
    // Basic formatting for other numbers
    if (digits.length >= 10) {
      return `+${digits.slice(0, digits.length - 10)} ${digits.slice(-10, -7)} ${digits.slice(-7, -4)}-${digits.slice(-4)}`;
    }
    
    return phone;
  };

  // Format dates according to language
  const formatDate = (date: Date | string): string => {
    if (!date) return "";
    
    const dateObj = typeof date === "string" ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return String(date);
    }
    
    try {
      if (language === "ru") {
        return new Intl.DateTimeFormat("ru-RU").format(dateObj);
      } else if (language === "uz") {
        return new Intl.DateTimeFormat("uz-UZ").format(dateObj);
      } else {
        return new Intl.DateTimeFormat("en-US").format(dateObj);
      }
    } catch (error) {
      console.error("Error formatting date:", error);
      return String(date);
    }
  };

  return { formatPhone, formatDate };
};
