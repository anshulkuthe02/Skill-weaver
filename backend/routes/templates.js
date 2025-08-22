const express = require('express');
const { body, validationResult } = require('express-validator');
const Template = require('../models/Template');
const { asyncHandler } = require('../middleware/errorHandler');
const { optionalAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/templates
// @desc    Get all templates with filtering and pagination
// @access  Public
router.get('/', optionalAuth, asyncHandler(async (req, res) => {
  const {
    category,
    subcategory,
    difficulty,
    isPremium,
    tags,
    search,
    sort = 'popular',
    page = 1,
    limit = 20
  } = req.query;

  // Build query
  const query = { isActive: true };

  if (category) query.category = category;
  if (subcategory) query.subcategory = subcategory;
  if (difficulty) query.difficulty = difficulty;
  if (isPremium !== undefined) query.isPremium = isPremium === 'true';
  if (tags) {
    const tagArray = tags.split(',').map(tag => tag.trim().toLowerCase());
    query.tags = { $in: tagArray };
  }

  // Search functionality
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } }
    ];
  }

  // Check if user has access to premium templates
  if (!req.user || req.user.subscription.plan === 'free') {
    // If not authenticated or free plan, exclude premium templates
    if (isPremium === undefined) {
      query.isPremium = false;
    }
  }

  // Sort options
  let sortQuery = {};
  switch (sort) {
    case 'popular':
      sortQuery = { 'statistics.downloads': -1, 'statistics.rating.average': -1 };
      break;
    case 'rating':
      sortQuery = { 'statistics.rating.average': -1, 'statistics.rating.count': -1 };
      break;
    case 'newest':
      sortQuery = { createdAt: -1 };
      break;
    case 'oldest':
      sortQuery = { createdAt: 1 };
      break;
    case 'name':
      sortQuery = { name: 1 };
      break;
    default:
      sortQuery = { 'statistics.downloads': -1 };
  }

  // Pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // Execute query
  const templates = await Template.find(query)
    .sort(sortQuery)
    .skip(skip)
    .limit(limitNum)
    .populate('createdBy', 'username profile.firstName profile.lastName')
    .select('-files.templateCode'); // Exclude template code from list view

  // Get total count for pagination
  const totalTemplates = await Template.countDocuments(query);

  res.json({
    success: true,
    data: {
      templates,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalTemplates / limitNum),
        totalTemplates,
        hasNextPage: pageNum < Math.ceil(totalTemplates / limitNum),
        hasPrevPage: pageNum > 1
      },
      filters: {
        category,
        subcategory,
        difficulty,
        isPremium,
        tags,
        search,
        sort
      }
    }
  });
}));

// @route   GET /api/templates/categories
// @desc    Get template categories with counts
// @access  Public
router.get('/categories', optionalAuth, asyncHandler(async (req, res) => {
  const query = { isActive: true };

  // Check if user has access to premium templates
  if (!req.user || req.user.subscription.plan === 'free') {
    query.isPremium = false;
  }

  const categories = await Template.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        subcategories: { $addToSet: '$subcategory' }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  res.json({
    success: true,
    data: { categories }
  });
}));

// @route   GET /api/templates/featured
// @desc    Get featured templates
// @access  Public
router.get('/featured', optionalAuth, asyncHandler(async (req, res) => {
  const query = { isFeatured: true, isActive: true };

  // Check if user has access to premium templates
  if (!req.user || req.user.subscription.plan === 'free') {
    query.isPremium = false;
  }

  const templates = await Template.find(query)
    .sort({ 'statistics.rating.average': -1 })
    .limit(6)
    .populate('createdBy', 'username profile.firstName profile.lastName')
    .select('-files.templateCode');

  res.json({
    success: true,
    data: { templates }
  });
}));

// @route   GET /api/templates/popular
// @desc    Get popular templates
// @access  Public
router.get('/popular', optionalAuth, asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;
  
  const query = { isActive: true };

  // Check if user has access to premium templates
  if (!req.user || req.user.subscription.plan === 'free') {
    query.isPremium = false;
  }

  const templates = await Template.find(query)
    .sort({ 'statistics.downloads': -1, 'statistics.rating.average': -1 })
    .limit(parseInt(limit))
    .populate('createdBy', 'username profile.firstName profile.lastName')
    .select('-files.templateCode');

  res.json({
    success: true,
    data: { templates }
  });
}));

