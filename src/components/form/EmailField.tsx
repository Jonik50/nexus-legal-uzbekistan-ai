
import React from 'react';
import { useLanguage } from "@/context/LanguageContext";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { safeTranslation } from "@/utils/formUtils";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./types";

interface EmailFieldProps {
  form: UseFormReturn<FormValues>;
}

export const EmailField: React.FC<EmailFieldProps> = ({ form }) => {
  const { t } = useLanguage();

  return (
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {safeTranslation(t, "form.fields.email.label", "Email")}
          </FormLabel>
          <FormControl>
            <Input 
              placeholder={safeTranslation(t, "form.fields.email.placeholder", "Enter your email")} 
              {...field} 
              type="email"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
