"use client"

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      alert(error.message);
    } else {
      alert('Check your email to confirm sign up');
      router.push('/auth/signin');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Sign Up</h1>
      <input type="email" placeholder="Email" className="mb-2" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" className="mb-2" onChange={e => setPassword(e.target.value)} />
      <button onClick={handleSignUp}>Sign Up</button>
    </div>
  );
}
