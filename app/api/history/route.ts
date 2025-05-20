import { cookies } from 'next/headers';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createServerActionClient({ cookies });
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
}
