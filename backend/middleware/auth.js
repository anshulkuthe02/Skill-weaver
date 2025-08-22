const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to authenticate JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Fetch user from database to ensure they still exist and are active
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'User not found'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'Account is deactivated'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Access denied',
        message: 'Token expired'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Access denied',
        message: 'Invalid token'
      });
    }

    console.error('Auth middleware error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Authentication failed'
    });
  }
};

// Middleware to check if user is admin
const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'Authentication required'
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Admin privileges required'
      });
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Authorization check failed'
    });
  }
};

// Middleware to check subscription level
const requireSubscription = (requiredPlan = 'pro') => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: 'Access denied',
          message: 'Authentication required'
        });
      }

      const planHierarchy = {
        'free': 0,
        'pro': 1,
        'enterprise': 2
      };

      const userPlanLevel = planHierarchy[req.user.subscription.plan] || 0;
      const requiredPlanLevel = planHierarchy[requiredPlan] || 1;

      if (userPlanLevel < requiredPlanLevel) {
        return res.status(403).json({
          error: 'Subscription required',
          message: `${requiredPlan} subscription or higher required for this feature`,
          currentPlan: req.user.subscription.plan,
          requiredPlan: requiredPlan
        });
      }

      // Check if subscription is active
      if (req.user.subscription.status !== 'active') {
        return res.status(403).json({
          error: 'Subscription inactive',
          message: 'Please renew your subscription to access this feature',
          status: req.user.subscription.status
        });
      }

      next();
    } catch (error) {
      console.error('Subscription middleware error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Subscription check failed'
      });
    }
  };
};

// Middleware to check AI usage limits
const checkAIUsage = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'Authentication required'
      });
    }

    if (!req.user.canUseAI()) {
      return res.status(429).json({
        error: 'Usage limit exceeded',
        message: 'AI generation limit reached for your current plan',
        currentUsage: req.user.usage.aiGenerations,
        plan: req.user.subscription.plan,
        suggestion: 'Upgrade to Pro for unlimited AI generations'
      });
    }

    next();
  } catch (error) {
    console.error('AI usage middleware error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Usage check failed'
    });
  }
};

// Middleware to validate email verification
const requireEmailVerification = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'Authentication required'
      });
    }

    if (!req.user.isEmailVerified) {
      return res.status(403).json({
        error: 'Email verification required',
        message: 'Please verify your email address to access this feature'
      });
    }

    next();
  } catch (error) {
    console.error('Email verification middleware error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Email verification check failed'
    });
  }
};

// Optional authentication - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        
        if (user && user.isActive) {
          req.user = user;
        }
      } catch (error) {
        // Ignore token errors for optional auth
        console.log('Optional auth token error:', error.message);
      }
    }

    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next(); // Continue even if there's an error
  }
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireSubscription,
  checkAIUsage,
  requireEmailVerification,
  optionalAuth
};
