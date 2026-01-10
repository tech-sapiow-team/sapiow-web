import { apiClient } from "@/lib/api-client";
import {
  AddFavoriteResponse,
  GetFavoritesResponse,
  RemoveFavoriteResponse,
} from "@/types/favorites";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Hook pour ajouter un favori avec optimistic update
export const useAddFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      professionalId: string
    ): Promise<AddFavoriteResponse> => {
      return await apiClient.post<AddFavoriteResponse>(
        `favorites/${professionalId}`,
        {
          id: professionalId,
        }
      );
    },
    onMutate: async (professionalId) => {
      // Annuler toutes les requêtes en cours pour éviter les conflits
      await queryClient.cancelQueries({ queryKey: ["favorites"] });

      // Sauvegarder l'état précédent pour rollback
      const previousFavorites = queryClient.getQueryData(["favorites"]);

      // Optimistic update : ajouter immédiatement le favori à l'UI
      queryClient.setQueryData(["favorites"], (old: any) => {
        if (!old || !Array.isArray(old)) return old;

        // Créer un nouveau favori temporaire
        const newFavorite = {
          id: `temp-${Date.now()}`,
          pro_id: professionalId,
          patient_id: "temp",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          pros: {}, // Objet vide temporaire
        };

        return [...old, newFavorite];
      });

      return { previousFavorites };
    },
    onError: (err, professionalId, context) => {
      // Rollback en cas d'erreur
      if (context?.previousFavorites) {
        queryClient.setQueryData(["favorites"], context.previousFavorites);
      }
    },
    onSettled: () => {
      // Toujours invalider le cache à la fin pour synchroniser avec le serveur
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
};

// Hook pour supprimer un favori avec optimistic update
export const useRemoveFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      professionalId: string
    ): Promise<RemoveFavoriteResponse> => {
      return await apiClient.delete<RemoveFavoriteResponse>(
        `favorites/${professionalId}`
      );
    },
    onMutate: async (professionalId) => {
      // Annuler toutes les requêtes en cours pour éviter les conflits
      await queryClient.cancelQueries({ queryKey: ["favorites"] });

      // Sauvegarder l'état précédent pour rollback
      const previousFavorites = queryClient.getQueryData(["favorites"]);

      // Optimistic update : supprimer immédiatement le favori de l'UI
      queryClient.setQueryData(["favorites"], (old: any) => {
        if (!old || !Array.isArray(old)) return old;

        // Filtrer pour retirer le favori
        return old.filter(
          (favorite: any) => favorite.pro_id !== professionalId
        );
      });

      return { previousFavorites };
    },
    onError: (err, professionalId, context) => {
      // Rollback en cas d'erreur
      if (context?.previousFavorites) {
        queryClient.setQueryData(["favorites"], context.previousFavorites);
      }
    },
    onSettled: () => {
      // Toujours invalider le cache à la fin pour synchroniser avec le serveur
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
};

// Hook pour récupérer tous les favoris
export const useGetFavorites = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["favorites"],
    queryFn: async (): Promise<GetFavoritesResponse> => {
      return await apiClient.get<GetFavoritesResponse>("favorites");
    },
    enabled,
  });
};

// Hook pour vérifier si un professionnel est en favori
export const useIsFavorite = (professionalId: string) => {
  const { data: favorites } = useGetFavorites();

  const isFavorite = Array.isArray(favorites)
    ? favorites.some(
        (favorite: AddFavoriteResponse) => favorite.pro_id === professionalId
      )
    : false;

  const favoriteId = Array.isArray(favorites)
    ? favorites.find(
        (favorite: AddFavoriteResponse) => favorite.pro_id === professionalId
      )?.id
    : undefined;

  return { isFavorite, favoriteId };
};
