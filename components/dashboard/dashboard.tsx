
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Header from "./Header";
import { User } from "@supabase/supabase-js";
import MessageSection from "./MessageSection";
import ComposerBar from "./ComposerBar";
import { LoadingBar } from "../LoadingBar";
import { Box } from "@mui/material";


export type Message = { role: "user" | "assistant"; text: string };

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const router = useRouter();
  const supabase = createClient();
  const [isLoading,setIsLoading] = useState<boolean>(false)
  const [isLoadingBar,setLoadingBar] = useState<boolean>(false)
  // -------------------------------- log out function  
  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/signin");
  };
  //--------------------------------- get user
  useEffect(() => {
    const init = async () => {
      setLoadingBar(true)
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return router.push("/signin");
      setUser(auth.user);
      setLoadingBar(false)
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
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) throw new Error(await res.text());
      const { answer } = await res.json();
      setMessages((m) => [...m, { role: "assistant", text: answer }]);
    } catch (err) {
      console.error(err);
      setMessages((m) => [...m, { role: "assistant", text: "Something went wrong." }]);
    } finally {
      setIsLoading(false)
      setPrompt('')
    }
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <LoadingBar isLoading={isLoadingBar} />
      <Header onLogout={logout} user={user} />
      <MessageSection messages={messages} />
      <ComposerBar
        prompt={prompt}
        onPromptChange={setPrompt}
        onSend={send}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    </Box>
  );
}

