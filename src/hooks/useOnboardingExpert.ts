"use client";
import { useGetDomaines, useGetExpertises } from "@/api/domaine/useDomaine";
import { useOnboardingExpertPro } from "@/api/onbaording/useOnboarding";
import { useGetCustomer } from "@/api/customer/useCustomer";
import {
  useGetProExpert,
  useUpdateProExpert,
} from "@/api/proExpert/useProExpert";
import { useCreateProSession } from "@/api/sessions/useSessions";
import { useUserStore } from "@/store/useUser";
import { OnboardingExpertData, mapDomainIdToNumeric } from "@/types/onboarding";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export interface VisioOption {
  duration: number;
  enabled: boolean;
  price: string;
}

export const useOnboardingExpert = () => {
  const router = useRouter();
  const { setUser } = useUserStore();
  const [step, setStep] = useState(1);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Hook pour l'appel API
  const onboardingMutation = useOnboardingExpertPro();
  const updateProMutation = useUpdateProExpert();
  const { data: existingPro } = useGetProExpert();
  const { data: customer } = useGetCustomer();
  const [pendingAddSessions, setPendingAddSessions] = useState<boolean>(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profession, setProfession] = useState("");
  const [email, setEmail] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [selectedDomainId, setSelectedDomainId] = useState<number | null>(null);
  const [selectedSpecialties, setSelectedSpecialties] = useState<number[]>([]);
  const [aboutMe, setAboutMe] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [visioOptions, setVisioOptions] = useState<VisioOption[]>([
    { duration: 15, enabled: false, price: "" },
    { duration: 30, enabled: false, price: "" },
    { duration: 45, enabled: false, price: "" },
    { duration: 60, enabled: false, price: "" },
  ]);

  const {
    data: domains = [],
    isLoading: isLoadingDomains,
    error: domainsError,
  } = useGetDomaines();

  const {
    data: expertises = [],
    isLoading: isLoadingExpertises,
    error: expertisesError,
  } = useGetExpertises(selectedDomainId || 0);

  const { mutateAsync: createProSession } = useCreateProSession();

  // Initialisation: démarrer à l'étape 2 si demandé + pré-remplir prénom/nom/job (email optionnel)
  useEffect(() => {
    if (hasInitialized) return;

    // 1) step depuis querystring (?step=2) OU sessionStorage (onboardingExpertStartStep)
    let desiredStep: number | null = null;
    try {
      const params = new URLSearchParams(window.location.search);
      const stepParam = params.get("step");
      if (stepParam) desiredStep = Number(stepParam);
    } catch {
      // no-op
    }

    try {
      const fromStorage = sessionStorage.getItem("onboardingExpertStartStep");
      if (fromStorage) desiredStep = Number(fromStorage);
    } catch {
      // no-op
    }

    if (desiredStep && Number.isFinite(desiredStep) && desiredStep >= 1) {
      setStep(desiredStep);
    }

    // 2) Préfill depuis sessionStorage, sinon customer/pro existant
    let prefill: { first_name?: string; last_name?: string } = {};
    try {
      const raw = sessionStorage.getItem("onboardingExpertPrefill");
      if (raw) prefill = JSON.parse(raw);
    } catch {
      // no-op
    }

    const fallbackFirstName = (
      prefill.first_name ??
      customer?.first_name ??
      existingPro?.first_name ??
      ""
    )
      .toString()
      .trim();
    const fallbackLastName = (
      prefill.last_name ??
      customer?.last_name ??
      existingPro?.last_name ??
      ""
    )
      .toString()
      .trim();
    if (!firstName && fallbackFirstName) setFirstName(fallbackFirstName);
    if (!lastName && fallbackLastName) setLastName(fallbackLastName);

    // Cleanup des flags one-shot
    try {
      sessionStorage.removeItem("onboardingExpertStartStep");
      sessionStorage.removeItem("onboardingExpertPrefill");
    } catch {
      // no-op
    }

    setHasInitialized(true);
  }, [hasInitialized, customer, existingPro, firstName, lastName]);

  // Validations
  const isFormValid =
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    profession.trim().length > 0 &&
    // email optionnel, mais s'il est rempli il doit être valide
    (!email.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()));

  const isDomainValid = !!selectedDomain;
  const isSpecialtyValid = selectedSpecialties.length > 0;
  // Validation des sessions : si une session est activée, elle doit avoir un prix >= 0 (0 est accepté pour les consultations gratuites)
  const isVisioValid = visioOptions.every(
    (option) =>
      !option.enabled ||
      (option.price !== "" &&
        option.price !== null &&
        option.price !== undefined &&
        Number(option.price) >= 0)
  );

  // Actions
  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => Math.max(1, prev - 1));
  const goToStep = (stepNumber: number) => setStep(stepNumber);

  const handleSpecialtyToggle = (expertiseId: number) => {
    setSelectedSpecialties((prev) =>
      prev.includes(expertiseId)
        ? prev.filter((id) => id !== expertiseId)
        : [...prev, expertiseId]
    );
  };

  const updateVisioOption = (
    index: number,
    field: keyof VisioOption,
    value: unknown
  ) => {
    setVisioOptions((prev) => {
      const newOptions = [...prev];
      // Si on active l'option (enabled devient true) et que le prix est vide, mettre 0 par défaut
      if (field === "enabled" && value === true && !newOptions[index].price) {
        newOptions[index] = {
          ...newOptions[index],
          [field]: value,
          price: "0",
        };
      } else {
        newOptions[index] = { ...newOptions[index], [field]: value };
      }
      return newOptions;
    });
  };

  const handleAvatarChange = (file: File | null) => {
    setAvatar(file);
  };

  const submitExpertProfile = useMemo(() => {
    return async (data: OnboardingExpertData) => {
      // Si un pro existe déjà (ex: créé minimalement via switch), on met à jour au lieu de re-créer
      if (existingPro) {
        return updateProMutation.mutateAsync({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          domain_id: data.domain_id,
          description: data.description,
          job: data.job,
          linkedin: data.linkedin,
          website: data.website,
          expertises: data.expertises,
          schedules: data.schedules,
          timezone: data.timezone,
          avatar: data.avatar,
        });
      }
      return onboardingMutation.mutateAsync(data);
    };
  }, [existingPro, onboardingMutation, updateProMutation]);

  // Fonction pour créer seulement l'expert (sans sessions) - utilisée pour "Plus tard"
  const completeOnboardingWithoutSessions = async () => {
    try {
      // Mapper les spécialités vers le format API attendu
      const expertises = selectedSpecialties.map((expertiseId) => ({
        expertise_id: expertiseId,
      }));

      // Préparer les données pour l'API
      const onboardingData: OnboardingExpertData = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        domain_id: selectedDomain
          ? mapDomainIdToNumeric(selectedDomain) || 0
          : 0,
        description: aboutMe.trim() || undefined,
        linkedin: linkedinUrl.trim() || undefined,
        website: websiteUrl.trim() || undefined,
        job: profession.trim() || undefined,
        expertises: expertises.length > 0 ? expertises : undefined,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        ...(avatar && { avatar }),
      };

      await submitExpertProfile(onboardingData);

      // Rediriger vers la page d'accueil après succès
      setUser({ type: "expert" });
      router.push("/");
    } catch (error) {
      console.error("❌ Erreur lors de l'onboarding expert:", error);
    }
  };

  // Fonction pour créer l'expert avec les sessions - utilisée pour "Terminer"
  // Cette fonction envoie TOUTES les données remplies : infos personnelles, domaine, spécialités, description, liens, avatar, et sessions
  const completeOnboarding = async () => {
    try {
      // Mapper les spécialités vers le format API attendu
      const expertises = selectedSpecialties.map((expertiseId) => ({
        expertise_id: expertiseId,
      }));

      // Préparer TOUTES les données pour l'API (étape 1 à 4)
      const onboardingData: OnboardingExpertData = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        domain_id: selectedDomain
          ? mapDomainIdToNumeric(selectedDomain) || 0
          : 0,
        description: aboutMe.trim() || undefined,
        job: profession.trim() || undefined,
        linkedin: linkedinUrl.trim() || undefined,
        website: websiteUrl.trim() || undefined,
        expertises: expertises.length > 0 ? expertises : undefined,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        ...(avatar && { avatar }),
      };

      // ÉTAPE 1: Soumettre toutes les données de l'expert à l'API
      const expertResult: any = await submitExpertProfile(onboardingData);

      // ÉTAPE 2: Créer TOUTES les sessions activées avec un prix >= 0 (0 est accepté pour les consultations gratuites)
      const enabledOptions = visioOptions.filter(
        (option) =>
          option.enabled &&
          option.price !== "" &&
          option.price !== null &&
          option.price !== undefined &&
          Number(option.price) >= 0
      );

      const proId =
        existingPro?.id ??
        expertResult?.data?.id ??
        expertResult?.expert_id ??
        expertResult?.id;

      if (proId && enabledOptions.length > 0) {
        setPendingAddSessions(true);
        // Créer toutes les sessions une par une en attendant chacune
        for (const option of enabledOptions) {
          const sessionData = {
            price: Number(option.price),
            session_type: `${option.duration}m` as any,
            session_nature: "one_time" as any,
            one_on_one: true,
            video_call: true,
            mentorship: true,
            name: `Consultation ${option.duration} minutes`,
            is_active: true,
          };

          try {
            // Utiliser mutateAsync pour attendre correctement chaque création
            await createProSession(sessionData);
            console.log(`✅ Session ${option.duration}m créée avec succès`);
            setPendingAddSessions(false);
          } catch (sessionError) {
            setPendingAddSessions(false);
            console.error(
              `❌ Erreur lors de la création de la session ${option.duration}m:`,
              sessionError
            );
            // Continuer avec les autres sessions même en cas d'erreur
          }
        }
      }

      // Rediriger vers la page d'accueil après succès complet
      setUser({ type: "expert" });
      router.push("/");
    } catch (error) {
      console.error("❌ Erreur lors de l'onboarding expert:", error);
    }
  };

  // Fonction pour gérer "Plus tard"
  const handleSkipToLater = () => {
    // Vérifier si les données minimales sont valides
    if (isFormValid && isDomainValid) {
      // Si les données de base sont valides, rediriger vers la racine
      setUser({ type: "expert" });
      router.push("/");
    } else {
      // Sinon, afficher un message d'erreur
      console.error("Données incomplètes pour continuer plus tard");
      // TODO: Afficher un toast d'erreur ou un message à l'utilisateur
      alert(
        "Veuillez remplir au minimum les informations personnelles et sélectionner un domaine avant de continuer."
      );
    }
  };

  return {
    // State
    step,
    firstName,
    lastName,
    profession,
    email,
    selectedDomain,
    selectedSpecialties,
    aboutMe,
    linkedinUrl,
    websiteUrl,
    avatar,
    visioOptions,

    // Validations
    isFormValid,
    isDomainValid,
    isSpecialtyValid,
    isVisioValid,

    // Loading state
    isSubmitting:
      onboardingMutation.isPending ||
      updateProMutation.isPending ||
      pendingAddSessions,
    error: onboardingMutation.error || updateProMutation.error,

    // Données des domaines et expertises
    domains,
    isLoadingDomains,
    expertises,
    isLoadingExpertises,
    domainsError,
    expertisesError,

    // Setters
    setFirstName,
    setLastName,
    setProfession,
    setEmail,
    setSelectedDomain: (domain: string | null) => {
      setSelectedDomain(domain);
      // Convertir le string domain en ID numérique pour l'API
      if (domain) {
        const domainId = mapDomainIdToNumeric(domain);
        setSelectedDomainId(domainId);
      } else {
        setSelectedDomainId(null);
      }
    },
    setAboutMe,
    setLinkedinUrl,
    setWebsiteUrl,

    // Actions
    nextStep,
    prevStep,
    goToStep,
    handleSpecialtyToggle,
    handleAvatarChange,
    updateVisioOption,
    completeOnboarding,
    completeOnboardingWithoutSessions,
    handleSkipToLater,
  };
};
