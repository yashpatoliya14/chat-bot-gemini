import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';


import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
    const { prompt } = await req.json();
    console.log(prompt);

    // ----- Gemini call

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    const answer = result.response.text();

    // ----- Save to Supabase
    
    const supabase = await createClient()

    
  // 5) verify user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  // 6) save chat
  const { error: dbError } = await supabase
    .from('chats')
    .insert({ user_id: user.id, question: prompt, answer })

  if (dbError) {
    console.error('DB error:', dbError)
    return NextResponse.json({ error: dbError.message }, { status: 500 })
  }

  // 7) return answer
  return NextResponse.json({ answer })
}
