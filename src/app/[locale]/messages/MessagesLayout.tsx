"use client";

import type {
  Conversation as PatientConversation,
  Message as PatientMessage,
} from "@/api/patientMessages/usePatientMessage";
import type {
  Conversation as ProConversation,
  Message as ProMessage,
} from "@/api/porMessages/useProMessage";
import { AppSidebar } from "@/components/layout/Sidebare";
import { ChatHeader } from "@/components/messages/ChatHeader";
import { ConversationsList } from "@/components/messages/ConversationsList";
import { MessageInput } from "@/components/messages/MessageInput";
import { MessagesList } from "@/components/messages/MessagesList";
import { useSearchParams } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

type ConversationType = PatientConversation | ProConversation;
type MessageType = PatientMessage | ProMessage;

interface MessagesLayoutProps {
  header: ReactNode;
  selectedConversation: string | null;
  setSelectedConversation: (id: string | null) => void;
  conversationsData: ConversationType[];
  conversationsLoading: boolean;
  conversationsError: unknown;
  conversationMessages: MessageType[] | null;
  conversationLoading: boolean;
  conversationError: unknown;
  activeConversation: ConversationType | null;
  currentUserId: string;
}

export const MessagesLayout = ({
  header,
  selectedConversation,
  setSelectedConversation,
  conversationsData,
  conversationsLoading,
  conversationsError,
  conversationMessages,
  conversationLoading,
  conversationError,
  activeConversation,
  currentUserId,
}: MessagesLayoutProps) => {
  const searchParams = useSearchParams();
  const [fallbackReceiverId, setFallbackReceiverId] = useState<string | null>(
    null
  );

  useEffect(() => {
    const queryReceiverId = searchParams.get("receiverId");
    if (queryReceiverId) {
      setFallbackReceiverId(queryReceiverId);
      if (!selectedConversation) {
        setSelectedConversation(queryReceiverId);
      }
      return;
    }

    const pendingRaw = sessionStorage.getItem("pendingConversation");
    if (!pendingRaw) return;

    try {
      const pending = JSON.parse(pendingRaw) as { receiverId?: string };
      if (pending.receiverId) {
        setFallbackReceiverId(pending.receiverId);
        if (!selectedConversation) {
          setSelectedConversation(pending.receiverId);
        }
      }
    } catch {
      // Ignore parse error
    }
  }, [searchParams, selectedConversation, setSelectedConversation]);

  const resolvedConversationId =
    selectedConversation ||
    fallbackReceiverId ||
    activeConversation?.profile?.id ||
    null;

  return (
    <div className="flex h-screen bg-white w-full">
      <AppSidebar hideMobileNav={!!resolvedConversationId} />

      {/* Desktop (lg+) : sidebar + chat */}
      <div className="hidden lg:flex flex-1 flex-col">
        {header}
        <div className="flex-1 flex h-[83vh] mt-[22px] mr-5">
          {/* Sidebar des conversations */}
          <div className="w-80 bg-white flex flex-col mr-4">
            <ConversationsList
              conversationsData={conversationsData}
              conversationsLoading={conversationsLoading}
              conversationsError={conversationsError}
              selectedConversation={resolvedConversationId}
              onConversationSelect={setSelectedConversation}
            />
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col border border-light-blue-gray rounded-3xl h-[85vh]">
            <ChatHeader activeConversation={activeConversation} />

            <div className="bg-gray-50 flex-1 overflow-y-auto p-4 scrollbar-hide">
              <MessagesList
                conversationMessages={conversationMessages || null}
                conversationLoading={conversationLoading}
                conversationError={conversationError}
                currentUserId={currentUserId}
                activeConversation={activeConversation}
                selectedConversation={resolvedConversationId}
              />
            </div>

            <MessageInput
              receiverId={
                resolvedConversationId ||
                activeConversation?.profile?.id ||
                undefined
              }
            />
          </div>
        </div>
      </div>

      {/* Mobile (sm/md) : liste ou chat seul */}
      <div className="flex flex-1 flex-col lg:hidden">
        {/* Pas de header sur mobile */}
        {/* Liste des conversations (si aucune sélection) */}
        {!resolvedConversationId && (
          <div className="flex-1 flex flex-col w-[95%] mx-auto">
            <h2 className="text-lg text-center font-semibold text-exford-blue mt-5">
              Messages
            </h2>
            <ConversationsList
              conversationsData={conversationsData}
              conversationsLoading={conversationsLoading}
              conversationsError={conversationsError}
              selectedConversation={resolvedConversationId}
              onConversationSelect={setSelectedConversation}
              searchBarClassName="sticky top-0 z-10 bg-white pt-2 pb-2"
            />
          </div>
        )}
        {/* Chat mobile (si une conversation est sélectionnée) */}
        {resolvedConversationId && (
          <div className="flex-1 flex flex-col border border-[#F4F6F9] rounded-3xl bg-white">
            <ChatHeader
              activeConversation={activeConversation}
              showBackButton={true}
              onBackClick={() => setSelectedConversation(null)}
              className="sticky top-0 z-10 bg-white"
            />

            <div className="bg-gray-50 flex-1 overflow-y-auto p-4 scrollbar-hide">
              <MessagesList
                conversationMessages={conversationMessages || null}
                conversationLoading={conversationLoading}
                conversationError={conversationError}
                currentUserId={currentUserId}
                activeConversation={activeConversation}
                selectedConversation={resolvedConversationId}
              />
            </div>

            <MessageInput
              receiverId={
                resolvedConversationId ||
                activeConversation?.profile?.id ||
                undefined
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};
