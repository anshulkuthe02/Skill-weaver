# Supabase Setup Guide

## Prerequisites
- A Supabase account (sign up at https://app.supabase.com)

## Step 1: Create a New Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `skill-weave` (or any name you prefer)
   - Database Password: Choose a strong password (save this!)
   - Region: Choose the closest region to your users
5. Click "Create new project"
6. Wait for the project to be created (this may take a few minutes)

## Step 2: Get Your Project Credentials

1. In your Supabase project dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://abcdefghijk.supabase.co`)
   - **anon/public key** (a long string starting with `eyJ...`)

## Step 3: Update Environment Variables

1. Open the `.env` file in your project root
2. Replace the placeholder values:

```env
# Replace these with your actual Supabase credentials
VITE_SUPABASE_URL=https://your-project-ref.supabase.co  # Your Project URL
VITE_SUPABASE_ANON_KEY=your-anon-key-here              # Your anon/public key
```

Example:
```env
VITE_SUPABASE_URL=https://abcdefghijk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzA5MjU5NDYsImV4cCI6MTk4NjUwMTk0Nn0.example-key
```

## Step 4: Set Up Database Schema

1. In your Supabase project dashboard, go to **SQL Editor**
2. Copy the contents of `schema.sql` from your project
3. Paste it into the SQL Editor
4. Click "Run" to execute the schema

## Step 5: Restart Development Server

1. Stop your development server (Ctrl+C)
2. Start it again:
   ```bash
   npm run dev
   ```

## Step 6: Test the Setup

1. Open your application in the browser
2. Try to create an account
3. Check the Supabase dashboard > **Authentication** > **Users** to see if the user was created
4. Check **Table Editor** to see if data is being stored

## Troubleshooting

### Common Issues:

1. **"Failed to fetch" error**
   - Check that your VITE_SUPABASE_URL is correct
   - Ensure there are no trailing slashes in the URL
   - Verify the URL is accessible (you can visit it in your browser)

2. **"Invalid API key" error**
   - Check that your VITE_SUPABASE_ANON_KEY is correct
   - Make sure you copied the anon/public key, not the service role key

3. **"Project not found" error**
   - Ensure your project is fully created and active in Supabase
   - Check that the project URL matches exactly

4. **Database errors**
   - Make sure you've run the schema.sql file
   - Check that all tables were created successfully
   - Verify RLS policies are enabled

### Environment Variables Not Loading:

If your environment variables aren't loading:

1. Make sure the `.env` file is in the root directory of your project
2. Restart your development server completely
3. Check that variable names start with `VITE_` (required for Vite)
4. Ensure there are no spaces around the `=` sign

### Security Notes:

- Never commit your actual Supabase credentials to version control
- The anon key is safe to use in frontend applications
- Keep your service role key secret and never use it in frontend code
- Enable Row Level Security (RLS) on all tables (already included in schema.sql)

## Next Steps

Once Supabase is configured:
1. User registration and login will work
2. Portfolio data will be saved to Supabase
3. Real-time features will be available
4. Your dashboard will show actual user data

For more advanced configuration, refer to the [Supabase Documentation](https://supabase.com/docs).
