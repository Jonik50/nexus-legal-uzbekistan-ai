
import React from 'react';
import { safeTranslation } from "@/utils/formUtils";
import { useLanguage } from "@/context/LanguageContext";

export const FormHeader = () => {
  const { t } = useLanguage();
  
  return (
    <h3 className="text-xl font-bold mb-4 text-center">
      {safeTranslation(t, "form.title", "Contact Us")}
    </h3>
  );
};
