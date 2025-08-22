const express = require('express');
const { body, validationResult } = require('express-validator');
const Portfolio = require('../models/Portfolio');
const Template = require('../models/Template');
const { asyncHandler } = require('../middleware/errorHandler');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/portfolios
// @desc    Get user's portfolios
// @access  Private
router.get('/', asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10, sort = 'lastModified' } = req.query;
  
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // Build query
  const query = { userId: req.user._id };
  if (status) query.status = status;

  // Sort options
  let sortQuery = {};
  switch (sort) {
    case 'title':
      sortQuery = { title: 1 };
      break;
    case 'created':
      sortQuery = { createdAt: -1 };
      break;
    case 'views':
      sortQuery = { 'analytics.views': -1 };
      break;
    default:
      sortQuery = { lastModified: -1 };
  }

  // Get portfolios
  const portfolios = await Portfolio.find(query)
    .populate('templateId', 'name category preview.thumbnail')
    .sort(sortQuery)
    .skip(skip)
    .limit(limitNum);

  // Get total count
  const totalPortfolios = await Portfolio.countDocuments(query);

  res.json({
    success: true,
    data: {
      portfolios,
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

// @route   GET /api/portfolios/public
// @desc    Get public portfolios
// @access  Public
router.get('/public', optionalAuth, asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, category, search } = req.query;
  
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // Build query for public portfolios
  const query = {
    'privacy.isPublic': true,
    'privacy.showInDirectory': true,
    status: 'published'
  };

  // Add category filter
  if (category) {
    const template = await Template.findOne({ category });
    if (template) {
      query.templateId = template._id;
    }
  }

  // Add search filter
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { 'content.personalInfo.bio': { $regex: search, $options: 'i' } }
    ];
  }

  const portfolios = await Portfolio.find(query)
    .populate('userId', 'username profile.firstName profile.lastName profile.avatar')
    .populate('templateId', 'name category preview.thumbnail')
    .sort({ publishedAt: -1 })
    .skip(skip)
    .limit(limitNum)
    .select('-content.sections -design.customCSS'); // Exclude detailed content for listing

  const totalPortfolios = await Portfolio.countDocuments(query);

  res.json({
    success: true,
    data: {
      portfolios,
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

// @route   GET /api/portfolios/:id
// @desc    Get portfolio by ID
// @access  Private (owner) / Public (if public portfolio)
router.get('/:id', optionalAuth, asyncHandler(async (req, res) => {
  const portfolio = await Portfolio.findById(req.params.id)
    .populate('userId', 'username profile.firstName profile.lastName profile.avatar')
    .populate('templateId', 'name category preview.thumbnail features');

  if (!portfolio) {
    return res.status(404).json({
      success: false,
      error: 'Portfolio not found'
    });
  }

  // Check access permissions
  const isOwner = req.user && portfolio.userId._id.toString() === req.user._id.toString();
  const isPublic = portfolio.privacy.isPublic && portfolio.status === 'published';

  if (!isOwner && !isPublic) {
    return res.status(403).json({
      success: false,
      error: 'Access denied'
    });
  }

  // Check password protection for public portfolios
  if (!isOwner && portfolio.privacy.passwordProtected) {
    const { password } = req.query;
    if (!password || password !== portfolio.privacy.password) {
      return res.status(401).json({
        success: false,
        error: 'Password required',
        passwordProtected: true
      });
    }
  }

  // Increment views if not owner
  if (!isOwner) {
    await portfolio.incrementViews(true); // Assume unique visitor for simplicity
  }

  res.json({
    success: true,
    data: { portfolio }
  });
}));

// @route   GET /api/portfolios/slug/:slug
// @desc    Get portfolio by slug (public access)
// @access  Public
router.get('/slug/:slug', optionalAuth, asyncHandler(async (req, res) => {
  const portfolio = await Portfolio.findOne({ 
    slug: req.params.slug,
    status: 'published'
  })
    .populate('userId', 'username profile.firstName profile.lastName profile.avatar')
    .populate('templateId', 'name category preview.thumbnail features');

  if (!portfolio) {
    return res.status(404).json({
      success: false,
      error: 'Portfolio not found'
    });
  }

  // Check if portfolio is public
  if (!portfolio.privacy.isPublic) {
    // Check if user is the owner
    const isOwner = req.user && portfolio.userId._id.toString() === req.user._id.toString();
    if (!isOwner) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }
  }

  // Check password protection
  if (portfolio.privacy.passwordProtected) {
    const { password } = req.query;
    const isOwner = req.user && portfolio.userId._id.toString() === req.user._id.toString();
    
    if (!isOwner && (!password || password !== portfolio.privacy.password)) {
      return res.status(401).json({
        success: false,
        error: 'Password required',
        passwordProtected: true
      });
    }
  }

  // Increment views if not owner
  const isOwner = req.user && portfolio.userId._id.toString() === req.user._id.toString();
  if (!isOwner) {
    await portfolio.incrementViews(true);
  }

  res.json({
    success: true,
    data: { portfolio }
  });
}));

// @route   POST /api/portfolios
// @desc    Create new portfolio
// @access  Private
router.post('/', [
  body('title')
    .notEmpty()
    .withMessage('Portfolio title is required')
    .isLength({ max: 100 })
    .withMessage('Title must be less than 100 characters'),
  body('templateId')
    .isMongoId()
    .withMessage('Valid template ID is required'),
  body('content')
    .optional()
    .isObject()
    .withMessage('Content must be an object')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }

  const { title, templateId, content = {} } = req.body;

  // Verify template exists
  const template = await Template.findById(templateId);
  if (!template || !template.isActive) {
    return res.status(404).json({
      success: false,
      error: 'Template not found'
    });
  }

  // Check premium template access
  if (template.isPremium && req.user.subscription.plan === 'free') {
    return res.status(403).json({
      success: false,
      error: 'Premium subscription required',
      message: 'Upgrade to Pro to use premium templates'
    });
  }

  // Generate unique slug
  let slug = title.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  // Ensure slug is unique
  let slugExists = await Portfolio.findOne({ slug });
  let counter = 1;
  while (slugExists) {
    slug = `${slug}-${counter}`;
    slugExists = await Portfolio.findOne({ slug });
    counter++;
  }

  // Create portfolio
  const portfolio = new Portfolio({
    title,
    slug,
    userId: req.user._id,
    templateId,
    content: {
      personalInfo: {
        fullName: req.user.profile.fullName || '',
        email: req.user.email,
        ...content.personalInfo
      },
      ...content
    },
    domain: {
      subdomain: slug
    }
  });

  await portfolio.save();

  // Increment user's portfolio count
  req.user.usage.portfoliosCreated += 1;
  await req.user.save();

  // Increment template usage
  await template.incrementDownloads();

  res.status(201).json({
    success: true,
    message: 'Portfolio created successfully',
    data: { portfolio }
  });
}));

// @route   PUT /api/portfolios/:id
// @desc    Update portfolio
// @access  Private (owner only)
router.put('/:id', [
  body('title')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }

  const portfolio = await Portfolio.findById(req.params.id);

  if (!portfolio) {
    return res.status(404).json({
      success: false,
      error: 'Portfolio not found'
    });
  }

  // Check ownership
  if (portfolio.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      error: 'Access denied'
    });
  }

  // Update fields
  const allowedUpdates = [
    'title', 'content', 'design', 'seo', 'privacy', 'domain'
  ];

  allowedUpdates.forEach(field => {
    if (req.body[field] !== undefined) {
      portfolio[field] = req.body[field];
    }
  });

  // Update slug if title changed
  if (req.body.title && req.body.title !== portfolio.title) {
    let newSlug = req.body.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    // Ensure new slug is unique
    let slugExists = await Portfolio.findOne({ 
      slug: newSlug, 
      _id: { $ne: portfolio._id } 
    });
    let counter = 1;
    while (slugExists) {
      newSlug = `${newSlug}-${counter}`;
      slugExists = await Portfolio.findOne({ 
        slug: newSlug, 
        _id: { $ne: portfolio._id } 
      });
      counter++;
    }
    
    portfolio.slug = newSlug;
    if (!portfolio.domain.subdomain) {
      portfolio.domain.subdomain = newSlug;
    }
  }

  await portfolio.save();

  res.json({
    success: true,
    message: 'Portfolio updated successfully',
    data: { portfolio }
  });
}));

