// Types pour la gestion des schedules

import {
  localTimeToUtcTimetz,
  utcTimetzToLocalTime,
} from "@/utils/dateUtils";

export interface ApiSchedule {
  id: number;
  pro_id: string;
  day_of_week:
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";
  start_time: string; // Format: "09:00:00+00" (toujours en UTC)
  end_time: string; // Format: "17:00:00+00" (toujours en UTC)
  created_at: string;
  updated_at: string;
}

export interface UITimeSlot {
  id: string;
  startTime: string; // Format: "9h00"
  endTime: string; // Format: "9h30"
}

export interface DaySchedule {
  day_of_week: string;
  timeSlots: UITimeSlot[];
}

// Fonction pour convertir un jour Date vers le nom du jour en anglais
export const getDayOfWeekFromDate = (
  date: Date
): ApiSchedule["day_of_week"] => {
  const days: ApiSchedule["day_of_week"][] = [
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

// Fonction pour convertir le format UI local (9h00) vers le format API UTC (07:00:00+00)
// L'ancre détermine l'offset appliqué et doit être la même qu'à la lecture.
export const convertUITimeToApiTime = (
  uiTime: string,
  anchor: Date = new Date()
): string => {
  const apiTime = localTimeToUtcTimetz(uiTime, anchor);

  if (apiTime === "" && uiTime && uiTime.trim() !== "") {
    console.error(`❌ Invalid time format (failed to parse): ${uiTime}`);
  }

  return apiTime;
};

// Fonction pour convertir le format API UTC (07:00:00+00) vers le format UI local (9h00)
export const convertApiTimeToUITime = (
  apiTime: string,
  anchor: Date = new Date()
): string => {
  const uiTime = utcTimetzToLocalTime(apiTime, anchor);

  if (uiTime === "" && apiTime && apiTime.trim() !== "") {
    console.error(`❌ Invalid API time format: ${apiTime}`);
  }

  return uiTime;
};

// Fonction pour convertir les créneaux UI vers les schedules API (format pour création)
// Cette version NE FILTRE PAS les créneaux vides - utilisée pour la gestion locale
export const convertTimeSlotsToApiSchedules = (
  timeSlots: UITimeSlot[],
  dayOfWeek: ApiSchedule["day_of_week"],
  anchor: Date = new Date()
): Omit<ApiSchedule, "id" | "pro_id" | "created_at" | "updated_at">[] => {
  return timeSlots.map((slot) => ({
    day_of_week: dayOfWeek,
    start_time: convertUITimeToApiTime(slot.startTime, anchor),
    end_time: convertUITimeToApiTime(slot.endTime, anchor),
  }));
};

// Fonction pour convertir les schedules API vers les créneaux UI pour un jour donné
export const convertApiSchedulesToTimeSlots = (
  apiSchedules: ApiSchedule[],
  dayOfWeek: ApiSchedule["day_of_week"],
  anchor: Date = new Date()
): UITimeSlot[] => {
  return apiSchedules
    .filter((schedule) => schedule.day_of_week === dayOfWeek)
    .map((schedule, index) => {
      const startTime = convertApiTimeToUITime(schedule.start_time, anchor);
      const endTime = convertApiTimeToUITime(schedule.end_time, anchor);

      return {
        id: `${dayOfWeek}-${schedule.id || `temp-${index}`}`,
        startTime,
        endTime,
      };
    })
    .filter((slot) => {
      // Filtrer les slots invalides (ceux qui ont des valeurs vides après conversion)
      // On garde les slots vides pour l'édition, mais on exclut les slots corrompus
      const isValid = slot.startTime !== "" || slot.endTime !== "";
      if (!isValid) {
        console.warn(`⚠️ Slot invalide filtré:`, slot);
      }
      return isValid || (slot.startTime === "" && slot.endTime === "");
    });
};
