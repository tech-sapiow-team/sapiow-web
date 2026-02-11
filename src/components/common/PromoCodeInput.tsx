"use client";

import { verifyPromoCode } from "@/api/promoCode/promoCode";
import { cn } from "@/lib/utils";
import { Check, Loader2, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type PromoCodeVerifyResponse = {
  valid?: boolean;
  [key: string]: any;
};

export type PromoCodeResult = PromoCodeVerifyResponse & {
  code: string;
};

interface PromoCodeInputProps {
  onPromoResult: (result: PromoCodeResult | null) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
  disabled?: boolean;
}

export function PromoCodeInput({
  onPromoResult,
  placeholder = "Entrer un code PROMO",
  debounceMs = 800,
  className,
  disabled,
}: PromoCodeInputProps) {
  const [promoCode, setPromoCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PromoCodeVerifyResponse | null>(null);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestCodeRef = useRef<string>("");
  const requestSeqRef = useRef(0);

  const normalizedPromoCode = useMemo(
    () => promoCode.trim().toUpperCase(),
    [promoCode]
  );

  const validatePromoCode = useCallback(
    async (code: string) => {
      const requestId = ++requestSeqRef.current;
      setIsLoading(true);

      try {
        const res = await verifyPromoCode<PromoCodeVerifyResponse>(code);

        // Éviter les mises à jour "en retard" si l'utilisateur a retapé entre temps
        if (requestId !== requestSeqRef.current) return;
        if (code !== latestCodeRef.current) return;

        setResult(res);
        onPromoResult(res?.valid ? ({ ...(res as any), code } as PromoCodeResult) : null);
      } catch (error) {
        if (requestId !== requestSeqRef.current) return;
        if (code !== latestCodeRef.current) return;

        setResult({ valid: false });
        onPromoResult(null);
      } finally {
        if (requestId !== requestSeqRef.current) return;
        setIsLoading(false);
      }
    },
    [onPromoResult]
  );

  const handlePromoCodeChange = (value: string) => {
    const next = value.toUpperCase();
    setPromoCode(next);
    setResult(null);
    onPromoResult(null);

    // Annuler le timer précédent
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    const normalized = next.trim();
    latestCodeRef.current = normalized;

    if (!normalized) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    debounceTimer.current = setTimeout(() => {
      validatePromoCode(normalized);
    }, debounceMs);
  };

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  return (
    <div className={cn("w-full", className)}>
      <div className="relative">
        <input
          value={promoCode}
          onChange={(e) => handlePromoCodeChange(e.target.value)}
          placeholder={placeholder}
          autoCapitalize="characters"
          inputMode="text"
          disabled={disabled}
          className={cn(
            "w-full h-14 rounded-xl border border-gray-200 bg-gray-50 px-4 pr-12 font-figtree text-sm sm:text-base text-gray-900 placeholder:text-gray-400",
            "focus:outline-none focus:ring-2 focus:ring-cobalt-blue/30 focus:border-cobalt-blue",
            disabled && "opacity-60 cursor-not-allowed"
          )}
          aria-label="Code promo"
          aria-invalid={result?.valid === false ? true : undefined}
        />

        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-cobalt-blue" />
          ) : result?.valid === true ? (
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-cobalt-blue/10">
              <Check className="w-4 h-4 text-cobalt-blue" />
            </span>
          ) : result?.valid === false ? (
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-500/10">
              <X className="w-4 h-4 text-red-500" />
            </span>
          ) : null}
        </div>
      </div>

      {/* Petit feedback optionnel, utile sur mobile */}
      {result?.valid === true ? (
        <p className="mt-2 text-xs text-green-700 font-figtree">
          Code appliqué : <span className="font-semibold">{normalizedPromoCode}</span>
        </p>
      ) : result?.valid === false ? (
        <p className="mt-2 text-xs text-red-600 font-figtree">
          Code promo invalide
        </p>
      ) : null}
    </div>
  );
}

