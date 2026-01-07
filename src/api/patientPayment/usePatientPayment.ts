import { supabase } from "@/lib/supabase/client";
import { getSupabaseFunctionErrorMessage } from "@/lib/supabase/handleFunctionError";
import { useCurrentUserData } from "@/store/useCurrentUser";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";

// Types pour les transactions de paiement
export interface PaymentTransaction {
  id: string;
  amount: number;
  currency: string;
  status: "succeeded" | "pending" | "failed";
  created: number;
  description: string;
  receipt_url: string;
  appointment: {
    id: string;
    appointment_at: string;
    status: "confirmed" | "pending" | "cancelled" | "completed" | "refunded";
    pro: {
      id: string;
      first_name: string;
      last_name: string;
      job: string;
      avatar: string;
      domains: {
        name: string;
      };
    };
  };
}

export interface PaymentResponse {
  transactions: PaymentTransaction[];
}

// Interface pour les données transformées pour l'affichage
export interface TransactionDisplay {
  id: string;
  title: string;
  date: string;
  amount: string;
  expert: string;
  dateHeure: string;
  statut: "completed" | "pending" | "cancelled";
  transactionId: string;
  session: string;
  receiptUrl?: string;
  appointmentStatus?: string; // Pour gérer l'affichage de "Remboursé"
}

// Hook pour récupérer l'historique des paiements du patient
export const usePatientPaymentHistory = () => {
  const { currentUser } = useCurrentUserData();
  const currentPatientId = currentUser?.id;

  const query = useQuery<PaymentTransaction[], Error>({
    queryKey: ["patient-payment-history"],
    queryFn: async () => {
      if (!currentPatientId) return [];

      try {
        // Utiliser Supabase Functions pour récupérer l'historique des paiements
        const { data, error } = await supabase.functions.invoke(
          "patient-payment",
          {
            method: "GET",
          }
        );

        if (error) {
          const errorMessage = await getSupabaseFunctionErrorMessage(error);
          throw new Error(errorMessage);
        }

        // Retourner directement le tableau de transactions
        return (data as PaymentResponse).transactions || [];
      } catch (error: any) {
        // Si c'est déjà une Error avec message, la relancer
        if (error instanceof Error) {
          throw error;
        }
        throw new Error(
          "Une erreur est survenue lors de la récupération de l'historique des paiements"
        );
      }
    },
    enabled: !!currentPatientId,
  });

  return query;
};

// Fonction utilitaire pour transformer les données API en format d'affichage
export const transformTransactionForDisplay = (
  transaction: PaymentTransaction,
  t: (key: string) => string,
  currentLocale: string
): TransactionDisplay => {
  // Formatage du montant avec Intl.NumberFormat
  const locale = currentLocale === "fr" ? "fr-FR" : "en-US";
  const formattedAmount = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: transaction.currency.toUpperCase(),
  }).format(transaction.amount); // amount est déjà en euros

  // Formatage de la date de création (timestamp Unix)
  const createdDate = new Date(transaction.created * 1000);
  const formattedDate = createdDate.toLocaleDateString(locale);
  const formattedDateTime = createdDate.toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Nom complet de l'expert
  const expertName =
    `${transaction.appointment.pro.first_name} ${transaction.appointment.pro.last_name}`.trim();

  // Mapping du statut
  const statusMapping: Record<string, "completed" | "pending" | "cancelled"> = {
    succeeded: "completed",
    pending: "pending",
    failed: "cancelled",
  };
  const statut = statusMapping[transaction.status] || "pending";

  // Titre de la transaction
  const title = `${t("paymentHistory.paymentConsultationWith")} ${expertName}`;

  // Type de session basé sur la description ou le job de l'expert
  const session = transaction.appointment.pro.job || "Consultation";

  return {
    id: transaction.id,
    title,
    date: formattedDate,
    amount: formattedAmount,
    expert: expertName,
    dateHeure: formattedDateTime,
    statut,
    transactionId: transaction.id,
    session,
    receiptUrl: transaction.receipt_url,
    appointmentStatus: transaction.appointment.status, // Pour gérer l'affichage de "Remboursé"
  };
};

// Hook pour récupérer et transformer les données pour l'affichage
export const usePatientPaymentHistoryDisplay = () => {
  const { data: transactions, ...queryResult } = usePatientPaymentHistory();
  const t = useTranslations();
  const currentLocale = useLocale();

  // Trier les transactions du plus récent au plus ancien avant de les transformer
  const sortedTransactions =
    transactions?.sort((a, b) => b.created - a.created) || [];

  const transformedData = sortedTransactions.map((transaction) =>
    transformTransactionForDisplay(transaction, t, currentLocale)
  );

  return {
    ...queryResult,
    data: transformedData,
    transactions: transformedData,
  };
};
