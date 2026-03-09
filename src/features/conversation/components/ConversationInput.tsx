"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useRef, useState } from "react";

interface ConversationInputProps {
  isSending?: boolean;
  onSend: (content: string | File) => Promise<unknown>;
}

export function ConversationInput({ isSending, onSend }: ConversationInputProps) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSend = async () => {
    if (isSending) return;
    if (!text.trim() && !file) return;

    const payload = file ?? text.trim();
    await onSend(payload);
    setText("");
    setFile(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <footer className="border-t border-gray-200 bg-white p-3">
      {file ? (
        <p className="mb-2 truncate text-xs text-gray-600">Fichier: {file.name}</p>
      ) : null}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          className="cursor-pointer"
          onClick={() => fileRef.current?.click()}
        >
          Upload
        </Button>
        <input
          ref={fileRef}
          type="file"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />

        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Votre message..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSend();
            }
          }}
        />

        <Button
          type="button"
          className="cursor-pointer"
          onClick={handleSend}
          disabled={isSending || (!text.trim() && !file)}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </footer>
  );
}
