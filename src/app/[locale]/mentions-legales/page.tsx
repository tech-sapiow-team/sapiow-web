"use client";

import enMessages from "@/messages/en";
import frMessages from "@/messages/fr";
import { useLocale, useTranslations } from "next-intl";
import { sanitizeHtml } from "@/utils/sanitizeHtml";
import Image from "next/image";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";

// Fonction pour générer les éléments de navigation avec traductions
const getNavItems = (t: any) => [
  {
    label: t("legalMentions.termsOfService"),
    href: "/#",
  },
  {
    label: t("legalMentions.privacyPolicy"),
    href: "/#",
  },
  {
    label: t("legalMentions.openSourceLicenses"),
    href: "/#",
  },
];

// Fonction pour générer les onglets avec traductions et contenu spécifique
const getTabs = (
  t: any,
  privacyHtml: string
): { id: number; label: string; content: ReactNode; href: string }[] => [
  {
    id: 1,
    label: t("legalMentions.termsOfService"),
    content: t("legalMentions.termsContent"),
    href: "/#",
  },
  {
    id: 2,
    label: t("legalMentions.privacyPolicy"),
    content: (
      <div
        className="space-y-4 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-semibold [&_ul]:list-disc [&_ul]:ml-4 [&_p]:mb-2"
        dangerouslySetInnerHTML={{
          __html: sanitizeHtml(privacyHtml),
        }}
      />
    ),
    href: "/#",
  },
  {
    id: 3,
    label: t("legalMentions.openSourceLicenses"),
    content: t("legalMentions.licensesContent"),
    href: "/#",
  },
];

export default function MentionsLegales() {
  const t = useTranslations();
  const locale = useLocale();
  const [activeIdx, setActiveIdx] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Détecter si l'écran est en mode mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const navItems = getNavItems(t);
  const messages = locale === "fr" ? frMessages : enMessages;
  const TABS = getTabs(t, messages.legalMentions.privacyContent as string);
  const activeTab = TABS[activeIdx];

  const handleTabClick = (idx: number) => {
    setActiveIdx(idx);
    if (isMobile) {
      setShowContent(true);
    }
  };

  const handleBackClick = () => {
    setShowContent(false);
  };

  return (
    <div>
      <div className="container px-4 md:px-6">
        {/* Version mobile avec navigation conditionnelle */}
        {isMobile ? (
          <div className="mt-5">
            {!showContent ? (
              // Liste des liens en mode mobile
              <ul className="space-y-1">
                {navItems.map((item, index) => (
                  <li
                    key={item.label}
                    className={`border-b border-soft-ice-gray py-2`}
                  >
                    <button
                      onClick={() => handleTabClick(index)}
                      className="w-full flex justify-between items-center gap-3 px-2 py-3 rounded-xl hover:bg-[#F7F9FB] cursor-pointer transition"
                    >
                      <span className="text-[15px] text-[#1E293B] font-medium">
                        {item.label}
                      </span>
                      <svg
                        width="18"
                        height="18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-[#1E293B] opacity-60"
                      >
                        <path
                          d="M7 13l4-4-4-4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              // Contenu détaillé en mode mobile avec bouton retour
              <div className="bg-white rounded-2xl p-4 border border-light-blue-gray relative">
                <div className="flex items-center mb-4">
                  <button
                    onClick={handleBackClick}
                    className="mr-3 p-2 rounded-full hover:bg-[#F7F9FB]"
                  >
                    <svg
                      width="20"
                      height="20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-[#1E293B]"
                    >
                      <path
                        d="M12 16l-6-6 6-6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <h2 className="text-xl font-bold">{activeTab.label}</h2>
                </div>
                <div className="text-ash-gray text-base leading-relaxed">
                  {activeTab.content}
                </div>
              </div>
            )}
          </div>
        ) : (
          // Version desktop avec grille à deux colonnes
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 mt-5">
            <nav className="flex-1 overflow-y-auto">
              <ul className="space-y-1">
                {navItems.map((item, index) => (
                  <li
                    key={item.label}
                    className={`h-[56px] ${
                      index === 0 || index === 1
                        ? "border-b border-soft-ice-gray "
                        : ""
                    }`}
                  >
                    <button
                      onClick={() => handleTabClick(index)}
                      className={`w-full flex justify-between gap-3 px-2 py-3 rounded-xl hover:bg-[#F7F9FB] cursor-pointer transition group ${
                        activeIdx === index ? "bg-snow-blue" : ""
                      }`}
                    >
                      <span className="text-[15px] text-[#1E293B] font-medium">
                        {item.label}
                      </span>
                      <span>
                        <svg
                          width="18"
                          height="18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-[#1E293B] opacity-60 group-hover:opacity-100"
                        >
                          <path
                            d="M7 13l4-4-4-4"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mt-5 md:mt-0">
              <div className="bg-white rounded-2xl p-4 md:p-8 border border-light-blue-gray max-w-2xl mx-auto relative">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-xl font-bold">{activeTab.label}</h2>
                  <Link
                    href={activeTab.href}
                    className="bg-white p-2 rounded-[8px] border border-light-blue-gray"
                  >
                    <Image
                      src="/assets/icons/scale.svg"
                      alt="external-link"
                      width={22}
                      height={22}
                    />
                  </Link>
                </div>
                <div className="text-ash-gray text-base leading-relaxed">
                  {activeTab.content}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
