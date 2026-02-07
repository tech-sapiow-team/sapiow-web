"use client";

import { ProfileAvatar } from "@/components/common/ProfileAvatar";
import { cancelProSubscription } from "@/api/pro-payouts/proSubscription";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { useState } from "react";

export type ProSubscriptionPatient = {
  first_name?: string | null;
  last_name?: string | null;
  avatar?: string | null;
};

export type ProSubscription = {
  id: string | number;
  created_at: string;
  active?: boolean | null;
  status?: string | null;
  subscription_id?: string | null;
  patient?: ProSubscriptionPatient | null;
};

type Props = {
  subscriptions: ProSubscription[];
  locale?: string;
  className?: string;
  onCancelled?: (subscriptionId: ProSubscription["id"]) => void;
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

export default function ProSubscriptionsList({
  subscriptions,
  locale = "fr-FR",
  className,
  onCancelled,
}: Props) {
  const t = useTranslations();
  const [confirmAction, setConfirmAction] = useState<{
    id: ProSubscription["id"];
    type: "stop" | "cancel";
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const closeModal = () => {
    if (isSubmitting) return;
    setConfirmAction(null);
  };

  return (
    <div className={cn("w-full", className)}>
      <h2 className="text-lg font-bold text-exford-blue">
        {t("subscriptions.title")}
      </h2>

      <div className="mt-4 space-y-4">
        {subscriptions.map((sub) => {
          const patient = sub.patient ?? undefined;
          const fullName = `${patient?.first_name ?? ""} ${
            patient?.last_name ?? ""
          }`.trim();

          const normalizedStatus = (sub.status ?? "").toLowerCase();
          const isConfirmed = normalizedStatus === "confirmed";
          const isCancelled = ["canceled", "cancelled", "inactive"].includes(
            normalizedStatus
          );
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
              className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
            >
              <div className="flex items-start gap-3 min-w-0">
                <ProfileAvatar
                  src={(patient?.avatar as string) || ""}
                  alt={fullName || t("patient")}
                  size="md"
                  borderColor="border-white"
                  borderWidth="2"
                  className="border-light-blue-gray shrink-0 !w-10 !h-10 sm:!w-14 sm:!h-14"
                />

                <div className="min-w-0 flex-1">
                  <p className="text-base font-bold text-exford-blue truncate sm:whitespace-normal sm:break-words">
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
                <div className="w-full flex items-center gap-2 sm:w-auto sm:justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      setConfirmAction({ id: sub.id, type: "stop" })
                    }
                    className="flex-1 sm:flex-none px-4 py-2 h-10 bg-exford-blue text-white rounded-lg font-semibold hover:bg-exford-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
                  >
                    {t("subscriptions.stop")}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setConfirmAction({ id: sub.id, type: "cancel" })
                    }
                    className="flex-1 sm:flex-none px-4 py-2 h-10 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
                  >
                    {t("cancel")}
                  </button>
                </div>
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

      {confirmAction ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />

          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-exford-blue">
                {confirmAction.type === "stop"
                  ? t("proSubscriptions.modalTitleStop")
                  : t("proSubscriptions.modalTitleCancel")}
              </h2>
              <button
                onClick={closeModal}
                className="text-slate-gray hover:text-exford-blue transition-colors"
                disabled={isSubmitting}
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-slate-gray mb-2">
                {confirmAction.type === "stop"
                  ? t("proSubscriptions.modalQuestionStop")
                  : t("proSubscriptions.modalQuestionCancel")}
              </p>
              <p className="text-red-500 font-semibold">
                {t("proSubscriptions.modalWarning")}
              </p>
              {confirmAction.type === "cancel" ? (
                <p className="mt-2 text-sm text-slate-gray">
                  {t("proSubscriptions.modalRefundInfo")}
                </p>
              ) : null}
            </div>

            <div className="flex gap-3">
              <button
                onClick={closeModal}
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 bg-gray-100 text-exford-blue rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {t("proSubscriptions.back")}
              </button>
              <button
                onClick={async () => {
                  setIsSubmitting(true);
                  try {
                    await cancelProSubscription(confirmAction.id, {
                      refund: confirmAction.type === "cancel",
                    });
                    onCancelled?.(confirmAction.id);
                    setConfirmAction(null);
                  } catch (e) {
                    console.error("cancelProSubscription error:", e);
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                disabled={isSubmitting}
                className={cn(
                  "flex-1 px-4 py-3 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed cursor-pointer inline-flex items-center justify-center gap-2",
                  isSubmitting
                    ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-50 opacity-100"
                    : "bg-red-500 text-white hover:bg-red-600"
                )}
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 rounded-full border-2 border-red-200 border-t-red-600 animate-spin" />
                    {t("proSubscriptions.submitting")}
                  </>
                ) : (
                  t("proSubscriptions.confirm")
                )}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
