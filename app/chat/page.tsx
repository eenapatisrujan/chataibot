import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ChatInterface from '@/components/chat/chat-interface'

export default async function ChatPage() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // Fetch user data with error handling
  const { data, error } = await supabase.auth.getUser()

  // Log error for debugging (optional, remove in production or use a logging service)
  if (error) {
    console.error('Authentication error:', error.message)
    redirect('/auth/login?error=auth_failed')
  }

  // Redirect if no user is found
  if (!data?.user) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-white">
      <ChatInterface user={data.user} />
    </div>
  )
}