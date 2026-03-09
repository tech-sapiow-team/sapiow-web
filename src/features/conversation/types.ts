export type ConversationRole = "pro" | "patient";

export type ConversationMessageType = "text" | "audio" | "image" | "document";

export interface ConversationProfile {
  id: string;
  user_id?: string;
  first_name?: string;
  last_name?: string;
  avatar?: string | null;
  job?: string;
  language?: string;
}

export interface ConversationMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  type: ConversationMessageType;
  content: string;
  created_at: string;
  read_at: string | null;
}

export interface ConversationMessagesParams {
  receiverId: string;
  limit?: number;
  offset?: number;
}

export interface ConversationSendPayload {
  receiverId: string;
  content: string | File;
}
