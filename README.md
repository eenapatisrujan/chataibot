# EENAPATI - AI Chatbot Application

A professional AI-powered chatbot application built with Next.js, Supabase, and Google's Gemini AI. Features cinematic animations, real-time chat, conversation history, and OAuth authentication.

> **Note:** EENAPATI always responds in professional, detailed plain text format. No markdown symbols or formatting are used in AI responses. All answers are structured with clear section titles, numbered or bulleted lists, and indented subpoints for clarity.

## 🚀 Features

- **Professional UI**: Clean, modern interface with cinematic animations
- **AI-Powered Chat**: Integration with Google's Gemini AI for intelligent conversations
- **Authentication**: Email/password and Google OAuth support
- **Chat History**: Save, search, and manage conversation history
- **Real-time Messaging**: Instant message delivery and typing indicators
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Database Integration**: Supabase for user management and data storage

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth with OAuth
- **AI**: Google Gemini API
- **Styling**: Tailwind CSS with custom animations

## 📋 Prerequisites

- Node.js 18+ installed
- A Supabase account and project
- A Google Cloud account with Gemini API access
- Git installed

## 🔧 Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Google Gemini AI
GEMINI_API_KEY=your_new_gemini_api_key   # <-- Update this value with your new Gemini API key

# Authentication Redirect (for development)
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🗄 Database Setup

1. **Create Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Copy your project URL and anon key

2. **Run Database Scripts**:
   Execute the following SQL scripts in your Supabase SQL editor in order:

   ```sql
   -- 1. Create profiles table
   CREATE TABLE IF NOT EXISTS public.profiles (
     id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
     email TEXT,
     full_name TEXT,
     avatar_url TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable RLS
   ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

   -- Create policies
   CREATE POLICY "Users can view own profile" ON public.profiles
     FOR SELECT USING (auth.uid() = id);

   CREATE POLICY "Users can update own profile" ON public.profiles
     FOR UPDATE USING (auth.uid() = id);

   -- 2. Create conversations table
   CREATE TABLE IF NOT EXISTS public.conversations (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
     title TEXT DEFAULT 'New Conversation',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

   CREATE POLICY "Users can manage own conversations" ON public.conversations
     FOR ALL USING (auth.uid() = user_id);

   -- 3. Create messages table
   CREATE TABLE IF NOT EXISTS public.messages (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
     content TEXT NOT NULL,
     role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

   CREATE POLICY "Users can manage messages in own conversations" ON public.messages
     FOR ALL USING (
       EXISTS (
         SELECT 1 FROM public.conversations 
         WHERE conversations.id = messages.conversation_id 
         AND conversations.user_id = auth.uid()
       )
     );

   -- 4. Create functions and triggers
   CREATE OR REPLACE FUNCTION public.handle_new_user()
   RETURNS TRIGGER AS $$
   BEGIN
     INSERT INTO public.profiles (id, email, full_name)
     VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;

   CREATE OR REPLACE TRIGGER on_auth_user_created
     AFTER INSERT ON auth.users
     FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
   ```

3. **Configure Authentication**:
   - In Supabase Dashboard, go to Authentication > Settings
   - Add your site URL: `http://localhost:3000`
   - Configure Google OAuth (optional):
     - Go to Authentication > Providers
     - Enable Google provider
     - Add your Google OAuth credentials

## 🚀 Installation & Setup

1. **Clone or Download the Project**:
   ```bash
   # If using git
   git clone <your-repo-url>
   cd eenapati-ai-chat

   # Or download and extract the ZIP file
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set Up Environment Variables**:
   - Copy the environment variables above into `.env.local`
   - Replace placeholder values with your actual credentials

4. **Run Database Scripts**:
   - Execute the SQL scripts in your Supabase SQL editor

5. **Start Development Server**:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open Application**:
   - Navigate to `http://localhost:3000`
   - Create an account or sign in
   - Start chatting with the AI!

## 📱 Usage

1. **Sign Up/Login**: Create an account or sign in with email or Google
2. **Start Chatting**: Click "New Chat" to begin a conversation
3. **Manage Conversations**: Use the sidebar to switch between chats
4. **Search History**: Use the search bar to find specific conversations
5. **Export Chats**: Right-click on conversations to export or delete

## 🎨 Customization

### Colors
The app uses a custom color scheme defined in `globals.css`:
- **Primary**: Charcoal Gray (#374151)
- **Background**: Off-White (#F9FAFB)
- **Accent**: Mint Green (#6EE7B7)

### Animations
Cinematic animations are defined in `globals.css` and can be customized:
- Particle effects
- Smooth transitions
- Hover animations
- Loading states

## 🔒 Security Features

- **Row Level Security (RLS)**: All database tables use RLS policies
- **Authentication**: Secure user authentication with Supabase
- **API Protection**: All API routes require authentication
- **Data Validation**: Input validation and sanitization
- **Rate Limiting**: Built-in rate limiting for API calls

## 📦 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**:
   - Verify Supabase URL and keys are correct
   - Ensure database scripts have been executed

2. **Authentication Not Working**:
   - Check redirect URLs in Supabase settings
   - Verify OAuth provider configuration

3. **AI Responses Not Working**:
   - Confirm Gemini API key is valid
   - Check API quota and billing

4. **Styling Issues**:
   - Clear browser cache
   - Verify Tailwind CSS is properly configured

## 📄 License

This project is licensed under the MIT License.

## 🤝 Support

For support or questions:
1. Check the troubleshooting section above
2. Review Supabase and Next.js documentation
3. Open an issue in the project repository

---

**EENAPATI** - Professional AI Chat Experience
