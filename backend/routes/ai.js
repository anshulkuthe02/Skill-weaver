const express = require('express');
const { OpenAI } = require('openai');
const { body, validationResult } = require('express-validator');
const { asyncHandler } = require('../middleware/errorHandler');
const { checkAIUsage } = require('../middleware/auth');
const Template = require('../models/Template');

const router = express.Router();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// AI prompts for different sections
const AI_PROMPTS = {
  about: `Create a professional "About Me" section for a portfolio. The content should be:
- Personal and engaging
- Professional tone
- 2-3 paragraphs
- Highlight personality and passion
- Include career objectives
Based on this user data: {userData}`,

  skills: `Generate a comprehensive skills section for a portfolio. Include:
- Technical skills with proficiency levels
- Soft skills
- Tools and technologies
- Categorize by type (Frontend, Backend, Design, etc.)
Based on this user data: {userData}`,

  experience: `Create detailed work experience entries for a portfolio. Include:
- Job responsibilities and achievements
- Quantifiable results where possible
- Relevant technologies used
- Professional growth and impact
Based on this user data: {userData}`,

  projects: `Generate compelling project descriptions for a portfolio. Include:
- Project overview and objectives
- Technologies and tools used
- Challenges overcome
- Results and impact
- Key features and functionality
Based on this user data: {userData}`,

  bio: `Create a concise professional bio (150-200 words) that captures:
- Professional identity
- Key expertise areas
- Unique value proposition
- Personal touch
Based on this user data: {userData}`
};

// @route   POST /api/ai/generate-content
// @desc    Generate AI content for portfolio sections
// @access  Private
router.post('/generate-content', checkAIUsage, [
  body('section')
    .isIn(['about', 'skills', 'experience', 'projects', 'bio'])
    .withMessage('Invalid section type'),
  body('userData')
    .isObject()
    .withMessage('User data is required'),
  body('additionalContext')
    .optional()
    .isString()
    .withMessage('Additional context must be a string')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }

  const { section, userData, additionalContext = '' } = req.body;

  try {
    // Get the prompt template
    const promptTemplate = AI_PROMPTS[section];
    
    // Prepare user data string
    const userDataString = JSON.stringify(userData, null, 2);
    
    // Create the final prompt
    const prompt = promptTemplate.replace('{userData}', userDataString) + 
                  (additionalContext ? `\n\nAdditional context: ${additionalContext}` : '');

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a professional portfolio writer who creates compelling, personalized content for developers, designers, and other professionals. Your writing is engaging, professional, and tailored to showcase the individual\'s unique strengths and experiences.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 1000,
      temperature: 0.7
    });

    const generatedContent = completion.choices[0].message.content.trim();

    // Increment user's AI usage
    await req.user.incrementAIUsage();

    res.json({
      success: true,
      data: {
        section,
        content: generatedContent,
        tokensUsed: completion.usage.total_tokens,
        remainingGenerations: req.user.subscription.plan === 'free' ? 
          Math.max(0, 5 - req.user.usage.aiGenerations) : 'unlimited'
      }
    });

  } catch (error) {
    console.error('OpenAI API error:', error);
    
    if (error.response?.status === 401) {
      return res.status(503).json({
        success: false,
        error: 'AI service configuration error',
        message: 'Please contact support'
      });
    }
    
    if (error.response?.status === 429) {
      return res.status(429).json({
        success: false,
        error: 'AI service rate limit exceeded',
        message: 'Please try again in a few minutes'
      });
    }

    throw error;
  }
}));

