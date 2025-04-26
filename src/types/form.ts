
// Common form-related type definitions

export interface SelectOption {
  value: string;
  label: string;
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
