# Google OAuth Setup Guide for EENAPATI

## Prerequisites
Before Google OAuth will work, you need to configure it in your Supabase project.

## Step 1: Configure Google OAuth in Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Providers**
3. Find **Google** in the list and click **Configure**
4. Enable Google OAuth by toggling it on
5. You'll need to provide:
   - **Client ID** (from Google Cloud Console)
   - **Client Secret** (from Google Cloud Console)

## Step 2: Set up Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API** and **Google OAuth2 API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
5. Configure the OAuth consent screen first if prompted
6. For **Application type**, select **Web application**
7. Add these **Authorized redirect URIs**:
   \`\`\`
   https://your-project-ref.supabase.co/auth/v1/callback
   http://localhost:3000/auth/callback (for local development)
   \`\`\`
8. Copy the **Client ID** and **Client Secret**

## Step 3: Configure Supabase with Google Credentials

1. Back in Supabase dashboard → **Authentication** → **Providers** → **Google**
2. Paste your **Client ID** and **Client Secret**
3. Save the configuration

## Step 4: Update Site URL (Important!)

1. In Supabase dashboard → **Authentication** → **Settings**
2. Set **Site URL** to your production domain (e.g., `https://your-app.vercel.app`)
3. Add **Additional Redirect URLs**:
   \`\`\`
   http://localhost:3000/auth/callback
   https://your-app.vercel.app/auth/callback
   \`\`\`

## Step 5: Environment Variables

Make sure these environment variables are set in your Vercel project:
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
\`\`\`

## Troubleshooting

### Common Issues:

1. **"Invalid redirect URI"**: Make sure the redirect URI in Google Cloud Console exactly matches your Supabase project's callback URL
2. **"OAuth provider not configured"**: Ensure Google OAuth is enabled in Supabase dashboard
3. **"Site URL mismatch"**: Check that your Site URL in Supabase matches your actual domain

### Testing:

1. Test locally first with `http://localhost:3000`
2. Deploy to Vercel and test with your production URL
3. Check browser developer tools for any console errors
4. Verify network requests are going to the correct callback URL

## Notes:

- The OAuth flow now properly uses the `/auth/callback` route
- Users will be redirected to `/chat` after successful authentication
- The callback route handles the OAuth code exchange automatically
