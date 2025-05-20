"use client"

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/auth/signin');
      else setUser(user);
    });
  }, [router]);

  const send = async () => {
    if (!prompt) return;

    // Add user's message
    setMessages((m) => [...m, { role: 'user', text: prompt }]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ prompt }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.log('Server error:', errorText);
        setMessages((m) => [
          ...m,
          { role: 'assistant', text: '❌ Something went wrong.' },
        ]);
        return;
      }

      const { answer } = await res.json();
      setMessages((m) => [...m, { role: 'assistant', text: answer }]);
    } catch (err) {
      console.error('Fetch failed:', err);
      setMessages((m) => [
        ...m,
        { role: 'assistant', text: '❌ Failed to fetch response.' },
      ]);
    }

    setPrompt('');
  };

  return (
    <>
      <div>{user && <p>Welcome, {user.email}</p>}</div>

      <div className="flex flex-col h-full">
        {/* message list */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((m, i) => (
            <p key={i} className={m.role === 'user' ? 'text-right' : ''}>
              <span className="font-semibold">{m.role}:</span> {m.text}
            </p>
          ))}
        </div>

        {/* composer */}
        <div className="p-4 border-t flex gap-2">
          <input
            className="flex-1 border px-2"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask something…"
            onKeyPress={(e) => e.key === 'Enter' && send()}
          />
          <button onClick={send}>Send</button>
        </div>
      </div>
    </>
  );
}