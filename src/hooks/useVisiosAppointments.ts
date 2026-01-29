import {
    useGetProAppointments,
    useUpdateProAppointment,
} from "@/api/appointments/useAppointments";
import { useGetProExpert } from "@/api/proExpert/useProExpert";
import { useCallStore } from "@/store/useCall";
import { useState } from "react";

export const useVisiosAppointments = () => {
  const { data: proExpert } = useGetProExpert();
  
  // Filtrer les rendez-vous futurs (>= aujourd'hui à minuit)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = today.toISOString();
  
  // Requête pour les rendez-vous futurs (confirmés et en attente)
  const { data: futureAppointments, isLoading: isLoadingFuture } = useGetProAppointments(proExpert?.id, {
    gteField: "appointment_at",
    gte: todayISO,
    orderBy: "appointment_at",
    orderDirection: "asc",
  });
  
  // Requête pour l'historique (tous les rendez-vous sans filtre de date)
  const { data: allAppointments, isLoading: isLoadingAll } = useGetProAppointments(proExpert?.id, {
    orderBy: "appointment_at",
    orderDirection: "desc",
  });
  
  const { mutateAsync: updateProAppointment } = useUpdateProAppointment();
  const { setAppointmentId } = useCallStore();

  const [loadingStates, setLoadingStates] = useState<
    Record<string, "confirming" | "cancelling" | null>
  >({});

  const handleConfirmAppointment = async (appointmentId: string) => {
    try {
      setLoadingStates((prev) => ({ ...prev, [appointmentId]: "confirming" }));
      await updateProAppointment({
        appointmentId,
        updateData: {
          status: "confirmed",
        },
      });
    } catch (error) {
      console.error("Erreur lors de la confirmation:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [appointmentId]: null }));
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      setLoadingStates((prev) => ({ ...prev, [appointmentId]: "cancelling" }));
      await updateProAppointment({
        appointmentId,
        updateData: {
          status: "cancelled",
        },
      });
    } catch (error) {
      console.error("Erreur lors de l'annulation:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [appointmentId]: null }));
    }
  };

  const handleStartVideoCall = (appointmentId: string) => {
    setAppointmentId(appointmentId);
  };

  // Organiser les appointments futurs par statut avec filtre de fin de session
  const confirmedAppointments = Array.isArray(futureAppointments)
    ? futureAppointments
        .filter((apt: any) => apt.type !== "calendar") // Exclure les rendez-vous de type calendar
        .filter((apt: any) => apt.status === "confirmed")
        .filter((apt: any) => {
          // Calculer l'heure de fin du rendez-vous (date + durée)
          const appointmentDate = new Date(apt.appointment_at);
          const sessionDuration = apt.session?.session_type || "30mn";
          
          // Extraire les minutes de la durée
          let durationMinutes = 30;
          if (sessionDuration.includes("mn")) {
            durationMinutes = parseInt(sessionDuration);
          } else if (sessionDuration.includes("h")) {
            durationMinutes = parseInt(sessionDuration) * 60;
          }
          
          // Calculer l'heure de fin
          const endTime = new Date(appointmentDate.getTime() + durationMinutes * 60000);
          const now = new Date();
          
          // Garder seulement si l'heure de fin n'est pas encore passée
          return endTime > now;
        })
    : [];

  const pendingAppointments = Array.isArray(futureAppointments)
    ? futureAppointments
        .filter((apt: any) => apt.type !== "calendar") // Exclure les rendez-vous de type calendar
        .filter((apt: any) => apt.status === "pending")
    : [];

  // Historique : tous les rendez-vous passés (cancelled, completed) OU dont l'heure de fin est dépassée
  const historicAppointments = Array.isArray(allAppointments)
    ? allAppointments
        .filter((apt: any) => apt.type !== "calendar") // Exclure les rendez-vous de type calendar
        .filter((apt: any) => {
          // Inclure les rendez-vous annulés ou complétés
          if (apt.status === "cancelled" || apt.status === "completed") {
            return true;
          }
          
          // Inclure les rendez-vous confirmés dont l'heure de fin est passée
          if (apt.status === "confirmed") {
            const appointmentDate = new Date(apt.appointment_at);
            const sessionDuration = apt.session?.session_type || "30mn";
            
            let durationMinutes = 30;
            if (sessionDuration.includes("mn")) {
              durationMinutes = parseInt(sessionDuration);
            } else if (sessionDuration.includes("h")) {
              durationMinutes = parseInt(sessionDuration) * 60;
            }
            
            const endTime = new Date(appointmentDate.getTime() + durationMinutes * 60000);
            const now = new Date();
            
            // Inclure si l'heure de fin est passée
            return endTime <= now;
          }
          
          return false;
        })
    : [];

  return {
    // Data
    proExpert,
    futureAppointments,
    allAppointments,
    confirmedAppointments,
    pendingAppointments,
    historicAppointments,

    // Loading states
    loadingStates,
    isLoading: isLoadingFuture || isLoadingAll,

    // Actions
    handleConfirmAppointment,
    handleCancelAppointment,
    handleStartVideoCall,
  };
};
