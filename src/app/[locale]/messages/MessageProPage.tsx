"use client";

import {
  type Conversation,
  type MessageType,
  useProGetConversation,
  useProGetConversations,
} from "@/api/porMessages/useProMessage";
import { Header } from "@/components/layout/header/Header";
import { useConversationStore } from "@/store/useConversationStore";
import { useCurrentUserData } from "@/store/useCurrentUser";
import { findActiveConversation } from "@/utils/messageHelpers";
import { useMemo } from "react";
import { MessagesLayout } from "./MessagesLayout";

export const MessageProPage = () => {
  const {
    selectedConversation,
    setSelectedConversation,
    selectedProfessional,
  } = useConversationStore();

  const { currentUser } = useCurrentUserData();
  const currentUserId = currentUser?.id || "";

  const {
    data: conversationsData = [],
    isLoading: conversationsLoading,
    error: conversationsError,
  } = useProGetConversations();

  const {
    data: conversationMessages,
    isLoading: conversationLoading,
    error: conversationError,
  } = useProGetConversation(selectedConversation || "", currentUserId);

  const conversationsWithSelected = useMemo(() => {
    const targetId = selectedProfessional?.id || selectedConversation;
    if (!targetId) return conversationsData;

    const alreadyExists = conversationsData.some(
      (conv) => conv.profile?.id === targetId
    );
    if (alreadyExists) return conversationsData;

    const draftConversation: Conversation = {
      profile: {
        id: targetId,
        first_name: selectedProfessional?.name?.split(" ")[0] || "Nouveau",
        last_name:
          selectedProfessional?.name?.split(" ").slice(1).join(" ") ||
          "contact",
        avatar: selectedProfessional?.avatar || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: targetId,
        language: "fr",
        stripe_customer_id: "",
        appointment_notification_sms: false,
        appointment_notification_email: false,
        message_notification_sms: false,
        message_notification_email: false,
        promotions_notification_sms: false,
        promotions_notification_email: false,
        domain_id: null,
        expo_push_token: null,
      },
      latest_message: {
        id: `draft-${targetId}`,
        sender_id: currentUserId,
        receiver_id: targetId,
        type: "text" as MessageType,
        content: "Nouveau message",
        created_at: new Date().toISOString(),
        read_at: null,
      },
    };

    return [
      draftConversation,
      ...conversationsData,
    ];
  }, [conversationsData, selectedProfessional, selectedConversation, currentUserId]);

  const activeConversation = findActiveConversation(
    conversationsWithSelected,
    selectedConversation,
    selectedProfessional
  );

  return (
    <MessagesLayout
      header={<Header hideProfile text="Messages" isBorder />}
      selectedConversation={selectedConversation}
      setSelectedConversation={setSelectedConversation}
      conversationsData={conversationsWithSelected}
      conversationsLoading={conversationsLoading}
      conversationsError={conversationsError}
      conversationMessages={conversationMessages || null}
      conversationLoading={conversationLoading}
      conversationError={conversationError}
      activeConversation={activeConversation}
      currentUserId={currentUserId}
    />
  );
};
