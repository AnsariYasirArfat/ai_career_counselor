"use client";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Paperclip, Send, X } from "lucide-react";

interface ChatInputProps {
  onSend: (text: string, image?: string) => void;
  loading: boolean;
}

export default function ChatInput({ onSend, loading }: ChatInputProps) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (text.trim()) {
      onSend(text)
      setText("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
  };

  return (
    <div className="w-full px-4 py-3 ">
      <div className="max-w-[760px] mx-auto">
        <div className="border border-zinc-400/50 rounded-3xl p-4 flex">
          <textarea
            id="chat-input"
            maxLength={20000}
            ref={textareaRef}
            className="flex-1 bg-transparent outline-none placeholder-zinc-400 resize-none min-h-[20px] max-h-[120px] overflow-y-auto"
            placeholder="Ask AI Counselor"
            value={text}
            onChange={handleTextareaChange}
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            rows={1}
          />
          <div className="flex items-center justify-between ml-2">
            <Button
              type="button"
              onClick={handleSend}
              disabled={loading || !text.trim()}
              className="rounded-full p-2 hover:!bg-zinc-400/50 disabled:bg-zinc-700 disabled:cursor-not-allowed transition-colors"
              size="sm"
            >
              <Send size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
