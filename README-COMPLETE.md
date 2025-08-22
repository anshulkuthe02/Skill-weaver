# SkillWeave - Complete Full-Stack Portfolio Builder

A modern, full-stack web application for creating and managing professional portfolios with AI-powered features. Built with React TypeScript frontend and Node.js/Express backend, integrated with Supabase for authentication and data management.

## 🚀 Features

### Frontend (React TypeScript)
- **Modern UI/UX**: Built with React 18, TypeScript, and Tailwind CSS
- **Authentication**: Complete Supabase Auth integration with secure session management
- **Portfolio Builder**: Drag-and-drop interface for creating custom portfolios
- **Template System**: Pre-built templates with Supabase backend integration
- **Real-time Updates**: Live preview and auto-save functionality
- **Responsive Design**: Mobile-first approach with responsive layouts
- **Privacy Compliant**: GDPR-compliant with privacy policy and cookie management

### Backend (Node.js/Express)
- **RESTful API**: Express.js server with comprehensive endpoint coverage
- **Supabase Integration**: Complete database operations with RLS policies
- **Authentication**: JWT-based auth with Supabase integration
- **File Management**: Upload and storage capabilities
- **Health Monitoring**: Database connectivity and system health checks
- **CORS Support**: Configured for secure cross-origin requests

### Database (Supabase PostgreSQL)
- **Comprehensive Schema**: 11-table normalized database structure
- **Security**: Row Level Security (RLS) policies for data protection
- **Real-time**: Supabase real-time subscriptions for live updates
- **Authentication**: Integrated user management and profile system

## 📁 Project Structure

```
skill-weave-site/
├── src/                          # Frontend React application
│   ├── components/              # Reusable UI components
│   ├── pages/                   # Page components
│   ├── services/               # API and business logic services
│   ├── contexts/               # React context providers
│   ├── config/                 # Configuration files
│   └── hooks/                  # Custom React hooks
├── backend/                     # Backend Node.js application
│   ├── config/                 # Backend configuration
│   ├── routes/                 # API route handlers
│   ├── middleware/             # Express middleware
│   ├── models/                 # Data models
│   ├── database/               # Database utilities
│   ├── scripts/                # Utility scripts
│   └── server.js              # Main server file
├── public/                     # Static frontend assets
└── docs/                       # Documentation files
```

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS + Custom Components
- **State Management**: React Context + Hooks
- **Routing**: React Router v6
- **Authentication**: Supabase Auth
- **HTTP Client**: Supabase Client
- **Build Tool**: Vite
- **Linting**: ESLint + TypeScript

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth + JWT
- **File Upload**: Multer
- **CORS**: cors middleware
- **Environment**: dotenv
- **Process Management**: Built-in clustering

### Database
- **Primary**: Supabase (PostgreSQL)
- **Features**: Row Level Security, Real-time subscriptions
- **Authentication**: Supabase Auth integration
- **Storage**: Supabase Storage for file uploads

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project
- Git

### 1. Clone Repository
```bash
git clone https://github.com/anshulkuthe02/skill-weave-site.git
cd skill-weave-site
```

### 2. Frontend Setup
```bash
# Install frontend dependencies
npm install

# Copy environment template
cp .env.example .env

# Configure Supabase credentials in .env
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install backend dependencies
npm install

# Copy environment template
cp .env.example .env

# Configure backend environment in backend/.env
# SUPABASE_URL=your_supabase_url
# SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
# PORT=5000
```

### 4. Database Setup
```bash
# Run the database schema setup (from root directory)
# Execute schema.sql in your Supabase SQL editor
```

### 5. Start Development
```bash
# Start backend server (from backend directory)
cd backend
npm start

# Start frontend development server (from root directory)
cd ..
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Copy your project URL and anon key
3. Run the provided `schema.sql` to set up the database
4. Configure Row Level Security policies
5. Update environment variables in both frontend and backend

### Environment Variables

#### Frontend (.env)
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### Backend (backend/.env)
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
PORT=5000
NODE_ENV=development
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout
- `GET /api/auth/user` - Get current user

### Portfolio Endpoints
- `GET /api/portfolios` - Get user portfolios
- `POST /api/portfolios` - Create new portfolio
- `PUT /api/portfolios/:id` - Update portfolio
- `DELETE /api/portfolios/:id` - Delete portfolio
- `POST /api/portfolios/:id/publish` - Publish portfolio

### Template Endpoints
- `GET /api/templates` - Get available templates
- `GET /api/templates/:id` - Get specific template

## 🏗️ Database Schema

The application uses a comprehensive 11-table schema including:
- `users` - User profiles and settings
- `portfolios` - Portfolio metadata and configuration
- `projects` - Project information and details
- `skills` - User skills and proficiency levels
- `experiences` - Work experience records
- `education` - Educational background
- `templates` - Portfolio templates
- `portfolio_analytics` - Usage analytics
- `user_activities` - Activity logging
- `portfolio_templates` - Template assignments
- `portfolio_customizations` - Custom styling

## 🔒 Security Features

- **Authentication**: Supabase Auth with JWT tokens
- **Authorization**: Row Level Security (RLS) policies
- **Data Validation**: Input sanitization and validation
- **CORS**: Configured cross-origin resource sharing
- **Environment Security**: Secure environment variable management
- **Privacy Compliance**: GDPR-compliant data handling

## 📱 Features Overview

### User Management
- Secure registration and login
- Profile management and customization
- Activity tracking and analytics
- Session management

### Portfolio Builder
- Drag-and-drop interface
- Real-time preview
- Template customization
- Project showcase
- Skills visualization
- Experience timeline
- Education display

### Content Management
- Rich text editing
- Image upload and management
- Document storage
- Template library
- Theme customization

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
```bash
# Build for production
npm run build

# Deploy the dist/ folder to your hosting service
```

### Backend Deployment (Railway/Heroku)
```bash
# From backend directory
cd backend

# Set up production environment variables
# Deploy to your chosen platform
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation in the `/docs` folder
- Review the setup guides in the project root

## 🔮 Roadmap

- [ ] Advanced template editor
- [ ] AI-powered content suggestions
- [ ] Social media integration
- [ ] Advanced analytics dashboard
- [ ] Mobile app development
- [ ] Team collaboration features

---

**Built with ❤️ using React, TypeScript, Node.js, and Supabase**