// @route   GET /api/templates/:id
// @desc    Get single template by ID
// @access  Public
router.get('/:id', optionalAuth, asyncHandler(async (req, res) => {
  const template = await Template.findById(req.params.id)
    .populate('createdBy', 'username profile.firstName profile.lastName');

  if (!template || !template.isActive) {
    return res.status(404).json({
      success: false,
      error: 'Template not found'
    });
  }

  // Check if user has access to premium template
  if (template.isPremium && (!req.user || req.user.subscription.plan === 'free')) {
    // Return template info but without code
    const templateData = template.toObject();
    delete templateData.files.templateCode;
    
    return res.json({
      success: true,
      data: { 
        template: templateData,
        requiresPremium: true,
        message: 'Upgrade to Pro to access this premium template'
      }
    });
  }

  // Increment view count
  await template.incrementViews();

  res.json({
    success: true,
    data: { template }
  });
}));

// @route   GET /api/templates/:slug/preview
// @desc    Get template preview data
// @access  Public
router.get('/:slug/preview', optionalAuth, asyncHandler(async (req, res) => {
  const template = await Template.findOne({ 
    slug: req.params.slug,
    isActive: true 
  }).select('name category description preview features difficulty estimatedTime statistics isPremium');

  if (!template) {
    return res.status(404).json({
      success: false,
      error: 'Template not found'
    });
  }

  res.json({
    success: true,
    data: { template }
  });
}));

// @route   POST /api/templates/:id/download
// @desc    Download/use template
// @access  Private
router.post('/:id/download', asyncHandler(async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
  }

  const template = await Template.findById(req.params.id);

  if (!template || !template.isActive) {
    return res.status(404).json({
      success: false,
      error: 'Template not found'
    });
  }

  // Check if user has access to premium template
  if (template.isPremium) {
    // Verify user and subscription in the actual route handler
    const jwt = require('jsonwebtoken');
    const User = require('../models/User');
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user || user.subscription.plan === 'free') {
      return res.status(403).json({
        success: false,
        error: 'Premium subscription required',
        message: 'Upgrade to Pro to download premium templates'
      });
    }
  }

  // Increment download count
  await template.incrementDownloads();

  res.json({
    success: true,
    message: 'Template downloaded successfully',
    data: {
      template: {
        id: template._id,
        name: template.name,
        files: template.files,
        structure: template.structure,
        design: template.design
      }
    }
  });
}));

// @route   POST /api/templates/:id/rate
// @desc    Rate a template
// @access  Private
router.post('/:id/rate', [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }

  const { rating } = req.body;
  
  const template = await Template.findById(req.params.id);

  if (!template || !template.isActive) {
    return res.status(404).json({
      success: false,
      error: 'Template not found'
    });
  }

  await template.addRating(rating);

  res.json({
    success: true,
    message: 'Rating added successfully',
    data: {
      newRating: template.formattedRating,
      ratingCount: template.statistics.rating.count
    }
  });
}));

// @route   POST /api/templates
// @desc    Create new template (Admin only)
// @access  Private/Admin
router.post('/', requireAdmin, [
  body('name').notEmpty().withMessage('Template name is required'),
  body('category').isIn(['developer', 'creative', 'professional', 'business', 'student', 'freelancer'])
    .withMessage('Invalid category'),
  body('description').notEmpty().withMessage('Description is required'),
  body('difficulty').isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Invalid difficulty level')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }

  const template = new Template({
    ...req.body,
    createdBy: req.user._id
  });

  await template.save();

  res.status(201).json({
    success: true,
    message: 'Template created successfully',
    data: { template }
  });
}));

// @route   PUT /api/templates/:id
// @desc    Update template (Admin only)
// @access  Private/Admin
router.put('/:id', requireAdmin, asyncHandler(async (req, res) => {
  const template = await Template.findById(req.params.id);

  if (!template) {
    return res.status(404).json({
      success: false,
      error: 'Template not found'
    });
  }

  const updatedTemplate = await Template.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    message: 'Template updated successfully',
    data: { template: updatedTemplate }
  });
}));

// @route   DELETE /api/templates/:id
// @desc    Delete template (Admin only)
// @access  Private/Admin
router.delete('/:id', requireAdmin, asyncHandler(async (req, res) => {
  const template = await Template.findById(req.params.id);

  if (!template) {
    return res.status(404).json({
      success: false,
      error: 'Template not found'
    });
  }

  // Soft delete - set isActive to false
  template.isActive = false;
  await template.save();

  res.json({
    success: true,
    message: 'Template deleted successfully'
  });
}));

module.exports = router;
