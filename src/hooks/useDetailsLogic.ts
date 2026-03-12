import { Professional } from "@/types/professional";
import { useMemo, useState } from "react";
import { useFavoritesLogic } from "./useFavoritesLogic";

/**
 * Hook pour isoler la logique métier de la page details
 *
 * RESPONSABILITÉS :
 * - Transformation des données expert → Professional
 * - Mapping des expertises
 * - Gestion UI (modals, description étendue)
 * - Délégation des favoris au hook useFavoritesLogic
 */
export const useDetailsLogic = (
  expertData: any,
  options?: { favoritesEnabled?: boolean },
) => {
  // États UI locaux
  const [isOfferSheetOpen, setIsOfferSheetOpen] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // Hook logique favoris (partagé avec la page d'accueil)
  const { likedProfs, handleToggleLike, isLoadingFavorites } =
    useFavoritesLogic({ enabled: options?.favoritesEnabled });

  // Utiliser directement les noms présents dans pro_expertises
  const expertiseNames = useMemo(() => {
    if (!expertData?.pro_expertises) return [];

    return expertData.pro_expertises
      .map((proExpertise: any) =>
        typeof proExpertise?.expertise?.name === "string"
          ? proExpertise.expertise.name.trim()
          : "",
      )
      .filter((name: string) => name.length > 0);
  }, [expertData?.pro_expertises]);

  // Transformer les données de l'expert en Professional
  const professional: Professional | null = useMemo(() => {
    if (!expertData) return null;

    return {
      id: expertData.id,
      name: `${expertData.first_name} ${expertData.last_name}`.trim(),
      first_name: expertData.first_name,
      last_name: expertData.last_name,
      price: expertData.sessions?.[0]?.price
        ? `${expertData.sessions[0].price} €`
        : "Non défini",
      image:
        expertData.avatar && expertData.avatar.startsWith("http")
          ? expertData.avatar
          : "/assets/icons/pro1.png",
      avatar: expertData.avatar,
      verified: true,
      topExpertise: expertData.badge === "gold",
      category: "business",
      domain: "Expert",
      description:
        expertData.description || `Expert spécialisé en consultation`,
      linkedin: expertData.linkedin,
      job: expertData.job,
    };
  }, [expertData]);

  /**
   * Fonction pour vérifier si un expert est en favori
   * Utilise les données réelles de l'API favorites
   */
  const isLiked = (profId: string) => {
    return likedProfs[profId] || false;
  };

  // Actions pour la modal d'offre
  const openOfferSheet = () => setIsOfferSheetOpen(true);
  const closeOfferSheet = () => setIsOfferSheetOpen(false);

  // Actions pour la description
  const toggleDescriptionExpanded = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  return {
    // Données transformées
    professional,
    expertiseNames,

    // États UI
    isOfferSheetOpen,
    likedProfs,
    isDescriptionExpanded,

    // États API
    isLoadingFavorites,

    // Actions
    toggleLike: handleToggleLike, // Délégation au hook favoris
    isLiked,
    openOfferSheet,
    closeOfferSheet,
    setIsOfferSheetOpen,
    toggleDescriptionExpanded,
    setIsDescriptionExpanded,
  };
};
