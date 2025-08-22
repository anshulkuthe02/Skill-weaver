const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const router = express.Router();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Validation rules
const signupValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('firstName')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters'),
  body('lastName')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters'),
  body('username')
    .optional()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores')
];

// @route   POST /api/supabase-auth/signup
// @desc    Register a new user using Supabase
// @access  Public
router.post('/signup', signupValidation, async (req, res) => {
  try {
    console.log('🔐 Backend signup request:', req.body);

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password, firstName, lastName, username } = req.body;

    // Clean and validate email
    const cleanEmail = email.trim().toLowerCase();
    
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    console.log('📧 Processing signup for email:', cleanEmail);

    // Try regular signup first (for when public registration is enabled)
    let signupData, signupError;
    
    try {
      const result = await supabase.auth.signUp({
        email: cleanEmail,
        password: password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            username: username
          }
        }
      });
      
      signupData = result.data;
      signupError = result.error;
      
      console.log('📊 Regular signup attempt result:', { 
        hasUser: !!signupData?.user, 
        hasSession: !!signupData?.session,
        error: signupError?.message 
      });
      
    } catch (error) {
      console.log('❌ Regular signup failed, trying admin creation:', error.message);
      
      // If regular signup fails, try admin creation (requires service role key)
      try {
        const adminResult = await supabase.auth.admin.createUser({
          email: cleanEmail,
          password: password,
          email_confirm: true, // Auto-confirm email
          user_metadata: {
            first_name: firstName,
            last_name: lastName,
            username: username
          }
        });
        
        signupData = adminResult.data;
        signupError = adminResult.error;
        
        console.log('📊 Admin creation result:', { 
          hasUser: !!signupData?.user, 
          error: signupError?.message 
        });
        
      } catch (adminError) {
        console.error('❌ Admin creation also failed:', adminError);
        return res.status(500).json({
          success: false,
          message: 'User registration is currently disabled. Please contact support.',
          suggestion: 'Check Supabase Auth settings: Authentication > Settings > Enable "Allow new signups"'
        });
      }
    }

    if (signupError) {
      console.error('❌ Supabase signup error:', signupError);
      console.error('❌ Full error details:', JSON.stringify(signupError, null, 2));
      
      // Handle specific error cases
      if (signupError.message.includes('not allowed') || signupError.message.includes('disabled')) {
        return res.status(400).json({
          success: false,
          message: 'User registration is currently disabled',
          suggestion: 'Please contact support or try again later',
          technicalDetails: signupError.message
        });
      }
      
      if (signupError.message.includes('already registered')) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists',
          suggestion: 'Try signing in instead'
        });
      }
      
      return res.status(400).json({
        success: false,
        message: `Signup failed: ${signupError.message}`,
        error: signupError
      });
    }

    if (!signupData?.user) {
      return res.status(400).json({
        success: false,
        message: 'Signup failed: No user data returned'
      });
    }

    console.log('✅ User created successfully:', signupData.user?.id);

    // Create profile in Profile Details table
    if (signupData.user) {
      try {
        const { error: profileError } = await supabase
          .from('Profile Details')
          .insert({
            user_id: signupData.user.id,
            first_name: firstName,
            last_name: lastName,
            email: cleanEmail,
            skills: []
          });

        if (profileError) {
          console.warn('⚠️ Profile creation failed:', profileError);
        } else {
          console.log('✅ Profile created successfully');
        }
      } catch (profileError) {
        console.warn('⚠️ Profile creation error:', profileError);
      }
    }

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        user: {
          id: signupData.user.id,
          email: signupData.user.email,
          email_confirmed_at: signupData.user.email_confirmed_at,
          created_at: signupData.user.created_at
        },
        requiresEmailConfirmation: !signupData.session
      }
    });

  } catch (error) {
    console.error('❌ Backend signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// @route   POST /api/supabase-auth/signin
// @desc    Sign in user using Supabase
// @access  Public
router.post('/signin', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: password
    });

    if (error) {
      return res.status(401).json({
        success: false,
        message: `Sign in failed: ${error.message}`
      });
    }

    res.json({
      success: true,
      message: 'Sign in successful',
      data: {
        user: data.user,
        session: data.session
      }
    });

  } catch (error) {
    console.error('❌ Backend signin error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/supabase-auth/settings
// @desc    Check Supabase auth settings and provide setup instructions
// @access  Public
router.get('/settings', async (req, res) => {
  try {
    // Test basic connection
    const { data, error } = await supabase.from('Profile Details').select('count').limit(1);
    
    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Supabase connection failed',
        error: error.message
      });
    }

    res.json({
      success: true,
      message: 'Supabase connection successful',
      settings: {
        supabaseUrl: supabaseUrl,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        instructions: {
          enableSignups: [
            '1. Go to your Supabase dashboard',
            '2. Navigate to Authentication > Settings',
            '3. Find "Allow new signups" and enable it',
            '4. Optionally disable "Enable email confirmations" for easier testing'
          ],
          getServiceKey: [
            '1. Go to Settings > API',
            '2. Copy the "service_role" key',
            '3. Add it to your .env file as SUPABASE_SERVICE_ROLE_KEY'
          ]
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Settings check failed',
      error: error.message
    });
  }
});

// @route   GET /api/supabase-auth/test
// @desc    Test Supabase connection
// @access  Public
router.get('/test', async (req, res) => {
  try {
    // Test Supabase connection
    const { data, error } = await supabase.from('Profile Details').select('count').limit(1);
    
    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Supabase connection failed',
        error: error.message
      });
    }

    res.json({
      success: true,
      message: 'Supabase connection successful',
      supabaseUrl: supabaseUrl,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Test failed',
      error: error.message
    });
  }
});

// @route   POST /api/supabase-auth/validate-email
// @desc    Test email validation
// @access  Public
router.post('/validate-email', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    
    const cleanEmail = email.trim().toLowerCase();
    console.log('🧪 Testing email validation for:', cleanEmail);
    
    // Test multiple email validation approaches
    const validations = {
      basicRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail),
      strictRegex: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(cleanEmail),
      nodeBuiltin: false
    };
    
    // Test if email contains valid characters
    const hasInvalidChars = /[<>()[\]\\.,;:\s@"]/.test(cleanEmail.split('@')[0]);
    
    // Test domain validation
    const domain = cleanEmail.split('@')[1];
    const domainValid = domain && domain.includes('.') && domain.length > 3;
    
    res.json({
      success: true,
      email: cleanEmail,
      validations,
      domain,
      domainValid,
      hasInvalidChars,
      recommendation: validations.basicRegex ? 'Email appears valid' : 'Email format invalid'
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Validation test failed',
      error: error.message
    });
  }
});

module.exports = router;