// @route   POST /api/portfolios/:id/publish
// @desc    Publish portfolio
// @access  Private (owner only)
router.post('/:id/publish', asyncHandler(async (req, res) => {
  const portfolio = await Portfolio.findById(req.params.id);

  if (!portfolio) {
    return res.status(404).json({
      success: false,
      error: 'Portfolio not found'
    });
  }

  // Check ownership
  if (portfolio.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      error: 'Access denied'
    });
  }

  if (portfolio.status === 'published') {
    return res.status(400).json({
      success: false,
      error: 'Portfolio is already published'
    });
  }

  await portfolio.publish();

  res.json({
    success: true,
    message: 'Portfolio published successfully',
    data: { 
      portfolio,
      publicUrl: portfolio.publicUrl
    }
  });
}));

// @route   DELETE /api/portfolios/:id
// @desc    Delete portfolio
// @access  Private (owner only)
router.delete('/:id', asyncHandler(async (req, res) => {
  const portfolio = await Portfolio.findById(req.params.id);

  if (!portfolio) {
    return res.status(404).json({
      success: false,
      error: 'Portfolio not found'
    });
  }

  // Check ownership
  if (portfolio.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      error: 'Access denied'
    });
  }

  await Portfolio.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Portfolio deleted successfully'
  });
}));

module.exports = router;
