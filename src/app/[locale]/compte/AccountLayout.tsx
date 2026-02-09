"use client";
import { AuthGuard } from "@/components/common/AuthGuard";
import { AccountSidebar } from "@/components/layout/AccountSidebar";
import { Header } from "@/components/layout/header/Header";
import { HeaderClient } from "@/components/layout/header/HeaderClient";
import { AppSidebar } from "@/components/layout/Sidebare";

import { useUserStore } from "@/store/useUser";
import { useTranslations } from "next-intl";

export default function AccountLayout({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const t = useTranslations();
  const { user } = useUserStore();

  return (
    <AuthGuard>
      <div className={`w-full flex ${className ?? ""}`}>
        <AppSidebar />

        {/* Layout principal */}
        <div className="w-full flex-1">
          {/* Header */}
          {user?.type === "client" ? (
            <HeaderClient text={t("nav.account")} showHamburger={true} />
          ) : (
            <Header
              hideProfile
              text={t("nav.account")}
              isBorder
              showHamburger={true}
            />
          )}

          {/* Contenu principal */}
          <div className="flex">
            {/* Sidebar desktop */}
            <div className="hidden lg:block">
              <AccountSidebar />
            </div>

            {/* Zone de contenu */}
            <div className="w-full mx-auto lg:px-0 pb-20 bg-white">
              {children}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
