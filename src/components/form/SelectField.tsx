
import React from 'react';
import { useLanguage } from "@/context/LanguageContext";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { safeTranslation } from "@/utils/formUtils";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./types";
import { TranslatedOptions } from "@/types/form";

interface SelectFieldProps {
  form: UseFormReturn<FormValues>;
  name: keyof FormValues;
  label: string;
  placeholder: string;
  options: TranslatedOptions;
}

export const SelectField: React.FC<SelectFieldProps> = ({ 
  form, 
  name, 
  label, 
  placeholder, 
  options 
}) => {
  const { t } = useLanguage();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {safeTranslation(t, `form.fields.${name}.label`, label)}
          </FormLabel>
          <Select 
            onValueChange={field.onChange}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={
                  safeTranslation(t, `form.fields.${name}.placeholder`, placeholder)
                } />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options && options.length > 0 ? (
                options.map((option) => (
                  <SelectItem 
                    key={option.value} 
                    value={option.value} 
                    disabled={option.disabled}
                  >
                    {option.label}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="placeholder" disabled>No options available</SelectItem>
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
