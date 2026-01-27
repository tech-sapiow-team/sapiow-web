"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Professional } from "@/types/professional";
import Image from "next/image";

interface ProfessionalCardProps {
  professional: Professional;
  isLiked: boolean;
  onToggleLike: (id: string) => void;
  onProfessionalClick?: (professional: Professional) => void;
  imageWidth?: number;
  imageHeight?: number;
  maxWidth?: string;
  lineClamp?: number;
  isLoadingFavorite?: boolean;
  nameSize?: string;
  iconSize?: number;
}

export default function ProfessionalCard({
  professional,
  isLiked,
  onToggleLike,
  onProfessionalClick,
  imageWidth = 205,
  imageHeight = 196,
  maxWidth = "max-w-[205px]",
  lineClamp = 3,
  isLoadingFavorite = false,
  nameSize = "text-sm",
  iconSize = 16,
}: ProfessionalCardProps) {
  return (
    <Card
      className={`mx-auto p-0 m-0 border-none shadow-none ${maxWidth} w-full cursor-pointer duration-200 my-3 rounded-2xl`}
      onClick={() => onProfessionalClick?.(professional)}
    >
      <div className="relative">
        {professional.topExpertise && (
          <Badge className="absolute bottom-3 left-3 bg-white text-black font-bold text-xs hover:bg-white">
            Top Expert
          </Badge>
        )}
        <Image
          src={
            professional.image ||
            professional.avatar ||
            "/assets/icons/pro1.png"
          }
          alt={
            professional.name ||
            `${professional.first_name || ""} ${
              professional.last_name || ""
            }`.trim() ||
            "Professional"
          }
          width={imageWidth}
          height={imageHeight}
          quality={100}
          className="w-full h-full object-cover rounded-[12px]"
          style={{
            objectFit: "cover",
            width: imageWidth,
            height: imageHeight,
          }}
        />
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-3 right-3 bg-white/20 hover:bg-white rounded-full w-8 h-8 backdrop-blur-[1.4px] transition-all duration-200 ${
            isLoadingFavorite ? "opacity-70 cursor-not-allowed" : ""
          }`}
          onClick={(e) => {
            e.stopPropagation();
            if (!isLoadingFavorite) {
              onToggleLike(professional.id.toString());
            }
          }}
          disabled={isLoadingFavorite}
        >
          {isLoadingFavorite ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"></div>
          ) : (
            <Image
              src={
                isLiked
                  ? "/assets/icons/heartactif.svg"
                  : "/assets/icons/heart.svg"
              }
              alt="Heart"
              width={16}
              height={16}
              className="transition-all duration-200"
            />
          )}
        </Button>
      </div>
      <CardContent className="flex items-center justify-between p-0 m-0">
        <div className="min-w-0 flex-1 overflow-hidden pr-2">
          <div className="flex items-center mb-1">
            <h3 className={`font-bold text-black ${nameSize} truncate`}>
              {professional.name ||
                `${professional.first_name || ""} ${
                  professional.last_name || ""
                }`.trim() ||
                "Nom non disponible"}
            </h3>

            {professional.topExpertise ? (
              <Image
                src="/assets/icons/top-verified.svg"
                alt="Verified"
                width={iconSize}
                height={iconSize}
                className="transition-all duration-200 ml-1 flex-shrink-0"
              />
            ) : (
              <Image
                src="/assets/icons/verified.svg"
                alt="Verified"
                width={iconSize}
                height={iconSize}
                className="transition-all duration-200 flex-shrink-0"
              />
            )}
          </div>
          <p className="text-xs text-black mb-1 truncate">
            {professional.price ? (
              <>
                <span className="font-bold font-figtree">
                  {professional.price}
                </span>{" "}
                / Session
              </>
            ) : (
              ""
            )}
          </p>
          <p
            className={`text-xs text-gray-500 leading-relaxed font-figtree font-medium line-clamp-3`}
          >
            {professional.description
              ? professional.description
              : professional.job}
          </p>
        </div>
        {professional.linkedin && (
          <Image
            src="/assets/icons/linkedin.svg"
            alt="Linkedin"
            width={25}
            height={25}
            className="transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation();
              if (professional.linkedin) {
                window.open(professional.linkedin, "_blank");
              }
            }}
            style={{ cursor: "pointer" }}
          />
        )}
      </CardContent>
    </Card>
  );
}

// Skeleton component for loading state
interface ProfessionalCardSkeletonProps {
  imageWidth?: number;
  imageHeight?: number;
  maxWidth?: string;
}

export function ProfessionalCardSkeleton({
  imageWidth = 205,
  imageHeight = 196,
  maxWidth = "max-w-[205px]",
}: ProfessionalCardSkeletonProps) {
  return (
    <Card
      className={`mx-auto p-0 m-0 border-none shadow-none ${maxWidth} w-full my-3 rounded-2xl animate-pulse`}
    >
      {/* Image skeleton */}
      <div className="relative">
        <div
          className="bg-gray-200 rounded-[12px]"
          style={{
            width: imageWidth,
            height: imageHeight,
          }}
        />
        {/* Heart button skeleton */}
        <div className="absolute top-3 right-3 bg-gray-300 rounded-full w-8 h-8" />
      </div>

      {/* Content skeleton */}
      <CardContent className="flex items-center justify-between p-0 m-0 mt-2">
        <div className="min-w-0 flex-1 overflow-hidden pr-2">
          {/* Name and verified icon skeleton */}
          <div className="flex items-center mb-1 gap-1">
            <div className="h-4 bg-gray-200 rounded w-24" />
            <div className="h-4 w-4 bg-gray-200 rounded-full flex-shrink-0" />
          </div>

          {/* Price skeleton */}
          <div className="h-3 bg-gray-200 rounded w-20 mb-1" />

          {/* Description skeleton - 3 lines */}
          <div className="space-y-1">
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-3/4" />
          </div>
        </div>

        {/* LinkedIn icon skeleton */}
        <div className="h-6 w-6 bg-gray-200 rounded flex-shrink-0" />
      </CardContent>
    </Card>
  );
}
