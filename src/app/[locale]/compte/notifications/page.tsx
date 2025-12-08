"use client";

import { LoadingScreen } from "@/components/common/LoadingScreen";
import { Switch } from "@/components/ui/switch";
import { useNotificationSettings } from "@/hooks/useNotificationSettings";
import { useTranslations } from "next-intl";
import Image from "next/image";
import AccountLayout from "../AccountLayout";

export default function Notifications() {
  const t = useTranslations();
  const {
    smsNotifications,
    emailNotifications,
    handleSmsNotificationChange,
    handleEmailNotificationChange,
    isLoading,
    isUpdating,
    error,
  } = useNotificationSettings();

  if (isLoading) {
    return (
      <AccountLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <LoadingScreen
            message={t("notificationSettings.loadingSettings")}
            size="md"
            fullScreen={false}
          />
        </div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout>
      <div className="container w-full py-0 px-5">
        {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-md">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-xs font-bold text-gray-700 uppercase mb-2 font-figtree">
            {t("notificationSettings.smsNotifications")}
          </h2>
          <div>
            {smsNotifications.map((notif, idx) => (
              <div
                key={notif.id}
                className={`flex items-center py-4 ${
                  idx === smsNotifications.length - 1
                    ? "border-b-0"
                    : "border-b border-light-blue-gray"
                }`}
              >
                <Image
                  src={notif.icon}
                  alt={notif.label}
                  width={24}
                  height={24}
                  className="mr-4"
                />
                <span className="flex-1 text-gray-800 font-figtree text-base">
                  {notif.label}
                </span>
                <Switch
                  checked={notif.checked}
                  onCheckedChange={(checked) =>
                    handleSmsNotificationChange(notif.id, checked)
                  }
                  disabled={isUpdating}
                  className="data-[state=checked]:bg-[#1E293B]"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xs font-bold text-gray-700 uppercase mb-2 font-figtree">
            {t("notificationSettings.emailNotifications")}
          </h2>
          <div>
            {emailNotifications.map((notif, idx) => (
              <div
                key={notif.id}
                className={`flex items-center py-4 ${
                  idx === emailNotifications.length - 1
                    ? "border-b-0"
                    : "border-b border-light-blue-gray"
                } ${isUpdating ? "opacity-60" : ""}`}
              >
                <Image
                  src={notif.icon}
                  alt={notif.label}
                  width={24}
                  height={24}
                  className="mr-4"
                />
                <span className="flex-1 text-gray-800 font-figtree text-base">
                  {notif.label}
                </span>
                <Switch
                  checked={notif.checked}
                  onCheckedChange={(checked) =>
                    handleEmailNotificationChange(notif.id, checked)
                  }
                  disabled={isUpdating}
                  className="data-[state=checked]:bg-[#1E293B]"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </AccountLayout>
  );
}
