"use client";
import {
  useCreatePatientAppointment,
  useGetProAppointments,
} from "@/api/appointments/useAppointments";
import { Button } from "@/components/common/Button";
import SessionFeaturesList from "@/components/common/SessionFeaturesList";
import { Card, CardContent } from "@/components/ui/card";
import { useAppointmentStore } from "@/store/useAppointmentStore";
import { usePayStore } from "@/store/usePay";
import { usePlaningStore } from "@/store/usePlaning";
import { Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

interface OfferSelectionProps {
  price: string;
  expertData?: any; // Données de l'expert avec ses sessions
}

// Mapping des jours de la semaine
const dayOfWeekMapping = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
};

// Fonction pour vérifier s'il y a des créneaux disponibles
const hasAnyAvailableSlots = (
  schedules: any[],
  existingAppointments: any[] = []
) => {
  if (!schedules || schedules.length === 0) return false;

  const today = new Date();
  const todayAtMidnight = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  // Vérifier les 30 prochains jours
  for (let i = 0; i < 30; i++) {
    const checkDate = new Date(todayAtMidnight);
    checkDate.setDate(checkDate.getDate() + i);

    const dayOfWeek =
      dayOfWeekMapping[checkDate.getDay() as keyof typeof dayOfWeekMapping];

    // Trouver les schedules pour ce jour
    const daySchedules = schedules.filter(
      (schedule) => schedule.day_of_week === dayOfWeek
    );

    if (daySchedules.length > 0) {
      // Si on trouve au moins un jour avec des schedules, il y a des créneaux
      return true;
    }
  }

  return false;
};

