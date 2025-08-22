const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  content: {
    personalInfo: {
      fullName: String,
      title: String,
      bio: String,
      email: String,
      phone: String,
      location: String,
      website: String,
      avatar: String,
      socialLinks: {
        linkedin: String,
        github: String,
        twitter: String,
        instagram: String,
        behance: String,
        dribbble: String
      }
    },
    sections: [{
      id: String,
      type: {
        type: String,
        enum: ['about', 'skills', 'experience', 'education', 'projects', 'testimonials', 'contact', 'custom']
      },
      title: String,
      content: mongoose.Schema.Types.Mixed, // Flexible content structure
      order: Number,
      isVisible: {
        type: Boolean,
        default: true
      }
    }],
    skills: [{
      name: String,
      category: String,
      level: {
        type: Number,
        min: 1,
        max: 5
      },
      years: Number,
      description: String
    }],
    experience: [{
      company: String,
      position: String,
      location: String,
      startDate: Date,
      endDate: Date,
      isCurrent: {
        type: Boolean,
        default: false
      },
      description: String,
      achievements: [String],
      technologies: [String]
    }],
    education: [{
      institution: String,
      degree: String,
      field: String,
      location: String,
      startDate: Date,
      endDate: Date,
      gpa: String,
      description: String,
      achievements: [String]
    }],
    projects: [{
      title: String,
      description: String,
      longDescription: String,
      technologies: [String],
      category: String,
      images: [{
        url: String,
        alt: String,
        caption: String
      }],
      links: {
        demo: String,
        github: String,
        website: String
      },
      startDate: Date,
      endDate: Date,
      status: {
        type: String,
        enum: ['completed', 'in-progress', 'planned']
      },
      featured: {
        type: Boolean,
        default: false
      }
    }],
    testimonials: [{
      name: String,
      position: String,
      company: String,
      content: String,
      avatar: String,
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      date: Date
    }]
  },
  design: {
    theme: {
      name: String,
      primaryColor: String,
      secondaryColor: String,
      accentColor: String,
      backgroundColor: String,
      textColor: String
    },
    typography: {
      headingFont: String,
      bodyFont: String,
      fontSize: String
    },
    layout: {
      style: String,
      sidebar: {
        type: Boolean,
        default: false
      },
      animations: {
        type: Boolean,
        default: true
      }
    },
    customCSS: String
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
    ogImage: String,
    canonicalUrl: String
  },
  analytics: {
    views: {
      type: Number,
      default: 0
    },
    uniqueVisitors: {
      type: Number,
      default: 0
    },
    lastViewed: Date,
    referrers: [{
      source: String,
      count: {
        type: Number,
        default: 1
      }
    }]
  },
  generation: {
    method: {
      type: String,
      enum: ['manual', 'ai-assisted', 'fully-ai'],
      default: 'manual'
    },
    aiPrompts: [{
      section: String,
      prompt: String,
      response: String,
      timestamp: {
        type: Date,
        default: Date.now
      }
    }],
    generationHistory: [{
      version: String,
      changes: [String],
      method: String,
      timestamp: {
        type: Date,
        default: Date.now
      }
    }]
  },
  domain: {
    subdomain: String, // skillweave.com/portfolio/[subdomain]
    customDomain: String,
    isCustomDomainActive: {
      type: Boolean,
      default: false
    }
  },
  privacy: {
    isPublic: {
      type: Boolean,
      default: true
    },
    passwordProtected: {
      type: Boolean,
      default: false
    },
    password: String,
    allowDownload: {
      type: Boolean,
      default: true
    },
    showInDirectory: {
      type: Boolean,
      default: true
    }
  },
  backup: {
    autoBackup: {
      type: Boolean,
      default: true
    },
    backupFrequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      default: 'weekly'
    },
    lastBackup: Date
  },
  publishedAt: Date,
  lastModified: {
    type: Date,
    default: Date.now
  },
  version: {
    type: String,
    default: '1.0.0'
  }
}, {
  timestamps: true
});

// Indexes
portfolioSchema.index({ userId: 1, status: 1 });
portfolioSchema.index({ slug: 1 });
portfolioSchema.index({ 'domain.subdomain': 1 });
portfolioSchema.index({ 'privacy.isPublic': 1, status: 1 });
portfolioSchema.index({ publishedAt: -1 });

// Pre-save middleware to generate slug
portfolioSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  
  // Update lastModified
  if (this.isModified() && !this.isNew) {
    this.lastModified = new Date();
  }
  
  next();
});

// Instance method to publish portfolio
portfolioSchema.methods.publish = async function() {
  this.status = 'published';
  this.publishedAt = new Date();
  await this.save();
};

// Instance method to increment views
portfolioSchema.methods.incrementViews = async function(isUnique = false) {
  this.analytics.views += 1;
  if (isUnique) {
    this.analytics.uniqueVisitors += 1;
  }
  this.analytics.lastViewed = new Date();
  await this.save();
};

// Instance method to add referrer
portfolioSchema.methods.addReferrer = async function(source) {
  const existingReferrer = this.analytics.referrers.find(r => r.source === source);
  if (existingReferrer) {
    existingReferrer.count += 1;
  } else {
    this.analytics.referrers.push({ source, count: 1 });
  }
  await this.save();
};

// Static method to get public portfolios
portfolioSchema.statics.getPublic = function(limit = 20, skip = 0) {
  return this.find({ 
    'privacy.isPublic': true, 
    'privacy.showInDirectory': true,
    status: 'published' 
  })
  .populate('userId', 'username profile.firstName profile.lastName profile.avatar')
  .populate('templateId', 'name category thumbnail')
  .sort({ publishedAt: -1 })
  .limit(limit)
  .skip(skip);
};

// Virtual for public URL
portfolioSchema.virtual('publicUrl').get(function() {
  if (this.domain.customDomain && this.domain.isCustomDomainActive) {
    return `https://${this.domain.customDomain}`;
  }
  return `https://skillweave.com/portfolio/${this.domain.subdomain || this.slug}`;
});

module.exports = mongoose.model('Portfolio', portfolioSchema);
