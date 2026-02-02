"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "./Button";
import { LoadingSpinner } from "./LoadingSpinner";
import { ProfileAvatar } from "./ProfileAvatar";
import { SessionModal } from "./SessionModal";

interface AppointmentQuestion {
  id: number | string;
  question: string;
  created_at: string;
  updated_at: string;
  appointment_id: number | string;
}

interface SessionCardProps {
  date: string;
  time: string;
  duration?: string;
  isComming?: boolean;
  profileImage: string;
  name: string;
  textButton?: string;
  sessionDescription: string;
  onAccept?: () => void;
  onCancel?: () => void;
  onViewRequest?: () => void;
  className?: string;
  icon?: string;
  classFooter?: string;
  buttonStates?: {
    acceptDisabled?: boolean;
    viewDisabled?: boolean;
  };
  isUpcoming?: boolean;
  isFlex1?: boolean;
  questions?: AppointmentQuestion[];
  loadingState?: "confirming" | "cancelling" | null;
  appointmentAt?: string;
  isLoading?: boolean;
}

export const SessionCard: React.FC<SessionCardProps> = ({
  date,
  time,
  profileImage,
  name,
  sessionDescription,
  onAccept,
  onCancel,
  onViewRequest,
  className = "",
  icon,
  classFooter = "",
  duration,
  isComming = false,
  textButton,
  buttonStates = { acceptDisabled: false, viewDisabled: false },
  isUpcoming = false,
  isFlex1 = false,
  questions = [],
  loadingState = null,
  appointmentAt,
  isLoading = false,
}) => {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);

  const handleViewRequest = () => {
    setIsOpen(true);
    if (onViewRequest) {
      onViewRequest();
    }
  };

  // Détermine le texte du bouton et le titre du modal selon le contexte
  const viewButtonText = isUpcoming
    ? t("visios.viewDetails")
    : t("visios.viewRequest");

  if (isLoading) {
    return (
      <Card
        className={`w-full max-w-[470px] bg-snow-blue shadow-none border border-soft-ice-gray rounded-[12px] p-0 animate-pulse ${className}`}
      >
        <CardHeader className="m-0">
          <div className="flex items-center justify-between gap-2 pt-3">
            <div className="flex items-center gap-2">
              <div className="w-4.5 h-4.5 bg-gray-200 rounded shrink-0" />
              <div className="h-3 bg-gray-200 rounded-full w-28" />
            </div>
            {isComming && (
              <div className="flex items-center gap-2">
                <div className="w-4.5 h-4.5 bg-gray-200 rounded shrink-0" />
                <div className="h-3 bg-gray-200 rounded-full w-20" />
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="-mt-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-200 shrink-0" />
            <div className="flex-1 space-y-2.5 min-w-0">
              <div className="h-5 bg-gray-200 rounded-full w-2/3" />
              <div className="h-4 bg-gray-200 rounded-full w-1/2" />
            </div>
          </div>
        </CardContent>

        <CardFooter className="pb-3">
          <div
            className={`flex gap-4 w-full flex-col lg:flex-row ${classFooter}`}
          >
            <div className="h-10 bg-gray-200 rounded-[8px] flex-1" />
            {!buttonStates.viewDisabled && (
              <div className="h-10 bg-gray-200 rounded-[8px] flex-1" />
            )}
          </div>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card
      className={`w-full max-w-[470px] bg-snow-blue shadow-none border border-soft-ice-gray rounded-[12px] p-0 ${className}`}
    >
      {/* En-tête avec date et heure */}
      <CardHeader className="m-0">
        <div className="flex items-center justify-between gap-2 pt-3">
          <div className="flex items-center gap-2 font-figtree">
            <div className="w-4.5 h-4.5 flex items-center justify-center">
              <Image
                src="/assets/icons/calendar.svg"
                alt={t("visios.calendarAlt")}
                width={18}
                height={18}
              />
            </div>
            <span className="text-xs font-figtree font-medium text-gray-900">
              {date}, {time}
            </span>
          </div>
          {isComming && (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4.5 h-4.5 flex items-center justify-center">
                <Image
                  src="/assets/icons/clock.svg"
                  alt={t("visios.clockAlt")}
                  width={18}
                  height={18}
                />
              </div>
              <span className="text-xs font-figtree font-medium text-gray-900">
                {t("visios.sessionDuration")} {duration}
              </span>
            </div>
          )}{" "}
        </div>
      </CardHeader>

      {/* Profil utilisateur */}
      <CardContent className="-mt-5">
        <div className="flex items-center gap-4">
          <ProfileAvatar
            src={profileImage}
            alt={name}
            size="md"
            borderColor="border-gray-200"
            borderWidth="2"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold text-gray-900 mb-1 lg:text-[16px] xl:text-xl font-figtree truncate">
              {name}
            </h3>
            <p className="text-gray-600 text-base lg:text-[13px] xl:text-base font-figtree truncate">
              {sessionDescription}
            </p>
          </div>
        </div>
      </CardContent>

      {/* Boutons d'action */}
      <CardFooter className="pb-3">
        <div
          className={`flex gap-4 w-full flex-col lg:flex-row ${classFooter}`}
        >
          <Button
            onClick={onAccept}
            label={
              loadingState === "confirming" ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                </div>
              ) : (
                textButton || t("accept")
              )
            }
            icon={!loadingState ? icon : undefined}
            className="h-[40px] px-6 rounded-[8px] font-bold font-figtree text-base lg:text-[13px] xl:text-base flex-1"
            disabled={
              buttonStates.acceptDisabled || loadingState === "confirming"
            }
          />

          {!buttonStates.viewDisabled && (
            <SessionModal
              isOpen={isOpen}
              onOpenChange={setIsOpen}
              profileImage={profileImage}
              name={name}
              sessionDescription={sessionDescription}
              isUpcoming={isUpcoming}
              onAccept={onAccept}
              onCancel={onCancel}
              questions={questions}
              loadingState={loadingState}
              appointmentAt={appointmentAt}
              trigger={
                <Button
                  onClick={handleViewRequest}
                  label={viewButtonText}
                  className="text-exford-blue h-[40px] font-bold font-figtree px-6 rounded-[8px] border border-light-blue-gray bg-white text-base lg:text-[13px] xl:text-base hover:bg-gray-200 flex-1"
                />
              }
            />
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
