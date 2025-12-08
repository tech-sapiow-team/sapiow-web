import { LoadingScreen } from "@/components/common/LoadingScreen";
import { useTranslations } from "next-intl";
import { ConversationItem } from "./ConversationItem";
import { SearchBar } from "./SearchBar";

interface ConversationsListProps {
  conversationsData: any[];
  conversationsLoading: boolean;
  conversationsError: any;
  selectedConversation: string | null;
  onConversationSelect: (id: string) => void;
  showSearchBar?: boolean;
  className?: string;
  searchBarClassName?: string;
}

export function ConversationsList({
  conversationsData,
  conversationsLoading,
  conversationsError,
  selectedConversation,
  onConversationSelect,
  showSearchBar = true,
  className = "",
  searchBarClassName = "",
}: ConversationsListProps) {
  const t = useTranslations();

  return (
    <div className={`flex flex-col ${className}`}>
      {showSearchBar && <SearchBar className={searchBarClassName} />}

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {conversationsLoading ? (
          <LoadingScreen
            message={t("messages.loadingConversations")}
            size="sm"
            fullScreen={false}
            className="h-32"
          />
        ) : conversationsError ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-red-500">
              {t("messages.conversationError")} {conversationsError.message}
            </p>
          </div>
        ) : conversationsData && conversationsData.length > 0 ? (
          conversationsData.map((conversation) => (
            <ConversationItem
              key={conversation.profile.id}
              conversation={conversation}
              isSelected={conversation.profile.id === selectedConversation}
              onClick={() => onConversationSelect(conversation.profile.id)}
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-32">
            <p className="text-gray-500">
              {t("messages.noConversationsFound")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
