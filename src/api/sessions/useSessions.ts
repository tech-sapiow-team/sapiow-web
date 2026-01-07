"use client";
import { apiClient } from "@/lib/api-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Types pour les énumérations
export type SessionType = "15m" | "30m" | "45m" | "60m";
export type SessionNature = "one_time" | "subscription";

// Interface pour les données de création de session
export interface SessionCreate {
  price: number; // float
  session_type?: SessionType; // Optionnel pour les accompagnements mensuels
  session_nature: SessionNature;
  one_on_one?: boolean; // default: false
  video_call?: boolean; // default: false
  strategic_session?: boolean; // default: false
  exclusive_ressources?: boolean; // default: false
  support?: boolean; // default: false
  mentorship?: boolean; // default: false
  webinar?: boolean; // default: false
  name?: string; // Session name
  is_active?: boolean; // default: true
}

// Interface pour la réponse de l'API
export interface SessionCreateResponse {
  success: boolean;
  message: string;
  session_id?: string;
  data?: {
    id: string;
    price: number;
    session_type: SessionType;
    session_nature: SessionNature;
    name?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: any;
  };
}

// Interface pour les erreurs
export interface SessionCreateError {
  message: string;
  status?: number;
  field?: string;
}

export interface SessionGetResponse {
  id: string;
  pro_id: string;
  price: number;
  name: string;
  session_type: SessionType;
  session_nature: SessionNature;
  one_on_one: boolean;
  video_call: boolean;
  strategic_session: boolean;
  exclusive_ressources: boolean;
  support: boolean;
  mentorship: boolean;
  webinar: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  extra_data?: string | null; // JSON string au format {"questions":[],"expectations":[]}
}

// Interface pour les données de mise à jour de session
export interface SessionUpdate {
  price?: number;
  session_type?: SessionType;
  session_nature?: SessionNature;
  one_on_one?: boolean;
  video_call?: boolean;
  strategic_session?: boolean;
  exclusive_ressources?: boolean;
  support?: boolean;
  mentorship?: boolean;
  webinar?: boolean;
  name?: string;
  is_active?: boolean;
  extra_data?: string; // JSON string au format {"questions":[],"expectations":[]}
}

// Interface pour la réponse de mise à jour
export interface SessionUpdateResponse {
  success: boolean;
  message: string;
  data: SessionGetResponse;
}

// Interface pour les erreurs de mise à jour
export interface SessionUpdateError {
  message: string;
  status?: number;
  field?: string;
}

/**
 * Hook pour créer une nouvelle session pro via POST /pro-session
 */
export const useCreateProSession = () => {
  const queryClient = useQueryClient();
  return useMutation<SessionCreateResponse, SessionCreateError, SessionCreate>({
    mutationFn: async (sessionData: SessionCreate) => {
      // Validation des données requises
      if (!sessionData.price || sessionData.price <= 0) {
        throw new Error(
          "Le prix de la session est requis et doit être positif"
        );
      }

      // session_type requis seulement pour les sessions ponctuelles
      if (
        sessionData.session_nature === "one_time" &&
        !sessionData.session_type
      ) {
        throw new Error(
          "Le type de session est requis pour les sessions ponctuelles"
        );
      }

      if (!sessionData.session_nature) {
        throw new Error("La nature de la session est requise");
      }

      try {
        // Préparation des données avec valeurs par défaut
        const sessionPayload: SessionCreate = {
          price: sessionData.price,
          session_type: sessionData.session_type,
          session_nature: sessionData.session_nature,
          one_on_one: sessionData.one_on_one ?? false,
          video_call: sessionData.video_call ?? false,
          strategic_session: sessionData.strategic_session ?? false,
          exclusive_ressources: sessionData.exclusive_ressources ?? false,
          support: sessionData.support ?? false,
          mentorship: sessionData.mentorship ?? false,
          webinar: sessionData.webinar ?? false,
          name: sessionData.name,
          is_active: sessionData.is_active ?? true,
        };

        // Appel API via apiClient
        const response = await apiClient.post<any>(
          "pro-session",
          sessionPayload
        );

        // L'API retourne directement l'objet session
        // On wrape dans la structure attendue
        return {
          success: true,
          message: "Session créée avec succès",
          data: response,
        };
      } catch (error: any) {
        console.error("Error creating pro session:", error);

        if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }

        throw new Error(
          error.message ||
            "Une erreur est survenue lors de la création de la session"
        );
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["pro-session"],
      });
    },
    onError: (error) => {
      console.error("Erreur création session:", error);
    },
  });
};

