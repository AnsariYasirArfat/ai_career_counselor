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
  const [image, setImage] = useState<string | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (text.trim() || image) {
      onSend(text, image);
      setText("");
      setImage(undefined);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => setImage(undefined);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'; 
  };

  return (
    <div className="w-full px-4 py-3 ">
      <div className="max-w-[760px] mx-auto">
        <div className="border border-zinc-400/50 rounded-3xl p-4">
          {image && (
            <div className="mb-3">
              <div className="relative inline-block">
                <img
                  src={image}
                  alt="preview"
                  className="w-20 h-20 object-cover rounded-lg border border-zinc-600"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 bg-zinc-600  rounded-full p-1 hover:bg-red-400 transition-colors"
                  title="Remove image"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          )}
          
          <textarea
            ref={textareaRef}
            className="w-full bg-transparent outline-none  placeholder-zinc-400 resize-none min-h-[20px] max-h-[120px] overflow-y-auto"
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
          
          <div className="flex items-center justify-between pt-3 ">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-full hover:!bg-zinc-400/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Image upload coming soon"
              disabled={true}
            >
              <Paperclip size={20} className="text-zinc-400" />
            </button>
            
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              disabled={true}
            />
            
            <Button
              type="button"
              onClick={handleSend}
              disabled={loading || (!text.trim() && !image)}
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
