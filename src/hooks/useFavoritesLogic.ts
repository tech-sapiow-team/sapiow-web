import {
    useAddFavorite,
    useGetFavorites,
    useRemoveFavorite,
} from "@/api/favorites/useFavorites";
import { authUtils } from "@/utils/auth";
import { useEffect, useMemo, useState } from "react";

/**
 * Hook personnalisé pour gérer la logique des favoris
 *
 * ARCHITECTURE FAVORIS :
 * - L'API /favorites retourne un array direct de favoris
 * - Chaque favori contient : { id: string, pro_id: string, patient_id: string, pros: Professional }
 * - pro_id est l'UUID string du professionnel
 *
 * FONCTIONNALITÉS :
 * - Détection automatique des favoris : likedProfs[pro_id] = true/false
 * - Ajout favori : POST /favorites/{pro_id}
 * - Suppression favori : DELETE /favorites/{pro_id}
 * - Invalidation automatique du cache React Query
 */
export const useFavoritesLogic = (options?: { enabled?: boolean }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      authUtils.isAuthenticated().then(setIsAuthenticated);
    }
  }, []);

  const enabled = options?.enabled ?? isAuthenticated;

  // Hooks API pour les favoris
  const { data: favoritesData, isLoading: isLoadingFavorites } =
    useGetFavorites(enabled);
  const addFavoriteMutation = useAddFavorite();
  const removeFavoriteMutation = useRemoveFavorite();

  /**
   * Convertit les données API favoris en mapping pour l'UI
   *
   * STRUCTURE API :
   * favoritesData = [
   *   { id: "uuid1", pro_id: "prof-uuid-1", ... },
   *   { id: "uuid2", pro_id: "prof-uuid-2", ... }
   * ]
   *
   * RÉSULTAT :
   * likedProfs = {
   *   "prof-uuid-1": true,
   *   "prof-uuid-2": true
   * }
   */
  const likedProfs = useMemo(() => {
    if (!favoritesData || !Array.isArray(favoritesData)) {
      return {};
    }

    const result: Record<string, boolean> = {};
    favoritesData.forEach((favorite) => {
      result[favorite.pro_id] = true;
    });

    return result;
  }, [favoritesData]);

  /**
   * Toggle l'état favori d'un professionnel avec optimistic update
   *
   * @param profId - UUID string du professionnel
   *
   * UX OPTIMISÉE :
   * - Changement immédiat de l'UI (optimistic update)
   * - Rollback automatique en cas d'erreur
   * - État de chargement pendant la requête
   */
  const handleToggleLike = async (profId: string) => {
    if (!enabled) return;
    const isCurrentlyLiked = likedProfs[profId];

    try {
      if (isCurrentlyLiked) {
        // Supprimer des favoris avec optimistic update
        await removeFavoriteMutation.mutateAsync(profId);
      } else {
        // Ajouter aux favoris avec optimistic update
        await addFavoriteMutation.mutateAsync(profId);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour des favoris:", error);
    }
  };

  return {
    // Données
    likedProfs,
    favoritesData,

    // États
    isLoadingFavorites,

    // Actions
    handleToggleLike,

    // États de chargement pour UX (utilisables dans l'UI)
    isAddingFavorite: addFavoriteMutation.isPending,
    isRemovingFavorite: removeFavoriteMutation.isPending,
    isMutatingFavorite:
      addFavoriteMutation.isPending || removeFavoriteMutation.isPending,
  };
};
