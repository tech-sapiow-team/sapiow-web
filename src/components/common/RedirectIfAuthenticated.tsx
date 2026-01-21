"use client";

import { authUtils } from "@/utils/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface RedirectIfAuthenticatedProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

/**
 * Composant qui redirige les utilisateurs authentifiés vers une autre page
 * À utiliser pour les pages login/register pour éviter l'accès aux utilisateurs déjà connectés
 */
export const RedirectIfAuthenticated: React.FC<RedirectIfAuthenticatedProps> = ({ 
  children, 
  fallback = <div className="flex items-center justify-center min-h-screen">Redirection...</div>,
  redirectTo = "/onboarding"
}) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = await authUtils.isAuthenticated();
        setIsAuthenticated(authenticated);
        
        if (authenticated) {
          // Rediriger vers la page d'accueil si authentifié
          router.push(redirectTo);
          return;
        }
      } catch (error) {
        console.error("Erreur lors de la vérification d'authentification:", error);
        // En cas d'erreur, considérer comme non authentifié
        setIsAuthenticated(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [router, redirectTo]);

  // Afficher le fallback pendant la vérification
  if (isChecking) {
    return <>{fallback}</>;
  }

  // Si authentifié, ne rien afficher (redirection en cours)
  if (isAuthenticated) {
    return null;
  }

  // Si non authentifié, afficher le contenu (page login/register)
  return <>{children}</>;
};

export default RedirectIfAuthenticated;
