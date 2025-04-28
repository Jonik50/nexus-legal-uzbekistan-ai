
import React from 'react';
import { useLanguage } from "@/context/LanguageContext";
import { formatRussianText } from "@/utils/typography";

export const FormHeader = () => {
  const { t, language } = useLanguage();
  
  // Form title with proper typography for Russian language
  const title = language === "ru" 
    ? formatRussianText(t("form.title"))
    : t("form.title");
    
  // Subtitle text with language-specific formatting
  const subtitle = language === "ru" 
    ? formatRussianText("Заполните форму ниже, чтобы связаться с нами")
    : "Fill out the form below to get in touch with us";
  
  return (
    <div className="mb-6 text-center">
      <h3 className="text-xl font-bold mb-2 text-neutral-darkPurple">
        {title}
      </h3>
      <p className="text-sm text-neutral-gray">
        {subtitle}
      </p>
    </div>
  );
};
