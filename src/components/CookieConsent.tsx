
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const CookieConsent = () => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (consent === null) {
      // Only show if consent hasn't been given yet
      setOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setOpen(false);
  };

  const handleReject = () => {
    localStorage.setItem("cookie-consent", "rejected");
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-white border-t border-gray-200 shadow-lg">
      <div className="container-custom flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <h3 className="text-lg font-bold mb-1">{t("cookies.title")}</h3>
          <p className="text-neutral-gray">{t("cookies.message")}</p>
        </div>
        <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
          <Button variant="outline" onClick={handleReject}>
            {t("cookies.reject")}
          </Button>
          <Button onClick={handleAccept}>{t("cookies.accept")}</Button>
        </div>
      </div>
    </div>
  );
};
