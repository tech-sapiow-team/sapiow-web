"use client";

import { ProfileAvatar } from "@/components/common/ProfileAvatar";
import { cancelPatientSubscription } from "@/api/patientPayment/patientSubscription";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";

export type PatientSubscriptionPro = {
  first_name?: string | null;
  last_name?: string | null;
  avatar?: string | null;
  job?: string | null;
};

export type PatientSubscription = {
  id: string | number;
  created_at: string;
  active?: boolean | null;
  status?: string | null;
  subscription_id?: string | null;
  pro?: PatientSubscriptionPro | null;
};

type Props = {
  subscriptions: PatientSubscription[];
  locale?: string;
  className?: string;
  onCancelled?: (subscriptionId: PatientSubscription["id"]) => void;
};

const formatSubscriptionDateTime = (isoDate: string, locale = "fr-FR") => {
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return isoDate;

  const date = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);

  const time = new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);

  const joiner = locale.startsWith("fr") ? "à" : "at";
  return `${date} ${joiner} ${time}`;
};

export default function PatientSubscriptionsList({
  subscriptions,
  locale = "fr-FR",
  className,
  onCancelled,
}: Props) {
  const t = useTranslations();
  const [confirmSub, setConfirmSub] = useState<PatientSubscription | null>(
    null
  );
  const [cancellingId, setCancellingId] = useState<
    PatientSubscription["id"] | null
  >(null);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const isCancelling = cancellingId !== null;

  const closeModal = () => {
    if (isCancelling) return;
    setCancelError(null);
    setConfirmSub(null);
  };

  const confirmCancel = async () => {
    if (!confirmSub) return;

    setCancelError(null);
    setCancellingId(confirmSub.id);

    try {
      await cancelPatientSubscription(confirmSub.id);
      onCancelled?.(confirmSub.id);
      setConfirmSub(null);
    } catch (e: any) {
      console.error("cancelPatientSubscription error:", e);
      setCancelError(e?.message || t("subscriptions.errorGeneric"));
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <h2 className="text-lg font-bold text-exford-blue">
        {t("subscriptions.title")}
      </h2>

      <div className="mt-4 space-y-4">
        {subscriptions.map((sub) => {
          const pro = sub.pro ?? undefined;
          const fullName = `${pro?.first_name ?? ""} ${
            pro?.last_name ?? ""
          }`.trim();
          const normalizedStatus = (sub.status ?? "").toLowerCase();
          const isConfirmed = normalizedStatus === "confirmed";
          const isCancelled = [
            "canceled",
            "cancelled",
            "canceled_at",
            "inactive",
          ].includes(normalizedStatus);

          // Le backend renvoie parfois `active` et/ou `status`.
          // On considère "Actif" si `status` est confirmed, sinon fallback sur `active`.
          const isActive = isConfirmed || (!isCancelled && Boolean(sub.active));
          const statusLabel = isActive
            ? t("subscriptions.active")
            : t("subscriptions.cancelled");
          const statusClass = isActive ? "text-green-500" : "text-red-500";
          const dateTimeLabel = formatSubscriptionDateTime(
            sub.created_at,
            locale
          );

          return (
            <div
              key={String(sub.id)}
              className="flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-3 min-w-0">
                <ProfileAvatar
                  src={(pro?.avatar as string) || ""}
                  alt={fullName || "Pro"}
                  size="md"
                  borderColor="border-white"
                  borderWidth="2"
                  className="border-light-blue-gray shrink-0"
                />

                <div className="min-w-0">
                  <p className="text-base font-bold text-exford-blue truncate">
                    {fullName || "—"}
                  </p>
                  <p className="text-sm text-platinum-platinum-700 font-medium">
                    {t("subscriptions.subscriptionLabel")}
                  </p>

                  <p className="text-sm text-platinum-platinum-700 font-medium">
                    {t("subscriptions.statusLabel")}:{" "}
                    <span className={cn("font-semibold", statusClass)}>
                      {statusLabel}
                    </span>
                  </p>

                  <p className="text-sm text-platinum-platinum-700 font-medium">
                    {dateTimeLabel}
                  </p>
                </div>
              </div>

              {isActive ? (
                <button
                  type="button"
                  onClick={() => {
                    setCancelError(null);
                    setConfirmSub(sub);
                  }}
                  disabled={cancellingId === sub.id}
                  className={cn(
                    "shrink-0 px-4 py-2 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed cursor-pointer inline-flex items-center justify-center",
                    cancellingId === sub.id
                      ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-50 opacity-100"
                      : "bg-red-500 text-white hover:bg-red-600"
                  )}
                >
                  {cancellingId === sub.id ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="h-4 w-4 rounded-full border-2 border-red-200 border-t-red-600 animate-spin" />
                      {t("subscriptions.stop")}
                    </span>
                  ) : (
                    t("subscriptions.stop")
                  )}
                </button>
              ) : null}
            </div>
          );
        })}

        {subscriptions.length === 0 ? (
          <div className="py-6">
            <p className="text-sm text-platinum-platinum-700">
              {t("subscriptions.empty")}
            </p>
          </div>
        ) : null}
      </div>

      {confirmSub ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />

          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-exford-blue">
                {t("subscriptions.modalTitle")}
              </h2>
              <button
                onClick={closeModal}
                className="text-slate-gray hover:text-exford-blue transition-colors"
                disabled={isCancelling}
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-slate-gray mb-2">
                {t("subscriptions.modalQuestion")}
              </p>
              <p className="text-red-500 font-semibold">
                {t("subscriptions.modalWarning")}
              </p>
              {cancelError ? (
                <p className="mt-3 text-sm text-red-600">{cancelError}</p>
              ) : null}
            </div>

            <div className="flex gap-3">
              <button
                onClick={closeModal}
                disabled={isCancelling}
                className="flex-1 px-4 py-3 bg-gray-100 text-exford-blue rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {t("subscriptions.back")}
              </button>
              <button
                onClick={confirmCancel}
                disabled={isCancelling}
                className={cn(
                  "flex-1 px-4 py-3 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed cursor-pointer inline-flex items-center justify-center gap-2",
                  isCancelling
                    ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-50 opacity-100"
                    : "bg-red-500 text-white hover:bg-red-600"
                )}
              >
                {isCancelling ? (
                  <>
                    <span className="h-4 w-4 rounded-full border-2 border-red-200 border-t-red-600 animate-spin" />
                    {t("subscriptions.cancelling")}
                  </>
                ) : (
                  t("subscriptions.confirmCancel")
                )}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
