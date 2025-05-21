import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {

    const supabase = await createClient()
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ data: [] });

    const { data } = await supabase
      .from('chats')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({
      error: "Server error!"
    },
      { status: 500 }
    )
  }
}
