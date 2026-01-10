// Types pour les énumérations

import { SessionType } from "@/api/sessions/useSessions";
import { apiClient } from "@/lib/api-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Types pour les énumérations
export type ProExpertStatus = "active" | "inactive" | "pending";

// Interface pour les données d'un client
export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar?: string;
  domain_id?: number[];
  language?: string;
  appointment_notification_sms?: boolean;
  appointment_notification_email?: boolean;
  message_notification_sms?: boolean;
  message_notification_email?: boolean;
  promotions_notification_sms?: boolean;
  promotions_notification_email?: boolean;
  created_at: string;
  updated_at: string;
}

// Interface pour les données d'un expert pro
export interface ProExpert {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar?: string;
  domain_id: number;
  description?: string;
  job?: string;
  expertises?: any[]; // JSON parsed
  schedules?: any[]; // JSON parsed
  status: ProExpertStatus;
  created_at: string;
  updated_at: string;
  sessions?: ProExpertSession[]; // Sessions associées
}

// Interface pour les sessions d'un expert
export interface ProExpertSession {
  id: string;
  price: number;
  session_type: SessionType;
  session_nature: string;
  name?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Interface pour la réponse de récupération d'un pro
export interface GetProExpertResponse {
  success: boolean;
  message: string;
  data: ProExpert;
}

// Interface pour les erreurs
export interface ProExpertError {
  message: string;
  status?: number;
  field?: string;
}

// Interface pour les données de session simplifiées (frontend)
export interface ProSessionData {
  price: number;
  session_type: SessionType;
  name?: string;
}

// Interface pour les données de mise à jour du client
export interface UpdateCustomerData {
  first_name?: string;
  last_name?: string;
  email?: string;
  avatar?: File | null; // File pour upload, null pour suppression
  language?: string;
  appointment_notification_sms?: boolean;
  appointment_notification_email?: boolean;
  message_notification_sms?: boolean;
  message_notification_email?: boolean;
  promotions_notification_sms?: boolean;
  promotions_notification_email?: boolean;
  domain_id?: number[];
}

/**
 * Hook pour récupérer les données du client
 */
export const useGetCustomer = (enabled: boolean = true) => {
  return useQuery<Customer | null, ProExpertError>({
    queryKey: ["customer"],
    queryFn: async () => {
      try {
        const response = await apiClient.get<Customer>(`patient`);

        // L'API retourne directement l'objet client
        return response;
      } catch (error: any) {
        // Détecter les erreurs spécifiques qui indiquent qu'aucun profil n'existe
        const errorMessage = error?.message || "";
        const errorData = error?.response?.data || {};

        // Si l'erreur est "Cannot coerce the result to a single JSON object" ou erreur vide, traiter comme 404
        if (
          errorMessage === "Resource not found" ||
          errorMessage.includes(
            "Cannot coerce the result to a single JSON object"
          ) ||
          (typeof errorData === "object" &&
            errorData !== null &&
            Object.keys(errorData).length === 0) ||
          (errorData?.error &&
            typeof errorData.error === "object" &&
            Object.keys(errorData.error).length === 0) ||
          errorMessage === "{}"
        ) {
          // Retourner null au lieu de lancer une erreur (ressource absente = 404)
          return null;
        }

        if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }

        throw new Error(
          error.message ||
            "Une erreur est survenue lors de la récupération du client"
        );
      }
    },
    retry: (failureCount, error) => {
      // Ne pas réessayer si c'est une erreur "profile not found" ou erreur vide
      const errorMessage = error?.message || "";
      const errorData = (error as any)?.response?.data || {};

      if (
        errorMessage === "Resource not found" ||
        errorMessage.includes(
          "Cannot coerce the result to a single JSON object"
        ) ||
        (typeof errorData === "object" &&
          errorData !== null &&
          Object.keys(errorData).length === 0) ||
        (errorData?.error &&
          typeof errorData.error === "object" &&
          Object.keys(errorData.error).length === 0) ||
        errorMessage === "{}"
      ) {
        return false;
      }
      // Ne pas réessayer pour les autres erreurs non plus (profil patient optionnel)
      return false;
    },
    enabled,
  });
};

// Fonction utilitaire pour transformer UpdateCustomerData en FormData
const transformUpdateCustomerToFormData = (
  data: UpdateCustomerData
): FormData => {
  const formData = new FormData();

  // Ajouter les champs texte seulement s'ils existent
  if (data.first_name) formData.append("first_name", data.first_name);
  if (data.last_name) formData.append("last_name", data.last_name);
  if (data.email) formData.append("email", data.email);
  if (data.language) formData.append("language", data.language);

  // Gérer domain_id comme un tableau JSON
  if (data.domain_id && data.domain_id.length > 0) {
    formData.append("domain_id", JSON.stringify(data.domain_id));
  }

  // Ajouter les champs de notification (comme JSON pour garder le type boolean)
  const notificationFields = {
    appointment_notification_sms: data.appointment_notification_sms,
    appointment_notification_email: data.appointment_notification_email,
    message_notification_sms: data.message_notification_sms,
    message_notification_email: data.message_notification_email,
    promotions_notification_sms: data.promotions_notification_sms,
    promotions_notification_email: data.promotions_notification_email,
  };

  // Nettoyer les valeurs undefined et ajouter seulement les champs définis
  Object.entries(notificationFields).forEach(([key, value]) => {
    if (value !== undefined) {
      formData.append(key, value ? "true" : "false");
    }
  });

  // Avatar (File pour upload, null pour suppression)
  if (data.avatar !== undefined) {
    if (data.avatar instanceof File) {
      console.log(
        "📎 Ajout du fichier au FormData client:",
        data.avatar.name,
        data.avatar.size + " bytes"
      );
      formData.append("avatar", data.avatar);
    } else if (data.avatar === null) {
      // Envoyer un blob vide + flag de suppression pour supprimer l'avatar
      console.log(
        "🗑️ Suppression avatar client: ajout d'un blob vide + flag de suppression au FormData"
      );
      const emptyBlob = new Blob([], { type: "image/jpeg" });
      formData.append("avatar", emptyBlob, "delete.jpg");
      formData.append("remove_avatar", "true");
    }
  }

  return formData;
};

/**
 * Hook pour mettre à jour les données du client
 */
export const useUpdateCustomer = () => {
  return useMutation<Customer, ProExpertError, UpdateCustomerData>({
    mutationFn: async (data: UpdateCustomerData) => {
      try {
        // Toujours utiliser FormData pour la cohérence avec l'API
        const formData = transformUpdateCustomerToFormData(data);

        // Utiliser l'endpoint patient comme pour l'onboarding
        const response = await apiClient.fetchFormData<Customer>(
          "patient",
          formData,
          {
            method: "PUT",
          }
        );

        return response;
      } catch (error: any) {
        console.error("Update customer error:", error);

        if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }

        if (error.message) {
          throw new Error(error.message);
        }

        throw new Error(
          "Une erreur est survenue lors de la mise à jour du profil"
        );
      }
    },
  });
};

/**
 * Hook pour supprimer un compte client
 */
export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation<void, ProExpertError>({
    mutationFn: async () => {
      try {
        await apiClient.delete(`patient`);
      } catch (error: any) {
        if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }

        throw new Error(
          error.message ||
            "Une erreur est survenue lors de la suppression du compte"
        );
      }
    },
    onSuccess: () => {
      console.log("✅ Compte client supprimé avec succès");

      // Invalide le cache pour forcer le rechargement
      queryClient.invalidateQueries({ queryKey: ["customer"] });
    },
    onError: (error) => {
      console.error("Failed to delete customer:", error);
    },
  });
};
