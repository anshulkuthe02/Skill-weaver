const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Import routes
const docsRoutes = require('./routes/docs');
const supabaseAuthRoutes = require('./routes/supabaseAuth');
const authSimpleRoutes = require('./routes/authSimple');
const authAdminRoutes = require('./routes/authAdmin');

// Import middleware
const { errorHandler } = require('./middleware/errorHandler');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://lgddiqnuapkrowxekxxx.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxnZGRpcW51YXBrcm93eGVreHh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyOTY2MTAsImV4cCI6MjA2Njg3MjYxMH0.zPmePQUXagXLg_xpcEHf2RS_k3gvdbhX6d93aia1FMs';

const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// CORS configuration - more permissive for development
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:8080',
      'http://localhost:8081',
      'http://127.0.0.1:8080',
      'http://127.0.0.1:8081',
      'http://localhost:3000',
      'http://127.0.0.1:3000'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Static files for uploads (create directory if it doesn't exist)
app.use('/uploads', express.static('uploads'));

// Routes - simplified without database dependencies
app.use('/api/docs', docsRoutes);
app.use('/api/supabase-auth', supabaseAuthRoutes);
app.use('/api/auth-simple', authSimpleRoutes);
app.use('/api/auth-admin', authAdminRoutes);

// Health check endpoint with Supabase connection test
app.options('/api/health', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.sendStatus(200);
});

app.get('/api/health', async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  
  try {
    // Test Supabase connection
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    const healthStatus = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      message: 'SkillWeave Backend API is running with Supabase integration',
      cors: 'enabled',
      supabase: {
        connected: !error,
        status: error ? 'Database schema not set up' : 'Connected',
        url: supabaseUrl,
        error: error?.message
      }
    };
    
    res.status(200).json(healthStatus);
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      message: 'Backend running but Supabase connection failed',
      error: error.message
    });
  }
});

// Templates endpoint - now connected to Supabase
app.get('/api/templates', async (req, res) => {
  try {
    const { data: templates, error } = await supabase
      .from('templates')
      .select('*')
      .eq('status', 'active')
      .order('featured', { ascending: false })
      .order('downloads', { ascending: false });

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      data: templates || [],
      message: 'Templates retrieved successfully from Supabase',
      total: templates?.length || 0
    });
  } catch (error) {
    console.error('Templates endpoint error:', error);
    
    // Fallback to mock data if Supabase isn't set up yet
    res.json({
      success: true,
      data: [
        {
          id: 'modern-template',
          name: 'Modern Portfolio',
          description: 'A clean and modern portfolio template',
          category: 'professional',
          featured: true,
          preview_url: '/templates/modern/preview.png',
          thumbnail_url: '/templates/modern/thumbnail.png',
          rating: 4.8,
          downloads: 1250
        },
        {
          id: 'creative-template',
          name: 'Creative Showcase',
          description: 'Perfect for designers and artists',
          category: 'creative',
          featured: true,
          preview_url: '/templates/creative/preview.png',
          thumbnail_url: '/templates/creative/thumbnail.png',
          rating: 4.6,
          downloads: 890
        },
        {
          id: 'minimal-template',
          name: 'Minimal Professional',
          description: 'Simple and elegant design',
          category: 'minimal',
          featured: false,
          preview_url: '/templates/minimal/preview.png',
          thumbnail_url: '/templates/minimal/thumbnail.png',
          rating: 4.7,
          downloads: 654
        }
      ],
      message: 'Templates retrieved successfully (fallback data - please set up database)',
      total: 3
    });
  }
});

// Mock AI endpoint
app.post('/api/ai/generate', (req, res) => {
  const { prompt, type } = req.body;
  
  if (!prompt) {
    return res.status(400).json({
      success: false,
      error: 'Prompt is required'
    });
  }
  
  // Simulate AI processing time
  setTimeout(() => {
    res.json({
      success: true,
      data: {
        generated_content: `This is mock AI-generated content for: "${prompt}". In a real implementation, this would be generated using OpenAI or another AI service.`,
        type: type || 'text',
        prompt: prompt,
        timestamp: new Date().toISOString()
      },
      message: 'Content generated successfully (mock data)'
    });
  }, 1000);
});

