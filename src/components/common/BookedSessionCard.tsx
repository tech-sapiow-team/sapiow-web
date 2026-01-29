import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { ProfileAvatar } from "./ProfileAvatar";

interface BookedSessionCardProps {
  professionalName?: string;
  professionalTitle?: string;
  profileImage?: string;
  sessionType?: string;
  duration?: string;
  date?: string;
  time?: string;
  className?: string;
  isLoading?: boolean;
}

export default function BookedSessionCard({
  professionalName = "",
  professionalTitle = "",
  profileImage = "",
  sessionType = "",
  duration = "",
  date = "",
  time = "",
  className = "",
  isLoading = false,
}: BookedSessionCardProps) {
  if (isLoading) {
    return (
      <Card
        className={`bg-white border-gray-100 shadow-none max-w-sm mx-auto p-0 rounded-[12px] animate-pulse ${className}`}
      >
        <CardContent className="p-0 text-center space-y-6">
          {/* Avatar Skeleton */}
          <div className="flex justify-center pt-6">
            <div className="w-28 h-28 rounded-full bg-gray-200" />
          </div>

          {/* Informations Section */}
          <div className="space-y-3 px-6">
            <div className="h-5 bg-gray-200 rounded-full w-3/4 mx-auto" />
            <div className="h-4 bg-gray-200 rounded-full w-1/2 mx-auto" />
          </div>

          {/* Details Section */}
          <div className="space-y-4 text-left bg-gray-50 p-6 rounded-b-[12px]">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded bg-gray-200 shrink-0" />
              <div className="h-4 bg-gray-200 rounded-full w-4/5" />
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-gray-200 shrink-0" />
                <div className="h-4 bg-gray-200 rounded-full w-2/3" />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-gray-200 shrink-0" />
                <div className="h-4 bg-gray-200 rounded-full w-1/2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`bg-snow-blue border-soft-ice-gray shadow-none max-w-sm mx-auto p-0 rounded-[12px] ${className}`}
    >
      <CardContent className="p-0 text-center space-y-6">
        {/* Avatar du professionnel */}
        <div className="flex justify-center pt-6">
          <ProfileAvatar
            src={profileImage}
            alt={professionalName}
            size="xl2"
            borderColor="border-white"
            borderWidth="3"
            className="border-light-blue-gray"
          />
        </div>

        {/* Informations du professionnel */}
        <div className="space-y-2">
          <h3 className="text-base font-bold text-exford-blue">
            {professionalName}
          </h3>
          <p className="text-sm text-platinum-platinum-700 font-medium">
            {professionalTitle}
          </p>
        </div>

        {/* Détails de la session */}
        <div className="space-y-4 text-left bg-soft-ice-gray p-6 rounded-b-[12px]">
          <div className="flex items-center gap-1.5">
            <Image
              src="/assets/icons/videorecord.svg"
              alt="video"
              width={24}
              height={24}
            />
            <span className="text-sm text-exford-blue font-medium">
              {sessionType} {duration && "- " + duration}
            </span>
          </div>

          <div className="flex flex-col  gap-3">
            <div className="flex items-center gap-2">
              <Image
                src="/assets/icons/calendar.svg"
                alt="calendar"
                width={24}
                height={24}
              />
              <span className="text-sm text-exford-blue font-medium capitalize">
                {date}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Image
                src="/assets/icons/clock.svg"
                alt="clock"
                width={24}
                height={24}
              />
              <span className="text-sm text-exford-blue font-medium">
                {time}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
