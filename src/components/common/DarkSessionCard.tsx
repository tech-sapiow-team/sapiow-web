"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button } from "./Button";
import { ProfileAvatar } from "./ProfileAvatar";

interface UpcomingVideoCallProps {
  date: string;
  appointmentAt: string; // ISO date string from API
  profileImage: string;
  name: string;
  title: string;
  onViewDetails?: () => void;
  className?: string;
  variant?: "dark" | "light";
  showButton?: boolean;
  sessionTime?: string; // Format: "14h30 - 15h30"
}

// Fonction pour formater la date selon la locale
const formatDateByLocale = (dateString: string, locale: string): string => {
  try {
    // Debug: log the input to understand the format
    console.log("formatDateByLocale input:", dateString, "locale:", locale);

    // Si la chaîne est déjà formatée (contient des lettres), la retourner telle quelle
    if (/[a-zA-Z]/.test(dateString)) {
      console.log("Date already formatted, returning as is:", dateString);
      return dateString;
    }

    let date: Date;

    // Essayer différents formats de parsing
    if (dateString.includes("/")) {
      // Format DD/MM/YYYY ou MM/DD/YYYY
      date = new Date(dateString);
    } else if (dateString.includes("-")) {
      // Format YYYY-MM-DD ou DD-MM-YYYY
      date = new Date(dateString);
    } else {
      // Essayer le parsing direct
      date = new Date(dateString);
    }

    // Vérifier si la date est valide
    if (isNaN(date.getTime())) {
      console.warn("Invalid date detected, using fallback:", dateString);
      return dateString; // Fallback to original string if date is invalid
    }

    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      day: "numeric",
      month: "short",
    };

    const formatted = date.toLocaleDateString(
      locale === "fr" ? "fr-FR" : "en-US",
      options
    );
    console.log("Formatted date:", formatted);
    return formatted;
  } catch (error) {
    console.warn("Error formatting date:", error);
    return dateString; // Fallback to original string if parsing fails
  }
};

// Fonction pour calculer le temps restant
const calculateTimeRemaining = (appointmentAt: string, t: any): string => {
  const now = new Date();
  const appointmentDate = new Date(appointmentAt);
  const diffMs = appointmentDate.getTime() - now.getTime();

  if (diffMs <= 0) {
    return t("upcomingCall.now");
  }

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    const dayText =
      diffDays > 1 ? t("upcomingCall.days") : t("upcomingCall.day");
    return `${t("upcomingCall.inDays")} ${diffDays} ${dayText}`;
  } else if (diffHours > 0) {
    const remainingMinutes = diffMinutes % 60;
    return remainingMinutes > 0
      ? `${t("upcomingCall.inHours")} ${diffHours}${t(
          "upcomingCall.hours"
        )}${remainingMinutes.toString().padStart(2, "0")}`
      : `${t("upcomingCall.inHours")} ${diffHours}${t("upcomingCall.hours")}`;
  } else {
    return `${t("upcomingCall.inMinutes")} ${diffMinutes} ${t(
      "upcomingCall.minutes"
    )}`;
  }
};

export const UpcomingVideoCall: React.FC<UpcomingVideoCallProps> = ({
  date,
  appointmentAt,
  profileImage,
  name,
  title,
  onViewDetails,
  className = "",
  variant = "dark",
  showButton = true,
  sessionTime,
}) => {
  const t = useTranslations();
  const currentLocale = useLocale();
  const isDark = variant === "dark";
  const [timeRemaining, setTimeRemaining] = useState<string>(
    calculateTimeRemaining(appointmentAt, t)
  );

  // Mettre à jour le temps restant chaque minute
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(appointmentAt, t));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [appointmentAt, t]);

  const cardClasses = isDark
    ? "text-white"
    : "bg-snow-blue text-slate-800 border border-soft-ice-gray shadow-none";

  const cardStyle = isDark
    ? {
        background: "linear-gradient(98deg, #020617 15.14%, #040E37 95.16%)",
        boxShadow: "0 4px 4px 0 #F1F5F9",
      }
    : {};

  const iconFilter = isDark ? "brightness-0 invert" : "opacity-60";

  const textClasses = {
    primary: isDark ? "text-white" : "text-slate-800",
    secondary: isDark ? "text-light-blue-gray" : "text-gray-600",
    dateTime: isDark
      ? "text-white font-figtree"
      : "text-slate-700 font-figtree",
  };

  const buttonClasses = isDark
    ? "bg-white hover:bg-white/90 text-exford-blue h-[48px]"
    : "bg-white hover:bg-white/90 text-exford-blue h-[40px] border border-light-blue-gray";
  return (
    <Card
      className={`w-full md:max-w-[424px] ${cardClasses}  rounded-[16px] overflow-hidden p-3 ${className}`}
      style={cardStyle}
    >
      {/* En-tête avec date et durée */}
      <CardHeader className="p-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/assets/icons/calendar.svg"
              alt={t("upcomingCall.calendarAlt")}
              width={24}
              height={24}
              className={iconFilter}
            />
            <span className={`text-xs font-medium ${textClasses.dateTime}`}>
              {formatDateByLocale(date, currentLocale)}
            </span>
          </div>
          <div className="flex items-center gap-2 ">
            <Image
              src="/assets/icons/clock.svg"
              alt={t("upcomingCall.clockAlt")}
              width={24}
              height={24}
              className={iconFilter}
            />
            <div
              className={`flex items-center gap-2 text-xs font-medium ${textClasses.dateTime}`}
            >
              <span>{timeRemaining}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Contenu principal */}
      <CardContent className="p-0 mb-1 -mt-4.5">
        {/* Profil utilisateur */}
        <div className="flex items-center gap-3">
          {showButton ? (
            <ProfileAvatar
              src={profileImage}
              alt={name}
              size="lg"
              borderColor="border-none"
              borderWidth="1"
            />
          ) : (
            <div
              className="relative overflow-hidden rounded-[8px]"
              style={{ width: "75px", height: "86px" }}
            >
              <Image
                src={profileImage}
                alt={name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="flex-1">
            <h3 className={`text-base font-bold ${textClasses.primary}`}>
              {name}
            </h3>
            <p className={`text-sm font-semibold ${textClasses.secondary}`}>
              {title}
            </p>
            <p className={`text-lg font-bold ${textClasses.primary} `}>
              {sessionTime}
            </p>
          </div>
        </div>

        {/* Bouton d'action ou informations de session */}
        {showButton && (
          <Button
            label={t("sessionDetail.viewDetails")}
            onClick={onViewDetails}
            className={`w-full ${buttonClasses} font-bold rounded-[8px] transition-all duration-200 mt-2.5 mb-1`}
          />
        )}
      </CardContent>
    </Card>
  );
};
