# Complete Supabase Setup Instructions

## Current Status
✅ **Supabase URL Configured**: `https://lgddiqnuapkrowxekxxx.supabase.co`  
⚠️ **Missing**: VITE_SUPABASE_ANON_KEY in your `.env` file

## Step 1: Get Your Anon Key

1. Go to your Supabase project dashboard: https://app.supabase.com
2. Navigate to **Settings** → **API**
3. Copy the **anon/public key** (it's a long string that starts with `eyJ...`)

## Step 2: Update Your .env File

Open `d:\Profiler\skill-weave-site\.env` and replace:

```env
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

With your actual anon key:

```env
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkZGlxbnVhcGtyb3d4ZWt4eHgiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcwMDU2MjA4MCwiZXhwIjoyMDE2MTM4MDgwfQ.example-key-replace-with-yours
```

## Step 3: Set Up Your Database

1. In your Supabase dashboard, go to **SQL Editor**
2. Create a new query
3. Copy and paste the entire contents of `schema.sql` (located in your project root)
4. Click **Run** to execute the schema

This will create:
- All necessary tables (users, portfolios, projects, skills, etc.)
- Row Level Security policies
- Indexes for performance
- Triggers for automatic timestamps
- Sample template data

## Step 4: Test the Setup

1. Restart your development server:
   ```bash
   cd d:\Profiler\skill-weave-site
   npm run dev
   ```

2. Open your browser and navigate to the app
3. Try creating an account - it should now work with real Supabase!

## What This Setup Provides

### ✅ **Full Authentication**
- User registration and login
- Password reset functionality
- Secure session management
- User profiles with custom data

### ✅ **Portfolio Management**
- Create, edit, delete portfolios
- Multiple portfolio support per user
- Draft and published states
- Custom domains and SEO settings

### ✅ **Rich Portfolio Content**
- Projects with images and links
- Skills with proficiency levels
- Work experience tracking
- Education history
- File uploads for images/documents

### ✅ **Analytics & Insights**
- Portfolio view tracking
- User activity logging
- Performance analytics

### ✅ **Templates System**
- Pre-built portfolio templates
- Template categorization
- Rating and download tracking

### ✅ **Security**
- Row Level Security (RLS) enabled
- Users can only access their own data
- Public portfolios are viewable by everyone
- Secure file upload policies

## Verification Checklist

After completing the setup, verify these work:

- [ ] Create a new account (should appear in Supabase Auth > Users)
- [ ] Login with the account
- [ ] View dashboard (should show real user data, not mock data)
- [ ] Create a new portfolio (should save to Supabase)
- [ ] Check Supabase Table Editor to see your data

## Troubleshooting

### **"Failed to fetch" errors**
- Double-check your anon key is correct
- Ensure there are no extra spaces in the .env file
- Restart the development server

### **Permission denied errors**
- Verify the schema.sql was executed successfully
- Check that RLS policies were created
- Ensure you're logged in when trying to access data

### **User not appearing after signup**
- Check the `handle_new_user()` function was created
- Verify the trigger `on_auth_user_created` exists
- Look for errors in Supabase logs

## Need Help?

If you encounter any issues:
1. Check the browser console for error messages
2. Look at Supabase logs in your dashboard
3. Verify all tables were created correctly in Table Editor
4. Ensure your .env file has the correct values

Once you provide your anon key and complete this setup, your SkillWeave application will be fully functional with real data persistence!
