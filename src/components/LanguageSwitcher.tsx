
import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Flag, Globe } from "lucide-react";

export const LanguageSwitcher = () => {
  const { language, setLanguage, region } = useLanguage();

  const languages = [
    { code: "ru", label: "Русский", region: "RU" },
    { code: "uz", label: "O'zbek", region: "UZ" },
    { code: "en", label: "English", region: "OTHER" },
  ];

  const currentLanguage = languages.find((lang) => lang.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          {region === "UZ" && language === "ru" ? (
            <span className="text-xs opacity-70">UZ</span>
          ) : region === "RU" && language === "ru" ? (
            <span className="text-xs opacity-70">RU</span>
          ) : null}
          {currentLanguage?.label || "Language"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white border shadow-md">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code as "ru" | "uz" | "en")}
            className={`${language === lang.code ? "bg-accent/10" : ""} hover:bg-accent/20 cursor-pointer`}
          >
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
