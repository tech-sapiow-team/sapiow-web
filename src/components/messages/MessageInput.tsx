import {
  createSendMessageData,
  usePatientSendMessage,
  validateFile,
} from "@/api/patientMessages/usePatientMessage";
import { useProSendMessage } from "@/api/porMessages/useProMessage";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUserData } from "@/store/useCurrentUser";
import { useUserStore } from "@/store/useUser";
import { Mic, Paperclip, Send, Square } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface MessageInputProps {
  receiverId?: string;
}

export function MessageInput({ receiverId }: MessageInputProps) {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const { currentUser } = useCurrentUserData();
  const currentProId = currentUser?.id;
  const currentPatientId = currentUser?.id;
  const [fallbackReceiverId, setFallbackReceiverId] = useState<string>("");
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { user } = useUserStore();
  const sendMessageMutation =
    user?.type === "expert"
      ? useProSendMessage(currentProId || "")
      : usePatientSendMessage(currentPatientId || "");
  const effectiveReceiverId = receiverId || fallbackReceiverId;

  useEffect(() => {
    const queryReceiverId = searchParams.get("receiverId");
    if (queryReceiverId) {
      setFallbackReceiverId(queryReceiverId);
      return;
    }

    const pendingRaw = sessionStorage.getItem("pendingConversation");
    if (!pendingRaw) return;
    try {
      const pending = JSON.parse(pendingRaw) as { receiverId?: string };
      if (pending.receiverId) setFallbackReceiverId(pending.receiverId);
    } catch {
      // Ignore parse error
    }
  }, [searchParams]);

  // Logique pour ajuster automatiquement la hauteur
  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = 96;

      if (scrollHeight <= maxHeight) {
        textarea.style.height = `${scrollHeight}px`;
        textarea.style.overflowY = "hidden";
      } else {
        textarea.style.height = `${maxHeight}px`;
        textarea.style.overflowY = "auto";
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    adjustHeight();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
    // Shift+Enter permet le saut de ligne naturel
  };

  const handleSendMessage = async () => {
    if ((message.trim() || selectedFile || recordedAudio) && effectiveReceiverId) {
      try {
        console.log("Avant envoi:", {
          selectedFile,
          recordedAudio,
          message: message.trim(),
          receiverId: effectiveReceiverId,
        });

        let content = selectedFile || message.trim();

        // Si c'est un audio enregistré, créer un File à partir du Blob
        if (recordedAudio) {
          const audioFile = new File(
            [recordedAudio],
            `audio-${Date.now()}.webm`,
            {
              type: recordedAudio.type,
            }
          );
          content = audioFile;
        }

        console.log("Content à envoyer:", content);

        const messageData = createSendMessageData(effectiveReceiverId, content);
        console.log("MessageData créé:", messageData);

        await sendMessageMutation.mutateAsync(messageData);
        setMessage("");
        setSelectedFile(null);
        setRecordedAudio(null);
        setAudioUrl(null);
        adjustHeight();
      } catch (error) {
        console.error(t("messages.sendingError"), error);
      }
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
      setMessage(`${t("messages.fileAttached")} ${file.name}`);
    } else {
      alert(t("messages.unsupportedFileType"));
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setMessage(`${t("messages.imageAttached")} ${file.name}`);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      setCameraStream(stream);
      setShowCamera(true);

      // Attendre un peu pour que la vidéo soit montée
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (error) {
      console.error(t("messages.cameraAccessErrorLog"), error);
      alert(t("messages.cameraAccessError"));
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setShowCamera(false);
  };

  const takePicture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        // Définir les dimensions du canvas
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Dessiner l'image de la vidéo sur le canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convertir en blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const file = new File([blob], `photo-${Date.now()}.jpg`, {
                type: "image/jpeg",
              });
              setSelectedFile(file);
              setMessage(t("messages.photoTaken"));
              stopCamera();
            }
          },
          "image/jpeg",
          0.8
        );
      }
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setRecordedAudio(blob);
        setAudioUrl(URL.createObjectURL(blob));
        setMessage(
          `${t("messages.audioRecording")} (${Math.floor(
            recordingTime / 60
          )}:${(recordingTime % 60).toString().padStart(2, "0")})`
        );
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Démarrer le timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error(t("messages.microphoneAccessErrorLog"), error);
      alert(t("messages.microphoneAccessError"));
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordedAudio(null);
      setAudioUrl(null);
      setRecordingTime(0);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  useEffect(() => {
    adjustHeight();
  }, []);

  // Ne rien afficher si aucune conversation n'est sélectionnée
  if (!effectiveReceiverId) {
    return null;
  }

  return (
    <div className="border-t border-gray-200 py-4 sticky bottom-0 z-10 bg-white">
      <div className="flex items-center space-x-0">
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500 cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="h-5 w-5" />
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,audio/*"
          onChange={handleFileSelect}
        />
        <div className="flex-1 flex rounded-[12px] px-0 bg-azure-mist min-h-[40px] text-granite-gray items-center">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={t("messages.messagePlaceholder")}
            className="border-none bg-transparent shadow-none resize-none min-h-[24px] leading-6 py-2 scrollbar-hide"
            rows={1}
          />

          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 cursor-pointer"
            onClick={handleSendMessage}
            disabled={
              (!message.trim() && !selectedFile) ||
              !effectiveReceiverId ||
              sendMessageMutation.isPending
            }
          >
            <Send
              className={`h-5 w-5  ${
                message.trim() || selectedFile
                  ? "text-exford-blue cursor-pointer"
                  : "text-gray-400"
              }`}
            />
          </Button>
        </div>
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 cursor-pointer"
            onClick={startCamera}
          >
            <Image
              src="/assets/icons/photo.svg"
              alt="camera"
              width={24}
              height={24}
            />
          </Button>

          <input
            ref={imageInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageSelect}
          />
        </div>
        {!isRecording ? (
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 cursor-pointer hover:text-exford-blue"
            onClick={startRecording}
          >
            <Mic className="h-5 w-5" />
          </Button>
        ) : (
          <div className="flex items-center gap-2 bg-red-50 rounded-lg px-3 py-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-red-600">
                {Math.floor(recordingTime / 60)}:
                {(recordingTime % 60).toString().padStart(2, "0")}
              </span>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
                onClick={stopRecording}
              >
                <Square className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-700 h-8 w-8 p-0"
                onClick={cancelRecording}
              >
                ✕
              </Button>
            </div>
          </div>
        )}

        {/* Lecteur audio pour l'aperçu */}
        {audioUrl && !isRecording && (
          <div className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2">
            <audio controls className="h-8">
              <source src={audioUrl} type="audio/webm" />
            </audio>
          </div>
        )}
      </div>

      {/* Modal Camera */}
      {showCamera && (
        <div className="fixed inset-0 z-50 bg-white bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {t("messages.takePhoto")}
                </h3>
                <button
                  onClick={stopCamera}
                  className="text-gray-500 cursor-pointer hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full rounded-lg"
                />
                <canvas ref={canvasRef} className="hidden" />
              </div>

              <div className="flex justify-center gap-4 mt-4">
                <Button
                  variant="outline"
                  onClick={stopCamera}
                  className="cursor-pointer"
                >
                  {t("cancel")}
                </Button>
                <Button
                  onClick={takePicture}
                  className="bg-white text-exford-blue cursor-pointer"
                >
                  {t("messages.takePhotoButton")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
