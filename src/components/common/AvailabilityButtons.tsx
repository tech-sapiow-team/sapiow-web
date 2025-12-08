import { Button as ButtonUI } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface AvailabilityButtonProps {
  icon: string;
  label: string;
  onClick: () => void;
}

const AvailabilityButton = ({
  icon,
  label,
  onClick,
}: AvailabilityButtonProps) => (
  <ButtonUI
    onClick={onClick}
    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors w-full h-[56px]"
  >
    <div className="flex items-center gap-3">
      <Image src={icon} width={20} height={20} alt="icon" />
      <span className="text-base font-medium text-gray-900">{label}</span>
    </div>
    <ChevronRight className="w-5 h-5 text-gray-400" />
  </ButtonUI>
);

interface AvailabilityButtonsProps {
  onManageAvailability: () => void;
  onSyncCalendars: () => void;
}

export const AvailabilityButtons = ({
  onManageAvailability,
  onSyncCalendars,
}: AvailabilityButtonsProps) => {
  const t = useTranslations();

  return (
    <div className="space-y-4 w-full mb-40 lg:mb-0">
      <AvailabilityButton
        icon="/assets/icons/calendar.svg"
        label={t("availabilityButtons.manageAvailability")}
        onClick={onManageAvailability}
      />
      {/* <AvailabilityButton
        icon="/assets/icons/calendar.svg"
        label={t("availabilityButtons.syncCalendars")}
        onClick={onSyncCalendars}
      /> */}
    </div>
  );
};
