"use client";

import { useConversation } from "../useConversation";
import { ConversationHeader } from "./ConversationHeader";
import { ConversationInput } from "./ConversationInput";
import { ConversationMessagesList } from "./ConversationMessagesList";

interface ConversationViewProps {
  receiverId?: string;
  onBack?: () => void;
}

export function ConversationView({ receiverId, onBack }: ConversationViewProps) {
  const {
    profile,
    messages,
    currentUserId,
    isLoadingMessages,
    isSending,
    sendMessage,
  } = useConversation(receiverId);

  if (!receiverId) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-gray-500">
        Aucun destinataire sélectionné.
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <ConversationHeader profile={profile} onBack={onBack} />
      <ConversationMessagesList
        currentUserId={currentUserId}
        messages={messages}
        isLoading={isLoadingMessages}
      />
      <ConversationInput isSending={isSending} onSend={sendMessage} />
    </div>
  );
}
