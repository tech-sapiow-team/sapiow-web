"use client";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";
import { Button } from "./Button";

function base64urlEncode(str: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(str)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function generateRandomString(length = 64) {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  let result = "";
  const randomValues = crypto.getRandomValues(new Uint8Array(length));
  for (let i = 0; i < length; i++) {
    result += charset[randomValues[i] % charset.length];
  }
  return result;
}

async function generatePKCECodes() {
  const codeVerifier = generateRandomString();
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const codeChallenge = base64urlEncode(digest);
  return { codeVerifier, codeChallenge };
}

interface GoogleCalendarConnectButtonProps {
  isLoading?: boolean;
  className?: string;
  children?: React.ReactNode;
  redirectPath?: string; // ✅ Nouveau: chemin de redirection après OAuth
  onSuccess?: () => void; // ✅ Nouveau: callback de succès
}

export default function GoogleCalendarConnectButton({
  isLoading = false,
  className = "",
  children,
  redirectPath = "/", // Par défaut, redirige vers la racine
  onSuccess,
}: GoogleCalendarConnectButtonProps) {
  const t = useTranslations("googleCalendarConnect");

  const handleConnect = async () => {
    try {
      const { codeVerifier, codeChallenge } = await generatePKCECodes();
      
      // ✅ Stocker avec un préfixe pour éviter les conflits
      localStorage.setItem("google_code_verifier", codeVerifier);
      localStorage.setItem("google_redirect_path", redirectPath);

      const clientId =
        "771885012336-l57mdnchvfv5tq6huhurc3dkdh26jm1r.apps.googleusercontent.com";
      
      // ✅ IMPORTANT: Utiliser une page de callback dédiée
      const redirectUri = `${window.location.origin}`;
      // OU si vous préférez garder l'origin simple:
      // const redirectUri = window.location.origin;
      
      // ✅ AJOUTER TOUS LES SCOPES VÉRIFIÉS
      const scope = [
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile", // ✅ Nouveau scope vérifié
        "openid" // ✅ Scope openid maintenant vérifié
      ].join(" ");

      const authUrl =
        `https://accounts.google.com/o/oauth2/v2/auth?` +
        new URLSearchParams({
          client_id: clientId,
          redirect_uri: redirectUri,
          response_type: "code",
          scope,
          code_challenge: codeChallenge,
          code_challenge_method: "S256",
          access_type: "offline",
          prompt: "consent",
          // ✅ Paramètres optionnels pour une meilleure UX
          include_granted_scopes: "true",
          state: btoa(JSON.stringify({
            timestamp: Date.now(),
            redirect: redirectPath
          }))
        }).toString();

      console.log("🔗 Connexion Google Calendar (App Vérifiée)");
      console.log("Scopes:", scope);
      
      // ✅ Déclencher le callback si fourni
      if (onSuccess) {
        onSuccess();
      }
      
      window.location.href = authUrl;
    } catch (error) {
      console.error("❌ Erreur lors de la génération PKCE:", error);
      // ✅ Gestion d'erreur améliorée
      alert(t("connectionError") || "Erreur de connexion à Google");
    }
  };

  return (
    <Button
      onClick={handleConnect}
      disabled={isLoading}
      className={`${className} bg-white hover:bg-gray-50 border-gray-300`}
      variant="outline"
      label={
        isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t("connecting")}
          </>
        ) : (
          children || (
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>{t("connectButton")}</span>
            </div>
          )
        )
      }
    />
  );
}