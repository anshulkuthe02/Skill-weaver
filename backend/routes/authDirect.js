const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const router = express.Router();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Simple email validation
const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

// @route   POST /api/auth-direct/signup
// @desc    Direct database signup (bypasses Supabase Auth restrictions)
// @access  Public
router.post('/signup', async (req, res) => {
  try {
    const { email, password, firstName, lastName, username } = req.body;

    console.log('🔐 Direct signup request for:', email);

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

    if (!isValidEmail(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    // Check if user already exists in Profile Details table
    const { data: existingProfile } = await supabase
      .from('Profile Details')
      .select('email')
      .eq('email', cleanEmail)
      .single();

    if (existingProfile) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate user ID
    const userId = uuidv4();

    console.log('📧 Creating user with ID:', userId);

    // Insert directly into Profile Details table
    const { error: profileError } = await supabase
      .from('Profile Details')
      .insert({
        id: userId,
        user_id: userId, // Same as ID for simplicity
        first_name: firstName || '',
        last_name: lastName || '',
        email: cleanEmail,
        username: username || '',
        password_hash: hashedPassword, // Store hashed password
        skills: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (profileError) {
      console.error('❌ Profile creation failed:', profileError);
      return res.status(500).json({
        success: false,
        message: 'Failed to create user account',
        debug: process.env.NODE_ENV === 'development' ? profileError : undefined
      });
    }

    console.log('✅ User created successfully with direct database insertion');

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        user: {
          id: userId,
          email: cleanEmail,
          first_name: firstName,
          last_name: lastName,
          username: username,
          created_at: new Date().toISOString()
        }
      }
    });

  } catch (error) {
    console.error('❌ Direct signup failed:', error);
    res.status(500).json({
      success: false,
      message: 'Server error - please try again'
    });
  }
});

// @route   POST /api/auth-direct/signin
// @desc    Direct database signin
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

    const cleanEmail = email.trim().toLowerCase();

    // Get user from Profile Details table
    const { data: userProfile, error } = await supabase
      .from('Profile Details')
      .select('*')
      .eq('email', cleanEmail)
      .single();

    if (error || !userProfile) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, userProfile.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Create session data (simplified)
    const sessionData = {
      access_token: 'direct_auth_' + uuidv4(),
      refresh_token: 'refresh_' + uuidv4(),
      expires_in: 3600,
      token_type: 'bearer',
      user: {
        id: userProfile.user_id,
        email: userProfile.email,
        user_metadata: {
          first_name: userProfile.first_name,
          last_name: userProfile.last_name,
          username: userProfile.username
        }
      }
    };

    console.log('✅ Direct signin successful for:', cleanEmail);

    res.json({
      success: true,
      message: 'Signed in successfully',
      data: {
        user: {
          id: userProfile.user_id,
          email: userProfile.email,
          first_name: userProfile.first_name,
          last_name: userProfile.last_name,
          username: userProfile.username
        },
        session: sessionData
      }
    });

  } catch (error) {
    console.error('❌ Direct signin failed:', error);
    res.status(500).json({
      success: false,
      message: 'Server error - please try again'
    });
  }
});

// @route   GET /api/auth-direct/test
// @desc    Test connection
// @access  Public
router.get('/test', async (req, res) => {
  try {
    // Test database connection
    const { data, error } = await supabase.from('Profile Details').select('count').limit(1);
    
    res.json({
      success: true,
      message: 'Direct auth system ready',
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
