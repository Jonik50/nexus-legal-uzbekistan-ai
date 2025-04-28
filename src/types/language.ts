
export type Language = "en" | "ru" | "uz";
export type Region = "UZ" | "RU" | "OTHER";

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => any;
  region: Region;
  formatPhone: (phone: string) => string;
  formatDate: (date: Date | string) => string;
}

// Default fallbacks for common array structures
export const defaultFallbacks = {
  features: {
    items: [],
    points: []
  },
  faq: {
    items: []
  },
  testimonials: {
    items: []
  },
  personas: {
    items: []
  },
  advantages: {
    table: {
      headers: [],
      rows: []
    }
  },
  security: {
    features: []
  },
  cta: {
    title: "Ready to optimize your legal work?",
    description: "Join leading legal firms in Uzbekistan using Legal Nexus AI",
    primary: "Try for free",
    secondary: "Request demo"
  }
};
