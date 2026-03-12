import { Country, detectCountryFromPhone } from "@/constants/countries";
import { supabase } from "@/lib/supabase/client";
import { setAuthNextPath } from "@/utils/authFlow";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface UseLoginReturn {
  phoneNumber: string;
  selectedCountry: Country | null;
  formattedValue: string;
  isPhoneValid: boolean;
  isLoading: boolean;
  error: string | null;
  setIsPhoneValid: (isValid: boolean) => void;
  handlePhoneChange: (
    value: string,
    country: Country,
    formatted?: string
  ) => void;
  handleContinue: () => Promise<void>;
}

export function useLogin(): UseLoginReturn {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [formattedValue, setFormattedValue] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Récupérer les données sauvegardées au chargement de la page
  useEffect(() => {
    const savedFullPhone = localStorage.getItem("phoneNumber");
    const savedFormatted = localStorage.getItem("formattedPhone");

    console.log("Données récupérées:", { savedFullPhone, savedFormatted });

    if (savedFullPhone) {
      // Détecter le pays depuis le numéro complet (ex: "+221771234567")
      const detectedCountry = detectCountryFromPhone(savedFullPhone);
      console.log("Pays détecté:", detectedCountry);

      // Extraire le numéro sans l'indicatif
      const phoneWithoutDialCode = savedFullPhone.replace(
        detectedCountry.dialCode,
        ""
      );
      console.log("Numéro sans indicatif:", phoneWithoutDialCode);

      // Pré-remplir les états avec le numéro SANS indicatif
      setPhoneNumber(phoneWithoutDialCode); // Passer seulement le numéro sans indicatif
      setSelectedCountry(detectedCountry);
      setFormattedValue(savedFormatted || "");
    }
  }, []);

  const handlePhoneChange = (
    value: string,
    country: Country,
    formatted?: string
  ) => {
    setPhoneNumber(value);
    setSelectedCountry(country);
    setFormattedValue(formatted || "");
  };

  const handleContinue = async () => {
    if (!isPhoneValid || !selectedCountry) return;

    setIsLoading(true);
    setError(null);

    try {
      const fullPhoneNumber = `${selectedCountry.dialCode}${phoneNumber}`;

      const { error: authError } = await supabase.auth.signInWithOtp({
        phone: fullPhoneNumber,
      });

      if (authError) {
        console.error("Erreur d'authentification:", authError);
        setError(authError.message);
        return;
      }

      // Sauvegarder les données dans localStorage pour la page de vérification
      localStorage.setItem("phoneNumber", fullPhoneNumber);
      localStorage.setItem("formattedPhone", formattedValue);

      const nextPath = searchParams.get("next");
      setAuthNextPath(nextPath);

      // Rediriger vers la page de vérification
      const verifyUrl = nextPath
        ? `/login/verify?next=${encodeURIComponent(nextPath)}`
        : "/login/verify";
      router.push(verifyUrl);
    } catch (err) {
      console.error("Erreur inattendue:", err);
      setError("Une erreur inattendue s'est produite. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    phoneNumber,
    selectedCountry,
    formattedValue,
    isPhoneValid,
    isLoading,
    error,
    setIsPhoneValid,
    handlePhoneChange,
    handleContinue,
  };
}
