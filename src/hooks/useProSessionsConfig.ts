"use client";

import {
  SessionType,
  useCreateProSession,
  useGetProSession,
  useUpdateProSession,
} from "@/api/sessions/useSessions";
import { useEffect, useState } from "react";

export interface SessionDuration {
  id: string;
  duration: string;
  price: number;
  enabled: boolean;
  session_type: SessionType;
  api_id?: string; // ID de la session dans l'API (si elle existe)
}

// Sessions par défaut
const DEFAULT_SESSIONS: SessionDuration[] = [
  {
    id: "15min",
    duration: "15 minutes",
    price: 0,
    enabled: false,
    session_type: "15m",
    api_id: undefined,
  },
  {
    id: "30min",
    duration: "30 minutes",
    price: 0,
    enabled: false,
    session_type: "30m",
    api_id: undefined,
  },
  {
    id: "45min",
    duration: "45 minutes",
    price: 0,
    enabled: false,
    session_type: "45m",
    api_id: undefined,
  },
  {
    id: "60min",
    duration: "60 minutes",
    price: 0,
    enabled: false,
    session_type: "60m",
    api_id: undefined,
  },
];

export const useProSessionsConfig = () => {
  const [sessions, setSessions] = useState<SessionDuration[]>(DEFAULT_SESSIONS);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // Hooks API
  const { data: sessionData, isLoading, error } = useGetProSession();
  const createSessionMutation = useCreateProSession();
  const updateSessionMutation = useUpdateProSession();

  // Charger les données de l'API au démarrage
  useEffect(() => {
    if (sessionData) {
      // Si on a des données de session de l'API, on met à jour nos sessions locales
      setSessions((prev) =>
        prev.map((session) => {
          // Vérifier si cette session existe dans les données API
          const apiSession = Array.isArray(sessionData)
            ? sessionData.find((s) => s.session_type === session.session_type)
            : sessionData.session_type === session.session_type
            ? sessionData
            : null;

          if (apiSession) {
            return {
              ...session,
              price: apiSession.price,
              enabled: apiSession.is_active,
              api_id: apiSession.id, // Stocker l'ID API pour les mises à jour
            };
          }
          return session;
        })
      );
    }
  }, [sessionData]);

  const handlePriceChange = (id: string, newPrice: number) => {
    // Mise à jour locale seulement
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, price: newPrice } : s))
    );
  };

  const handleToggle = (id: string, enabled: boolean) => {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === id
          ? {
              ...session,
              enabled,
              // Remettre le prix à 0 quand on désactive
              price: enabled ? session.price : 0,
            }
          : session
      )
    );
  };

  const handlePriceBlur = async (id: string) => {
    const session = sessions.find((s) => s.id === id);
    // Accepter 0 comme prix valide pour les consultations gratuites
    if (!session || !session.enabled || session.price < 0) return;

    // Sauvegarder via API seulement si la session est activée et a un prix valide (>= 0)
    try {
      setIsUpdating(id);

      if (session.api_id) {
        // Session existe déjà - utiliser UPDATE
        await updateSessionMutation.mutateAsync({
          id: session.api_id,
          data: {
            price: session.price,
            session_type: session.session_type,
            session_nature: "one_time",
            name: `Session ${session.duration}`,
            one_on_one: true,
            video_call: true,
            strategic_session: false,
            exclusive_ressources: false,
            support: false,
            mentorship: false,
            webinar: false,
            is_active: session.enabled,
          },
        });
      } else {
        // Nouvelle session - utiliser CREATE
        const response = await createSessionMutation.mutateAsync({
          price: session.price,
          session_type: session.session_type,
          session_nature: "one_time",
          name: `Session ${session.duration}`,
          one_on_one: true,
          video_call: true,
          strategic_session: false,
          exclusive_ressources: false,
          support: false,
          mentorship: false,
          webinar: false,
          is_active: session.enabled,
        });

        // Mettre à jour l'api_id après création
        if (response.data?.id) {
          setSessions((prev) =>
            prev.map((s) =>
              s.id === id ? { ...s, api_id: response.data!.id } : s
            )
          );
        }
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la session:", error);
      // En cas d'erreur, on peut désactiver la session
      setSessions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, enabled: false } : s))
      );
    } finally {
      setIsUpdating(null);
    }
  };

  const handleToggleUpdate = async (id: string, enabled: boolean) => {
    const session = sessions.find((s) => s.id === id);
    if (!session || !session.api_id) return;

    // Mettre à jour le statut d'activation pour une session existante
    try {
      setIsUpdating(id);
      await updateSessionMutation.mutateAsync({
        id: session.api_id,
        data: {
          price: session.price,
          session_type: session.session_type,
          session_nature: "one_time",
          name: `Session ${session.duration}`,
          one_on_one: true,
          video_call: true,
          strategic_session: false,
          exclusive_ressources: false,
          support: false,
          mentorship: false,
          webinar: false,
          is_active: enabled,
        },
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la session:", error);
      // Rollback
      setSessions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, enabled: !enabled } : s))
      );
    } finally {
      setIsUpdating(null);
    }
  };

  const isSessionUpdating = (sessionId: string) => isUpdating === sessionId;

  // Loading initial seulement si on n'a pas encore de données
  const isInitialLoading =
    isLoading && sessions.every((s) => s.price === 0 && !s.enabled);

  return {
    sessions,
    isInitialLoading,
    error,
    isSessionUpdating,
    handlePriceChange,
    handleToggle,
    handlePriceBlur,
    handleToggleUpdate,
    sessionData, // Exposer sessionData pour accéder à extra_data
  };
};
