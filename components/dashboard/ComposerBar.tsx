"use client"
import { Send, Upload } from "lucide-react";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import Loader from "./Loader";

export default function ComposerBar({ prompt, onPromptChange, onSend, onSelectFile, onUpload, selectedFile, isLoading, setIsLoading }: {
  prompt: string,
  onPromptChange: (v: string) => void,
  onSend: () => void,
  onSelectFile: (f: File) => void,
  onUpload: () => void,
  selectedFile: File | null,
  isLoading: boolean,
  setIsLoading: Dispatch<SetStateAction<boolean>>
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading,setUploading]  = useState<boolean>(false)
  return (
    <div className="border rounded-3xl border-slate-200 bg-white/60 backdrop-blur-sm sm:p-4 p-2  flex items-center sm:gap-3 fixed bottom-5 w-[50%] sm:right-[25%] right-[35%]">
      <input
        className="flex-1  px-3 py-2 focus:outline-none focus:ring-0 "
        placeholder="Ask something…"
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSend()}
      />
      <button
        onClick={onSend}
        className="rounded-full p-2 hover:bg-blue-100 transition"
        aria-label="Send"
      >
        {
          isLoading ? <Loader /> :
            <Send size={18} />
        }
      </button>

      <input
        type="file"
        accept="application/pdf"
        className="hidden"
        ref={fileInputRef}
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (f) {
            onSelectFile(f);
            await onUpload();
            
          }
        }}
      />
        <button
        onClick={() => fileInputRef.current?.click()}
        className="rounded-full p-2 hover:bg-gray-200 transition"
        aria-label="Choose PDF"
        >
        <Upload size={18} />
      </button>
    </div>
  );
};