// @route   POST /api/ai/customize-template
// @desc    AI-powered template customization
// @access  Private
router.post('/customize-template', checkAIUsage, [
  body('templateId')
    .isMongoId()
    .withMessage('Valid template ID is required'),
  body('userData')
    .isObject()
    .withMessage('User data is required'),
  body('customizationPreferences')
    .optional()
    .isObject()
    .withMessage('Customization preferences must be an object')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }

  const { templateId, userData, customizationPreferences = {} } = req.body;

  // Get template
  const template = await Template.findById(templateId);
  
  if (!template || !template.isActive) {
    return res.status(404).json({
      success: false,
      error: 'Template not found'
    });
  }

  // Check premium access
  if (template.isPremium && req.user.subscription.plan === 'free') {
    return res.status(403).json({
      success: false,
      error: 'Premium subscription required',
      message: 'Upgrade to Pro to customize premium templates'
    });
  }

  try {
    const customizationPrompt = `
You are an expert portfolio designer. Customize the following template for this user:

Template: ${template.name}
Category: ${template.category}
Template Description: ${template.description}

User Data: ${JSON.stringify(userData, null, 2)}

Customization Preferences: ${JSON.stringify(customizationPreferences, null, 2)}

Please provide customized content for each section of the portfolio that matches the template style and user's professional background. Return a JSON object with the following structure:
{
  "personalInfo": {
    "title": "Professional title",
    "bio": "Brief professional bio",
    "tagline": "Catchy professional tagline"
  },
  "sections": [
    {
      "type": "about",
      "title": "Section title",
      "content": "Customized content"
    }
  ],
  "colorScheme": {
    "primary": "#color",
    "secondary": "#color",
    "accent": "#color"
  },
  "suggestions": [
    "Improvement suggestions"
  ]
}
`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a professional portfolio designer and content creator. You create personalized, compelling portfolio content that highlights individual strengths and aligns with industry best practices. Always return valid JSON.'
        },
        {
          role: 'user',
          content: customizationPrompt
        }
      ],
      max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 1500,
      temperature: 0.8
    });

    let customizedContent;
    try {
      customizedContent = JSON.parse(completion.choices[0].message.content.trim());
    } catch (parseError) {
      // If JSON parsing fails, return the raw content
      customizedContent = {
        content: completion.choices[0].message.content.trim(),
        note: 'Content generated but not in expected JSON format'
      };
    }

    // Increment user's AI usage
    await req.user.incrementAIUsage();

    res.json({
      success: true,
      data: {
        template: {
          id: template._id,
          name: template.name,
          category: template.category
        },
        customizedContent,
        tokensUsed: completion.usage.total_tokens,
        remainingGenerations: req.user.subscription.plan === 'free' ? 
          Math.max(0, 5 - req.user.usage.aiGenerations) : 'unlimited'
      }
    });

  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}));

// @route   POST /api/ai/generate-portfolio
// @desc    Generate complete portfolio using AI
// @access  Private
router.post('/generate-portfolio', checkAIUsage, [
  body('userData')
    .isObject()
    .withMessage('User data is required'),
  body('templateId')
    .optional()
    .isMongoId()
    .withMessage('Valid template ID required if provided'),
  body('preferences')
    .optional()
    .isObject()
    .withMessage('Preferences must be an object')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }

  const { userData, templateId, preferences = {} } = req.body;

  let template = null;
  if (templateId) {
    template = await Template.findById(templateId);
    
    if (!template || !template.isActive) {
      return res.status(404).json({
        success: false,
        error: 'Template not found'
      });
    }

    // Check premium access
    if (template.isPremium && req.user.subscription.plan === 'free') {
      return res.status(403).json({
        success: false,
        error: 'Premium subscription required'
      });
    }
  }

  try {
    const portfolioPrompt = `
Create a complete portfolio for this professional:

User Data: ${JSON.stringify(userData, null, 2)}
Preferences: ${JSON.stringify(preferences, null, 2)}
${template ? `Template: ${template.name} (${template.category})` : 'No specific template - choose the best approach'}

Generate a comprehensive portfolio with the following JSON structure:
{
  "title": "Portfolio title",
  "personalInfo": {
    "fullName": "Full name",
    "title": "Professional title",
    "bio": "Professional bio (200-300 words)",
    "tagline": "Catchy tagline",
    "location": "Location",
    "email": "Email",
    "phone": "Phone (if provided)"
  },
  "sections": [
    {
      "type": "about",
      "title": "About Me",
      "content": "Detailed about section",
      "order": 1
    },
    {
      "type": "skills",
      "title": "Skills & Expertise",
      "content": [
        {
          "category": "Technical Skills",
          "skills": [
            {"name": "Skill name", "level": 4, "description": "Brief description"}
          ]
        }
      ],
      "order": 2
    },
    {
      "type": "experience",
      "title": "Professional Experience",
      "content": [
        {
          "company": "Company name",
          "position": "Job title",
          "location": "Location",
          "startDate": "2023-01-01",
          "endDate": "2023-12-31",
          "description": "Job description",
          "achievements": ["Achievement 1", "Achievement 2"]
        }
      ],
      "order": 3
    },
    {
      "type": "projects",
      "title": "Featured Projects",
      "content": [
        {
          "title": "Project name",
          "description": "Project description",
          "technologies": ["Tech 1", "Tech 2"],
          "category": "Project category",
          "status": "completed"
        }
      ],
      "order": 4
    }
  ],
  "design": {
    "theme": {
      "primaryColor": "#color",
      "secondaryColor": "#color",
      "accentColor": "#color"
    },
    "style": "modern/creative/professional"
  },
  "seo": {
    "metaTitle": "SEO title",
    "metaDescription": "SEO description",
    "keywords": ["keyword1", "keyword2"]
  }
}

Make it professional, engaging, and tailored to their background and industry.
`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert portfolio creator who generates comprehensive, professional portfolios tailored to individual backgrounds and industries. Always return valid JSON that showcases the person\'s unique strengths and achievements.'
        },
        {
          role: 'user',
          content: portfolioPrompt
        }
      ],
      max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 2000,
      temperature: 0.8
    });

    let generatedPortfolio;
    try {
      generatedPortfolio = JSON.parse(completion.choices[0].message.content.trim());
    } catch (parseError) {
      return res.status(500).json({
        success: false,
        error: 'Failed to generate structured portfolio',
        rawContent: completion.choices[0].message.content.trim()
      });
    }

    // Increment user's AI usage
    await req.user.incrementAIUsage();

    res.json({
      success: true,
      data: {
        portfolio: generatedPortfolio,
        template: template ? {
          id: template._id,
          name: template.name,
          category: template.category
        } : null,
        tokensUsed: completion.usage.total_tokens,
        remainingGenerations: req.user.subscription.plan === 'free' ? 
          Math.max(0, 5 - req.user.usage.aiGenerations) : 'unlimited'
      }
    });

  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}));