/**
 * Fonction utilitaire pour valider les données de session
 */
export const validateSessionData = (data: SessionCreate): string[] => {
  const errors: string[] = [];

  if (!data.price || data.price <= 0) {
    errors.push("Le prix doit être un nombre positif");
  }

  // session_type requis seulement pour les sessions ponctuelles
  if (data.session_nature === "one_time") {
    if (
      !data.session_type ||
      !["15m", "30m", "45m", "60m"].includes(data.session_type)
    ) {
      errors.push("Type de session invalide (15m, 30m, 45m, 60m)");
    }
  }

  if (
    !data.session_nature ||
    !["one_time", "subscription"].includes(data.session_nature)
  ) {
    errors.push("Nature de session invalide (one_time, subscription)");
  }

  if (data.name && data.name.trim().length === 0) {
    errors.push("Le nom de session ne peut pas être vide");
  }

  return errors;
};

/**
 * Fonction utilitaire pour créer des données de session avec valeurs par défaut
 */
export const createDefaultSessionData = (
  overrides: Partial<SessionCreate> = {}
): SessionCreate => {
  return {
    price: 0,
    session_type: "30m",
    session_nature: "one_time",
    one_on_one: false,
    video_call: false,
    strategic_session: false,
    exclusive_ressources: false,
    support: false,
    mentorship: false,
    webinar: false,
    is_active: true,
    ...overrides,
  };
};

/**
 * Hook pour mettre à jour une session pro existante via PUT /pro-session/{id}
 */
export const useUpdateProSession = () => {
  const queryClient = useQueryClient();
  return useMutation<
    SessionUpdateResponse,
    SessionUpdateError,
    { id: string; data: SessionUpdate }
  >({
    mutationFn: async ({ id, data }: { id: string; data: SessionUpdate }) => {
      try {
        // Appel API via apiClient
        const response = await apiClient.put<any>(`pro-session/${id}`, data);

        // L'API retourne directement l'objet session
        // On wrape dans la structure attendue
        return {
          success: true,
          message: "Session mise à jour avec succès",
          data: response,
        };
      } catch (error: any) {
        console.error("Error updating pro session:", error);

        if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }

        throw new Error(
          error.message ||
            "Une erreur est survenue lors de la mise à jour de la session"
        );
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["pro-session"],
      });
      console.log("Session mise à jour avec succès:", data);
    },
    onError: (error) => {
      console.error("Erreur mise à jour session:", error);
    },
  });
};

export const useGetProSession = () => {
  return useQuery<SessionGetResponse | SessionGetResponse[]>({
    queryKey: ["pro-session"],
    queryFn: () =>
      apiClient.get<SessionGetResponse | SessionGetResponse[]>("pro-session"),
  });
};

/**
 * Fonction utilitaire pour valider les données de mise à jour
 */
export const validateSessionUpdateData = (data: SessionUpdate): string[] => {
  const errors: string[] = [];

  if (data.price !== undefined && data.price <= 0) {
    errors.push("Le prix doit être un nombre positif");
  }

  if (
    data.session_type &&
    !["15m", "30m", "45m", "60m"].includes(data.session_type)
  ) {
    errors.push("Type de session invalide (15m, 30m, 45m, 60m)");
  }

  if (
    data.session_nature &&
    !["one_time", "subscription"].includes(data.session_nature)
  ) {
    errors.push("Nature de session invalide (one_time, subscription)");
  }

  if (data.name && data.name.trim().length === 0) {
    errors.push("Le nom de session ne peut pas être vide");
  }

  return errors;
};
