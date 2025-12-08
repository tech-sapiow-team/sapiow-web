"use client";
import { apiClient } from "@/lib/api-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Interface pour les fonctionnalités de session (structure réelle de l'API)
export interface SessionFeatures {
  id: string;
  name: string;
  session_id: string;
  created_at: string;
}

// Interface pour la réponse des fonctionnalités
export interface SessionFeaturesResponse {
  success: boolean;
  data: SessionFeatures;
}

// Interface pour la création de fonctionnalités de session
export interface SessionFeaturesCreate {
  name: string;
}

// Interface pour la réponse de création de fonctionnalités
export interface SessionFeaturesCreateResponse {
  success: boolean;
  message: string;
  data: SessionFeatures;
}

// Interface pour les erreurs de création de fonctionnalités
export interface SessionFeaturesCreateError {
  message: string;
  status?: number;
  field?: string;
}

// Interface pour la mise à jour de fonctionnalités de session
export interface SessionFeaturesUpdate {
  name?: string;
}

// Interface pour la réponse de mise à jour de fonctionnalités
export interface SessionFeaturesUpdateResponse {
  success: boolean;
  message: string;
  data: SessionFeatures;
}

// Interface pour les erreurs de mise à jour de fonctionnalités
export interface SessionFeaturesUpdateError {
  message: string;
  status?: number;
  field?: string;
}

// Interface pour la réponse de suppression de fonctionnalités
export interface SessionFeaturesDeleteResponse {
  success: boolean;
  message: string;
}

// Interface pour les erreurs de suppression de fonctionnalités
export interface SessionFeaturesDeleteError {
  message: string;
  status?: number;
}

/**
 * Hook pour récupérer toutes les fonctionnalités d'une session via GET /pro-session-features/{id}
 */
export const useGetProSessionFeatures = (sessionId: string) => {
  return useQuery<SessionFeatures>({
    queryKey: ["pro-session-features", sessionId],
    queryFn: async () => {
      try {
        const response = await apiClient.get<SessionFeatures>(
          `pro-session-features/${sessionId}`
        );
        return response;
      } catch (error: any) {
        console.error("Error fetching session features:", error);

        if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }

        throw new Error(
          error.message ||
            "Une erreur est survenue lors de la récupération des fonctionnalités"
        );
      }
    },
    enabled: !!sessionId, // Ne lance la requête que si sessionId est défini
  });
};

/**
 * Hook pour créer les fonctionnalités d'une session via POST /pro-session-features/{id}
 */
export const useCreateProSessionFeatures = () => {
  const queryClient = useQueryClient();
  return useMutation<
    SessionFeaturesCreateResponse,
    SessionFeaturesCreateError,
    { id: string; data: SessionFeaturesCreate }
  >({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: SessionFeaturesCreate;
    }) => {
      try {
        // Validation du nom
        if (!data.name || data.name.trim().length === 0) {
          throw new Error("Le nom de la fonctionnalité est requis");
        }

        // Appel API via apiClient
        const response = await apiClient.post<any>(
          `pro-session-features/${id}`,
          data
        );

        // L'API retourne directement l'objet features
        // On wrape dans la structure attendue
        return {
          success: true,
          message: "Fonctionnalités créées avec succès",
          data: response,
        };
      } catch (error: any) {
        console.error("Error creating session features:", error);

        if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }

        throw new Error(
          error.message ||
            "Une erreur est survenue lors de la création des fonctionnalités"
        );
      }
    },
    onSuccess: (data, variables) => {
      // Invalider les queries pour rafraîchir les données
      queryClient.invalidateQueries({
        queryKey: ["pro-session-features", variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["pro-session"],
      });
      console.log("Fonctionnalités créées avec succès:", data);
    },
    onError: (error) => {
      console.error("Erreur création fonctionnalités:", error);
    },
  });
};

/**
 * Hook pour mettre à jour les fonctionnalités d'une session via PUT /pro-session-features/{id}
 */
export const useUpdateProSessionFeatures = () => {
  const queryClient = useQueryClient();
  return useMutation<
    SessionFeaturesUpdateResponse,
    SessionFeaturesUpdateError,
    { id: string; data: SessionFeaturesUpdate }
  >({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: SessionFeaturesUpdate;
    }) => {
      try {
        // Appel API via apiClient
        const response = await apiClient.put<any>(
          `pro-session-features/${id}`,
          data
        );

        // L'API retourne directement l'objet features
        // On wrape dans la structure attendue
        return {
          success: true,
          message: "Fonctionnalités mises à jour avec succès",
          data: response,
        };
      } catch (error: any) {
        console.error("Error updating session features:", error);

        if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }

        throw new Error(
          error.message ||
            "Une erreur est survenue lors de la mise à jour des fonctionnalités"
        );
      }
    },
    onSuccess: (data, variables) => {
      // Invalider les queries pour rafraîchir les données
      queryClient.invalidateQueries({
        queryKey: ["pro-session-features", variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["pro-session"],
      });
      console.log("Fonctionnalités mises à jour avec succès:", data);
    },
    onError: (error) => {
      console.error("Erreur mise à jour fonctionnalités:", error);
    },
  });
};

/**
 * Hook pour supprimer les fonctionnalités d'une session via DELETE /pro-session-features/{id}
 */
export const useDeleteProSessionFeatures = () => {
  const queryClient = useQueryClient();
  return useMutation<
    SessionFeaturesDeleteResponse,
    SessionFeaturesDeleteError,
    string
  >({
    mutationFn: async (id: string) => {
      try {
        // Appel API via apiClient
        await apiClient.delete(`pro-session-features/${id}`);

        return {
          success: true,
          message: "Fonctionnalités supprimées avec succès",
        };
      } catch (error: any) {
        console.error("Error deleting session features:", error);

        if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }

        throw new Error(
          error.message ||
            "Une erreur est survenue lors de la suppression des fonctionnalités"
        );
      }
    },
    onSuccess: (data, id) => {
      // Invalider les queries pour rafraîchir les données
      queryClient.invalidateQueries({
        queryKey: ["pro-session-features", id],
      });
      queryClient.invalidateQueries({
        queryKey: ["pro-session"],
      });
      console.log("Fonctionnalités supprimées avec succès:", data);
    },
    onError: (error) => {
      console.error("Erreur suppression fonctionnalités:", error);
    },
  });
};

/**
 * Fonction utilitaire pour valider les données de création de fonctionnalités
 */
export const validateSessionFeaturesData = (
  data: SessionFeaturesCreate
): string[] => {
  const errors: string[] = [];

  if (!data.name || data.name.trim().length === 0) {
    errors.push("Le nom de la fonctionnalité est requis");
  }

  if (data.name && data.name.length > 255) {
    errors.push(
      "Le nom de la fonctionnalité ne peut pas dépasser 255 caractères"
    );
  }

  return errors;
};
