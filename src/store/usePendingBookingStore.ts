import {
  PendingBooking,
  clearPendingBookingStorage,
  getPendingBookingFromStorage,
  savePendingBooking,
} from "@/utils/pendingBooking";
import { create } from "zustand";

type PendingBookingInput = Omit<PendingBooking, "createdAt" | "expiresAt">;

interface PendingBookingStore {
  pendingBooking: PendingBooking | null;
  setPendingBooking: (booking: PendingBookingInput) => void;
  hydratePendingBooking: () => PendingBooking | null;
  clearPendingBooking: () => void;
}

export const usePendingBookingStore = create<PendingBookingStore>((set) => ({
  pendingBooking: null,
  setPendingBooking: (booking) => {
    const saved = savePendingBooking(booking);
    set({ pendingBooking: saved });
  },
  hydratePendingBooking: () => {
    const booking = getPendingBookingFromStorage();
    set({ pendingBooking: booking });
    return booking;
  },
  clearPendingBooking: () => {
    clearPendingBookingStorage();
    set({ pendingBooking: null });
  },
}));

