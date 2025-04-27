
// Common form-related type definitions

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface FormField {
  label: string;
  placeholder: string;
  options?: SelectOption[];
}

export interface FormConfig {
  title: string;
  fields: Record<string, FormField>;
  submit: string;
  success: string;
  error: string;
}

// Enhanced types for form handling
export interface FormTranslation {
  key: string;
  fallback: string;
}

export interface SelectFieldOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export type TranslatedOptions = SelectFieldOption[] | null;
