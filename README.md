# SkillWeaver - Portfolio Builder

A modern full-stack portfolio builder with React TypeScript frontend and Node.js backend, integrated with Supabase for authentication and data management.

## 🚀 Quick Setup After Cloning

### Prerequisites
- **Node.js 18+** and npm - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **Supabase Account** - [Create free account](https://supabase.com)
- **Git** installed on your system

### Step 1: Clone and Navigate
```bash
git clone https://github.com/anshulkuthe02/skill-weave-site.git
cd skill-weave-site
```

### Step 2: Frontend Setup
```bash
# Install frontend dependencies
npm install

# Create environment file from template
cp .env.example .env

# Edit .env with your Supabase credentials:
# VITE_SUPABASE_URL=your_supabase_project_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 3: Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install backend dependencies
npm install

# Create backend environment file
cp .env.example .env

# Edit backend/.env with your credentials:
# SUPABASE_URL=your_supabase_project_url
# SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
# PORT=5000
# NODE_ENV=development
```

### Step 4: Database Setup
1. **Create Supabase Project**: Go to [Supabase Dashboard](https://app.supabase.com)
2. **Create New Project**: Click "New Project" and follow setup
3. **Get Credentials**: 
   - Project URL: Settings → API → Project URL
   - Anon Key: Settings → API → Project API keys → anon/public
   - Service Role Key: Settings → API → Project API keys → service_role
4. **Run Database Schema**: 
   - Go to SQL Editor in Supabase Dashboard
   - Copy contents of `schema.sql` from root directory
   - Execute the SQL to create all tables and policies

### Step 5: Start Development Servers

**Terminal 1 - Backend Server:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend Development Server:**
```bash
# From root directory
npm run dev
```

### Step 6: Access Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 🔧 Environment Configuration

### Frontend Environment (.env)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### Backend Environment (backend/.env)
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
PORT=5000
NODE_ENV=development
```

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Vite** for build tooling
- **Supabase Client** for authentication and data
- **React Router** for navigation

### Backend
- **Node.js** with Express.js
- **Supabase** for database and authentication
- **JWT** token-based authentication
- **CORS** enabled for cross-origin requests

### Database
- **Supabase PostgreSQL** with Row Level Security
- **11-table schema** for comprehensive data management
- **Real-time subscriptions** for live updates

## 📝 Key Features

- ✅ **No localStorage dependencies** - Complete Supabase integration
- ✅ **Secure authentication** - JWT-based with Supabase Auth
- ✅ **Portfolio management** - Create, edit, and publish portfolios
- ✅ **Template system** - Pre-built templates with customization
- ✅ **Real-time updates** - Live preview and auto-save
- ✅ **Mobile responsive** - Works on all device sizes

## 🚨 Troubleshooting

### Common Issues:

**1. Supabase Connection Errors:**
- Verify your environment variables are correct
- Check that your Supabase project is active
- Ensure RLS policies are set up (run schema.sql)

**2. CORS Errors:**
- Backend server should be running on port 5000
- Frontend should proxy API calls correctly

**3. Authentication Issues:**
- Verify anon key and service role key are correct
- Check that auth is enabled in Supabase dashboard

### Get Help:
- Check [QUICK_START.md](./QUICK_START.md) for simplified setup
- Review [README-COMPLETE.md](./README-COMPLETE.md) for detailed documentation
- Create an issue in the GitHub repository

## 🔗 Useful Links

- **Repository**: https://github.com/anshulkuthe02/skill-weave-site
- **Supabase Dashboard**: https://app.supabase.com
- **Documentation**: See README-COMPLETE.md for full details

---

**Ready to build amazing portfolios! 🎨**