// @route   GET /api/ai/usage
// @desc    Get AI usage statistics for current user
// @access  Private
router.get('/usage', asyncHandler(async (req, res) => {
  const user = req.user;
  
  const usageData = {
    currentUsage: user.usage.aiGenerations,
    plan: user.subscription.plan,
    limits: {
      free: 5,
      pro: 'unlimited',
      enterprise: 'unlimited'
    },
    remainingGenerations: user.subscription.plan === 'free' ? 
      Math.max(0, 5 - user.usage.aiGenerations) : 'unlimited',
    canUseAI: user.canUseAI(),
    resetDate: user.subscription.plan === 'free' ? 
      new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1) : null
  };

  res.json({
    success: true,
    data: { usage: usageData }
  });
}));

// @route   POST /api/ai/suggest-improvements
// @desc    Get AI suggestions for portfolio improvement
// @access  Private
router.post('/suggest-improvements', [
  body('portfolioContent')
    .isObject()
    .withMessage('Portfolio content is required')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }

  const { portfolioContent } = req.body;

  try {
    const improvementPrompt = `
Analyze this portfolio and provide specific improvement suggestions:

Portfolio Content: ${JSON.stringify(portfolioContent, null, 2)}

Please provide suggestions in the following JSON format:
{
  "overallScore": 85,
  "improvements": [
    {
      "section": "about",
      "priority": "high",
      "suggestion": "Specific improvement suggestion",
      "reason": "Why this improvement is needed"
    }
  ],
  "strengths": ["What's working well"],
  "seoSuggestions": ["SEO improvement suggestions"],
  "designSuggestions": ["Design improvement suggestions"]
}

Focus on content quality, professional presentation, SEO optimization, and user engagement.
`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a portfolio optimization expert who provides actionable feedback to improve professional portfolios. Your suggestions are specific, practical, and focused on maximizing impact and professional appeal.'
        },
        {
          role: 'user',
          content: improvementPrompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.7
    });

    let suggestions;
    try {
      suggestions = JSON.parse(completion.choices[0].message.content.trim());
    } catch (parseError) {
      suggestions = {
        content: completion.choices[0].message.content.trim(),
        note: 'Suggestions generated but not in expected JSON format'
      };
    }

    res.json({
      success: true,
      data: {
        suggestions,
        tokensUsed: completion.usage.total_tokens
      }
    });

  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}));

module.exports = router;
