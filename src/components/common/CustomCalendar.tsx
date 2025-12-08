"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useCalendarStore } from "@/store/useCalendar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

interface CustomCalendarProps {
  className?: string;
  confirmedAppointments?: any[];
  schedules?: any[];
  blockedDates?: any[]; // Dates bloquées par l'expert
  availabilityStartDate?: string | null; // Date de début de disponibilité (YYYY-MM-DD)
  availabilityEndDate?: string | null; // Date de fin de disponibilité (YYYY-MM-DD)
}

export default function CustomCalendar({
  className,
  confirmedAppointments = [],
  schedules = [],
  blockedDates = [],
  availabilityStartDate,
  availabilityEndDate,
}: CustomCalendarProps) {
  const t = useTranslations();

  // Get translated arrays
  const months = [
    t("calendar.january"),
    t("calendar.february"),
    t("calendar.march"),
    t("calendar.april"),
    t("calendar.may"),
    t("calendar.june"),
    t("calendar.july"),
    t("calendar.august"),
    t("calendar.september"),
    t("calendar.october"),
    t("calendar.november"),
    t("calendar.december"),
  ];
  const daysOfWeek = [
    t("calendar.sunday"),
    t("calendar.monday"),
    t("calendar.tuesday"),
    t("calendar.wednesday"),
    t("calendar.thursday"),
    t("calendar.friday"),
    t("calendar.saturday"),
  ];
  const {
    currentDate,
    selectedDate,
    setSelectedDate,
    isDateSelected,
    navigateMonth,
  } = useCalendarStore();

  // Créer les événements à partir des rendez-vous confirmés et dates bloquées
  const getMergedEvents = () => {
    const mergedEvents: any = {};

    // Extraire les jours de la semaine disponibles depuis schedules
    const availableDaysOfWeek = schedules.map((schedule: any) =>
      schedule.day_of_week.toLowerCase()
    );

    // Mapper les jours de la semaine (0 = dimanche, 1 = lundi, etc.)
    const dayOfWeekMap: { [key: number]: string } = {
      0: "sunday",
      1: "monday",
      2: "tuesday",
      3: "wednesday",
      4: "thursday",
      5: "friday",
      6: "saturday",
    };

    // Bloquer tous les jours du mois qui ne sont pas dans les schedules
    const daysInMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      const dayOfWeek = dayOfWeekMap[date.getDay()];

      // Si ce jour de la semaine n'est pas dans les schedules, le bloquer avec barre oblique
      if (!availableDaysOfWeek.includes(dayOfWeek)) {
        mergedEvents[day] = {
          type: "unavailable",
          users: [],
        };
      }
    }

    // Ajouter les dates bloquées manuellement par l'expert (fond rouge)
    blockedDates.forEach((block: any) => {
      const blockDate = new Date(block.date);
      const day = blockDate.getDate();
      const isCurrentMonth =
        blockDate.getMonth() === currentDate.getMonth() &&
        blockDate.getFullYear() === currentDate.getFullYear();

      if (isCurrentMonth) {
        mergedEvents[day] = {
          type: "blocked",
          users: [],
        };
      }
    });

    // Ajouter les rendez-vous confirmés (ils écrasent les jours bloqués par schedules)
    confirmedAppointments.forEach((appointment) => {
      const appointmentDate = new Date(appointment.appointment_at);
      const day = appointmentDate.getDate();
      const isCurrentMonth =
        appointmentDate.getMonth() === currentDate.getMonth() &&
        appointmentDate.getFullYear() === currentDate.getFullYear();

      if (isCurrentMonth) {
        const appointmentUser = {
          id: appointment.id,
          name:
            appointment.patient?.first_name && appointment.patient?.last_name
              ? `${appointment.patient.first_name} ${appointment.patient.last_name}`
              : t("calendar.defaultClient"),
          avatar:
            appointment.patient?.avatar || "/assets/icons/defaultAvatar.png",
          time: new Date(appointment.appointment_at).toLocaleTimeString(
            undefined,
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          ),
          duration:
            appointment.session?.session_type || t("calendar.defaultDuration"),
          description:
            appointment.session?.name || t("calendar.defaultConsultation"),
        };

        if (mergedEvents[day]) {
          mergedEvents[day].users.push(appointmentUser);
        } else {
          mergedEvents[day] = {
            type: "active",
            users: [appointmentUser],
          };
        }
      }
    });

    return mergedEvents;
  };

  const allEvents = getMergedEvents();

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const isPastDate = (day: number) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day

    const checkDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    checkDate.setHours(0, 0, 0, 0);

    return checkDate < today;
  };

  const isOutsideAvailabilityRange = (day: number) => {
    if (!availabilityStartDate || !availabilityEndDate) {
      return false; // Si pas d'intervalle défini, toutes les dates sont disponibles
    }

    const checkDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    checkDate.setHours(0, 0, 0, 0);

    const startDate = new Date(availabilityStartDate);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(availabilityEndDate);
    endDate.setHours(23, 59, 59, 999); // Inclure toute la journée de fin

    return checkDate < startDate || checkDate > endDate;
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );

    // Si la date cliquée est déjà sélectionnée, la désélectionner
    if (isDateSelected(clickedDate)) {
      setSelectedDate(null);
    } else {
      // Sinon, la sélectionner
      setSelectedDate(clickedDate);
    }
  };

  const isClickable = (day: number) => {
    const event = allEvents[day as keyof typeof allEvents];
    // Les dates barrées (unavailable) ne sont pas cliquables
    if (event?.type === "unavailable") {
      return false;
    }
    // Les dates passées ne sont pas cliquables
    if (isPastDate(day)) {
      return false;
    }

    // Vérifier si la date est dans l'intervalle de disponibilité
    if (availabilityStartDate && availabilityEndDate) {
      const checkDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      checkDate.setHours(0, 0, 0, 0);

      const startDate = new Date(availabilityStartDate);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(availabilityEndDate);
      endDate.setHours(23, 59, 59, 999); // Inclure toute la journée de fin

      // Si la date est en dehors de l'intervalle, elle n'est pas cliquable
      if (checkDate < startDate || checkDate > endDate) {
        return false;
      }
    }

    return true;
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Jours du mois précédent
    const prevMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      0
    );
    const daysInPrevMonth = prevMonth.getDate();

    for (let i = firstDay - 1; i >= 0; i--) {
      days.push(
        <div
          key={`prev-${daysInPrevMonth - i}`}
          className="bg-gray-100 relative"
          style={{ borderRadius: "2px" }}
        >
          <div className="flex p-2 flex-col justify-between items-start flex-1 self-stretch h-[60px] relative">
            <span
              className="text-xs font-bold leading-4 tracking-wide"
              style={{
                color: "#CBD5E1",
                fontFamily: "Figtree",
                fontSize: "12px",
                fontWeight: 700,
                lineHeight: "16px",
                letterSpacing: "0.04px",
              }}
            >
              {daysInPrevMonth - i}
            </span>
            <div className="flex flex-col items-start"></div>
          </div>
        </div>
      );
    }

    // Jours du mois actuel
    for (let day = 1; day <= daysInMonth; day++) {
      const event = allEvents[day as keyof typeof allEvents];
      const todayIndicator = isToday(day);
      const isPast = isPastDate(day);
      const isOutsideRange = isOutsideAvailabilityRange(day);
      const clickedDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      const isSelected = isDateSelected(clickedDate);
      const clickable = isClickable(day);

      days.push(
        <div
          key={day}
          className={`bg-gray-100 relative ${
            clickable ? "cursor-pointer" : "cursor-not-allowed"
          }`}
          style={{ borderRadius: "2px" }}
          onClick={() => clickable && handleDateClick(day)}
        >
          <div
            className={`
            flex p-2 flex-col justify-between items-start flex-1 self-stretch h-[60px] relative
            transition-all duration-200
            
            ${event?.type === "active" ? "bg-blue-600 text-white" : ""}
            ${event?.type === "complete" ? " text-gray-700" : ""}
            ${event?.type === "unavailable" ? "bg-white" : ""}
            ${isPast && !event ? "opacity-40" : ""}
            ${isOutsideRange && !event ? "opacity-40" : ""}
            ${
              !event && !todayIndicator && !isPast && !isOutsideRange
                ? "text-gray-900"
                : ""
            }
            ${isSelected ? "ring-2 ring-blue-500 ring-offset-2" : ""}
            ${clickable ? "hover:bg-opacity-80" : ""}
          `}
            style={{
              borderRadius: "2px",
              ...(event?.type === "unavailable" && {
                backgroundColor: "#FFF",
                border: "1px solid #F8FAFC",
                borderRadius: "2px",
                position: "relative",
              }),
              ...(isPast &&
                !event && {
                  backgroundColor: "#F8FAFC",
                  opacity: 0.5,
                }),
              ...(isOutsideRange &&
                !event && {
                  backgroundColor: "#F8FAFC",
                  opacity: 0.5,
                }),
              ...(isSelected && {
                boxShadow: "0 0 0 2px #3B82F6",
              }),
            }}
          >
            <span
              className={`text-xs font-bold leading-4 tracking-wide ${
                todayIndicator
                  ? "bg-[#0F172A] min-w-[17px] h-[16px] flex items-center justify-center text-xs font-bold text-white rounded-full px-1"
                  : ""
              }`}
              style={{
                color:
                  todayIndicator || event?.type === "active"
                    ? "white"
                    : event?.type === "unavailable" || isPast || isOutsideRange
                    ? "#CBD5E1"
                    : "#020617",
                fontFamily: "Figtree",
                fontSize: "12px",
                fontWeight: 700,
                lineHeight: "16px",
                letterSpacing: "0.04px",
              }}
            >
              {day}
            </span>

            {/* Indicateur de sélection */}
            {isSelected && (
              <div className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
            )}

            {/* Barre oblique pour les dates indisponibles */}
            {event?.type === "unavailable" && (
              <div
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                style={{
                  background: `linear-gradient(128deg, transparent calc(50% - 0.5px), #F1F5F9 calc(50% - 0.5px), #F1F5F9 calc(50% + 0.5px), transparent calc(50% + 0.5px))`,
                }}
              />
            )}

            <div className="flex flex-col items-start">
              {/* Badge "Bloqué" pour les dates bloquées */}
              {event?.type === "blocked" && (
                <span className="text-[8px] font-semibold text-red-600 bg-red-200 px-1.5 py-0.5 rounded">
                  {t("calendar.blocked")}
                </span>
              )}

              {event?.users && event.users.length > 0 && (
                <div className="flex -space-x-1">
                  {event.users.slice(0, 2).map((user: any, index: number) => (
                    <Avatar
                      key={user.id}
                      className="w-3.5 h-3.5 border-2 border-white"
                    >
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="text-xs bg-blue-100 text-blue-600 font-semibold">
                        {user.name
                          ? user.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              )}

              {event?.type === "complete" && (
                <span className="w-[150px] text-[8px] mt-1"></span>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Jours du mois suivant
    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
    const remainingCells = totalCells - (firstDay + daysInMonth);

    for (let day = 1; day <= remainingCells; day++) {
      days.push(
        <div
          key={`next-${day}`}
          className="bg-gray-100 relative"
          style={{ borderRadius: "2px" }}
        >
          <div className="flex p-2 flex-col justify-between items-start flex-1 self-stretch h-[60px] relative">
            <span
              className="text-xs font-bold leading-4 tracking-wide"
              style={{
                color: "#CBD5E1",
                fontFamily: "Figtree",
                fontSize: "12px",
                fontWeight: 700,
                lineHeight: "16px",
                letterSpacing: "0.04px",
              }}
            >
              {day}
            </span>
            <div className="flex flex-col items-start"></div>
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className={`max-w-2xl mx-auto p-6 bg-white ${className}`}>
      {/* En-tête avec navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateMonth("prev")}
          className="h-8 w-8 cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <h2 className="text-2xl font-bold text-gray-900 font-figtree">
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateMonth("next")}
          className="h-8 w-8 cursor-pointer"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Jours de la semaine */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map((day: string) => (
          <div
            key={day}
            className="h-12 flex items-center justify-center text-gray-500 font-medium font-figtree"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grille du calendrier */}
      <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>
    </div>
  );
}
