# SkillWeave Backend

A comprehensive backend API for the SkillWeave Portfolio Builder platform with AI integration.

## Features

- **User Authentication & Authorization** - JWT-based auth with role management
- **AI-Powered Content Generation** - OpenAI integration for portfolio content
- **Template Management** - Portfolio templates with customization options
- **Portfolio Builder** - Create, edit, and publish portfolios
- **File Upload & Processing** - Image optimization and management
- **RESTful API** - Clean, documented endpoints
- **Database Integration** - MongoDB with Mongoose ODM
- **Security** - Rate limiting, CORS, input validation
- **Error Handling** - Comprehensive error management

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **AI Integration**: OpenAI API
- **File Processing**: Multer + Sharp
- **Validation**: Joi, express-validator
- **Security**: Helmet, CORS, bcryptjs
- **Development**: Nodemon, dotenv

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (running locally or MongoDB Atlas)
- OpenAI API key (for AI features)

### Installation

1. **Clone and install dependencies:**
   ```bash
   cd skill-weave-backend
   npm install
   ```

2. **Environment Setup:**
   Copy `.env` file and update with your values:
   ```bash
   # Required configurations
   MONGODB_URI=mongodb://localhost:27017/skillweave
   JWT_SECRET=your_super_secret_jwt_key_here
   OPENAI_API_KEY=your_openai_api_key_here
   
   # Optional configurations (defaults provided)
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:8081
   ```

3. **Database Setup:**
   ```bash
   # Seed templates (optional)
   npm run seed
   ```

4. **Start Development Server:**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh tokens
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/change-password` - Change password
- `GET /api/users/dashboard` - Get dashboard data
- `DELETE /api/users/account` - Delete account

### Templates
- `GET /api/templates` - Get all templates (with filters)
- `GET /api/templates/:id` - Get template by ID
- `GET /api/templates/featured` - Get featured templates
- `GET /api/templates/popular` - Get popular templates
- `POST /api/templates/:id/download` - Download template
- `POST /api/templates/:id/rate` - Rate template

### Portfolios
- `GET /api/portfolios` - Get user portfolios
- `POST /api/portfolios` - Create portfolio
- `GET /api/portfolios/:id` - Get portfolio by ID
- `PUT /api/portfolios/:id` - Update portfolio
- `DELETE /api/portfolios/:id` - Delete portfolio
- `POST /api/portfolios/:id/publish` - Publish portfolio
- `GET /api/portfolios/public` - Get public portfolios

### AI Services
- `POST /api/ai/generate-content` - Generate content for sections
- `POST /api/ai/customize-template` - AI template customization
- `POST /api/ai/generate-portfolio` - Generate complete portfolio
- `GET /api/ai/usage` - Get AI usage statistics
- `POST /api/ai/suggest-improvements` - Get improvement suggestions

### File Uploads
- `POST /api/uploads/image` - Upload and process image
- `POST /api/uploads/avatar` - Upload avatar
- `POST /api/uploads/portfolio-images` - Upload portfolio images
- `GET /api/uploads/user-images` - Get user's images
- `DELETE /api/uploads/image/:filename` - Delete image

## Project Structure

```
skill-weave-backend/
├── models/               # Database models
│   ├── User.js          # User schema
│   ├── Template.js      # Template schema
│   └── Portfolio.js     # Portfolio schema
├── routes/              # API route handlers
│   ├── auth.js         # Authentication routes
│   ├── users.js        # User management routes
│   ├── templates.js    # Template routes
│   ├── portfolios.js   # Portfolio routes
│   ├── ai.js          # AI service routes
│   └── uploads.js     # File upload routes
├── middleware/         # Custom middleware
│   ├── auth.js        # Authentication middleware
│   └── errorHandler.js # Error handling middleware
├── scripts/           # Utility scripts
│   └── seedTemplates.js # Database seeding
├── uploads/          # File upload directory
├── server.js         # Main server file
├── package.json      # Dependencies and scripts
└── .env             # Environment variables
```

## Key Features Explained

### Authentication System
- JWT-based authentication with access and refresh tokens
- Role-based access control (user, admin)
- Password hashing with bcrypt
- Email verification and password reset functionality

### AI Integration
- OpenAI GPT integration for content generation
- Template customization with AI suggestions
- Usage tracking and subscription-based limits
- Content optimization and improvement suggestions

### Template System
- Comprehensive template management
- Category-based organization
- Premium template access control
- Usage statistics and ratings

### Portfolio Builder
- Dynamic portfolio creation and editing
- Public/private portfolio options
- Custom domain support
- Analytics and view tracking

### File Management
- Image upload and optimization with Sharp
- Multiple format support with WebP conversion
- Automatic resizing and thumbnail generation
- User-specific file organization

## Development

### Available Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run seed` - Seed database with sample templates

### Environment Variables
See `.env` file for all available configuration options.

### Database Seeding
To populate the database with sample templates:
```bash
npm run seed
```

## Security Features

- Helmet.js for security headers
- CORS configuration
- Rate limiting
- Input validation and sanitization
- JWT token security
- File upload restrictions
- Password strength requirements

## API Documentation

For detailed API documentation, visit `/api` endpoint when the server is running, or check the route files for specific endpoint documentation.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please contact the development team or create an issue in the repository.
