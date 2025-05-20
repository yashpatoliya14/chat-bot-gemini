
"use client";

import { useEffect, useState, useRef, FC } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import { LogOut, Upload, Send } from "lucide-react";

type Message = { role: "user" | "assistant"; text: string };
type HistoryItem = { id: string; title?: string; question: string; answer: string };


const HeaderBar: FC<{ user: User | null; onLogout: () => void }> = ({
  user,
  onLogout,
}) => (
  <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
    <h1 className="text-xl font-semibold">Gemini Chat</h1>
    <div className="flex items-center gap-4 text-sm">
      {user?.email && <span className="text-gray-600">{user.email}</span>}
      <button
        onClick={onLogout}
        className="rounded-full p-2 hover:bg-gray-200 transition"
      >
        <LogOut size={18} />
      </button>
    </div>
  </header>
);

const ChatMessages: FC<{ messages: Message[] }> = ({ messages }) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
      {messages.map(({ role, text }, i) => (
        <p
          key={i}
          className={
            role === "user"
              ? "self-end bg-blue-600 text-white rounded-xl px-3 py-1 max-w-xs ml-auto"
              : "self-start bg-white shadow-sm rounded-xl px-3 py-1 max-w-xs"
          }
        >
          {text}
        </p>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

const ComposerBar: FC<{
  prompt: string;
  onPromptChange: (v: string) => void;
  onSend: () => void;
  onSelectFile: (f: File) => void;
  onUpload: () => void;
  selectedFile: File | null;
}> = ({ prompt, onPromptChange, onSend, onSelectFile, onUpload, selectedFile }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="border-t bg-white/60 backdrop-blur-sm p-4 flex items-center gap-3">
      <input
        className="flex-1 rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
        <Send size={18} />
      </button>

      {/* hidden file input */}
      <input
        type="file"
        accept="application/pdf"
        className="hidden"
        ref={fileInputRef}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onSelectFile(f);
        }}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="rounded-full p-2 hover:bg-gray-200 transition"
        aria-label="Choose PDF"
      >
        <Upload size={18} />
      </button>
      {selectedFile && (
        <button
          onClick={onUpload}
          className="text-sm px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Upload
        </button>
      )}
    </div>
  );
};

const HistoryPane: FC<{ history: HistoryItem[] }> = ({ history }) => (
  <aside className="hidden lg:flex flex-col border-l bg-white overflow-y-auto">
    <h2 className="px-4 pt-4 pb-2 font-medium text-gray-700">History</h2>
    <ul className="flex-1 space-y-2 px-4 pb-4 text-sm">
      {history.length === 0 && <li className="text-gray-400">No history yet.</li>}
      {history.map(({ id, title }, idx) => (
        <li
          key={id ?? idx}
          className="cursor-pointer truncate rounded-md px-3 py-2 hover:bg-gray-100"
          title={title ?? "Conversation"}
        >
          {title ?? `Conversation ${idx + 1}`}
        </li>
      ))}
    </ul>
  </aside>
);


const Dashboard: FC = () => {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<User | null>(null);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [pdfText, setPdfText] = useState("");

  /* 1️⃣  Auth & history ---------------------------------------------------- */
  useEffect(() => {
    const init = async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return router.push("/auth/signin");
      setUser(auth.user);

      try {
        const res = await fetch("/api/history");
        if (!res.ok) throw new Error(await res.text());
        const { data: hist } = await res.json();
        setHistory(hist);
        setMessages(
          hist.flatMap((c: HistoryItem) => [
            { role: "user", text: c.question },
            { role: "assistant", text: c.answer },
          ])
        );
      } catch (err) {
        console.error(err);
        setMessages([{ role: "assistant", text: "❌ Could not load history." }]);
      }
    };
    init();
  }, [router, supabase]);

  /* 2️⃣  Send prompt ------------------------------------------------------- */
  const send = async () => {
    if (!prompt.trim()) return;
    setMessages((m) => [...m, { role: "user", text: prompt }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: `${prompt}\n\nPDF:\n${pdfText}` }),
      });
      if (!res.ok) throw new Error(await res.text());
      const { answer } = await res.json();
      setMessages((m) => [...m, { role: "assistant", text: answer }]);
    } catch (err) {
      console.error(err);
      setMessages((m) => [...m, { role: "assistant", text: "Something went wrong." }]);
    }
    setPrompt("");
  };

  /* 3️⃣  Upload PDF -------------------------------------------------------- */
  const uploadPdf = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error(await res.text());
      const { text } = await res.json();
      setPdfText(text);
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  /* 4️⃣  Logout ----------------------------------------------------------- */
  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/signin");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <HeaderBar user={user} onLogout={logout} />

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_280px]">
        {/* Chat Column */}
        <section className="flex flex-col overflow-hidden">
          <ChatMessages messages={messages} />
          <ComposerBar
            prompt={prompt}
            onPromptChange={setPrompt}
            onSend={send}
            onSelectFile={setFile}
            onUpload={uploadPdf}
            selectedFile={file}
          />
        </section>

        {/* History */}
        <HistoryPane history={history} />
      </main>
    </div>
  );
};

export default Dashboard;
