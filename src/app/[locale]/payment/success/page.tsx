"use client";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { withAuth } from "@/components/common/withAuth";
import { usePayStore } from "@/store/usePay";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setIsPaid } = usePayStore();
  const t = useTranslations();

  useEffect(() => {
    // Marquer comme payé
    setIsPaid(true);

    // Récupérer l'URL de retour et rediriger
    const returnUrl = searchParams.get("returnUrl") || "/details";

    // Petit délai pour s'assurer que l'état est mis à jour
    setTimeout(() => {
      router.push(returnUrl);
    }, 1000);
  }, [setIsPaid, router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <LoadingScreen
          message={`${t("payment.success")} - ${t("payment.redirecting")}`}
          size="xl"
          fullScreen={false}
        />
      </div>
    </div>
  );
}

export default withAuth(PaymentSuccessPage);
