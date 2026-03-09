"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button as ButtonUI } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useConversationStore } from "@/store/useConversationStore";
import { X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "./Button";
import { LoadingSpinner } from "./LoadingSpinner";

interface AppointmentQuestion {
  id: number | string;
  question: string;
  created_at: string;
  updated_at: string;
  appointment_id: number | string;
}

interface SessionModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: React.ReactNode;
  profileImage: string;
  name: string;
  sessionDescription: string;
  isUpcoming?: boolean;
  onAccept?: () => void;
  onCancel?: () => void;
  questions?: AppointmentQuestion[];
  loadingState?: "confirming" | "cancelling" | null;
  appointmentAt?: string;
  conversationParticipantId?: string;
}

export const SessionModal: React.FC<SessionModalProps> = ({
  isOpen,
  onOpenChange,
  trigger,
  profileImage,
  name,
  sessionDescription,
  isUpcoming = false,
  onAccept,
  onCancel,
  questions = [],
  loadingState = null,
  appointmentAt,
  conversationParticipantId,
}) => {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const { setSelectedConversation, setSelectedProfessional } =
    useConversationStore();

  // Détermine le titre du modal selon le contexte
  const modalTitle = isUpcoming
    ? t("visios.sessionDetail")
    : t("visios.pendingRequest");

  const handleOpenChat = () => {
    if (conversationParticipantId) {
      setSelectedProfessional({
        id: conversationParticipantId,
        name,
        title: sessionDescription,
        avatar: profileImage,
      });
      setSelectedConversation(conversationParticipantId);

      const params = new URLSearchParams({
        receiverId: conversationParticipantId,
        name,
        title: sessionDescription,
        avatar: profileImage,
      });
      sessionStorage.setItem(
        "pendingConversation",
        JSON.stringify({
          receiverId: conversationParticipantId,
          name,
          title: sessionDescription,
          avatar: profileImage,
        })
      );
      onOpenChange(false);
      router.push(`/${locale}/messages?${params.toString()}`);
      return;
    }
    onOpenChange(false);
    router.push(`/${locale}/messages`);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[478px] p-0 !bg-white [&>button]:hidden border-l border-light-blue-gray shadow-none"
      >
        <SheetHeader className="p-6 pb-4 border-b border-light-blue-gray bg-white">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-semibold text-gray-900">
              {modalTitle}
            </SheetTitle>
            <SheetClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
              <X className="h-4 w-4 cursor-pointer" />
              <span className="sr-only">{t("visios.close")}</span>
            </SheetClose>
          </div>
        </SheetHeader>

        <div className="p-6 space-y-6 bg-white min-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Requested by section */}
          <div>
            <p className="text-sm text-slate-gray font-medium font-figtree mb-3">
              {t("visios.requestedBy")}
            </p>
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={profileImage} alt={name} />
                <AvatarFallback>
                  {name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold text-gunmetal-gray text-sm font-figtree">
                  {name}
                </p>
              </div>
            </div>
          </div>

          {/* Session details */}
          <div>
            <p className="text-xs font-figtree font-medium text-slate-gray mb-2">
              {t("visios.sessionName")}
            </p>
            <p className="text-sm text-gunmetal-gray font-bold font-figtree">
              {sessionDescription}
            </p>
          </div>

          {/* Questions section */}
          {questions.length > 0 && (
            <div>
              <p className="text-xs font-figtree font-medium text-slate-gray mb-2">
                {t("visios.questionsComments")}
              </p>
              <div className="space-y-3">
                {questions.map((question) => (
                  <div
                    key={question.id}
                    className="bg-snow-blue rounded-[8px] p-4"
                  >
                    <p className="text-sm text-gray-700 font-figtree font-normal leading-relaxed">
                      {question.question}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action buttons - Fixed at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-none">
          <div className="flex flex-col space-y-3">
            {isUpcoming ? (
              // Modal pour "A venir" - Bouton Commencer la visio + Annuler
              <>
                <ButtonUI
                  variant="outline"
                  className="w-full h-14 text-exford-blue font-bold border-gray-300 hover:bg-gray-50 bg-transparent font-figtree cursor-pointer"
                  onClick={handleOpenChat}
                >
                  <Image
                    src="/assets/icons/chatDots.svg"
                    alt={t("sessionDetail.sendMessage")}
                    width={20}
                    height={20}
                  />
                  {t("sessionDetail.sendMessage")}
                </ButtonUI>
                <ButtonUI
                  className="w-full bg-cobalt-blue hover:bg-cobalt-blue/80 h-14 text-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => {
                    onAccept?.();
                    onOpenChange(false);
                  }}
                  disabled={
                    appointmentAt ? new Date(appointmentAt) > new Date() : false
                  }
                >
                  <Image
                    src="/assets/icons/videocamera.svg"
                    alt="camera"
                    width={24}
                    height={24}
                  />
                  {t("visios.startVideo")}
                </ButtonUI>
              </>
            ) : (
              // Modal pour "En attente" - Refuser + Accepter côte à côte
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  className="flex-1 text-charcoal-blue font-figtree font-bold text-xs md:text-base border-none shadow-none hover:bg-gray-50 bg-transparent h-14 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  onClick={() => {
                    onCancel?.();
                    onOpenChange(false);
                  }}
                  disabled={loadingState === "cancelling"}
                  label={
                    loadingState === "cancelling" ? (
                      <div className="flex items-center gap-2">
                        <LoadingSpinner size="sm" />
                        {t("visios.cancelling")}
                      </div>
                    ) : (
                      t("visios.refuse")
                    )
                  }
                />

                <Button
                  className="flex-1 bg-cobalt-blue hover:bg-cobalt-blue/80 rounded-[8px] shadow-none text-white font-figtree font-bold text-xs md:text-base h-14 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => {
                    onAccept?.();
                    onOpenChange(false);
                  }}
                  disabled={loadingState === "confirming"}
                  label={
                    loadingState === "confirming" ? (
                      <div className="flex items-center gap-2">
                        <LoadingSpinner size="sm" />
                        {t("visios.confirming")}
                      </div>
                    ) : (
                      t("accept")
                    )
                  }
                />
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
