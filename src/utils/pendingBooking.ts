const PENDING_BOOKING_STORAGE_KEY = "pendingBooking";
const DEFAULT_PENDING_BOOKING_TTL_MS = 1000 * 60 * 45; // 45 minutes

export interface PendingBooking {
  pro_id: string;
  session_id: string;
  appointment_at: string;
  promo_code?: string;
  returnUrl: string;
  createdAt: number;
  expiresAt: number;
}

const isBrowser = () => typeof window !== "undefined";

const isValidPendingBooking = (value: unknown): value is PendingBooking => {
  if (!value || typeof value !== "object") return false;

  const candidate = value as PendingBooking;

  return (
    typeof candidate.pro_id === "string" &&
    typeof candidate.session_id === "string" &&
    typeof candidate.appointment_at === "string" &&
    typeof candidate.returnUrl === "string" &&
    typeof candidate.createdAt === "number" &&
    typeof candidate.expiresAt === "number"
  );
};

export const clearPendingBookingStorage = () => {
  if (!isBrowser()) return;
  localStorage.removeItem(PENDING_BOOKING_STORAGE_KEY);
};

export const savePendingBooking = (
  booking: Omit<PendingBooking, "createdAt" | "expiresAt">,
  ttlMs = DEFAULT_PENDING_BOOKING_TTL_MS
) => {
  if (!isBrowser()) return null;

  const createdAt = Date.now();
  const payload: PendingBooking = {
    ...booking,
    createdAt,
    expiresAt: createdAt + ttlMs,
  };

  localStorage.setItem(PENDING_BOOKING_STORAGE_KEY, JSON.stringify(payload));
  return payload;
};

export const getPendingBookingFromStorage = (): PendingBooking | null => {
  if (!isBrowser()) return null;

  const raw = localStorage.getItem(PENDING_BOOKING_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (!isValidPendingBooking(parsed)) {
      clearPendingBookingStorage();
      return null;
    }

    if (Date.now() > parsed.expiresAt) {
      clearPendingBookingStorage();
      return null;
    }

    return parsed;
  } catch {
    clearPendingBookingStorage();
    return null;
  }
};

