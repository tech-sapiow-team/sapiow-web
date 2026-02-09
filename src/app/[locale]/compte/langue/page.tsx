"use client";

import { useLanguageSettings } from "@/hooks/useLanguageSettings";
import { Check, Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useState } from "react";
import AccountLayout from "../AccountLayout";

interface Language {
  id: string;
  name: string;
  flagUrl: string;
}

// Fonction pour générer les langues disponibles avec traductions
const getAvailableLanguages = (t: any): Language[] => [
  {
    id: "fr", // Utiliser les codes de locale de next-intl
    name: t("languagePage.french"),
    flagUrl: "https://flagcdn.com/24x18/fr.png",
  },
  {
    id: "en", // Utiliser les codes de locale de next-intl
    name: t("languagePage.english"),
    flagUrl: "https://flagcdn.com/24x18/us.png",
  },
];

// Fonction pour définir le cookie de locale côté client
const setLocaleCookie = (locale: string) => {
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${
    60 * 60 * 24 * 365
  }; SameSite=Lax`;
};

export default function LanguePage() {
  const t = useTranslations();
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { currentLanguage, isLoading, error, handleLanguageChange } =
    useLanguageSettings();

  const [updatingLanguage, setUpdatingLanguage] = useState<string | null>(null);

  const availableLanguages = getAvailableLanguages(t);

  // Mapper les codes de locale aux noms de langue pour l'API
  const localeToLanguageMap = {
    fr: "French",
    en: "English",
  };

  const handleLanguageSelect = async (localeId: string) => {
    if (currentLocale === localeId) return;

    setUpdatingLanguage(localeId);
    try {
      // 1. Définir le cookie de locale pour la persistance
      setLocaleCookie(localeId);

      // 2. Sauvegarder dans la base de données (API)
      const languageName =
        localeToLanguageMap[localeId as keyof typeof localeToLanguageMap];
      if (languageName) {
        await handleLanguageChange(languageName);
      }

      // 3. Utiliser le router de next-intl pour changer la locale
      // Cela garantit que la locale est correctement gérée dans toute l'application
      router.replace(pathname, { locale: localeId as "fr" | "en" });

      // 4. Forcer un refresh pour s'assurer que tous les composants utilisent la nouvelle locale
      router.refresh();
    } catch (error) {
      console.error(t("languagePage.errorChangingLanguage"), error);
    } finally {
      setUpdatingLanguage(null);
    }
  };

  // Loading initial seulement si on n'a pas encore de données
  if (isLoading && !currentLanguage) {
    return (
      <AccountLayout>
        <div className="w-full px-6 space-y-6">
          <h1 className="text-2xl font-bold text-gray-900 mt-5">
            {t("account.language")}
          </h1>
          <div className="text-center py-8">
            <p className="text-gray-600">
              {t("notificationSettings.loadingSettings")}
            </p>
          </div>
        </div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout>
      <div className="w-full px-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 mt-5">
          {t("account.language")}
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          {availableLanguages.map((language, index) => {
            const isUpdating = updatingLanguage === language.id;
            const isSelected = currentLocale === language.id;

            return (
              <div
                key={language.id}
                className={`flex items-center justify-between py-4 cursor-pointer border-b border-[#D9D9D9] ${
                  index === availableLanguages.length - 1 ? "border-b-0" : ""
                } ${
                  isUpdating ? "opacity-70" : ""
                } transition-opacity duration-200`}
                onClick={() => !isUpdating && handleLanguageSelect(language.id)}
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={language.flagUrl}
                    alt={`${t("languagePage.flagAlt")} ${language.name}`}
                    width={24}
                    height={18}
                    className="rounded-sm"
                  />
                  <span className="text-base font-medium text-gray-900">
                    {language.name}
                  </span>
                  {isUpdating && (
                    <Loader2 className="w-4 h-4 text-gray-500 animate-spin ml-2" />
                  )}
                </div>

                {/* Indicateur de sélection */}
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    isSelected
                      ? "bg-[#0F172A] border-[#0F172A]"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {isSelected && !isUpdating && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                  {isUpdating && (
                    <Loader2 className="w-3 h-3 text-white animate-spin" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AccountLayout>
  );
}
