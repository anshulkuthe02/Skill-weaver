const express = require('express');
const router = express.Router();

// API Documentation data
const apiDocumentation = {
  title: "SkillWeave Backend API",
  version: "1.0.0",
  description: "Comprehensive backend API for SkillWeave Portfolio Builder with AI integration",
  baseUrl: "http://localhost:3001/api",
  
  authentication: {
    type: "Bearer Token (JWT)",
    description: "Include JWT token in Authorization header: 'Bearer <token>'",
    endpoints: {
      register: "POST /auth/register",
      login: "POST /auth/login", 
      refresh: "POST /auth/refresh"
    }
  },

  endpoints: {
    auth: {
      description: "User authentication and account management",
      routes: [
        {
          method: "POST",
          path: "/auth/register",
          description: "Register new user account",
          auth: false,
          body: {
            username: "string (required)",
            email: "string (required)",
            password: "string (required, min 6 chars)",
            firstName: "string (optional)",
            lastName: "string (optional)"
          }
        },
        {
          method: "POST", 
          path: "/auth/login",
          description: "Login existing user",
          auth: false,
          body: {
            email: "string (required)",
            password: "string (required)"
          }
        },
        {
          method: "GET",
          path: "/auth/me",
          description: "Get current user information",
          auth: true
        }
      ]
    },

    templates: {
      description: "Portfolio template management",
      routes: [
        {
          method: "GET",
          path: "/templates",
          description: "Get all templates with optional filtering",
          auth: false,
          query: {
            category: "string (developer|creative|professional|business|student|freelancer)",
            difficulty: "string (beginner|intermediate|advanced)",
            isPremium: "boolean",
            search: "string",
            page: "number (default: 1)",
            limit: "number (default: 20)"
          }
        },
        {
          method: "GET",
          path: "/templates/:id",
          description: "Get specific template by ID",
          auth: false
        },
        {
          method: "GET",
          path: "/templates/featured",
          description: "Get featured templates",
          auth: false
        }
      ]
    },

    portfolios: {
      description: "Portfolio creation and management",
      routes: [
        {
          method: "GET",
          path: "/portfolios",
          description: "Get user's portfolios",
          auth: true
        },
        {
          method: "POST",
          path: "/portfolios",
          description: "Create new portfolio",
          auth: true,
          body: {
            title: "string (required)",
            templateId: "string (required)",
            content: "object (optional)"
          }
        },
        {
          method: "PUT",
          path: "/portfolios/:id",
          description: "Update existing portfolio",
          auth: true
        },
        {
          method: "POST",
          path: "/portfolios/:id/publish",
          description: "Publish portfolio to make it public",
          auth: true
        }
      ]
    },

    ai: {
      description: "AI-powered content generation",
      routes: [
        {
          method: "POST",
          path: "/ai/generate-content",
          description: "Generate AI content for portfolio sections",
          auth: true,
          body: {
            section: "string (about|skills|experience|projects|bio)",
            userData: "object (required)",
            additionalContext: "string (optional)"
          }
        },
        {
          method: "POST",
          path: "/ai/customize-template",
          description: "AI-powered template customization",
          auth: true,
          body: {
            templateId: "string (required)",
            userData: "object (required)",
            customizationPreferences: "object (optional)"
          }
        },
        {
          method: "POST",
          path: "/ai/generate-portfolio",
          description: "Generate complete portfolio using AI",
          auth: true,
          body: {
            userData: "object (required)",
            templateId: "string (optional)",
            preferences: "object (optional)"
          }
        }
      ]
    },

    uploads: {
      description: "File upload and image processing",
      routes: [
        {
          method: "POST",
          path: "/uploads/image",
          description: "Upload and process image",
          auth: true,
          contentType: "multipart/form-data",
          fields: {
            image: "file (required)"
          },
          query: {
            width: "number (optional)",
            height: "number (optional)",
            quality: "number (optional, 1-100)"
          }
        },
        {
          method: "POST",
          path: "/uploads/avatar",
          description: "Upload user avatar",
          auth: true,
          contentType: "multipart/form-data"
        }
      ]
    }
  },

  errorCodes: {
    400: "Bad Request - Invalid input data",
    401: "Unauthorized - Authentication required or invalid token",
    403: "Forbidden - Insufficient permissions or subscription required",
    404: "Not Found - Resource not found",
    429: "Too Many Requests - Rate limit exceeded",
    500: "Internal Server Error - Server error occurred"
  },

  subscriptionLimits: {
    free: {
      aiGenerations: 5,
      portfolios: "unlimited",
      premiumTemplates: false,
      customDomain: false
    },
    pro: {
      aiGenerations: "unlimited",
      portfolios: "unlimited", 
      premiumTemplates: true,
      customDomain: true
    },
    enterprise: {
      aiGenerations: "unlimited",
      portfolios: "unlimited",
      premiumTemplates: true,
      customDomain: true,
      prioritySupport: true
    }
  },

  examples: {
    registerUser: {
      request: {
        method: "POST",
        url: "/api/auth/register",
        body: {
          username: "johndoe",
          email: "john@example.com",
          password: "SecurePass123",
          firstName: "John",
          lastName: "Doe"
        }
      },
      response: {
        success: true,
        message: "User registered successfully",
        data: {
          user: {
            id: "64f8a1b2c3d4e5f6a7b8c9d0",
            username: "johndoe",
            email: "john@example.com"
          },
          tokens: {
            accessToken: "eyJhbGciOiJIUzI1NiIs...",
            refreshToken: "eyJhbGciOiJIUzI1NiIs..."
          }
        }
      }
    },

    generateContent: {
      request: {
        method: "POST",
        url: "/api/ai/generate-content",
        headers: {
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIs...",
          "Content-Type": "application/json"
        },
        body: {
          section: "about",
          userData: {
            name: "John Doe",
            profession: "Full Stack Developer",
            experience: "3 years",
            skills: ["React", "Node.js", "Python"]
          }
        }
      },
      response: {
        success: true,
        data: {
          section: "about",
          content: "I'm a passionate Full Stack Developer with 3 years of experience...",
          tokensUsed: 150,
          remainingGenerations: 4
        }
      }
    }
  }
};

