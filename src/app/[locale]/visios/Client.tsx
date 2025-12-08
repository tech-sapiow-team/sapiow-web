"use client";
import { useGetPatientAppointments } from "@/api/appointments/useAppointments";
import { useGetCustomer } from "@/api/customer/useCustomer";
import { UpcomingVideoCall } from "@/components/common/DarkSessionCard";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { HeaderClient } from "@/components/layout/header/HeaderClient";
import { SessionDetailSheet } from "@/components/visios/SessionDetailSheet";
import { useCallStore } from "@/store/useCall";
import {
  filterAndSortAppointments,
  transformAppointmentToSessionData,
  type ApiAppointment,
  type SessionData,
} from "@/utils/appointmentUtils";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import VideoConsultation from "../VideoCall/video-consultation";

export default function Client() {
  const t = useTranslations();
  const { setAppointmentId, callCreatorName, setCallCreatorName } =
    useCallStore();
  const [selectedSession, setSelectedSession] = useState<SessionData | null>(
    null
  );

  const { isVideoCallOpen, setIsVideoCallOpen } = useCallStore();

  const handleViewDetails = (sessionData: SessionData) => {
    setSelectedSession(sessionData);
  };

  const handleCloseDetails = () => {
    setSelectedSession(null);
  };

  const handleStartVideoCall = (appointmentId: string) => {
    setAppointmentId(appointmentId);
    setIsVideoCallOpen(true);
    setSelectedSession(null); // Fermer le sheet modal
  };

  const handleCloseVideoCall = () => {
    setIsVideoCallOpen(false);
    // Nettoyer le nom du professionnel quand l'appel est terminé
    setCallCreatorName(null);
  };

  const { data: customer } = useGetCustomer();

  // Filtrer les rendez-vous futurs (>= aujourd'hui à minuit)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = today.toISOString();

  const {
    data: appointments,
    isLoading: isLoadingAppointments,
    refetch,
  } = useGetPatientAppointments(customer?.id, {
    gteField: "appointment_at",
    gte: todayISO,
    orderBy: "appointment_at",
    orderDirection: "asc",
  });

  // Écouteur d'événement pour l'annulation de rendez-vous
  useEffect(() => {
    const handleAppointmentCancelled = () => {
      // Rafraîchir les données après l'annulation
      refetch();
    };

    window.addEventListener(
      "appointment-cancelled",
      handleAppointmentCancelled
    );

    return () => {
      window.removeEventListener(
        "appointment-cancelled",
        handleAppointmentCancelled
      );
    };
  }, [refetch]);

  // Transformation et filtrage des données avec filtre de fin de session
  const { nextAppointment, upcomingConfirmed, otherUpcoming } = useMemo(() => {
    if (!appointments)
      return {
        nextAppointment: null,
        upcomingConfirmed: [],
        otherUpcoming: [],
      };

    // Filtrer les rendez-vous dont l'heure de fin n'est pas encore passée
    const filteredAppointments = (appointments as ApiAppointment[]).filter(
      (apt) => {
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
        const endTime = new Date(
          appointmentDate.getTime() + durationMinutes * 60000
        );
        const now = new Date();

        // Garder seulement si l'heure de fin n'est pas encore passée
        return endTime > now;
      }
    );

    const { upcomingConfirmed: allConfirmed, otherUpcoming: pending } =
      filterAndSortAppointments(filteredAppointments);

    // Extraire le rendez-vous le plus imminent (le premier de la liste triée)
    const nextAppointment = allConfirmed.length > 0 ? allConfirmed[0] : null;

    // Les autres rendez-vous confirmés (tous sauf le premier)
    const remainingConfirmed = allConfirmed.slice(1);

    return {
      nextAppointment,
      upcomingConfirmed: remainingConfirmed,
      otherUpcoming: pending,
    };
  }, [appointments]);

  if (isLoadingAppointments) {
    return (
      <div>
        <HeaderClient text={t("visios.myVideoConferences")} />
        <div className="w-full my-4 px-5 pb-10">
          <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <LoadingScreen
              message={t("visios.loadingVideoConferences")}
              size="lg"
              fullScreen={false}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      {isVideoCallOpen ? (
        <HeaderClient
          text={
            callCreatorName
              ? `Session avec ${callCreatorName}`
              : t("visios.sessionInProgress")
          }
        />
      ) : (
        <HeaderClient text={t("visios.myVideoConferences")} />
      )}

      {/* Contenu principal */}
      {isVideoCallOpen ? (
        <VideoConsultation
          isOpen={isVideoCallOpen}
          onClose={handleCloseVideoCall}
        />
      ) : (
        <div className="w-full my-4 px-5 pb-10">
          {/* Section Rendez-vous imminent */}
          {nextAppointment && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">
                {t("visios.imminentAppointment")}
              </h2>
              <div className="flex gap-4">
                {(() => {
                  const sessionData =
                    transformAppointmentToSessionData(nextAppointment);
                  return (
                    <UpcomingVideoCall
                      key={nextAppointment.id}
                      date={sessionData.date}
                      appointmentAt={nextAppointment.appointment_at}
                      profileImage={sessionData.profileImage}
                      name={sessionData.professionalName}
                      title={sessionData.professionalTitle}
                      onViewDetails={() => handleViewDetails(sessionData)}
                      variant="dark"
                      className="w-full md:max-w-[324px] h-[184px] border-none shadow-none"
                    />
                  );
                })()}
              </div>
            </div>
          )}

          {/* Section Visio à venir */}
          <h2 className="mb-3">{t("visios.upcomingVideo")}</h2>
          {upcomingConfirmed.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
              {upcomingConfirmed.map((appointment: ApiAppointment) => {
                const sessionData =
                  transformAppointmentToSessionData(appointment);
                return (
                  <UpcomingVideoCall
                    key={appointment.id}
                    date={sessionData.date}
                    appointmentAt={appointment.appointment_at}
                    profileImage={sessionData.profileImage}
                    name={sessionData.professionalName}
                    title={sessionData.professionalTitle}
                    onViewDetails={() => handleViewDetails(sessionData)}
                    variant="light"
                    className="w-full h-[184px]"
                  />
                );
              })}
            </div>
          ) : !nextAppointment ? (
            <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg mb-10">
              <p className="text-gray-500">{t("visios.noConfirmedUpcoming")}</p>
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg mb-10">
              <p className="text-gray-500">{t("visios.noOtherScheduled")}</p>
            </div>
          )}

          {/* Section Demandes en attente */}
          {otherUpcoming.length > 0 && (
            <>
              <h2 className="mb-3 mt-6">{t("visios.pending")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                {otherUpcoming.map((appointment: ApiAppointment) => {
                  const sessionData =
                    transformAppointmentToSessionData(appointment);
                  return (
                    <UpcomingVideoCall
                      key={appointment.id}
                      date={sessionData.date}
                      appointmentAt={appointment.appointment_at}
                      profileImage={sessionData.profileImage}
                      name={sessionData.professionalName}
                      title={sessionData.professionalTitle}
                      onViewDetails={() => handleViewDetails(sessionData)}
                      variant="light"
                      className="w-full h-[184px]"
                    />
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* Sheet modal de détails de session */}
      <SessionDetailSheet
        session={selectedSession}
        isOpen={!!selectedSession}
        onClose={handleCloseDetails}
        onStartVideoCall={handleStartVideoCall}
      />
    </div>
  );
}
