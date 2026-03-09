"use client";

import clsx from "clsx";
import type { ConversationMessage } from "../types";

interface ConversationMessagesListProps {
  currentUserId?: string;
  messages: ConversationMessage[];
  isLoading?: boolean;
}

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

export function ConversationMessagesList({
  currentUserId,
  messages,
  isLoading,
}: ConversationMessagesListProps) {
  if (isLoading) {
    return <div className="p-4 text-sm text-gray-500">Chargement...</div>;
  }

  if (!messages.length) {
    return (
      <div className="p-4 text-sm text-gray-500">
        Aucun message pour le moment. Ecris le premier message.
      </div>
    );
  }

  const sorted = [...messages].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
      <div className="space-y-3">
        {sorted.map((msg) => {
          const isOwn = msg.sender_id === currentUserId;
          return (
            <div
              key={msg.id}
              className={clsx("flex", isOwn ? "justify-end" : "justify-start")}
            >
              <div
                className={clsx(
                  "max-w-[80%] rounded-2xl px-3 py-2 text-sm",
                  isOwn ? "bg-exford-blue text-white" : "bg-white text-gray-900"
                )}
              >
                <p className="break-words">{msg.content}</p>
                <p
                  className={clsx(
                    "mt-1 text-[11px]",
                    isOwn ? "text-blue-100" : "text-gray-500"
                  )}
                >
                  {formatTime(msg.created_at)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
