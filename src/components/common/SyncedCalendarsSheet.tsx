"use client";

import { useGoogleCalendarDisconnect } from "@/api/google-calendar-sync/useGoogleCalendarSync";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Button } from "./Button";
import GoogleCalendarConnectButton from "./GoogleCalendarConnectButton";

interface SyncedCalendarsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  connectedEmail?: string;
  isConnected: boolean;
}

export default function SyncedCalendarsSheet({
  isOpen,
  onClose,
  connectedEmail,
  isConnected,
}: SyncedCalendarsSheetProps) {
  const t = useTranslations();
  const disconnectMutation = useGoogleCalendarDisconnect();

  const handleDisconnect = async () => {
    try {
      await disconnectMutation.mutateAsync();
      console.log("✅ Calendrier déconnecté avec succès");
    } catch (error) {
      console.error("❌ Erreur lors de la déconnexion:", error);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[478px] overflow-y-auto bg-white border-none"
      >
        <SheetHeader className="pb-6">
          <SheetTitle className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-4">
            {t("syncedCalendars.title")}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-4 px-6">
          {/* Calendrier connecté */}
          {isConnected && connectedEmail ? (
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white">
              <div className="flex items-center gap-3">
                <Image
                  src="/assets/icons/googleCalendar.svg"
                  width={40}
                  height={40}
                  alt="Google Calendar"
                  className="flex-shrink-0"
                />
                <span className="text-sm font-medium font-figtree text-gray-900">
                  {connectedEmail}
                </span>
              </div>
              <Button
                label={
                  disconnectMutation.isPending
                    ? t("syncedCalendars.disconnecting")
                    : t("syncedCalendars.disconnect")
                }
                onClick={handleDisconnect}
                disabled={disconnectMutation.isPending}
                className="text-sm font-semibold font-figtree text-gray-900 bg-white border border-gray-300 hover:bg-gray-50"
              />
            </div>
          ) : null}

          {/* Bouton Ajouter un calendrier */}
          {/* <button
            onClick={() => {
              // Si déjà connecté, on ne fait rien pour l'instant
              // Sinon, on peut ouvrir le flux de connexion
              if (!isConnected) {
                onClose();
              }
            }}
            className="w-full flex items-center justify-center gap-2 p-4 border border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Plus className="h-5 w-5 text-gray-700" />
            <span className="text-sm font-semibold font-figtree text-gray-900">
              {t("syncedCalendars.addCalendar")}
            </span>
          </button> */}

          {/* Si pas connecté, afficher le bouton de connexion */}
          {!isConnected && (
            <div className="pt-4">
              <GoogleCalendarConnectButton 
                className="w-full"
                redirectPath="/compte/disponibilites"
              >
                {t("disponibilites.connect")}
              </GoogleCalendarConnectButton>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
