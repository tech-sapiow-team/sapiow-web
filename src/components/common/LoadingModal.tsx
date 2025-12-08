"use client";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface LoadingModalProps {
  isOpen: boolean;
  message?: string;
}

export const LoadingModal = ({ isOpen, message }: LoadingModalProps) => {
  const t = useTranslations();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-8">
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-12 w-12 text-cobalt-blue animate-spin" />
          {message && (
            <p className="text-lg text-exford-blue font-medium text-center">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
