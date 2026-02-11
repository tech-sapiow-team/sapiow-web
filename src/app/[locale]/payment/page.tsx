"use client";
import { useGetProExpertById } from "@/api/proExpert/useProExpert";
import { withAuth } from "@/components/common/withAuth";
import { useRouter } from "@/i18n/navigation";
import { useAppointmentStore } from "@/store/useAppointmentStore";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ChevronLeft } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React, { useMemo, useState } from "react";

// Composant récapitulatif de commande
function OrderSummary() {
  const t = useTranslations();
  const locale = useLocale();
  const { appointment, promo } = useAppointmentStore();
  const router = useRouter();

  // Récupérer les données de l'expert
  const { data: expertData } = useGetProExpertById(appointment?.pro_id || "");

  // Trouver la session correspondante dans les sessions de l'expert
  const sessionData = useMemo(() => {
    if (!expertData?.sessions || !appointment?.session_id) return null;
    return expertData.sessions.find(
      (session: any) => session.id === appointment.session_id
    );
  }, [expertData, appointment]);

  const sessionPrice = sessionData?.price || 0;
  const serviceFeeRate = 0.15;
  const serviceFee = Math.round(sessionPrice * serviceFeeRate * 100) / 100;
  const tax = 0; // Pas de taxe pour le moment

  const moneyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    [locale]
  );

  const serviceFeeDiscount = useMemo(() => {
    if (!promo?.valid) return 0;

    const coupon = promo?.promotion_code?.coupon;
    const percentOff = coupon?.percent_off;
    const amountOff = coupon?.amount_off;

    let discount = 0;
    if (typeof percentOff === "number" && Number.isFinite(percentOff)) {
      discount = (serviceFee * percentOff) / 100;
    } else if (typeof amountOff === "number" && Number.isFinite(amountOff)) {
      // Stripe: amount_off est en cents (pour eur/usd, etc.)
      discount = amountOff / 100;
    }

    if (!Number.isFinite(discount) || discount <= 0) return 0;
    return Math.min(serviceFee, discount);
  }, [promo, serviceFee]);

  const serviceFeeAfterDiscount = Math.max(0, serviceFee - serviceFeeDiscount);
  const total = sessionPrice + serviceFeeAfterDiscount + tax;

  return (
    <div className="w-full lg:w-1/2 bg-gray-50 p-6 lg:p-8">
      {/* Logo Sapiow */}

      {/* Bouton retour */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 cursor-pointer"
      >
        <ChevronLeft size={20} />
        <span className="text-sm font-medium">Retour</span>
      </button>

      <div className="flex items-center gap-2 mb-6">
        <Image
          src="/assets/iconSidebare/logo.svg"
          alt="Sapiow Logo"
          width={48}
          height={44}
        />
      </div>
      {/* Titre */}
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        {t("paymentPage.orderSummary")}
      </h2>

      {/* Détails de la session */}
      <div className="bg-white rounded-lg p-4 mb-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">
              {sessionData?.name || t("paymentPage.sessionWith")}{" "}
              {expertData?.first_name} {expertData?.last_name}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {t("paymentPage.quantity")} 1
            </p>
          </div>
          <p className="text-sm font-semibold text-gray-900">
            €{moneyFormatter.format(sessionPrice)}
          </p>
        </div>
      </div>

      {/* Totaux */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{t("paymentPage.subtotal")}</span>
          <span className="text-gray-900 font-medium">
            €{moneyFormatter.format(sessionPrice)}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{t("offers.serviceFee")}</span>
          <span className="text-gray-900 font-medium">
            €{moneyFormatter.format(serviceFee)}
          </span>
        </div>

        {promo?.valid && serviceFeeDiscount > 0 ? (
          <div className="flex justify-between text-sm">
            <span className="text-cobalt-blue font-medium">
              {t("offers.discount")}{" "}
              <span className="font-semibold">({promo.code})</span>
            </span>
            <span className="text-cobalt-blue font-medium">
              -€{moneyFormatter.format(serviceFeeDiscount)}
            </span>
          </div>
        ) : null}

        <div className="h-px bg-gray-200"></div>
        <div className="flex justify-between">
          <span className="text-base font-bold text-gray-900">
            {t("paymentPage.totalAmount")}
          </span>
          <span className="text-base font-bold text-gray-900">
            €{moneyFormatter.format(total)}
          </span>
        </div>
      </div>
    </div>
  );
}

// Formulaire de paiement
function CheckoutForm() {
  const t = useTranslations();
  const [loading, setLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const searchParams = useSearchParams();

  const returnUrl = searchParams.get("returnUrl") || "/details";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!stripe || !elements) return;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${
          window.location.origin
        }/payment/success?returnUrl=${encodeURIComponent(returnUrl)}`,
      },
    });

    if (error) {
      console.error(error.message);
      setLoading(false);
      alert(`${t("paymentPage.paymentError")}: ${error.message}`);
    }
  };

  return (
    <div className="w-full lg:w-1/2 bg-white p-6 lg:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Stripe Payment Element */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <PaymentElement
            options={{
              layout: "tabs",
            }}
            onChange={(e) => {
              setIsComplete(e.complete);
            }}
          />
        </div>

        {/* Bouton de paiement */}
        <button
          type="submit"
          disabled={!stripe || loading || !isComplete}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          {loading ? t("paymentPage.loading") : t("paymentPage.pay")}
        </button>
      </form>
    </div>
  );
}

// Page principale
function PaymentPage() {
  const t = useTranslations();
  const { payment, appointment } = useAppointmentStore();

  if (!payment || !appointment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">{t("paymentPage.loading")}</p>
      </div>
    );
  }

  const stripePromise = loadStripe(payment.publishableKey);

  return (
    <div className="flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-[1440px] flex flex-col lg:flex-row">
        {/* Récapitulatif de commande - Gauche */}
        <OrderSummary />

        {/* Formulaire de paiement - Droite */}
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret: payment.paymentIntent,
            appearance: {
              theme: "stripe",
              variables: {
                colorPrimary: "#10b981",
              },
            },
          }}
        >
          <CheckoutForm />
        </Elements>
      </div>
    </div>
  );
}

export default withAuth(PaymentPage);
