"use client";
import VideoConsultationUI from "./video-consultation-ui";

interface VideoConsultationProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoConsultation({ onClose }: VideoConsultationProps) {
  return (
    <div className="w-full h-[80vh] min-h-[700px] max-h-screen rounded-xl">
      <VideoConsultationUI onClose={onClose} />
    </div>
  );
}
