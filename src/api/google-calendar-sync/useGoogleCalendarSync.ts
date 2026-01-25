import { apiClient } from "@/lib/api-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Types basés sur les réponses backend réelles
export interface GoogleCalendarConnectResponse {
  message: string;
  connectedAt: string;
}

export interface GoogleCalendarConnectRequest {
  authorizationCode: string;
  codeVerifier?: string;
}

export interface GoogleCalendarDisconnectResponse {
  message: string;
}

export interface GoogleCalendarStatusResponse {
  success: boolean;
  connected: boolean;
  email?: string;
  connectedAt?: string;
  totalAppointments?: number;
  syncedAppointments?: number;
  unsyncedAppointments?: number;
  syncPercentage?: number;
  note?: string;
  message?: string;
  instructions?: {
    note: string;
    endpoints: {
      connect: string;
      disconnect: string;
    };
  };
}

// Hook pour connecter Google Calendar avec authorization code et PKCE
export function useGoogleCalendarConnect() {
  const queryClient = useQueryClient();

  return useMutation<
    GoogleCalendarConnectResponse,
    Error,
    GoogleCalendarConnectRequest
  >({
    mutationFn: async ({ authorizationCode, codeVerifier }) => {
      const response = await apiClient.post<GoogleCalendarConnectResponse>(
        "google-calendar-sync",
        {
          authorizationCode,
          codeVerifier,
        }
      );
      return response;
    },
    onSuccess: () => {
      // Invalider le cache du statut de connexion
      queryClient.invalidateQueries({ queryKey: ["google-calendar-sync"] });
    },
    onError: (error) => {
      console.error("Erreur de connexion Google Calendar:", error);
    },
  });
}

// Hook pour vérifier le statut de connexion et les statistiques
export function useGoogleCalendarStatus() {
  return useQuery<GoogleCalendarStatusResponse>({
    queryKey: ["google-calendar-sync"],
    queryFn: () =>
      apiClient.get<GoogleCalendarStatusResponse>("google-calendar-sync"),
  });
}

// Hook pour déconnecter Google Calendar
export function useGoogleCalendarDisconnect() {
  const queryClient = useQueryClient();

  return useMutation<GoogleCalendarDisconnectResponse, Error>({
    mutationFn: async () => {
      const response = await apiClient.delete<GoogleCalendarDisconnectResponse>(
        "google-calendar-sync"
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["google-calendar-sync"] });
    },
    onError: (error) => {
      console.error("Erreur de déconnexion Google Calendar:", error);
    },
  });
}

// Hook pour obtenir l'URL d'autorisation Google OAuth
export function useGoogleCalendarAuthUrl() {
  const getAuthUrl = () => {
    const clientId =
      "443622405675-sdjuhup5hrr2q0lm69i7285obsc0s1ri.apps.googleusercontent.com";
    // URL de redirection - seulement l'origine (ex: http://localhost:5173)
    const redirectUri = window.location.origin;
    const scope = "https://www.googleapis.com/auth/calendar";
    const responseType = "code";
    const accessType = "offline";
    const prompt = "consent";

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope,
      response_type: responseType,
      access_type: accessType,
      prompt,
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  };

  return { getAuthUrl };
}
