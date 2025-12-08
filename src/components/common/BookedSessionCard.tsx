import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { ProfileAvatar } from "./ProfileAvatar";

interface BookedSessionCardProps {
  professionalName: string;
  professionalTitle: string;
  profileImage: string;
  sessionType: string;
  duration: string;
  date: string;
  time: string;
  className?: string;
}

export default function BookedSessionCard({
  professionalName,
  professionalTitle,
  profileImage,
  sessionType,
  duration,
  date,
  time,
  className = "",
}: BookedSessionCardProps) {
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
          <div className="flex items-center gap-3">
            <Image
              src="/assets/icons/videorecord.svg"
              alt="video"
              width={24}
              height={24}
            />
            <span className="text-sm text-exford-blue font-medium">
              {sessionType} - {duration}
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
              <span className="text-sm text-exford-blue font-medium">
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

          {/* <div className="flex items-center gap-3">
            <Image
              src="/assets/icons/clock.svg"
              alt="clock"
              width={24}
              height={24}
            />
            <span className="text-sm text-exford-blue font-medium">{time}</span>
          </div> */}
        </div>
      </CardContent>
    </Card>
  );
}
