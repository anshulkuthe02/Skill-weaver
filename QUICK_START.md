# 🚀 SkillWeave Deployment Guide

## Quick Setup Commands

### 1. Clone and Setup
```bash
git clone https://github.com/anshulkuthe02/skill-weave-site.git
cd skill-weave-site
```

### 2. Frontend Setup
```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your Supabase credentials
```

### 3. Backend Setup
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit backend/.env with your Supabase credentials
```

### 4. Database Setup
1. Create Supabase project
2. Run `schema.sql` in Supabase SQL editor
3. Copy project URL and keys to environment files

### 5. Start Development
```bash
# Terminal 1: Start backend
cd backend
npm start

# Terminal 2: Start frontend
cd ..
npm run dev
```

## Environment Variables

### Frontend (.env)
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Backend (backend/.env)
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
PORT=5000
```

## 🎉 You're All Set!

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Complete Supabase integration with no localStorage dependencies
- Full authentication and portfolio management system
