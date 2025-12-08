"use client";

import { authUtils } from "@/utils/auth";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Composant de protection des routes - redirige vers login si non authentifié
 * À utiliser pour protéger toutes les pages sauf la page de login
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  fallback = null,
}) => {
  const t = useTranslations();
  const defaultFallback = (
    <div className="flex items-center justify-center min-h-screen">
      {t("loading")}...
    </div>
  );
  const actualFallback = fallback;
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const authenticated = authUtils.isAuthenticated();
        setIsAuthenticated(authenticated);

        if (!authenticated) {
          // Rediriger vers la page de login si non authentifié
          router.push("/login");
          return;
        }
      } catch (error) {
        console.error(
          "Erreur lors de la vérification d'authentification:",
          error
        );
        // En cas d'erreur, rediriger aussi vers login
        router.push("/login");
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [router]);

  // Afficher le fallback pendant la vérification
  if (isChecking) {
    return <>{actualFallback}</>;
  }

  // Si authentifié, afficher le contenu
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Si non authentifié, ne rien afficher (redirection en cours)
  return null;
};

export default AuthGuard;
