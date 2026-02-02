"use client";

import { useGoogleCalendarConnect } from "@/api/google-calendar-sync/useGoogleCalendarSync";
import { Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

function OAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const t = useTranslations("oauthCallback");
  const [error, setError] = useState<string | null>(null);
  const hasProcessed = useRef(false);
  const { mutateAsync: connectGoogleCalendar } = useGoogleCalendarConnect();

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const handleOAuthCallback = async () => {
      try {
        const authorizationCode = searchParams.get("code");
        const errorParam = searchParams.get("error");

        // ✅ Récupérer le chemin de redirection stocké
        const redirectPath = localStorage.getItem("google_redirect_path") || "/compte/disponibilites";

        if (errorParam) {
          console.error("❌ Erreur OAuth:", errorParam);
          setError(`Erreur Google: ${errorParam}`);
          setTimeout(() => router.replace(`/${locale}${redirectPath}`), 3000);
          return;
        }

        if (!authorizationCode) {
          console.error("❌ Code d'autorisation manquant.");
          setError(t("missingCode"));
          setTimeout(() => router.replace(`/${locale}${redirectPath}`), 2000);
          return;
        }

        const codeVerifier = localStorage.getItem("google_code_verifier");
        
        if (!codeVerifier) {
          console.error("❌ Code verifier manquant.");
          setError(t("sessionExpired"));
          setTimeout(() => router.replace(`/${locale}${redirectPath}`), 2000);
          return;
        }

        // ✅ Utiliser mutateAsync avec try/catch
        const data = await connectGoogleCalendar({ authorizationCode, codeVerifier });
        
        // ✅ Nettoyer tous les éléments stockés
        localStorage.removeItem("google_code_verifier");
        localStorage.removeItem("google_redirect_path");
        
        router.replace(`/${locale}${redirectPath}`);
        
      } catch (err) {
        console.error("❌ Erreur:", err);
        // ✅ Typage amélioré de l'erreur
        const errorMessage = err instanceof Error ? err.message : t("processingError");
        setError(errorMessage);
        const redirectPath = localStorage.getItem("google_redirect_path") || "/compte/disponibilites";
        setTimeout(() => {
          router.replace(`/${locale}${redirectPath}`);
        }, 3000);
      }
    };

    handleOAuthCallback();
  }, [searchParams, connectGoogleCalendar, router, locale, t]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 text-center">
        {error ? (
          <div className="space-y-4">
            <div className="rounded-lg bg-red-50 p-4 border border-red-200">
              <div className="text-red-700">
                <span className="text-lg font-semibold">{t("error")}: </span>
                <span>{error}</span>
              </div>
            </div>
            <p className="text-gray-500 text-sm">{t("redirecting")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto" />
            <p className="text-xl font-semibold text-gray-800">
              {t("connecting")}
            </p>
            <p className="text-gray-600">{t("pleaseWait")}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        </div>
      }
    >
      <OAuthCallbackContent />
    </Suspense>
  );
}