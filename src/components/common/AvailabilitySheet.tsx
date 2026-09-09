"use client";

import { useUpdateProExpert } from "@/api/proExpert/useProExpert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { useTimeSlotsManager } from "@/hooks/useTimeSlotsManager";
import { useProExpertStore } from "@/store/useProExpert";
import { formatDateToLocalISO } from "@/utils/dateUtils";
import { Check, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

interface DayAvailability {
  day: string;
  dayOfWeek:
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";
  available: boolean;
}

interface AvailabilitySheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AvailabilitySheet({
  isOpen,
  onClose,
}: AvailabilitySheetProps) {
  const t = useTranslations();
  const { proExpertData, setProExpertData } = useProExpertStore();
  const updateProExpertMutation = useUpdateProExpert();

  // Définir les jours de la semaine
  const weekDays: DayAvailability[] = [
    {
      day: t("availabilitySheet.sunday"),
      dayOfWeek: "sunday",
      available: false,
    },
    {
      day: t("availabilitySheet.monday"),
      dayOfWeek: "monday",
      available: true,
    },
    {
      day: t("availabilitySheet.tuesday"),
      dayOfWeek: "tuesday",
      available: true,
    },
    {
      day: t("availabilitySheet.wednesday"),
      dayOfWeek: "wednesday",
      available: false,
    },
    {
      day: t("availabilitySheet.thursday"),
      dayOfWeek: "thursday",
      available: true,
    },
    {
      day: t("availabilitySheet.friday"),
      dayOfWeek: "friday",
      available: true,
    },
    {
      day: t("availabilitySheet.saturday"),
      dayOfWeek: "saturday",
      available: false,
    },
  ];

  // Créer des dates fictives pour chaque jour de la semaine (pour utiliser le hook)
  const weekDates = useMemo(() => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1); // Lundi de cette semaine

    return {
      sunday: new Date(monday.getTime() - 24 * 60 * 60 * 1000),
      monday: new Date(monday),
      tuesday: new Date(monday.getTime() + 24 * 60 * 60 * 1000),
      wednesday: new Date(monday.getTime() + 2 * 24 * 60 * 60 * 1000),
      thursday: new Date(monday.getTime() + 3 * 24 * 60 * 60 * 1000),
      friday: new Date(monday.getTime() + 4 * 24 * 60 * 60 * 1000),
      saturday: new Date(monday.getTime() + 5 * 24 * 60 * 60 * 1000),
    };
  }, []);

  // Hooks pour chaque jour de la semaine (autoSave désactivé pour gérer la sauvegarde manuellement)
  const sundayManager = useTimeSlotsManager({
    selectedDate: weekDates.sunday,
    autoSave: false,
  });
  const mondayManager = useTimeSlotsManager({
    selectedDate: weekDates.monday,
    autoSave: false,
  });
  const tuesdayManager = useTimeSlotsManager({
    selectedDate: weekDates.tuesday,
    autoSave: false,
  });
  const wednesdayManager = useTimeSlotsManager({
    selectedDate: weekDates.wednesday,
    autoSave: false,
  });
  const thursdayManager = useTimeSlotsManager({
    selectedDate: weekDates.thursday,
    autoSave: false,
  });
  const fridayManager = useTimeSlotsManager({
    selectedDate: weekDates.friday,
    autoSave: false,
  });
  const saturdayManager = useTimeSlotsManager({
    selectedDate: weekDates.saturday,
    autoSave: false,
  });

  // Mapper les managers par jour
  const dayManagers = {
    sunday: sundayManager,
    monday: mondayManager,
    tuesday: tuesdayManager,
    wednesday: wednesdayManager,
    thursday: thursdayManager,
    friday: fridayManager,
    saturday: saturdayManager,
  };

  const [isEditingPeriod, setIsEditingPeriod] = useState(false);
  const [selectedMonths, setSelectedMonths] = useState<string>("3");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Options de périodes disponibles
  const periodOptions = [
    { value: "3", label: "3 mois" },
    { value: "6", label: "6 mois" },
    { value: "9", label: "9 mois" },
    { value: "12", label: "12 mois" },
    { value: "24", label: "24 mois" },
  ];

  // Calculer les dates de début et fin basées sur la période sélectionnée
  const calculatePeriodDates = (months: string) => {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1); // 1er du mois actuel
    const endDate = new Date(
      today.getFullYear(),
      today.getMonth() + parseInt(months),
      0
    ); // Dernier jour du mois (30 ou 31)

    return { startDate, endDate };
  };

  const [availabilityPeriod, setAvailabilityPeriod] = useState(() => {
    const { startDate, endDate } = calculatePeriodDates("3");
    return {
      startDate,
      endDate,
      displayText: "3 mois",
    };
  });

  // Calculer la période de disponibilité en mois ou jours
  const calculatePeriodText = (start: Date, end: Date): string => {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.round(diffDays / 30);

    // Si moins d'un mois (moins de 30 jours),
    if (diffDays < 30) {
      return `${diffDays} ${
        diffDays > 1 ? t("availabilitySheet.days") : t("availabilitySheet.day")
      }`;
    }

    // Sinon, afficher en mois
    if (diffMonths === 1) {
      return t("availabilitySheet.oneMonth");
    } else if (diffMonths === 3) {
      return t("availabilitySheet.threeMonths");
    } else if (diffMonths === 6) {
      return t("availabilitySheet.sixMonths");
    } else if (diffMonths === 12) {
      return t("availabilitySheet.oneYear");
    } else {
      return `${diffMonths} ${
        diffMonths > 1
          ? t("availabilitySheet.months")
          : t("availabilitySheet.month")
      }`;
    }
  };

  // Charger les dates de disponibilité depuis le store
  useEffect(() => {
    if (
      proExpertData?.availability_start_date &&
      proExpertData?.availability_end_date
    ) {
      const startDate = new Date(proExpertData.availability_start_date);
      const endDate = new Date(proExpertData.availability_end_date);

      setAvailabilityPeriod({
        startDate,
        endDate,
        displayText: calculatePeriodText(startDate, endDate),
      });
    }
  }, [proExpertData]);

  // Obtenir le manager pour un jour donné
  const getManagerForDay = (dayOfWeek: DayAvailability["dayOfWeek"]) => {
    return dayManagers[dayOfWeek];
  };

  // Vérifier si un jour a des créneaux (donc disponible)
  const isDayAvailable = (dayOfWeek: DayAvailability["dayOfWeek"]) => {
    const manager = getManagerForDay(dayOfWeek);
    return manager.timeSlots.length > 0;
  };

  // Basculer la disponibilité d'un jour
  const toggleDayAvailability = (
    dayOfWeek: DayAvailability["dayOfWeek"],
    newValue?: boolean
  ) => {
    const manager = getManagerForDay(dayOfWeek);
    const currentlyAvailable = isDayAvailable(dayOfWeek);

    // Si une nouvelle valeur est fournie, l'utiliser, sinon inverser l'état actuel
    const shouldBeAvailable =
      newValue !== undefined ? newValue : !currentlyAvailable;

    if (!shouldBeAvailable && currentlyAvailable) {
      // Désactivation : supprimer TOUS les créneaux du jour EN UNE SEULE FOIS
      console.log(
        `🗑️ Suppression de tous les créneaux pour ${dayOfWeek}`,
        manager.timeSlots.length
      );

      if (!proExpertData?.schedules) return;

      // Filtrer tous les schedules de ce jour en une seule opération
      const updatedSchedules = proExpertData.schedules.filter(
        (schedule: any) => schedule.day_of_week !== dayOfWeek
      );

      // Mettre à jour le store directement avec les schedules filtrés
      setProExpertData({
        ...proExpertData,
        schedules: updatedSchedules,
      });

      console.log(`✅ Tous les créneaux de ${dayOfWeek} ont été supprimés`);
    } else if (shouldBeAvailable && !currentlyAvailable) {
      // Activation : ajouter un créneau par défaut
      console.log(`➕ Ajout d'un créneau par défaut pour ${dayOfWeek}`);
      manager.handleAddTimeSlot();
    }

    setHasUnsavedChanges(true);
  };

  // Ajouter une session à un jour
  const addSession = (dayOfWeek: DayAvailability["dayOfWeek"]) => {
    const manager = getManagerForDay(dayOfWeek);
    manager.handleAddTimeSlot();
    setHasUnsavedChanges(true);
  };

  // Supprimer une session
  const removeSession = (
    dayOfWeek: DayAvailability["dayOfWeek"],
    sessionId: string
  ) => {
    const manager = getManagerForDay(dayOfWeek);
    manager.handleRemoveTimeSlot(sessionId);
    setHasUnsavedChanges(true);
  };

  // Mettre à jour l'heure d'une session
  const updateSessionTime = (
    dayOfWeek: DayAvailability["dayOfWeek"],
    sessionId: string,
    field: "startTime" | "endTime",
    value: string
  ) => {
    const manager = getManagerForDay(dayOfWeek);
    manager.handleUpdateTimeSlot(sessionId, field, value);
    setHasUnsavedChanges(true);
  };

  // Sauvegarder toutes les modifications (période + créneaux)
  const handleSaveAll = async () => {
    try {
      setIsSaving(true);

      // 1. Sauvegarder la période de disponibilité (seulement si les dates sont remplies)
      if (availabilityPeriod.startDate && availabilityPeriod.endDate) {
        await updateProExpertMutation.mutateAsync({
          availability_start_date: formatDateToLocalISO(
            availabilityPeriod.startDate
          ),
          availability_end_date: formatDateToLocalISO(
            availabilityPeriod.endDate
          ),
        });

        setAvailabilityPeriod({
          ...availabilityPeriod,
          displayText: calculatePeriodText(
            availabilityPeriod.startDate,
            availabilityPeriod.endDate
          ),
        });
      }

      // 2. Sauvegarder tous les créneaux horaires en UN SEUL appel
      // Collecter tous les schedules de tous les jours depuis le store
      if (proExpertData?.schedules) {
        console.log("💾 Sauvegarde de tous les schedules en un seul appel");

        // Utiliser le premier manager pour accéder à handleSaveToServer
        // qui va sauvegarder TOUS les schedules du store
        await sundayManager.handleSaveToServer();
      }

      setIsEditingPeriod(false);
      setHasUnsavedChanges(false);

      // Fermer le sheet après sauvegarde réussie
      onClose();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-50">
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-[478px] overflow-y-auto bg-white border-none"
        >
          <SheetHeader className="pb-6">
            <SheetTitle className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-4">
              {t("availabilitySheet.title")}
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-8 px-6">
            {/* Période disponible */}
            <div>
              <h2 className="text-base font-medium text-slate-800 mb-2.5">
                {t("availabilitySheet.availablePeriod")}
              </h2>
              <Card className="border border-gray-200 h-fit p-0">
                <CardContent className="h-fit">
                  {!isEditingPeriod ? (
                    <div className="flex items-center justify-between h-14">
                      {!availabilityPeriod.startDate ||
                      !availabilityPeriod.endDate ? (
                        <div className="flex flex-col gap-1">
                          <div className="font-semibold text-gray-900">
                            {t("availabilitySheet.noPeriodDefined")}
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between ">
                          <div className="font-semibold text-gray-900">
                            {t("availabilitySheet.availability")}
                          </div>
                          <div className="text-gray-500 ml-3">
                            {availabilityPeriod.displayText}
                          </div>
                        </div>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-gray-600 border-none cursor-pointer"
                        onClick={() => setIsEditingPeriod(true)}
                      >
                        <Image
                          src="/assets/icons/edit.svg"
                          alt="edit"
                          width={20}
                          height={20}
                        />
                      </Button>
                    </div>
                  ) : (
                    <div className="pb-4 pt-0">
                      <div className="flex items-center justify-between mb-6">
                        <div className="font-semibold text-gray-900">
                          {t("availabilitySheet.availability")}{" "}
                          {availabilityPeriod.displayText}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-green-600 hover:text-green-700 border-none cursor-pointer"
                          onClick={() => {
                            setIsEditingPeriod(false);
                            setHasUnsavedChanges(true);
                          }}
                        >
                          <Check className="h-5 w-5" />
                        </Button>
                      </div>

                      <div className="-mt-4.5">
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          {t("availabilitySheet.selectPeriod")}
                        </label>
                        <Select
                          value={selectedMonths}
                          onValueChange={(value) => {
                            setSelectedMonths(value);
                            const { startDate, endDate } =
                              calculatePeriodDates(value);
                            setAvailabilityPeriod({
                              startDate,
                              endDate,
                              displayText: `${value} mois`,
                            });
                          }}
                        >
                          <SelectTrigger className="w-full bg-white border-gray-300 rounded-xl">
                            <SelectValue placeholder="Sélectionner une période" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-none">
                            {periodOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                                className="hover:bg-gray-50 border-b border-[#E2E8F0]"
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* Affichage des dates calculées */}
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <div className="text-sm text-gray-600">
                            <div className="flex justify-between mb-1">
                              <span className="font-medium">
                                {t("availabilitySheet.startDate")}:
                              </span>
                              <span>
                                {availabilityPeriod.startDate?.toLocaleDateString(
                                  "fr-FR"
                                )}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">
                                {t("availabilitySheet.endDate")}:
                              </span>
                              <span>
                                {availabilityPeriod.endDate?.toLocaleDateString(
                                  "fr-FR"
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Jours disponibles */}
            <div>
              <h2 className="text-base font-medium text-slate-800 mb-2.5">
                {t("availabilitySheet.availableDays")}
              </h2>
              <div className="space-y-4">
                {weekDays.map((dayData) => {
                  const manager = getManagerForDay(dayData.dayOfWeek);
                  const isAvailable = isDayAvailable(dayData.dayOfWeek);

                  return (
                    <Card
                      key={dayData.day}
                      className="border border-gray-200 p-0 m-0 min-h-[70px] mb-[13px]"
                    >
                      <CardContent className="px-[13px]">
                        <div className="flex items-center justify-between h-full pt-[7px]">
                          <div>
                            <div className="text-base font-bold text-exford-blue">
                              {dayData.day}
                            </div>
                            {isAvailable ? (
                              <div className="text-sm text-slate-gray mb-2">
                                {manager.timeSlots.length}{" "}
                                {manager.timeSlots.length > 1
                                  ? t("availabilitySheet.sessions")
                                  : t("availabilitySheet.session")}
                              </div>
                            ) : (
                              <div className="text-sm text-slate-gray">
                                {t("availabilitySheet.unavailable")}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center justify-center">
                            <Switch
                              checked={isAvailable}
                              onCheckedChange={(checked) =>
                                toggleDayAvailability(
                                  dayData.dayOfWeek,
                                  checked
                                )
                              }
                              className="data-[state=checked]:bg-gray-900 p-0"
                            />
                          </div>
                        </div>

                        {manager.error && (
                          <div className="p-2 bg-red-100 border border-red-300 rounded-md mb-3">
                            <p className="text-red-700 text-xs">
                              {manager.error}
                            </p>
                          </div>
                        )}

                        {isAvailable && (
                          <div className="space-y-3">
                            {manager.timeSlots.map((session) => (
                              <div
                                key={session.id}
                                className="flex items-center gap-2 sm:gap-4"
                              >
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  <Select
                                    value={session.startTime}
                                    onValueChange={(value) =>
                                      updateSessionTime(
                                        dayData.dayOfWeek,
                                        session.id,
                                        "startTime",
                                        value
                                      )
                                    }
                                  >
                                    <SelectTrigger className="w-20 sm:w-24 bg-white border-[#E2E8F0] rounded-xl">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white max-h-60 overflow-y-auto border-none">
                                      {manager.timeOptions.map((time) => {
                                        const isTaken = manager.isTimeSlotTaken(
                                          time,
                                          session.id
                                        );
                                        return (
                                          <SelectItem
                                            key={time}
                                            value={time}
                                            disabled={isTaken}
                                            className={`${
                                              isTaken
                                                ? "text-gray-400 cursor-not-allowed"
                                                : "text-gray-900"
                                            } hover:bg-gray-50 border-b border-[#E2E8F0]`}
                                          >
                                            {time}
                                          </SelectItem>
                                        );
                                      })}
                                    </SelectContent>
                                  </Select>
                                  <span className="text-gray-500 text-sm whitespace-nowrap">
                                    {t("availabilitySheet.to")}
                                  </span>
                                  <Select
                                    value={session.endTime}
                                    onValueChange={(value) =>
                                      updateSessionTime(
                                        dayData.dayOfWeek,
                                        session.id,
                                        "endTime",
                                        value
                                      )
                                    }
                                  >
                                    <SelectTrigger className="w-20 sm:w-24 bg-white border-[#E2E8F0] rounded-xl">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white max-h-60 overflow-y-auto border-none">
                                      {manager
                                        .getEndTimeOptions(session.startTime)
                                        .map((time) => {
                                          const isTaken =
                                            manager.isTimeSlotTaken(
                                              time,
                                              session.id
                                            );
                                          return (
                                            <SelectItem
                                              key={time}
                                              value={time}
                                              disabled={isTaken}
                                              className={`${
                                                isTaken
                                                  ? "text-gray-400 cursor-not-allowed"
                                                  : "text-gray-900"
                                              } hover:bg-gray-50 border-b border-[#E2E8F0]`}
                                            >
                                              {time}
                                            </SelectItem>
                                          );
                                        })}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      removeSession(
                                        dayData.dayOfWeek,
                                        session.id
                                      )
                                    }
                                    className="text-red-600 hover:text-red-700 h-8 w-8"
                                    disabled={manager.isLoadingAny}
                                  >
                                    <Image
                                      src="/assets/icons/trash.svg"
                                      alt="trash"
                                      width={24}
                                      height={24}
                                    />
                                  </Button>
                                </div>
                              </div>
                            ))}

                            <Button
                              variant="outline"
                              onClick={() => addSession(dayData.dayOfWeek)}
                              className="w-full h-10 justify-center items-center text-exford-blue font-bold border-[#E2E8F0] mt-3 mb-[13px] cursor-pointer"
                              disabled={manager.isLoadingAny}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              {t("availabilitySheet.addSession")}
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bouton Enregistrer fixe en bas */}
          <div className="sticky bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-200">
            <Button
              onClick={handleSaveAll}
              disabled={isSaving}
              className="w-full h-12 bg-exford-blue hover:bg-exford-blue/90 text-white font-semibold rounded-lg cursor-pointer"
            >
              {isSaving ? (
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t("availabilitySheet.saving")}
                </div>
              ) : (
                t("availabilitySheet.save")
              )}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
