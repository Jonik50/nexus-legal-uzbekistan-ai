
import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { SelectOption, TranslatedOptions } from "@/types/form";
import { getTranslatedOptions, safeTranslation, handleFormError } from "@/utils/formUtils";

// Define the schema with proper types
const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  role: z.string().min(1, "Please select a role"),
  company_size: z.string().min(1, "Please select a company size"),
  language: z.string().min(1, "Please select a language"),
});

type FormValues = z.infer<typeof formSchema>;

export const LeadForm: React.FC = () => {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Memoize options to avoid unnecessary re-renders
  const roleOptions = useCallback((): TranslatedOptions => {
    return getTranslatedOptions(
      t("form.fields.role.options"),
      "form.fields.role.options",
      [{ value: "default", label: "Default Role", disabled: true }]
    );
  }, [t]);
  
  const companySizeOptions = useCallback((): TranslatedOptions => {
    return getTranslatedOptions(
      t("form.fields.company_size.options"),
      "form.fields.company_size.options"
    );
  }, [t]);
  
  const languageOptions = useCallback((): TranslatedOptions => {
    return getTranslatedOptions(
      t("form.fields.language.options"),
      "form.fields.language.options"
    );
  }, [t]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      role: "",
      company_size: "",
      language: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    // Track form submission event
    window.dispatchEvent(new CustomEvent("form_submit", { detail: data }));
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(safeTranslation(t, "form.success", "Thank you! We'll be in touch soon."));
      form.reset();
    } catch (error) {
      handleFormError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pre-generate options with error handling
  const roleOptionsList = roleOptions();
  const companySizeOptionsList = companySizeOptions();
  const languageOptionsList = languageOptions();

  return (
    <div className="bg-white p-6 rounded-xl shadow-md max-w-md w-full mx-auto">
      <h3 className="text-xl font-bold mb-4 text-center">
        {safeTranslation(t, "form.title", "Contact Us")}
      </h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
          
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {safeTranslation(t, "form.fields.role.label", "Role")}
                </FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={
                        safeTranslation(t, "form.fields.role.placeholder", "Select your role")
                      } />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {roleOptionsList && roleOptionsList.length > 0 ? (
                      roleOptionsList.map((option) => (
                        <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
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
          
          <FormField
            control={form.control}
            name="company_size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {safeTranslation(t, "form.fields.company_size.label", "Company Size")}
                </FormLabel>
                <Select 
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={
                        safeTranslation(t, "form.fields.company_size.placeholder", "Select company size")
                      } />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {companySizeOptionsList && companySizeOptionsList.length > 0 ? (
                      companySizeOptionsList.map((option) => (
                        <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
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
          
          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {safeTranslation(t, "form.fields.language.label", "Preferred Language")}
                </FormLabel>
                <Select 
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={
                        safeTranslation(t, "form.fields.language.placeholder", "Select language")
                      } />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {languageOptionsList && languageOptionsList.length > 0 ? (
                      languageOptionsList.map((option) => (
                        <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
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
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {safeTranslation(t, "form.submit", "Submit")}
              </div>
            ) : (
              safeTranslation(t, "form.submit", "Submit")
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};
