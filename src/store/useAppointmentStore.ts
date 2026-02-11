import { create } from "zustand";

type Appointment = {
  id: string;
  patient_id: string;
  pro_id: string;
  session_id: string;
  appointment_at: string;
  status: string;
  created_at: string;
  updated_at: string;
};

type Payment = {
  paymentIntent: string;
  ephemeralKey: string;
  customer: string;
  publishableKey: string;
};

type Promo = {
  code: string;
  valid?: boolean;
  promotion_code?: {
    coupon?: {
      percent_off?: number | null;
      amount_off?: number | null;
      currency?: string | null;
    };
  };
  [key: string]: any;
};

type AppointmentState = {
  appointment: Appointment | null;
  payment: Payment | null;
  promo: Promo | null;
  setAppointmentData: (
    appointment: Appointment,
    payment: Payment,
    promo?: Promo | null
  ) => void;
  clearAppointmentData: () => void;
};

export const useAppointmentStore = create<AppointmentState>((set) => ({
  appointment: null,
  payment: null,
  promo: null,
  setAppointmentData: (appointment, payment, promo) =>
    set({ appointment, payment, promo: promo ?? null }),
  clearAppointmentData: () => set({ appointment: null, payment: null, promo: null }),
}));