// Portfolio endpoints
app.get('/api/portfolios', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    const token = authHeader.substring(7);
    
    // Get user from Supabase using the token
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { data: portfolios, error } = await supabase
      .from('portfolios')
      .select(`
        *,
        projects (*),
        skills (*),
        experiences (*),
        education (*)
      `)
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      data: portfolios || [],
      total: portfolios?.length || 0
    });
  } catch (error) {
    console.error('Get portfolios error:', error);
    res.status(500).json({ error: 'Failed to fetch portfolios' });
  }
});

app.post('/api/portfolios', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    const token = authHeader.substring(7);
    
    // Get user from Supabase using the token
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const portfolioData = {
      user_id: user.id,
      title: req.body.title || 'Untitled Portfolio',
      description: req.body.description || '',
      content: req.body.content || {},
      visibility: req.body.visibility || 'private',
      status: req.body.status || 'draft'
    };

    const { data: portfolio, error } = await supabase
      .from('portfolios')
      .insert([portfolioData])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data: portfolio,
      message: 'Portfolio created successfully'
    });
  } catch (error) {
    console.error('Create portfolio error:', error);
    res.status(500).json({ error: 'Failed to create portfolio' });
  }
});

app.put('/api/portfolios/:id', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    const token = authHeader.substring(7);
    const portfolioId = req.params.id;
    
    // Get user from Supabase using the token
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const updateData = {
      title: req.body.title,
      description: req.body.description,
      content: req.body.content,
      visibility: req.body.visibility,
      status: req.body.status,
      updated_at: new Date().toISOString()
    };

    const { data: portfolio, error } = await supabase
      .from('portfolios')
      .update(updateData)
      .eq('id', portfolioId)
      .eq('user_id', user.id) // Ensure user owns the portfolio
      .select()
      .single();

    if (error) throw error;

    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    res.json({
      success: true,
      data: portfolio,
      message: 'Portfolio updated successfully'
    });
  } catch (error) {
    console.error('Update portfolio error:', error);
    res.status(500).json({ error: 'Failed to update portfolio' });
  }
});

app.delete('/api/portfolios/:id', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    const token = authHeader.substring(7);
    const portfolioId = req.params.id;
    
    // Get user from Supabase using the token
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { error } = await supabase
      .from('portfolios')
      .delete()
      .eq('id', portfolioId)
      .eq('user_id', user.id); // Ensure user owns the portfolio

    if (error) throw error;

    res.json({
      success: true,
      message: 'Portfolio deleted successfully'
    });
  } catch (error) {
    console.error('Delete portfolio error:', error);
    res.status(500).json({ error: 'Failed to delete portfolio' });
  }
});

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'SkillWeave Backend API',
    version: '1.0.0',
    status: 'running',
    mode: 'simplified',
    endpoints: {
      health: '/api/health',
      templates: '/api/templates',
      ai: '/api/ai/generate',
      documentation: '/api/docs'
    },
    note: 'Running in simplified mode without database connectivity.',
    documentation: 'Visit /api/docs for detailed API documentation'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    availableEndpoints: [
      '/api',
      '/api/health',
      '/api/templates',
      '/api/ai/generate',
      '/api/docs'
    ]
  });
});

// Error handling middleware (must be last)
// app.use(errorHandler); // Temporarily disabled for debugging

// Graceful shutdown handlers - more stable
process.on('SIGINT', () => {
  console.log('\n🔄 Received SIGINT - Server will continue running...');
  // Don't shutdown automatically, let user manually stop if needed
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM - keeping server running');
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Don't exit, just log
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit, just log
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 SkillWeave Backend Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API URL: http://localhost:${PORT}/api`);
  console.log(`📊 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📚 Documentation: http://localhost:${PORT}/api/docs`);
  console.log(`🎨 Templates: http://localhost:${PORT}/api/templates`);
  console.log(`🤖 AI Generate: POST http://localhost:${PORT}/api/ai/generate`);
  console.log('');
  console.log('✅ Backend is running in simplified mode (no database required)');
});

module.exports = { app, server };
