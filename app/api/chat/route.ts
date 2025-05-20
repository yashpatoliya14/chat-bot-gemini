import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createRouteHandlerClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs';


import { cookies } from 'next/headers';


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
    const { prompt } = await req.json();
    console.log(prompt);

    // ----- Gemini call

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    const answer = result.response.text();

    // ----- Save to Supabase
    console.log(cookies());
    
    const supabase = createRouteHandlerClient({
        cookies: () => cookies()
    });

    // Get user with error handling
    let user;
    try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        user = authUser;
    } catch (error) {
        console.error('Auth error:', error);
        return NextResponse.json(
            { error: 'Authentication check failed' },
            { status: 500 }
        );
    }

    if (user) {
        try {
            const { error } = await supabase.from('chats').insert({
                user_id: user.id,
                question: prompt,
                answer
            });

            if (error) throw error;
        } catch (error) {
            console.error('Database error:', error);
            return NextResponse.json(
                { error: 'Failed to save chat history' },
                { status: 500 }
            );
        }
    }

    return NextResponse.json({ answer });
}
