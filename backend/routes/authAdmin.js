const express = require('express');
const router = express.Router();
const { supabaseAdmin, supabase } = require('../config/supabase-admin');

// @route   GET /api/auth-admin/test
// @desc    Test admin connection and permissions
// @access  Public
router.get('/test', async (req, res) => {
  try {
    console.log('🔧 Testing admin connection...');
    
    // Test admin access by listing users
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    
    if (error) {
      console.error('❌ Admin test failed:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Admin connection failed',
        error: error.message,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
      });
    }
    
    console.log('✅ Admin connection successful');
    
    res.json({ 
      success: true, 
      message: 'Admin access working',
      userCount: data.users.length,
      hasServiceKey: true,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Admin test error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// @route   POST /api/auth-admin/signup
// @desc    Create user using admin API (bypasses email restrictions)
// @access  Public
router.post('/signup', async (req, res) => {
  try {
    const { email, password, firstName, lastName, username } = req.body;

    console.log('🔐 Admin signup request for:', email);

    // Validate input
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

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const userExists = existingUsers.users.some(user => user.email === cleanEmail);

    if (userExists) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists'
      });
    }

    // Create user using admin API (bypasses all email restrictions)
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: cleanEmail,
      password: password,
      email_confirm: true, // Auto-confirm email to skip verification
      user_metadata: {
        first_name: firstName || '',
        last_name: lastName || '',
        username: username || '',
        created_at: new Date().toISOString()
      }
    });

    if (error) {
      console.error('❌ Supabase admin signup error:', error);
      return res.status(400).json({
        success: false,
        message: `Signup failed: ${error.message}`,
        error: error
      });
    }

    console.log('✅ User created successfully via admin API:', data.user.id);

    // Create profile in Profile Details table
    const { error: profileError } = await supabaseAdmin
      .from('Profile Details')
      .insert([
        {
          user_id: data.user.id,
          email: cleanEmail,
          first_name: firstName || '',
          last_name: lastName || '',
          username: username || '',
          skills: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);

    if (profileError) {
      console.warn('⚠️ Profile creation warning:', profileError);
      // Continue anyway - profile can be created later
    } else {
      console.log('✅ Profile created in Profile Details table');
    }

    res.json({
      success: true,
      message: 'Account created successfully',
      data: {
        user: {
          id: data.user.id,
          email: data.user.email,
          first_name: firstName || '',
          last_name: lastName || '',
          username: username || '',
          created_at: data.user.created_at
        }
      }
    });

  } catch (error) {
    console.error('❌ Admin signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during signup',
      error: error.message
    });
  }
});

// @route   POST /api/auth-admin/signin
// @desc    Sign in user using regular Supabase auth
// @access  Public
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 Sign in request for:', email);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Use regular Supabase client for sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: password
    });

    if (error) {
      console.error('❌ Sign in failed:', error);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        error: error.message
      });
    }

    console.log('✅ Sign in successful for:', cleanEmail);

    // Get user profile from Profile Details table
    const { data: profile } = await supabase
      .from('Profile Details')
      .select('*')
      .eq('user_id', data.user.id)
      .single();

    res.json({
      success: true,
      message: 'Signed in successfully',
      data: {
        user: data.user,
        session: data.session,
        profile: profile || null
      }
    });

  } catch (error) {
    console.error('❌ Sign in error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during sign in',
      error: error.message
    });
  }
});

// @route   POST /api/auth-admin/signout
// @desc    Sign out user
// @access  Public
router.post('/signout', async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Sign out failed',
        error: error.message
      });
    }

    res.json({
      success: true,
      message: 'Signed out successfully'
    });

  } catch (error) {
    console.error('❌ Sign out error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during sign out',
      error: error.message
    });
  }
});

module.exports = router;
