"use client"
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignIn = async () => {
    const supabase =  createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(error.message);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Sign In</h1>
      <input type="email" placeholder="Email" className="mb-2" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" className="mb-2" onChange={e => setPassword(e.target.value)} />
      <button onClick={handleSignIn}>Sign In</button>
    </div>
  );
}
