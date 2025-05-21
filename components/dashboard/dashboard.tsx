
"use client";


import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Header from "./Header";
import { User } from "@supabase/supabase-js";
import MessageSection from "./MessageSection";
import ComposerBar from "./ComposerBar";
import { LoadingBar } from "../LoadingBar";


export type Message = { role: "user" | "assistant"; text: string };
type HistoryItem = { id: string; title?: string; question: string; answer: string };

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [pdfText, setPdfText] = useState("");
  const router = useRouter();
  const supabase = createClient();
  const [isLoading,setIsLoading] = useState<boolean>(false)
  const [isLoadingBar,setLoadingBar] = useState<boolean>(false)
  // -------------------------------- log out function  
  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/signin");
  };
  //--------------------------------- history fetch and assign get user
  useEffect(() => {
    const init = async () => {
      setLoadingBar(true)
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return router.push("/signin");
      setUser(auth.user);
      
      try {
        const res = await fetch("/api/history");
        if (!res.ok) throw new Error(await res.text());
        const { data: hist } = await res.json();
        setMessages(
          hist.flatMap((c: HistoryItem) => [
            { role: "assistant", text: c.answer },
            { role: "user", text: c.question },
          ]).reverse()
        );
      } catch (err) {
        console.error(err);
        setMessages([{ role: "assistant", text: "❌ Could not load history." }]);
      }finally{
        setLoadingBar(false)        
      }
    };
    init();
  }, [router, supabase]);
  
  
  
  const send = async () => {
    if (!prompt.trim()) return;
    setMessages((m) => [...m, { role: "user", text: prompt }]);
    
    try {
      setIsLoading(true)
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: `${prompt}\n\n${pdfText}` }),
      });
      if (!res.ok) throw new Error(await res.text());
      const { answer } = await res.json();
      setMessages((m) => [...m, { role: "assistant", text: answer }]);
    } catch (err) {
      console.error(err);
      setMessages((m) => [...m, { role: "assistant", text: "Something went wrong." }]);
    } finally {
      setIsLoading(false)
      setFile(null)
      setPrompt('')
    }
    setPrompt("");
  };
  
  /* Upload PDF -------------------------------------------------------- */
  const uploadPdf = async () => {
    if (!file) return;
    console.log("i called");
    
    setIsLoading(true)
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error(await res.text());
      const { text } = await res.json();
      setPdfText(text);
    } catch (err) {
      console.error("Upload failed", err);
    }finally{
      setIsLoading(false)
    }
  };
  return (
    <>
  <LoadingBar isLoading={isLoadingBar}/>
      <Header onLogout={logout} user={user} />
      <MessageSection messages={messages} />
      <ComposerBar 
        prompt={prompt} 
        onPromptChange={setPrompt} 
        onSend={send} 
        onSelectFile={setFile} 
        onUpload={uploadPdf} 
        selectedFile={file}
        isLoading={isLoading} 
        setIsLoading={setIsLoading}
      />
    </>
  )
}

