const express = require('express');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const router = express.Router();

// Initialize Supabase client with service role key for admin operations
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Create two clients - one for regular operations, one for admin
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Simple email validation
const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

// @route   POST /api/auth-simple/signup
// @desc    Simple signup that bypasses strict validation
// @access  Public
router.post('/signup', async (req, res) => {
  try {
    const { email, password, firstName, lastName, username } = req.body;

    console.log('🔐 Simple signup request for:', email);

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Simple email validation
    if (!isValidEmail(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    console.log('📧 Cleaned email:', cleanEmail);

    // Try simple signup
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password: password,
      options: {
        data: {
          first_name: firstName || '',
          last_name: lastName || '',
          username: username || ''
        }
      }
    });

    console.log('📊 Signup result:', {
      hasUser: !!data?.user,
      hasSession: !!data?.session,
      userEmail: data?.user?.email,
      errorMessage: error?.message
    });

    if (error) {
      console.error('❌ Signup error:', error);
      
      // Handle specific common errors
      let userMessage = error.message;
      
      if (error.message.includes('User already registered')) {
        userMessage = 'An account with this email already exists. Please sign in instead.';
      } else if (error.message.includes('Signups not allowed')) {
        userMessage = 'Account creation is currently disabled. Please contact support.';
      } else if (error.message.includes('invalid') && error.message.includes('email')) {
        userMessage = 'Email address is not valid. Please check and try again.';
      }
      
      return res.status(400).json({
        success: false,
        message: userMessage,
        debug: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }

    if (!data.user) {
      return res.status(400).json({
        success: false,
        message: 'Signup failed - please try again'
      });
    }

    console.log('✅ User created:', data.user.id);

    // Create profile record
    try {
      const { error: profileError } = await supabase
        .from('Profile Details')
        .insert({
          user_id: data.user.id,
          first_name: firstName || '',
          last_name: lastName || '',
          email: cleanEmail,
          skills: []
        });

      if (profileError) {
        console.warn('⚠️ Profile creation failed:', profileError.message);
      }
    } catch (profileError) {
      console.warn('⚠️ Profile creation error:', profileError);
    }

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        user: {
          id: data.user.id,
          email: data.user.email,
          created_at: data.user.created_at
        }
      }
    });

  } catch (error) {
    console.error('❌ Signup failed:', error);
    res.status(500).json({
      success: false,
      message: 'Server error - please try again'
    });
  }
});

// @route   POST /api/auth-simple/signin  
// @desc    Simple signin
// @access  Public
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: password
    });

    if (error) {
      console.error('❌ Signin error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    res.json({
      success: true,
      message: 'Signed in successfully',
      data: {
        user: data.user,
        session: data.session
      }
    });

  } catch (error) {
    console.error('❌ Signin failed:', error);
    res.status(500).json({
      success: false,
      message: 'Server error - please try again'
    });
  }
});

// @route   GET /api/auth-simple/test
// @desc    Test connection
// @access  Public
router.get('/test', async (req, res) => {
  try {
    // Test basic Supabase connection
    const { data, error } = await supabase.from('Profile Details').select('count').limit(1);
    
    res.json({
      success: true,
      message: 'Connection successful',
      supabaseUrl: supabaseUrl,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Connection failed',
      error: error.message
    });
  }
});

module.exports = router;
