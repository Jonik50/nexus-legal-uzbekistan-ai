
import React from 'react';
import { safeTranslation } from "@/utils/formUtils";
import { useLanguage } from "@/context/LanguageContext";

export const FormHeader = () => {
  const { t } = useLanguage();
  
  console.log("FormHeader rendering with language:", t ? "translation available" : "no translations");
  
  return (
    <div className="mb-6 text-center">
      <h3 className="text-xl font-bold mb-2 text-neutral-darkPurple">
        {safeTranslation(t, "form.title", "Contact Us")}
      </h3>
      <p className="text-sm text-neutral-gray">
        Fill out the form below to get in touch with us
      </p>
    </div>
  );
};
