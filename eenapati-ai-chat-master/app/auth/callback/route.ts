import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/chat'
  const source = searchParams.get('source');

  if (code) {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    const { error, data } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
        const { user } = data;
        const currentTime = new Date().getTime();
        const createdAt = new Date(user.created_at).getTime();
        const isNewUser = (currentTime - createdAt) < 60000; // 60 seconds threshold for new user detection

        if (source === 'login' && isNewUser) {
            return NextResponse.redirect(`${origin}/auth/login?new_user=true`);
        } else if (source === 'signup' && !isNewUser) {
            return NextResponse.redirect(`${origin}/auth/login?existing_user=true`);
        }
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/error`)
}
