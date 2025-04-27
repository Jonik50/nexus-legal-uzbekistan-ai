
import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage } from "@/context/LanguageContext";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { getTranslatedOptions, safeTranslation } from "@/utils/formUtils";
import { FormHeader } from "./form/FormHeader";
import { EmailField } from "./form/EmailField";
import { SelectField } from "./form/SelectField";
import { SubmitButton } from "./form/SubmitButton";
import { formSchema, FormValues } from "./form/types";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export const LeadForm: React.FC = () => {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      role: "",
      company_size: "",
      language: "",
    },
  });

  // Memoize options to avoid unnecessary re-renders
  const roleOptions = useCallback(() => {
    return getTranslatedOptions(
      t("form.fields.role.options"),
      "form.fields.role.options",
      [{ value: "default", label: "Default Role", disabled: true }]
    );
  }, [t]);
  
  const companySizeOptions = useCallback(() => {
    return getTranslatedOptions(
      t("form.fields.company_size.options"),
      "form.fields.company_size.options"
    );
  }, [t]);
  
  const languageOptions = useCallback(() => {
    return getTranslatedOptions(
      t("form.fields.language.options"),
      "form.fields.language.options"
    );
  }, [t]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    window.dispatchEvent(new CustomEvent("form_submit", { detail: data }));
    
    try {
      // Store lead information in Supabase (implementation will come later)
      // For now, show success message and redirect to auth page
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(safeTranslation(t, "form.success", "Thank you! We'll be in touch soon."));
      form.reset();
      
      // Navigate to sign up page with the email pre-filled
      setTimeout(() => {
        navigate("/auth", { 
          state: { 
            activeTab: "signup",
            email: data.email
          } 
        });
      }, 1500);
    } catch (error: any) {
      toast.error(
        error?.message || "An error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md max-w-md w-full mx-auto">
      <FormHeader />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <EmailField form={form} />
          
          <SelectField
            form={form}
            name="role"
            label="Role"
            placeholder="Select your role"
            options={roleOptions()}
          />
          
          <SelectField
            form={form}
            name="company_size"
            label="Company Size"
            placeholder="Select company size"
            options={companySizeOptions()}
          />
          
          <SelectField
            form={form}
            name="language"
            label="Preferred Language"
            placeholder="Select language"
            options={languageOptions()}
          />
          
          <SubmitButton isSubmitting={isSubmitting} />
        </form>
      </Form>
    </div>
  );
};
