"use client";

import { withAuth } from "@/components/common/withAuth";
import { useConversationStore } from "@/store/useConversationStore";
import { useUserStore } from "@/store/useUser";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { MessageClientPage } from "./MessageClientPage";
import { MessageProPage } from "./MessageProPage";

function Messages() {
  const { user } = useUserStore();
  const { setSelectedConversation, setSelectedProfessional } =
    useConversationStore();
  const searchParams = useSearchParams();

  useEffect(() => {
    const queryReceiverId = searchParams.get("receiverId");
    const queryName = searchParams.get("name") || "";
    const queryTitle = searchParams.get("title") || "";
    const queryAvatar = searchParams.get("avatar") || "";

    let receiverId = queryReceiverId;
    let name = queryName;
    let title = queryTitle;
    let avatar = queryAvatar;

    if (!receiverId) {
      const pendingRaw = sessionStorage.getItem("pendingConversation");
      if (pendingRaw) {
        try {
          const pending = JSON.parse(pendingRaw) as {
            receiverId?: string;
            name?: string;
            title?: string;
            avatar?: string;
          };
          receiverId = pending.receiverId || "";
          name = pending.name || "";
          title = pending.title || "";
          avatar = pending.avatar || "";
        } catch {
          // Ignore parse error
        }
      }
    }

    if (!receiverId) return;

    setSelectedConversation(receiverId);
    if (name || avatar || title) {
      setSelectedProfessional({
        id: receiverId,
        name,
        title,
        avatar,
      });
    }
    sessionStorage.removeItem("pendingConversation");
  }, [searchParams, setSelectedConversation, setSelectedProfessional]);

  const pageKey = user?.type === "expert" ? "expert" : "client";

  if (user?.type === "expert") {
    return <MessageProPage key={pageKey} />;
  }

  return <MessageClientPage key={pageKey} />;
}

export default withAuth(Messages);
