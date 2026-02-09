"use client";
import { useGetProExpert } from "@/api/proExpert/useProExpert";
import { useGetCustomer } from "@/api/customer/useCustomer";
import { useUserStore } from "@/store/useUser";
import { useRouter } from "next/navigation";

export const useExpertModeSwitch = () => {
  const router = useRouter();
  const { user, setUser } = useUserStore();
  const { data: proExpert } = useGetProExpert();
  const { data: customer } = useGetCustomer();

  // Fonction pour vérifier si les données expert sont vides
  const checkIfProExpertEmpty = (data: any): boolean => {
    if (!data) return true;
    if (data.error === "Cannot coerce the result to a single JSON object")
      return true;
    if (Array.isArray(data) && data.length === 0) return true;
    return false;
  };

  // Fonction pour gérer le passage en mode expert
  const handleExpertModeSwitch = async () => {
    const isProExpertEmpty = checkIfProExpertEmpty(proExpert);

    if (isProExpertEmpty) {
      // Pas de profil expert -> rediriger vers l'étape 2 de l'onboarding expert
      const firstName = (customer?.first_name ?? "").trim();
      const lastName = (customer?.last_name ?? "").trim();

      sessionStorage.setItem("switchToExpert", "true");
      const startStep = "2";
      sessionStorage.setItem("onboardingExpertStartStep", startStep);
      sessionStorage.setItem(
        "onboardingExpertPrefill",
        JSON.stringify({ first_name: firstName, last_name: lastName })
      );

      router.push(`/onboarding?step=${startStep}`);
    } else {
      // Profil expert existe -> passer en mode expert
      setUser({ type: "expert" });
    }
  };

  // Fonction pour gérer le switch entre modes client/expert
  const handleModeSwitch = (checked: boolean) => {
    if (checked) {
      setUser({ type: "expert" });
    } else {
      setUser({ type: "client" });
    }
  };

  // Vérifier si l'utilisateur a un profil expert
  const hasExpertProfile = !checkIfProExpertEmpty(proExpert);
  const isExpertMode = user.type === "expert";

  return {
    handleExpertModeSwitch,
    handleModeSwitch,
    hasExpertProfile,
    isExpertMode,
  };
};
