import { Button } from "@/components/common/Button";
import { ChevronLeftIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

interface TransactionDetailsProps {
  montant: string;
  session: string;
  expert: string;
  dateHeure: string;
  statut: "completed" | "pending" | "cancelled";
  id: string;
  onBack?: () => void;
  isMobile?: boolean;
  appointmentStatus?: string; // Pour gérer l'affichage de "Remboursé"
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({
  montant,
  session,
  expert,
  dateHeure,
  statut,
  id,
  onBack,
  isMobile = false,
  appointmentStatus,
}) => {
  const t = useTranslations();

  const getStatutColor = (statut: string, appointmentStatus?: string) => {
    // Si l'appointment est remboursé, afficher en rouge
    if (appointmentStatus === "refunded") {
      return "text-red-500";
    }
    switch (statut) {
      case "completed":
        return "text-green-600";
      case "pending":
        return "text-orange-500";
      case "cancelled":
        return "text-red-500";
      default:
        return "text-slate-600";
    }
  };

  const getStatutLabel = (statut: string, appointmentStatus?: string) => {
    // Si l'appointment est remboursé, afficher "Remboursé"
    if (appointmentStatus === "refunded") {
      return t("revenue.refunded");
    }
    switch (statut) {
      case "completed":
        return t("paymentHistory.completed");
      case "pending":
        return t("paymentHistory.pending");
      case "cancelled":
        return t("paymentHistory.cancelled");
      default:
        return statut;
    }
  };

  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col font-figtree">
        {/* Header mobile */}
        <div className="flex items-center justify-between p-4 border-b border-light-blue-gray">
          <Button
            onClick={onBack}
            className="bg-white shadow-none flex items-center gap-2 text-exford-blue"
            label=""
            icon={<ChevronLeftIcon />}
          />
          <h1 className="text-lg font-medium text-exford-blue">
            {t("paymentHistory.transactionDetails")}
          </h1>
          <div className="w-6"></div> {/* Spacer pour centrer le titre */}
        </div>

        {/* Contenu mobile */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Montant */}
          <div className="flex justify-between items-center py-4 border-b border-light-blue-gray">
            <span className="text-base font-semibold text-exford-blue">
              {t("paymentHistory.amount")}
            </span>
            <span className="text-base font-bold text-exford-blue">
              {montant}
            </span>
          </div>

          {/* Session */}
          <div className="flex justify-between items-center py-4 border-b border-light-blue-gray">
            <span className="text-base font-semibold text-exford-blue">
              {t("paymentHistory.session")}
            </span>
            <span className="text-base font-medium text-exford-blue text-right max-w-[200px]">
              {session}
            </span>
          </div>

          {/* Expert */}
          <div className="flex justify-between items-center py-4 border-b border-light-blue-gray">
            <span className="text-base font-semibold text-exford-blue">
              {t("paymentHistory.expert")}
            </span>
            <span className="text-base font-medium text-exford-blue text-right max-w-[200px]">
              {expert}
            </span>
          </div>

          {/* Date et heure */}
          <div className="flex justify-between items-center py-4 border-b border-light-blue-gray">
            <span className="text-base font-semibold text-exford-blue">
              {t("paymentHistory.dateTime")}
            </span>
            <span className="text-base font-medium text-exford-blue text-right max-w-[200px]">
              {dateHeure}
            </span>
          </div>

          {/* Statut */}
          <div className="flex justify-between items-center py-4 border-b border-light-blue-gray">
            <span className="text-base font-semibold text-exford-blue">
              {t("paymentHistory.status")}
            </span>
            <span
              className={`text-base font-normal ${getStatutColor(
                statut,
                appointmentStatus
              )}`}
            >
              {getStatutLabel(statut, appointmentStatus)}
            </span>
          </div>

          {/* ID */}
          <div className="flex justify-between items-center py-4">
            <span className="text-base font-semibold text-exford-blue">
              {t("paymentHistory.transactionId")}
            </span>
            <span className="text-base font-normal text-slate-600 font-mono text-right max-w-[200px] break-all">
              {id}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Vue desktop
  return (
    <div className="w-full max-w-[412px] h-[392px] bg-white border border-light-blue-gray rounded-[16px] p-6">
      <div className="space-y-6">
        {/* Montant */}
        <div className="flex justify-between items-center pb-4 border-b border-light-blue-gray">
          <span className="text-base font-semibold text-exford-blue">
            {t("paymentHistory.amount")}
          </span>
          <span className="text-base font-bold text-exford-blue">
            {montant}
          </span>
        </div>

        {/* Session */}
        <div className="flex justify-between items-center pb-4 border-b border-light-blue-gray">
          <span className="text-base font-semibold text-exford-blue">
            {t("paymentHistory.session")}
          </span>
          <span className="text-base font-normal text-exford-blue text-right max-w-[200px]">
            {session}
          </span>
        </div>

        {/* Expert */}
        <div className="flex justify-between items-center pb-4 border-b border-light-blue-gray">
          <span className="text-base font-semibold text-exford-blue">
            {t("paymentHistory.expert")}
          </span>
          <span className="text-base font-normal text-exford-blue text-right max-w-[200px]">
            {expert}
          </span>
        </div>

        {/* Date et heure */}
        <div className="flex justify-between items-center pb-4 border-b border-light-blue-gray">
          <span className="text-base font-semibold text-exford-blue">
            {t("paymentHistory.dateTime")}
          </span>
          <span className="text-base font-normal text-exford-blue text-right max-w-[200px]">
            {dateHeure}
          </span>
        </div>

        {/* Statut */}
        <div className="flex justify-between items-center pb-4 border-b border-light-blue-gray">
          <span className="text-base font-semibold text-exford-blue">
            {t("paymentHistory.status")}
          </span>
          <span
            className={`text-base font-normal ${getStatutColor(
              statut,
              appointmentStatus
            )}`}
          >
            {getStatutLabel(statut, appointmentStatus)}
          </span>
        </div>

        {/* ID */}
        <div className="flex justify-between items-center">
          <span className="text-base font-semibold text-exford-blue">
            {t("paymentHistory.transactionId")}
          </span>
          <span className="text-base font-normal text-slate-600 font-mono text-right max-w-[200px] break-all">
            {id}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;
