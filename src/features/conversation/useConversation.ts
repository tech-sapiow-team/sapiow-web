"use client";

import { supabase } from "@/lib/supabase/client";
import { useCurrentUserData } from "@/store/useCurrentUser";
import { useUserStore } from "@/store/useUser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { conversationApi } from "./conversation.api";
import type { ConversationMessage, ConversationRole } from "./types";

interface UseConversationOptions {
  limit?: number;
  offset?: number;
}

const getRole = (type: string | undefined): ConversationRole =>
  type === "expert" ? "pro" : "patient";

export const useConversation = (
  receiverId: string | undefined,
  options?: UseConversationOptions
) => {
  const { user } = useUserStore();
  const { currentUser } = useCurrentUserData();
  const queryClient = useQueryClient();

  const currentUserId = currentUser?.id;
  const role = getRole(user?.type);
  const limit = options?.limit ?? 50;
  const offset = options?.offset ?? 0;

  const profileQueryKey = useMemo(
    () => ["conversation-profile", role, receiverId],
    [role, receiverId]
  );
  const messagesQueryKey = useMemo(
    () => ["conversation-messages", role, receiverId, limit, offset],
    [role, receiverId, limit, offset]
  );

  const profileQuery = useQuery({
    queryKey: profileQueryKey,
    queryFn: () => conversationApi.getReceiverProfile(role, receiverId!),
    enabled: !!receiverId,
  });

  const messagesQuery = useQuery({
    queryKey: messagesQueryKey,
    queryFn: () =>
      conversationApi.getMessages(role, {
        receiverId: receiverId!,
        limit,
        offset,
      }),
    enabled: !!receiverId,
  });

  const sendMutation = useMutation({
    mutationFn: (content: string | File) =>
      conversationApi.sendMessage(role, { receiverId: receiverId!, content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messagesQueryKey });
      queryClient.invalidateQueries({
        queryKey:
          role === "pro" ? ["pro-conversations"] : ["patient-conversations"],
      });
    },
  });

  useEffect(() => {
    if (!receiverId || !currentUserId) return;

    const filterReceiver = `receiver_id=eq.${currentUserId}`;
    const filterSender = `sender_id=eq.${currentUserId}`;

    const onIncoming = (payload: { new: ConversationMessage }) => {
      const msg = payload.new;
      const isLinkedToOpenConversation =
        (msg.sender_id === receiverId && msg.receiver_id === currentUserId) ||
        (msg.sender_id === currentUserId && msg.receiver_id === receiverId);

      if (!isLinkedToOpenConversation) return;
      queryClient.invalidateQueries({ queryKey: messagesQueryKey });
    };

    const channel = supabase
      .channel(`conversation-${role}-${currentUserId}-${receiverId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: filterReceiver },
        onIncoming as any
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: filterSender },
        onIncoming as any
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, receiverId, role, messagesQueryKey, queryClient]);

  return {
    role,
    currentUserId,
    profile: profileQuery.data,
    messages: messagesQuery.data ?? [],
    isLoadingProfile: profileQuery.isLoading,
    isLoadingMessages: messagesQuery.isLoading,
    isSending: sendMutation.isPending,
    profileError: profileQuery.error,
    messagesError: messagesQuery.error,
    sendMessage: sendMutation.mutateAsync,
  };
};
