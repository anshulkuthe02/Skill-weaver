const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        profile: req.user.profile,
        preferences: req.user.preferences,
        subscription: req.user.subscription,
        usage: req.user.usage,
        isEmailVerified: req.user.isEmailVerified,
        createdAt: req.user.createdAt,
        lastLogin: req.user.lastLogin
      }
    }
  });
}));

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  body('profile.firstName')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters'),
  body('profile.lastName')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters'),
  body('profile.bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio must be less than 500 characters'),
  body('profile.location')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Location must be less than 100 characters'),
  body('profile.website')
    .optional()
    .isURL()
    .withMessage('Please provide a valid website URL')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }

  const { profile, preferences } = req.body;

  // Update profile fields
  if (profile) {
    Object.keys(profile).forEach(key => {
      if (profile[key] !== undefined) {
        req.user.profile[key] = profile[key];
      }
    });
  }

  // Update preferences
  if (preferences) {
    Object.keys(preferences).forEach(key => {
      if (preferences[key] !== undefined) {
        req.user.preferences[key] = preferences[key];
      }
    });
  }

  await req.user.save();

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        profile: req.user.profile,
        preferences: req.user.preferences
      }
    }
  });
}));

// @route   PUT /api/users/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }

  const { currentPassword, newPassword } = req.body;

  // Get user with password
  const user = await User.findById(req.user._id).select('+password');

  // Check current password
  const isCurrentPasswordValid = await user.comparePassword(currentPassword);
  
  if (!isCurrentPasswordValid) {
    return res.status(400).json({
      success: false,
      error: 'Invalid current password'
    });
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: 'Password changed successfully'
  });
}));

// @route   GET /api/users/dashboard
// @desc    Get user dashboard data
// @access  Private
router.get('/dashboard', asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Get user's portfolios
  const portfolios = await Portfolio.find({ userId })
    .populate('templateId', 'name category')
    .sort({ lastModified: -1 })
    .limit(5);

  // Get portfolio statistics
  const portfolioStats = await Portfolio.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  // Calculate total views
  const totalViews = await Portfolio.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: null,
        totalViews: { $sum: '$analytics.views' },
        totalUniqueVisitors: { $sum: '$analytics.uniqueVisitors' }
      }
    }
  ]);

  const stats = {
    totalPortfolios: portfolios.length,
    published: portfolioStats.find(s => s._id === 'published')?.count || 0,
    drafts: portfolioStats.find(s => s._id === 'draft')?.count || 0,
    totalViews: totalViews[0]?.totalViews || 0,
    totalUniqueVisitors: totalViews[0]?.totalUniqueVisitors || 0,
    aiGenerationsUsed: req.user.usage.aiGenerations,
    templatesUsed: req.user.usage.templatesUsed.length
  };

  res.json({
    success: true,
    data: {
      user: {
        id: req.user._id,
        username: req.user.username,
        profile: req.user.profile,
        subscription: req.user.subscription
      },
      recentPortfolios: portfolios,
      statistics: stats
    }
  });
}));

// @route   GET /api/users/activity
// @desc    Get user activity history
// @access  Private
router.get('/activity', asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // Get user's portfolios with activity data
  const portfolios = await Portfolio.find({ userId: req.user._id })
    .populate('templateId', 'name category')
    .sort({ lastModified: -1 })
    .skip(skip)
    .limit(limitNum);

  // Get total count
  const totalPortfolios = await Portfolio.countDocuments({ userId: req.user._id });

  // Format activity data
  const activities = portfolios.map(portfolio => ({
    id: portfolio._id,
    type: 'portfolio',
    title: portfolio.title,
    status: portfolio.status,
    template: portfolio.templateId?.name,
    lastModified: portfolio.lastModified,
    views: portfolio.analytics.views,
    uniqueVisitors: portfolio.analytics.uniqueVisitors
  }));

  res.json({
    success: true,
    data: {
      activities,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalPortfolios / limitNum),
        totalItems: totalPortfolios,
        hasNextPage: pageNum < Math.ceil(totalPortfolios / limitNum),
        hasPrevPage: pageNum > 1
      }
    }
  });
}));

// @route   DELETE /api/users/account
// @desc    Delete user account
// @access  Private
router.delete('/account', [
  body('password').notEmpty().withMessage('Password confirmation is required')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }

  const { password } = req.body;

  // Get user with password
  const user = await User.findById(req.user._id).select('+password');

  // Verify password
  const isPasswordValid = await user.comparePassword(password);
  
  if (!isPasswordValid) {
    return res.status(400).json({
      success: false,
      error: 'Invalid password'
    });
  }

  // Soft delete - deactivate account
  user.isActive = false;
  user.email = `deleted_${Date.now()}_${user.email}`;
  user.username = `deleted_${Date.now()}_${user.username}`;
  await user.save();

  // Archive user's portfolios
  await Portfolio.updateMany(
    { userId: req.user._id },
    { status: 'archived' }
  );

  res.json({
    success: true,
    message: 'Account deleted successfully'
  });
}));

// @route   POST /api/users/export-data
// @desc    Export user data
// @access  Private
router.post('/export-data', asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Get user data
  const user = await User.findById(userId).select('-password');
  
  // Get user's portfolios
  const portfolios = await Portfolio.find({ userId })
    .populate('templateId', 'name category');

  const exportData = {
    user: user.toObject(),
    portfolios: portfolios.map(p => p.toObject()),
    exportDate: new Date().toISOString(),
    totalPortfolios: portfolios.length
  };

  res.json({
    success: true,
    message: 'Data exported successfully',
    data: exportData
  });
}));

module.exports = router;
