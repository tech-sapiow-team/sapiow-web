import { apiClient } from "@/lib/api-client";
import type {
  ConversationMessage,
  ConversationMessagesParams,
  ConversationProfile,
  ConversationRole,
  ConversationSendPayload,
} from "./types";

const getProfileEndpoint = (role: ConversationRole, receiverId: string) =>
  role === "pro" ? `patient/${receiverId}` : `pro/${receiverId}`;

const getMessagesEndpoint = (
  role: ConversationRole,
  params: ConversationMessagesParams
) => {
  const basePath =
    role === "pro"
      ? `pro-messages/${params.receiverId}`
      : `patient-messages/${params.receiverId}`;
  const query = new URLSearchParams({
    limit: String(params.limit ?? 50),
    offset: String(params.offset ?? 0),
  });
  return `${basePath}?${query.toString()}`;
};

const getSendEndpoint = (role: ConversationRole, receiverId: string) =>
  role === "pro"
    ? `pro-messages/${receiverId}`
    : `patient-messages/${receiverId}`;

export const conversationApi = {
  getReceiverProfile: (role: ConversationRole, receiverId: string) =>
    apiClient.get<ConversationProfile>(getProfileEndpoint(role, receiverId)),

  getMessages: (role: ConversationRole, params: ConversationMessagesParams) =>
    apiClient.get<ConversationMessage[]>(getMessagesEndpoint(role, params)),

  sendMessage: async (role: ConversationRole, payload: ConversationSendPayload) => {
    const formData = new FormData();
    formData.append("content", payload.content);
    if (typeof payload.content === "string") {
      formData.append("type", "text");
    }

    return apiClient.fetchFormData<ConversationMessage>(
      getSendEndpoint(role, payload.receiverId),
      formData,
      { method: "POST" }
    );
  },
};