// @route   GET /api/docs
// @desc    Get API documentation
// @access  Public
router.get('/docs', (req, res) => {
  res.json(apiDocumentation);
});

// @route   GET /api/docs/interactive
// @desc    Get interactive API documentation (simple HTML)
// @access  Public
router.get('/docs/interactive', (req, res) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SkillWeave API Documentation</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 10px; }
        h2 { color: #1e40af; margin-top: 30px; }
        h3 { color: #1f2937; }
        .endpoint { background: #f8fafc; padding: 15px; margin: 10px 0; border-radius: 6px; border-left: 4px solid #2563eb; }
        .method { display: inline-block; padding: 4px 8px; border-radius: 4px; font-weight: bold; color: white; font-size: 12px; }
        .get { background: #10b981; }
        .post { background: #3b82f6; }
        .put { background: #f59e0b; }
        .delete { background: #ef4444; }
        .auth-required { color: #dc2626; font-weight: bold; }
        .auth-optional { color: #059669; }
        pre { background: #1f2937; color: #f3f4f6; padding: 15px; border-radius: 6px; overflow-x: auto; }
        .section { margin: 20px 0; }
        .badge { background: #dbeafe; color: #1e40af; padding: 2px 6px; border-radius: 4px; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 SkillWeave Backend API Documentation</h1>
        <p><strong>Version:</strong> ${apiDocumentation.version}</p>
        <p><strong>Base URL:</strong> <code>${apiDocumentation.baseUrl}</code></p>
        <p>${apiDocumentation.description}</p>

        <div class="section">
            <h2>🔐 Authentication</h2>
            <p>This API uses JWT Bearer tokens for authentication. Include the token in the Authorization header:</p>
            <pre>Authorization: Bearer &lt;your-jwt-token&gt;</pre>
            <p><strong>Auth Endpoints:</strong></p>
            <ul>
                <li><span class="method post">POST</span> <code>/auth/register</code> - Register new user</li>
                <li><span class="method post">POST</span> <code>/auth/login</code> - Login user</li>
                <li><span class="method post">POST</span> <code>/auth/refresh</code> - Refresh token</li>
            </ul>
        </div>

        <div class="section">
            <h2>📋 Available Endpoints</h2>
            
            <h3>Authentication & Users</h3>
            <div class="endpoint">
                <span class="method post">POST</span> <code>/auth/register</code>
                <span class="auth-optional">Public</span>
                <p>Register a new user account</p>
            </div>
            <div class="endpoint">
                <span class="method post">POST</span> <code>/auth/login</code>
                <span class="auth-optional">Public</span>
                <p>Login existing user</p>
            </div>
            <div class="endpoint">
                <span class="method get">GET</span> <code>/users/profile</code>
                <span class="auth-required">Auth Required</span>
                <p>Get current user profile</p>
            </div>

            <h3>Templates</h3>
            <div class="endpoint">
                <span class="method get">GET</span> <code>/templates</code>
                <span class="auth-optional">Public</span>
                <p>Get all available templates with filtering options</p>
            </div>
            <div class="endpoint">
                <span class="method get">GET</span> <code>/templates/featured</code>
                <span class="auth-optional">Public</span>
                <p>Get featured templates</p>
            </div>

            <h3>Portfolios</h3>
            <div class="endpoint">
                <span class="method get">GET</span> <code>/portfolios</code>
                <span class="auth-required">Auth Required</span>
                <p>Get user's portfolios</p>
            </div>
            <div class="endpoint">
                <span class="method post">POST</span> <code>/portfolios</code>
                <span class="auth-required">Auth Required</span>
                <p>Create new portfolio</p>
            </div>

            <h3>AI Services</h3>
            <div class="endpoint">
                <span class="method post">POST</span> <code>/ai/generate-content</code>
                <span class="auth-required">Auth Required</span> <span class="badge">Usage Limits Apply</span>
                <p>Generate AI content for portfolio sections</p>
            </div>
            <div class="endpoint">
                <span class="method post">POST</span> <code>/ai/generate-portfolio</code>
                <span class="auth-required">Auth Required</span> <span class="badge">Usage Limits Apply</span>
                <p>Generate complete portfolio using AI</p>
            </div>

            <h3>File Uploads</h3>
            <div class="endpoint">
                <span class="method post">POST</span> <code>/uploads/image</code>
                <span class="auth-required">Auth Required</span>
                <p>Upload and process images</p>
            </div>
        </div>

        <div class="section">
            <h2>💰 Subscription Limits</h2>
            <ul>
                <li><strong>Free Plan:</strong> 5 AI generations per month, public templates only</li>
                <li><strong>Pro Plan:</strong> Unlimited AI generations, premium templates access</li>
                <li><strong>Enterprise Plan:</strong> All Pro features + priority support</li>
            </ul>
        </div>

        <div class="section">
            <h2>🔗 Quick Links</h2>
            <ul>
                <li><a href="/api">API Status</a></li>
                <li><a href="/api/health">Health Check</a></li>
                <li><a href="/api/docs">Full Documentation (JSON)</a></li>
            </ul>
        </div>

        <div class="section">
            <h2>📞 Support</h2>
            <p>For API support or questions, please contact the development team.</p>
        </div>
    </div>
</body>
</html>`;

  res.send(html);
});

module.exports = router;
