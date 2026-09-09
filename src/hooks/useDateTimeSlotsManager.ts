import {
  useCreateProAppointmentAllowDay,
  useDeleteProAppointmentAllowDay,
  useGetProAppointmentAllowDays,
  useUpdateProAppointmentAllowDay,
} from "@/api/appointments/useProAppointmentAllowDay";
import { useUpdateProExpert } from "@/api/proExpert/useProExpert";
import { useProExpertStore } from "@/store/useProExpert";
import { useTimeSlotsStore } from "@/store/useTimeSlotsStore";
import { convertApiTimeToUITime } from "@/types/schedule";
import {
  formatDateToLocalISO,
  localDateTimeToUtcISO,
} from "@/utils/dateUtils";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isNew?: boolean; // Pour tracker les slots non encore sauvegardés
  isRecurring?: boolean; // Pour tracker les slots récurrents (hebdomadaires)
}

interface UseDateTimeSlotsManagerProps {
  selectedDate: Date | null;
}

export const useDateTimeSlotsManager = ({
  selectedDate,
}: UseDateTimeSlotsManagerProps) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  // Hooks API pour créneaux spécifiques
  const { data: allowDays, isLoading } = useGetProAppointmentAllowDays();
  const queryClient = useQueryClient();
  const createMutation = useCreateProAppointmentAllowDay();
  const createSilentMutation = useCreateProAppointmentAllowDay({
    showSuccessToast: false,
    skipInvalidate: true,
  });
  const updateMutation = useUpdateProAppointmentAllowDay();
  const deleteMutation = useDeleteProAppointmentAllowDay();

  // Store pour créneaux hebdomadaires récurrents (fallback)
  const { proExpertData, setProExpertData } = useProExpertStore();
  const { getTimeSlotsForDate } = useTimeSlotsStore();
  const updateProExpertMutation = useUpdateProExpert();

  // Générer les options d'heures (de 00h00 à 23h30 par tranches de 30 minutes)
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour <= 23; hour++) {
      times.push(`${hour}h00`);
      if (hour < 23) {
        times.push(`${hour}h30`);
      }
    }
    times.push("23h30");
    return times;
  };

  const timeOptions = generateTimeOptions();

  // Convertir une heure en nombre pour comparaison (ex: "9h30" -> 9.5)
  const timeToNumber = (time: string): number => {
    const [hour, minutes] = time.replace("h", ":").split(":");
    return parseInt(hour) + parseInt(minutes || "0") / 60;
  };

  // Générer les options de endTime filtrées selon startTime
  const getEndTimeOptions = (startTime: string): string[] => {
    if (!startTime) return timeOptions;

    const startTimeNum = timeToNumber(startTime);
    return timeOptions.filter((time) => {
      const timeNum = timeToNumber(time);
      return timeNum > startTimeNum;
    });
  };

  // Vérifier si une heure est déjà prise
  const isTimeSlotTaken = (time: string, currentSlotId?: string): boolean => {
    return timeSlots.some(
      (slot) =>
        slot.id !== currentSlotId &&
        (slot.startTime === time ||
          (slot.startTime &&
            slot.endTime &&
            timeToNumber(time) > timeToNumber(slot.startTime) &&
            timeToNumber(time) < timeToNumber(slot.endTime)))
    );
  };

  // Convertir un instant UTC renvoyé par la base en heure murale locale ("9h30")
  const formatTimeFromAPI = (isoTimestamp: string): string => {
    const instant = new Date(isoTimestamp);
    if (isNaN(instant.getTime())) {
      return "";
    }
    return `${instant.getHours()}h${String(instant.getMinutes()).padStart(
      2,
      "0"
    )}`;
  };

  // Charger les créneaux pour la date sélectionnée
  useEffect(() => {
    if (!selectedDate) {
      setTimeSlots([]);
      return;
    }

    const dateStr = formatDateToLocalISO(selectedDate);

    // 1. Chercher les créneaux spécifiques pour cette date
    // La base renvoie des instants UTC: on les interprète en heure locale
    // avant de comparer le jour et d'afficher l'heure.
    const specificSlots = allowDays
      ? allowDays
          .filter((allowDay) => {
            const startDate = new Date(allowDay.start_date);
            if (isNaN(startDate.getTime())) return false;
            return formatDateToLocalISO(startDate) === dateStr;
          })
          .map((allowDay) => ({
            id: String(allowDay.id), // Convertir en string pour cohérence
            startTime: formatTimeFromAPI(allowDay.start_date),
            endTime: formatTimeFromAPI(allowDay.end_date),
            isNew: false,
          }))
      : [];

    // 2. Si aucun créneau spécifique, utiliser les créneaux hebdomadaires récurrents
    if (specificSlots.length === 0 && proExpertData?.schedules) {
      const recurringSlots = getTimeSlotsForDate(
        proExpertData.schedules,
        selectedDate
      );

      // Marquer ces créneaux comme récurrents (pas de sauvegarde spécifique)
      const formattedRecurringSlots = recurringSlots.map((slot: any) => ({
        id: `recurring-${slot.id}`,
        startTime: slot.startTime,
        endTime: slot.endTime,
        isNew: false,
        isRecurring: true, // Indicateur pour savoir que c'est un créneau récurrent
      }));

      setTimeSlots(formattedRecurringSlots);
    } else {
      setTimeSlots(specificSlots);
    }
  }, [selectedDate, allowDays, proExpertData?.schedules, getTimeSlotsForDate]);

  // Trouver le prochain créneau disponible
  const findNextAvailableSlot = (): { startTime: string; endTime: string } => {
    const defaultStart = "8h30";
    const defaultEnd = "9h00";

    // Si aucun créneau, retourner le créneau par défaut
    if (timeSlots.length === 0) {
      return { startTime: defaultStart, endTime: defaultEnd };
    }

    // Trouver le dernier créneau
    const lastSlot = timeSlots[timeSlots.length - 1];
    if (!lastSlot.endTime) {
      return { startTime: defaultStart, endTime: defaultEnd };
    }

    // Calculer le prochain créneau après le dernier
    const lastEndTimeNum = timeToNumber(lastSlot.endTime);
    const nextStartTimeNum = lastEndTimeNum + 0.5; // +30 minutes

    // Si on dépasse 23h30, revenir au début
    if (nextStartTimeNum >= 24) {
      return { startTime: defaultStart, endTime: defaultEnd };
    }

    const nextEndTimeNum = nextStartTimeNum + 0.5; // +30 minutes

    // Convertir en format "Xh30"
    const formatTime = (num: number): string => {
      const hours = Math.floor(num);
      const minutes = (num % 1) * 60;
      return `${hours}h${
        minutes === 0 ? "00" : minutes.toString().padStart(2, "0")
      }`;
    };

    return {
      startTime: formatTime(nextStartTimeNum),
      endTime: formatTime(nextEndTimeNum),
    };
  };

  // Sauvegarder tous les créneaux affichés pour la date sélectionnée
  const persistCurrentDaySlots = async () => {
    if (!selectedDate) return;

    const slotsToPersist = timeSlots.filter((slot) => slot.isRecurring);
    if (slotsToPersist.length === 0) return;

    for (const slot of slotsToPersist) {
      const startDateTime = localDateTimeToUtcISO(selectedDate, slot.startTime);
      const endDateTime = localDateTimeToUtcISO(selectedDate, slot.endTime);
      if (!startDateTime || !endDateTime) continue;

      await createSilentMutation.mutateAsync({
        start_date: startDateTime,
        end_date: endDateTime,
      });
    }

    // Marquer localement les slots comme spécifiques pour éviter les doublons
    setTimeSlots((prev) =>
      prev.map((slot) =>
        slot.isRecurring ? { ...slot, isRecurring: false, isNew: false } : slot
      )
    );

    await queryClient.invalidateQueries({
      queryKey: ["pro-appointment-allow-days"],
    });
  };

  // Ajouter un nouveau créneau avec heures par défaut et sauvegarde automatique
  const handleAddTimeSlot = async () => {
    if (!selectedDate) return;

    try {
      // S'assurer que tous les créneaux du jour sont déjà enregistrés
      await persistCurrentDaySlots();
    } catch (error) {
      console.error(
        "❌ Impossible de sauvegarder les créneaux existants avant l'ajout:",
        error
      );
      return;
    }

    // Trouver le prochain créneau disponible
    const { startTime, endTime } = findNextAvailableSlot();

    // Créer le créneau temporaire localement
    const tempId = `temp-${Date.now()}`;
    const newSlot: TimeSlot = {
      id: tempId,
      startTime,
      endTime,
      isNew: true,
    };

    // Ajouter localement immédiatement
    setTimeSlots((prev) => [...prev, newSlot]);

    // Préparer les instants UTC à envoyer à la base
    const startDateTime = localDateTimeToUtcISO(selectedDate, startTime);
    const endDateTime = localDateTimeToUtcISO(selectedDate, endTime);
    if (!startDateTime || !endDateTime) {
      setTimeSlots((prev) => prev.filter((s) => s.id !== tempId));
      return;
    }

    // Sauvegarder automatiquement
    try {
      console.log("🆕 Création automatique du créneau:", {
        start_date: startDateTime,
        end_date: endDateTime,
      });

      await createMutation.mutateAsync({
        start_date: startDateTime,
        end_date: endDateTime,
      });

      // Marquer comme non nouveau après création
      setTimeSlots((prev) =>
        prev.map((slot) =>
          slot.id === tempId ? { ...slot, isNew: false } : slot
        )
      );
    } catch (error) {
      console.error("❌ Erreur lors de la création automatique:", error);
      // En cas d'erreur, supprimer le créneau temporaire
      setTimeSlots((prev) => prev.filter((s) => s.id !== tempId));
    }
  };

  // Mettre à jour un créneau
  const handleUpdateTimeSlot = async (
    slotId: string,
    field: "startTime" | "endTime",
    value: string
  ) => {
    if (!selectedDate) return;

    // Mettre à jour localement
    setTimeSlots((prev) =>
      prev.map((slot) =>
        slot.id === slotId ? { ...slot, [field]: value } : slot
      )
    );

    // Récupérer le slot mis à jour
    const updatedSlot = timeSlots.find((s) => s.id === slotId);
    if (!updatedSlot) return;

    // Créer un objet temporaire avec la nouvelle valeur
    const slotWithNewValue = { ...updatedSlot, [field]: value };

    // Vérifier si les deux champs sont remplis
    const isComplete = slotWithNewValue.startTime && slotWithNewValue.endTime;

    if (!isComplete) return;

    // Valider que startTime < endTime
    const isValid =
      timeToNumber(slotWithNewValue.startTime) <
      timeToNumber(slotWithNewValue.endTime);

    if (!isValid) {
      console.error("L'heure de fin doit être après l'heure de début");
      return;
    }

    // Préparer les instants UTC à envoyer à la base
    const startDateTime = localDateTimeToUtcISO(
      selectedDate,
      slotWithNewValue.startTime
    );
    const endDateTime = localDateTimeToUtcISO(
      selectedDate,
      slotWithNewValue.endTime
    );
    if (!startDateTime || !endDateTime) return;

    try {
      // Si c'est un créneau récurrent, on crée un nouveau créneau spécifique pour cette date
      if (slotWithNewValue.isRecurring) {
        // Créer un nouveau créneau spécifique
        console.log("🆕 Création du créneau spécifique (depuis récurrent):", {
          start_date: startDateTime,
          end_date: endDateTime,
        });

        await createMutation.mutateAsync({
          start_date: startDateTime,
          end_date: endDateTime,
        });

        // Marquer comme non récurrent après création
        setTimeSlots((prev) =>
          prev.map((slot) =>
            slot.id === slotId ? { ...slot, isRecurring: false } : slot
          )
        );
      } else if (!slotWithNewValue.isNew) {
        // Mettre à jour un créneau spécifique existant (seulement si ce n'est pas nouveau)
        console.log("✏️ Mise à jour du créneau:", {
          id: slotId,
          start_date: startDateTime,
          end_date: endDateTime,
        });

        await updateMutation.mutateAsync({
          id: slotId,
          start_date: startDateTime,
          end_date: endDateTime,
        });
      }
      // Si isNew, ne rien faire car déjà sauvegardé lors de la création
    } catch (error) {
      console.error("❌ Erreur lors de la sauvegarde:", error);
    }
  };

  // Fonction helper pour obtenir le jour de la semaine
  const getDayOfWeek = (date: Date): string => {
    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    return days[date.getDay()];
  };

  // Supprimer un créneau
  const handleRemoveTimeSlot = async (slotId: string) => {
    const slot = timeSlots.find((s) => s.id === slotId);
    if (!slot) return;

    // Si c'est un nouveau slot non sauvegardé, supprimer localement uniquement
    if (slot.isNew) {
      setTimeSlots((prev) => prev.filter((s) => s.id !== slotId));
      return;
    }

    // Si c'est un créneau récurrent, supprimer du système récurrent
    if (slot.isRecurring && selectedDate && proExpertData?.schedules) {
      console.log("🗑️ Suppression du créneau récurrent:", slotId);

      const dayOfWeek = getDayOfWeek(selectedDate);

      // Trouver le schedule correspondant dans les créneaux récurrents
      const scheduleToRemove = proExpertData.schedules.find((schedule: any) => {
        if (schedule.day_of_week !== dayOfWeek) return false;

        // Comparer via le même convertisseur que l'affichage: la base est en
        // UTC alors que slot.startTime est déjà en heure locale.
        const scheduleStart = convertApiTimeToUITime(schedule.start_time);
        const scheduleEnd = convertApiTimeToUITime(schedule.end_time);

        return scheduleStart === slot.startTime && scheduleEnd === slot.endTime;
      });

      if (scheduleToRemove) {
        // Filtrer le schedule à supprimer
        const updatedSchedules = proExpertData.schedules.filter(
          (s: any) => s.id !== scheduleToRemove.id
        );

        // Nettoyer les schedules pour l'API (supprimer les métadonnées)
        const cleanedSchedules = updatedSchedules.map((schedule: any) => {
          const { id, pro_id, created_at, updated_at, ...cleanSchedule } =
            schedule;
          return cleanSchedule;
        });

        try {
          // Sauvegarder sur le serveur
          await updateProExpertMutation.mutateAsync({
            schedules: cleanedSchedules,
          });

          // Mettre à jour le store après succès
          setProExpertData({
            ...proExpertData,
            schedules: updatedSchedules,
          });

          console.log("✅ Créneau récurrent supprimé et sauvegardé");
        } catch (error) {
          console.error(
            "❌ Erreur lors de la sauvegarde de la suppression:",
            error
          );
          return; // Ne pas supprimer localement en cas d'erreur
        }
      }

      // Supprimer localement
      setTimeSlots((prev) => prev.filter((s) => s.id !== slotId));
      return;
    }

    // Sinon, appeler l'API pour supprimer un créneau spécifique
    try {
      console.log("🗑️ Suppression du créneau spécifique:", slotId);
      await deleteMutation.mutateAsync(slotId);

      // Supprimer localement après succès
      setTimeSlots((prev) => prev.filter((s) => s.id !== slotId));
    } catch (error) {
      console.error("❌ Erreur lors de la suppression:", error);
    }
  };

  const isLoadingAny =
    isLoading ||
    createMutation.isPending ||
    createSilentMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const error =
    createMutation.error?.message ||
    createSilentMutation.error?.message ||
    updateMutation.error?.message ||
    deleteMutation.error?.message;

  return {
    // États
    timeSlots,
    timeOptions,
    isLoadingAny,
    error,

    // Fonctions utilitaires
    isTimeSlotTaken,
    getEndTimeOptions,
    timeToNumber,

    // Actions
    handleAddTimeSlot,
    handleUpdateTimeSlot,
    handleRemoveTimeSlot,
  };
};
