"use client";
import {
  useCancelPatientAppointment,
  useDeleteAppointmentQuestion,
  useSubmitAppointmentQuestion,
  useUpdateAppointmentQuestion,
  type AppointmentQuestion,
} from "@/api/appointments/useAppointments";
import BookedSessionCard from "@/components/common/BookedSessionCard";
import { CancelAppointmentModal } from "@/components/common/CancelAppointmentModal";
import { Button as ButtonUI } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAddToCalendar } from "@/hooks/useAddToCalendar";
import { useCallStore } from "@/store/useCall";
import { useConversationStore } from "@/store/useConversationStore";
import { Check, ChevronRight, Pencil, Send, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../common/Button";

interface SessionData {
  id: string;
  proId: string;
  professionalName: string;
  professionalTitle: string;
  profileImage: string;
  sessionType: string;
  duration: string;
  date: string;
  time: string;
  status: string;
  price: number;
  appointment_questions?: AppointmentQuestion[];
  appointment_at: string; // Date ISO originale
}

interface SessionDetailSheetProps {
  session: SessionData | null;
  isOpen: boolean;
  onClose: () => void;
  onStartVideoCall?: (appointmentId: string) => void;
}

export function SessionDetailSheet({
  session,
  isOpen,
  onClose,
  onStartVideoCall,
}: SessionDetailSheetProps) {
  console.log({ session });
  const t = useTranslations();
  const { setCallCreatorName } = useCallStore();
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const { setSelectedConversation, setSelectedProfessional } =
    useConversationStore();
  const { handleAddToCalendar } = useAddToCalendar();

  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [localQuestions, setLocalQuestions] = useState<AppointmentQuestion[]>(
    []
  );
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(
    null
  );
  const [editingQuestionText, setEditingQuestionText] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);

  const submitQuestionMutation = useSubmitAppointmentQuestion();
  const updateQuestionMutation = useUpdateAppointmentQuestion();
  const deleteQuestionMutation = useDeleteAppointmentQuestion();
  const cancelAppointmentMutation = useCancelPatientAppointment();

  // Mettre à jour les questions locales quand la session change
  const currentQuestions = session?.appointment_questions || [];
  const allQuestions = [...currentQuestions, ...localQuestions];

  const handleSubmitQuestion = async () => {
    if (!question.trim() || !session) return;

    try {
      await submitQuestionMutation.mutateAsync({
        appointmentId: session.id,
        question: question.trim(),
      });

      // Ajouter la nouvelle question localement pour affichage immédiat
      const newQuestion: AppointmentQuestion = {
        id: Date.now(), // ID temporaire
        question: question.trim(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        appointment_id: session.id,
      };

      setLocalQuestions((prev) => [...prev, newQuestion]);
      setQuestion("");
      setShowQuestionForm(false);
    } catch (error) {
      console.error(t("sessionDetail.questionSubmitError"), error);
    }
  };

  const handleToggleQuestionForm = () => {
    setShowQuestionForm(!showQuestionForm);
    if (showQuestionForm) {
      setQuestion("");
    }
  };

  const handleStartEditQuestion = (questionId: number, currentText: string) => {
    setEditingQuestionId(questionId);
    setEditingQuestionText(currentText);
  };

  const handleCancelEditQuestion = () => {
    setEditingQuestionId(null);
    setEditingQuestionText("");
  };

  const handleSaveEditQuestion = async (questionId: number) => {
    if (!editingQuestionText.trim()) return;

    try {
      await updateQuestionMutation.mutateAsync({
        questionId: questionId,
        question: editingQuestionText.trim(),
      });

      // Mettre à jour la question localement
      setLocalQuestions((prev) =>
        prev.map((q) =>
          q.id === questionId
            ? { ...q, question: editingQuestionText.trim() }
            : q
        )
      );

      setEditingQuestionId(null);
      setEditingQuestionText("");
    } catch (error) {
      console.error(t("sessionDetail.questionUpdateError"), error);
    }
  };

  const handleDeleteQuestion = async (questionId: number) => {
    const confirmed = window.confirm(t("sessionDetail.confirmDeleteQuestion"));
    if (!confirmed) return;

    try {
      await deleteQuestionMutation.mutateAsync(questionId);

      // Supprimer la question localement
      setLocalQuestions((prev) => prev.filter((q) => q.id !== questionId));
    } catch (error) {
      console.error(t("sessionDetail.questionDeleteError"), error);
    }
  };

  const handleCancelAppointment = async () => {
    if (!session?.id) return;

    try {
      await cancelAppointmentMutation.mutateAsync(session.id);
      // Fermer le sheet après annulation réussie
      onClose();

      // Attendre un court instant pour permettre à React Query de mettre à jour le cache
      setTimeout(() => {
        // Forcer un rafraîchissement des données si nécessaire
        window.dispatchEvent(
          new CustomEvent("appointment-cancelled", { detail: session.id })
        );
      }, 100);
    } catch (error) {
      console.error(t("sessionDetail.cancelError"), error);
    }
  };

  const handleOpenChat = () => {
    if (session?.id) {
      // Récupérer l'ID du professionnel depuis les données de session
      const professionalId = session.proId;

      // Stocker les informations du professionnel pour l'affichage
      setSelectedProfessional({
        id: professionalId,
        name: session.professionalName,
        title: session.professionalTitle,
        avatar: session.profileImage,
      });

      setSelectedConversation(professionalId);
      // onClose();
      router.push("/messages");
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[478px] p-0 !bg-white [&>button]:hidden border-l border-light-blue-gray shadow-none flex flex-col"
      >
        <SheetHeader className="p-6 pb-4 border-b border-light-blue-gray bg-white">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-semibold text-gray-900">
              {t("sessionDetail.title")}
            </SheetTitle>
            <SheetClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
              <X className="h-4 w-4 cursor-pointer" />
              <span className="sr-only">Close</span>
            </SheetClose>
          </div>
        </SheetHeader>

        {session && (
          <>
            <div className="flex-1 overflow-y-auto">
              <div className="px-6 py-6 space-y-6 pb-[200px]">
                {/* Card de session réservée */}
                <div>
                  <BookedSessionCard
                    professionalName={session.professionalName}
                    professionalTitle={session.professionalTitle}
                    profileImage={session.profileImage}
                    sessionType={session.sessionType}
                    duration={session.duration}
                    date={session.date}
                    time={session.time}
                    className="max-w-[446px]"
                  />
                </div>

                {/* Section questions */}
                <div>
                  {/* Bloc d'invitation - affiché seulement s'il n'y a pas de questions */}
                  {allQuestions.length === 0 && (
                    <div className="bg-[#E8F2FF] rounded-[8px] p-4">
                      <h1 className="text-exford-blue text-base font-bold font-figtree">
                        {t("sessionDetail.dontHesitateAskQuestions")}
                      </h1>
                      <p className="text-sm text-exford-blue font-figtree font-normal leading-relaxed">
                        {t("sessionDetail.submitQuestionsAdvance")}
                      </p>

                      {!showQuestionForm ? (
                        <Button
                          label={t("sessionDetail.submitMyQuestions")}
                          className="h-[40px] w-full rounded-[8px] mt-2 text-base font-bold font-figtree"
                          onClick={handleToggleQuestionForm}
                        />
                      ) : (
                        <div className="mt-4 space-y-3">
                          <div className="relative">
                            <textarea
                              value={question}
                              onChange={(e) => setQuestion(e.target.value)}
                              placeholder={t("sessionDetail.typeQuestionHere")}
                              className="w-full p-3 pr-12 border border-gray-200 rounded-[8px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              rows={3}
                              disabled={submitQuestionMutation.isPending}
                            />
                            <button
                              onClick={handleSubmitQuestion}
                              disabled={
                                !question.trim() ||
                                submitQuestionMutation.isPending
                              }
                              className="absolute bottom-3 right-3 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <Send className="h-4 w-4" />
                            </button>
                          </div>
                          <button
                            onClick={handleToggleQuestionForm}
                            className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
                            disabled={submitQuestionMutation.isPending}
                          >
                            {t("sessionDetail.cancel")}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Bouton pour ajouter une question si des questions existent déjà */}
                  {allQuestions.length > 0 && (
                    <div className="mb-4">
                      {!showQuestionForm ? (
                        <Button
                          label={t("sessionDetail.addAnotherQuestion")}
                          className="h-[40px] w-full rounded-[8px] text-base font-bold font-figtree"
                          onClick={handleToggleQuestionForm}
                        />
                      ) : (
                        <div className="space-y-3">
                          <div className="relative">
                            <textarea
                              value={question}
                              onChange={(e) => setQuestion(e.target.value)}
                              placeholder={t("sessionDetail.typeQuestionHere")}
                              className="w-full p-3 pr-12 border border-gray-200 rounded-[8px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              rows={3}
                              disabled={submitQuestionMutation.isPending}
                            />
                            <button
                              onClick={handleSubmitQuestion}
                              disabled={
                                !question.trim() ||
                                submitQuestionMutation.isPending
                              }
                              className="absolute bottom-3 right-3 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <Send className="h-4 w-4" />
                            </button>
                          </div>
                          <button
                            onClick={handleToggleQuestionForm}
                            className="text-sm text-gray-500 hover:text-gray-700"
                            disabled={submitQuestionMutation.isPending}
                          >
                            {t("sessionDetail.cancel")}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Affichage des questions existantes */}
                  {allQuestions.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">
                        {t("sessionDetail.questionsOrComments")}
                      </h3>
                      <div className="space-y-2">
                        {allQuestions.map((question) => (
                          <div
                            key={question.id}
                            className="bg-gray-50 p-3 rounded-[8px]"
                          >
                            {editingQuestionId === question.id ? (
                              // Mode édition
                              <div className="space-y-2">
                                <textarea
                                  value={editingQuestionText}
                                  onChange={(e) =>
                                    setEditingQuestionText(e.target.value)
                                  }
                                  className="w-full p-2 border border-gray-200 rounded-[8px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                  rows={3}
                                  disabled={updateQuestionMutation.isPending}
                                />
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() =>
                                      handleSaveEditQuestion(question.id)
                                    }
                                    disabled={
                                      !editingQuestionText.trim() ||
                                      updateQuestionMutation.isPending
                                    }
                                    className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    title={t("sessionDetail.save")}
                                  >
                                    <Check className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={handleCancelEditQuestion}
                                    disabled={updateQuestionMutation.isPending}
                                    className="p-2 bg-gray-400 text-white rounded-full hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    title={t("sessionDetail.cancel")}
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              // Mode affichage
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-sm text-gray-700 flex-1">
                                  {question.question}
                                </p>
                                <div className="flex items-center gap-1 flex-shrink-0">
                                  <button
                                    onClick={() =>
                                      handleStartEditQuestion(
                                        question.id,
                                        question.question
                                      )
                                    }
                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                    title={t("sessionDetail.edit")}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </button>
                                  {/* <button
                                    onClick={() =>
                                      handleDeleteQuestion(question.id)
                                    }
                                    disabled={deleteQuestionMutation.isPending}
                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    title={t("sessionDetail.delete")}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button> */}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action buttons - Fixed at bottom */}
            <div className="sticky bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
              <div className="flex flex-col space-y-3">
                {/* Video consultation button - only for confirmed appointments */}
                {session?.status === "confirmed" && onStartVideoCall && (
                  <Button
                    label={t("sessionDetail.startVideo")}
                    onClick={() => {
                      // Stocker le nom du professionnel avant de démarrer l'appel
                      if (session.professionalName) {
                        setCallCreatorName(session.professionalName);
                      }
                      onStartVideoCall?.(session.id);
                    }}
                    className="flex-1 bg-cobalt-blue hover:bg-cobalt-blue/80 text-white"
                    disabled={new Date(session.appointment_at) > new Date()}
                  >
                    <Image
                      src="/assets/icons/video-camera.svg"
                      alt={t("sessionDetail.videoCameraAlt")}
                      width={16}
                      height={16}
                      className="mr-2"
                    />
                  </Button>
                )}

                {/* Cancel appointment button - only for pending appointments */}
                {/* {session?.status === "pending" && ( */}
                <>
                  {cancelAppointmentMutation.isPending ? (
                    <div className="w-full flex items-center justify-center p-3 bg-gray-50 rounded-[8px] mb-2">
                      <svg
                        className="animate-spin mr-3 h-5 w-5 text-cobalt-blue-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span className="font-medium text-cobalt-blue-500">
                        ...
                      </span>
                    </div>
                  ) : (
                    <div
                      className="w-full flex items-center justify-between bg-white border border-[#E2E8F0] rounded-[8px] mb-2"
                      onClick={() => setShowCancelModal(true)}
                    >
                      <Button
                        label={t("sessionDetail.cancelAppointment")}
                        icon="/assets/icons/forbiddenCircle.svg"
                        iconSize={20}
                        className="flex-1 bg-white text-exford-blue font-bold hover:bg-gray-50"
                      >
                        <span>{t("sessionDetail.cancelAppointment")}</span>
                      </Button>
                      <span className="mr-4">
                        <ChevronRight className="h-4 w-4" />
                      </span>
                    </div>
                  )}
                </>
                {/* )} */}
                <div className="w-full mx-auto flex items-center justify-end">
                  {/* <ButtonUI
                    variant="outline"
                    className="w-full max-w-[360px] text-exford-blue font-bold border-gray-300 hover:bg-gray-50 bg-transparent font-figtree mr-2 cursor-pointer"
                    onClick={() =>
                      handleAddToCalendar({
                        id: session?.id,
                        appointment_at: session?.appointment_at || "",
                        pro: {
                          first_name: session?.professionalName?.split(" ")[0],
                          last_name: session?.professionalName
                            ?.split(" ")
                            .slice(1)
                            .join(" "),
                          job: session?.professionalTitle,
                        },
                      })
                    }
                  >
                    <Image
                      src="/assets/icons/calendar.svg"
                      width={20}
                      height={20}
                      alt={t("sessionDetail.calendarAlt")}
                    />
                    {t("expertDetails.addToCalendar")}
                  </ButtonUI> */}
                  <ButtonUI
                    variant="outline"
                    className="w-full text-exford-blue font-bold border-gray-300 hover:bg-gray-50 bg-transparent font-figtree cursor-pointer"
                    onClick={handleOpenChat}
                  >
                    <Image
                      src="/assets/icons/chatDots.svg"
                      width={20}
                      height={20}
                      alt={t("sessionDetail.sendMessage")}
                    />
                  </ButtonUI>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Cancel Appointment Modal */}
        <CancelAppointmentModal
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          onConfirm={async () => {
            setShowCancelModal(false);
            await handleCancelAppointment();
          }}
          isCancelling={cancelAppointmentMutation.isPending}
        />
      </SheetContent>
    </Sheet>
  );
}