export default function OfferSelection({
  price,
  expertData,
}: OfferSelectionProps) {
  const t = useTranslations();
  const currentLocale = useLocale();
  const [selectedOption, setSelectedOption] = useState<"session" | string>(
    "session"
  );
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  const { setIsPaid } = usePayStore();
  const { setIsPlaning } = usePlaningStore();
  const { setAppointmentData } = useAppointmentStore();
  const router = useRouter();
  const createAppointmentMutation = useCreatePatientAppointment();

  // Récupérer les rendez-vous existants pour vérifier les créneaux
  const { data: appointments } = useGetProAppointments(
    expertData?.id?.toString()
  );

  // Vérifier s'il y a des créneaux disponibles
  const hasSlotsAvailable = useMemo(() => {
    return hasAnyAvailableSlots(
      expertData?.schedules || [],
      Array.isArray(appointments) ? appointments : []
    );
  }, [expertData?.schedules, appointments]);

  // Récupérer toutes les sessions d'abonnement actives (session_type null et session_nature "subscription")
  const subscriptionSessions =
    expertData?.sessions?.filter(
      (session: any) =>
        session.session_type === null &&
        session.session_nature === "subscription" &&
        session.is_active === true
    ) || [];

  // Fonction pour gérer le paiement de l'abonnement
  const handleSubscriptionPayment = async (sessionId: string) => {
    const selectedSession = subscriptionSessions.find(
      (s: any) => s.id === sessionId
    );
    if (!selectedSession || !expertData?.id) {
      console.error("Données manquantes pour créer l'appointment");
      return;
    }

    setIsPaymentLoading(true);

    try {
      // Créer la date d'aujourd'hui pour l'abonnement
      const today = new Date();

      const appointmentData = {
        pro_id: expertData.id, // ID de l'expert
        session_id: selectedSession.id, // ID de la session d'abonnement
        appointment_at: today.toISOString(), // Date d'aujourd'hui ISO
      };

      const result: any = await createAppointmentMutation.mutateAsync(
        appointmentData
      );

      console.log("Appointment créé avec succès:", result);

      // Pour les abonnements, l'API renvoie seulement { payment: {...} }
      if (result?.payment) {
        // Créer un objet appointment minimal avec les données qu'on a
        const appointmentForStore = {
          id: result.id || "",
          pro_id: expertData.id,
          session_id: selectedSession.id,
          appointment_at: today.toISOString(),
          status: "pending",
          patient_id: "",
          created_at: today.toISOString(),
          updated_at: today.toISOString(),
        };

        setAppointmentData(appointmentForStore as any, result.payment);

        // Construire l'URL de retour avec l'ID de l'expert
        const returnUrl = `/details?id=${expertData.id}`;
        router.push(`/payment?returnUrl=${encodeURIComponent(returnUrl)}`);
      } else {
        console.error("Pas de données de paiement dans la réponse");
        setIsPaymentLoading(false);
      }
    } catch (error) {
      console.error("Erreur lors de la création de l'appointment:", error);
      setIsPaymentLoading(false);
    }
  };

  return (
    <div className="w-full relative">
      {/* Overlay de chargement pendant le paiement */}
      {isPaymentLoading && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-lg">
          <div className="flex flex-col items-center gap-4 p-8">
            <Loader2 className="w-12 h-12 text-cobalt-blue animate-spin" />
            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-gray-900">
                {currentLocale === "fr"
                  ? "Préparation de votre réservation..."
                  : "Preparing your booking..."}
              </h3>
              <p className="text-sm text-gray-600">
                {currentLocale === "fr"
                  ? "Vous allez être redirigé vers la page de paiement"
                  : "You will be redirected to the payment page"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sessions uniques */}
      <div className="h-[70px] flex flex-col justify-center border-b border-gray-200">
        <h2 className="text-xl font-bold px-6">{t("offers.chooseOffer")}</h2>
      </div>

      <div
        className={`p-6 space-y-6 ${
          isPaymentLoading ? "pointer-events-none opacity-50" : ""
        }`}
      >
        <div>
          <h2 className="text-sm font-bold text-gray-900 mb-1.5 font-figtree">
            {t("offers.singleSessions")}
          </h2>

          <Card
            className={`relative transition-all cursor-pointer p-0 m-0 ${
              selectedOption === "session"
                ? "ring-2 ring-pale-blue-gray border border-pale-blue-gray bg-snow-blue"
                : "ring-2 ring-frost-gray border border-frost-gray"
            }`}
            onClick={() => setSelectedOption("session")}
          >
            <CardContent className="p-3.5 m-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-2 font-figtree">
                    {t("offers.quickVideoSession")}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 font-figtree">
                    {t("offers.perfectForSpecificQuestions")}
                  </p>
                  <p className="text-sm text-gray-700 mb-6 font-figtree">
                    {t("offers.startingFrom")}{" "}
                    <span className="font-semibold">{price}</span>
                  </p>
                </div>
                <div className="ml-4">
                  <button
                    onClick={() => setSelectedOption("session")}
                    className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
                  >
                    {selectedOption === "session" && (
                      <div className="w-3 h-3 rounded-full bg-gray-900"></div>
                    )}
                  </button>
                </div>
              </div>

              {selectedOption === "session" && (
                <Button
                  label={
                    hasSlotsAvailable
                      ? t("offers.viewTimeSlots")
                      : t("offers.noSlotsAvailable")
                  }
                  className={`w-full h-[56px] rounded-[8px] ${
                    hasSlotsAvailable
                      ? "bg-cobalt-blue hover:bg-cobalt-blue/80 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  onClick={() => hasSlotsAvailable && setIsPlaning(true)}
                  disabled={!hasSlotsAvailable}
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Abonnements mensuels - Affichés seulement si des sessions d'abonnement existent */}
        {subscriptionSessions.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-gray-900 mb-1.5 font-figtree">
              {t("offers.monthlySubscriptions")}
            </h2>

            <div className="space-y-4">
              {subscriptionSessions.map((session: any) => (
                <Card
                  key={session.id}
                  className={`relative transition-all cursor-pointer p-0 ${
                    selectedOption === session.id
                      ? "ring-2 ring-pale-blue-gray border border-pale-blue-gray bg-snow-blue"
                      : "ring-2 ring-frost-gray border border-frost-gray"
                  }`}
                  onClick={() => setSelectedOption(session.id)}
                >
                  <CardContent className="p-3.5 m-0">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 mb-4 font-figtree">
                          {session.name}
                        </h3>

                        <div className="mb-6">
                          <h4 className="text-sm font-medium text-[#6B7280] mb-2 font-figtree">
                            {t("offers.whatIsIncluded")}
                          </h4>
                          <SessionFeaturesList
                            sessionId={session.id}
                            variant="compact"
                          />
                        </div>

                        <p className="text-xl font-bold text-exford-blue font-figtree">
                          {session.price} €{" "}
                          <span className="text-sm font-normal text-slate-800 font-figtree">
                            {t("offers.perMonth")}
                          </span>
                        </p>
                      </div>
                      <div className="ml-4">
                        <button
                          onClick={() => setSelectedOption(session.id)}
                          className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
                        >
                          {selectedOption === session.id && (
                            <div className="w-3 h-3 rounded-full bg-gray-900"></div>
                          )}
                        </button>
                      </div>
                    </div>
                    {selectedOption === session.id && (
                      <Button
                        label={t("offers.chooseAndPay")}
                        className="w-full h-[56px] rounded-[8px] bg-cobalt-blue hover:bg-cobalt-blue/80 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handleSubscriptionPayment(session.id)}
                        disabled={isPaymentLoading}
                      />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
