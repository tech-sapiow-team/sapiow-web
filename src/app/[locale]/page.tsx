"use client";
import { Header } from "@/components/layout/header/Header";
import { HeaderClient } from "@/components/layout/header/HeaderClient";
import { AppSidebar } from "@/components/layout/Sidebare";
import { useUserStore } from "@/store/useUser";
import { authUtils } from "@/utils/auth";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Client from "./home/Client";
import Expert from "./home/Expert";

function Home() {
  const { user } = useUserStore();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentUserType, setCurrentUserType] = useState(user.type);
  const [isRedirectingOAuth, setIsRedirectingOAuth] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Vérifier l'authentification au chargement de la page
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = await authUtils.isAuthenticated();
        setIsAuthenticated(authenticated);

        if (!authenticated) {
          console.log("❌ Non authentifié, redirection vers /login");
          router.push(`/${locale}/login`);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la vérification d'authentification:",
          error
        );
        router.push(`/${locale}/login`);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [router, locale]);

  // Gérer le retour OAuth de Google Calendar (doit être le premier useEffect)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authCode = params.get("code");
    const scope = params.get("scope");

    // Si on a un code d'autorisation ET un scope Google Calendar, rediriger immédiatement
    if (authCode && scope?.includes("googleapis.com/auth/calendar")) {
      console.log(
        "🔄 Code OAuth Google Calendar détecté, redirection immédiate..."
      );
      setIsRedirectingOAuth(true);
      // Redirection immédiate sans délai
      router.replace(`/${locale}/oauth-callback${window.location.search}`);
      return;
    }
  }, [router, locale]);

  useEffect(() => {
    if (user.type !== currentUserType) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setCurrentUserType(user.type);
        setIsTransitioning(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [user.type, currentUserType]);

  // Afficher un loader pendant la vérification d'authentification
  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t("loading")}...</p>
        </div>
      </div>
    );
  }

  // Si non authentifié, ne rien afficher (redirection en cours)
  if (!isAuthenticated) {
    return null;
  }

  // Afficher un loader pendant la redirection OAuth
  if (isRedirectingOAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirection en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:flex min-h-screen bg-white">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <div className="transition-all duration-300 ease-in-out sticky top-0 z-20">
          {currentUserType === "client" ? (
            <HeaderClient />
          ) : (
            <Header isBorder={true} />
          )}
        </div>
        <div className="flex-1 px-5 relative overflow-hidden">
          <div
            className={`transition-all duration-300 ease-in-out transform ${
              isTransitioning
                ? "opacity-0 translate-y-2 scale-[0.98]"
                : "opacity-100 translate-y-0 scale-100"
            }`}
          >
            {currentUserType === "client" ? <Client /> : <Expert />}
          </div>
        </div>

        {/* Footer - uniquement sur la home */}
        <footer className="mt-auto border-t border-soft-ice-gray px-5 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-ash-gray">
            <Link
              href={`/${locale}/mentions-legales`}
              className="hover:underline underline-offset-4 w-fit"
            >
              {t("account.legalMentions")}
            </Link>
            <Link
              href={`/${locale}/mentions-legales#tos`}
              className="hover:underline underline-offset-4 w-fit"
            >
              {t("legalMentions.termsOfService")}
            </Link>
            <Link
              href={`/${locale}/mentions-legales#privacy`}
              className="hover:underline underline-offset-4 w-fit"
            >
              {t("legalMentions.privacyPolicy")}
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Home;
