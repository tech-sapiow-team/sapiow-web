"use client";

import { useCreatePatientAppointment } from "@/api/appointments/useAppointments";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { withAuth } from "@/components/common/withAuth";
import { useAppointmentStore } from "@/store/useAppointmentStore";
import { usePayStore } from "@/store/usePay";
import { usePendingBookingStore } from "@/store/usePendingBookingStore";
import { usePlaningStore } from "@/store/usePlaning";
import { showToast } from "@/utils/toast";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const RESUME_LOCK_KEY = "bookingResumeInFlight";
const RESUME_LOCK_MAX_AGE_MS = 90 * 1000;

const acquireResumeLock = () => {
  if (typeof window === "undefined") return false;

  const raw = sessionStorage.getItem(RESUME_LOCK_KEY);
  if (raw) {
    const lockAt = Number(raw);
    const isFresh = Number.isFinite(lockAt) && Date.now() - lockAt < RESUME_LOCK_MAX_AGE_MS;
    if (isFresh) return false;
  }

  sessionStorage.setItem(RESUME_LOCK_KEY, String(Date.now()));
  return true;
};

const releaseResumeLock = () => {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(RESUME_LOCK_KEY);
};

function BookingResumePage() {
  const t = useTranslations();
  const router = useRouter();
  const hasStartedRef = useRef(false);
  const { setAppointmentData } = useAppointmentStore();
  const { setIsPaid } = usePayStore();
  const { setIsPlaning } = usePlaningStore();
  const { consumePendingBooking } = usePendingBookingStore();
  const createAppointmentMutation = useCreatePatientAppointment();

  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    const hasLock = acquireResumeLock();
    if (!hasLock) return;

    const pendingBooking = consumePendingBooking();
    if (!pendingBooking) {
      releaseResumeLock();
      router.replace("/");
      return;
    }

    const resumeBooking = async () => {
      try {
        const result: any = await createAppointmentMutation.mutateAsync({
          pro_id: pendingBooking.pro_id,
          session_id: pendingBooking.session_id,
          appointment_at: pendingBooking.appointment_at,
          ...(pendingBooking.promo_code
            ? { promo_code: pendingBooking.promo_code }
            : {}),
        });

        if (result?.appointment && result?.payment) {
          const promoForStore = pendingBooking.promo_code
            ? { code: pendingBooking.promo_code, valid: true }
            : null;
          setAppointmentData(result.appointment, result.payment, promoForStore);
          router.replace(
            `/payment?returnUrl=${encodeURIComponent(pendingBooking.returnUrl)}`
          );
          return;
        }

        if (result?.appointment && !result?.payment) {
          setIsPaid(true);
          router.replace(pendingBooking.returnUrl);
          return;
        }

        router.replace(pendingBooking.returnUrl);
      } catch (error) {
        console.error("Error while resuming booking flow:", error);
        setIsPlaning(true);
        showToast.errorDirect(t("booking.resume.slotUnavailable"));
        router.replace(pendingBooking.returnUrl);
      } finally {
        releaseResumeLock();
      }
    };

    void resumeBooking();
  }, [
    createAppointmentMutation,
    consumePendingBooking,
    router,
    setAppointmentData,
    setIsPaid,
    setIsPlaning,
    t,
  ]);

  return <LoadingScreen message={t("booking.resume.processing")} size="lg" />;
}

export default withAuth(BookingResumePage);

