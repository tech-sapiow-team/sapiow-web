"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { ConversationProfile } from "../types";

interface ConversationHeaderProps {
  profile?: ConversationProfile;
  onBack?: () => void;
}

const initialsFromProfile = (profile?: ConversationProfile) => {
  const first = profile?.first_name?.[0] ?? "";
  const last = profile?.last_name?.[0] ?? "";
  const initials = `${first}${last}`.trim();
  return initials || "??";
};

export function ConversationHeader({ profile, onBack }: ConversationHeaderProps) {
  const fullName =
    `${profile?.first_name ?? ""} ${profile?.last_name ?? ""}`.trim() ||
    "Conversation";

  return (
    <header className="flex items-center gap-3 border-b border-gray-200 bg-white p-3">
      {onBack ? (
        <Button
          variant="ghost"
          size="icon"
          className="cursor-pointer"
          onClick={onBack}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      ) : null}

      <Avatar className="h-10 w-10">
        {profile?.avatar ? <AvatarImage src={profile.avatar} alt={fullName} /> : null}
        <AvatarFallback>{initialsFromProfile(profile)}</AvatarFallback>
      </Avatar>

      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-gray-900">{fullName}</p>
        {profile?.job ? (
          <p className="truncate text-xs text-gray-500">{profile.job}</p>
        ) : null}
      </div>
    </header>
  );
}
