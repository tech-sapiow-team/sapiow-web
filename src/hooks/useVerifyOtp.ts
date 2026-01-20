import { supabase } from "@/lib/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface UseVerifyOtpReturn {
  code: string;
  isCodeComplete: boolean;
  phoneNumber: string;
  formattedPhone: string;
  isLoading: boolean;
  error: string | null;
  handleCodeChange: (value: string) => void;
  handleResendCode: () => Promise<void>;
  handleChangeNumber: () => void;
  handleContinue: () => Promise<void>;
}

export function useVerifyOtp(): UseVerifyOtpReturn {
  const [code, setCode] = useState("");
  const [isCodeComplete, setIsCodeComplete] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [formattedPhone, setFormattedPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const queryClient = useQueryClient();

  // Récupérer le numéro de téléphone depuis localStorage
  useEffect(() => {
    const savedPhone = localStorage.getItem("phoneNumber");
    const savedFormatted = localStorage.getItem("formattedPhone");

    if (savedPhone) {
      setPhoneNumber(savedPhone);
      setFormattedPhone(savedFormatted || savedPhone);
    } else {
      // Rediriger vers la page de login si pas de numéro sauvegardé
      router.push("/login");
    }
  }, [router]);

  // Vérifier si le code est complet
  useEffect(() => {
    setIsCodeComplete(code.length === 6);
  }, [code]);

  const handleCodeChange = (value: string) => {
    setCode(value);
    // Réinitialiser l'erreur quand l'utilisateur tape
    if (error) {
      setError(null);
    }
  };

  const handleResendCode = async () => {
    if (!phoneNumber) return;

    setIsLoading(true);
    setError(null);

    try {
      const { error: authError } = await supabase.auth.signInWithOtp({
        phone: phoneNumber,
      });

      if (authError) {
        console.error("Erreur lors du renvoi:", authError);
        setError(authError.message);
      }
    } catch (err) {
      console.error("Erreur inattendue lors du renvoi:", err);
      setError("Erreur lors du renvoi du code. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeNumber = () => {
    router.push("/login");
  };

  const handleContinue = async () => {
    if (!isCodeComplete || !phoneNumber) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: code,
        type: "sms",
      });

      if (authError) {
        console.error("Erreur de vérification:", authError);
        setError(authError.message);
        return;
      }

      if (data.user && data.session) {
       
        localStorage.removeItem("phoneNumber");
        localStorage.removeItem("formattedPhone");

        // Invalider la query customer pour forcer le rechargement des données
        queryClient.invalidateQueries({ queryKey: ["customer"] });
        queryClient.invalidateQueries({ queryKey: ["proExpert"] });

        // Rediriger vers onboarding - la logique de vérification des profils se fera là-bas
        router.push("/onboarding");
      }
    } catch (err) {
      console.error("Erreur inattendue lors de la vérification:", err);
      setError("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    code,
    isCodeComplete,
    phoneNumber,
    formattedPhone,
    isLoading,
    error,
    handleCodeChange,
    handleResendCode,
    handleChangeNumber,
    handleContinue,
  };
}
