# SkillWeave Supabase Setup Guide

This guide will help you set up Supabase for the SkillWeave project.

## Prerequisites

1. A Supabase account (create one at [supabase.com](https://supabase.com))
2. Node.js and npm installed
3. Git (for version control)

## Step 1: Create a New Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `skillweave-portfolio`
   - **Database Password**: Generate a strong password and save it securely
   - **Region**: Choose the closest region to your users
5. Click "Create new project"
6. Wait for the project to be set up (usually takes 1-2 minutes)

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to Settings > API
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **Anon public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
   - **Service role key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

## Step 3: Set Up Environment Variables

### Frontend Environment Variables
Create a `.env` file in the `skill-weave-site` directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_public_key_here

# API Configuration (if using custom backend)
VITE_API_URL=http://localhost:3001/api

# Application Configuration
VITE_APP_NAME=SkillWeave
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=development
```

### Backend Environment Variables
Create a `.env` file in the `skill-weave-backend` directory:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_anon_public_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3001
NODE_ENV=development

# OpenAI Configuration (optional)
OPENAI_API_KEY=your_openai_api_key_here

# CORS Configuration
FRONTEND_URL=http://localhost:8081

# File Upload Configuration
MAX_FILE_SIZE=5000000
UPLOAD_DIR=uploads
```

## Step 4: Set Up the Database Schema

1. In your Supabase dashboard, go to the SQL Editor
2. Copy the contents of `skill-weave-backend/database/schema.sql`
3. Paste it into the SQL Editor
4. Click "Run" to execute the schema
5. Verify that all tables were created in the Table Editor

## Step 5: Configure Row Level Security (RLS)

The schema already includes RLS policies, but you may need to adjust them:

1. Go to Authentication > Policies in your Supabase dashboard
2. Review the policies for each table
3. Make sure they align with your security requirements

## Step 6: Set Up Storage Buckets (Optional)

For file uploads (avatars, project images, etc.):

1. Go to Storage in your Supabase dashboard
2. Create a new bucket called `portfolio-files`
3. Set it to public if you want files to be publicly accessible
4. Configure bucket policies as needed

## Step 7: Configure Authentication

1. Go to Authentication > Settings in your Supabase dashboard
2. Configure your auth settings:
   - **Site URL**: `http://localhost:8081` (for development)
   - **Redirect URLs**: Add your production URLs when deploying
3. Enable the authentication providers you want (Email/Password is enabled by default)

## Step 8: Test the Connection

1. Start the backend server:
   ```bash
   cd skill-weave-backend
   npm install
   npm start
   ```

2. Start the frontend:
   ```bash
   cd skill-weave-site
   npm install
   npm run dev
   ```

3. Open your browser and test:
   - User registration/login
   - Creating a portfolio
   - Viewing templates

## Step 9: Sample Data (Optional)

To populate your database with sample templates and data:

1. In the SQL Editor, run the sample data queries from the schema file
2. Or create your own test data through the application

## Migration from MongoDB (If Applicable)

If you're migrating from MongoDB:

1. Export your existing data
2. Transform it to match the PostgreSQL schema
3. Import using Supabase's CSV import feature or SQL scripts

## Production Deployment

When ready for production:

1. Update environment variables with production URLs
2. Configure custom domains in Supabase
3. Set up proper backup policies
4. Configure monitoring and alerts
5. Review and tighten security policies

## Troubleshooting

### Common Issues:

1. **Connection Errors**: Check your environment variables
2. **Authentication Issues**: Verify your RLS policies
3. **API Errors**: Check the Supabase logs in the dashboard
4. **Permission Errors**: Review your user roles and policies

### Getting Help:

- Supabase Documentation: [docs.supabase.com](https://docs.supabase.com)
- Supabase Discord: [discord.supabase.com](https://discord.supabase.com)
- GitHub Issues: Create an issue in the SkillWeave repository

## Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use service role keys only on the backend**
3. **Implement proper RLS policies**
4. **Regularly rotate your keys**
5. **Monitor your usage and costs**
6. **Enable database backups**

## Performance Optimization

1. **Add database indexes** for frequently queried fields
2. **Use Supabase Edge Functions** for complex logic
3. **Implement caching** strategies
4. **Monitor query performance** in the dashboard
5. **Use connection pooling** for high-traffic applications

---

## Next Steps

After completing this setup:

1. Test all functionality thoroughly
2. Set up continuous integration/deployment
3. Configure monitoring and analytics
4. Plan for scaling and performance optimization
5. Implement additional features as needed

Your SkillWeave application should now be fully integrated with Supabase for authentication, database operations, and file storage!
