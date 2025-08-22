const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  category: {
    type: String,
    required: true,
    enum: ['developer', 'creative', 'professional', 'business', 'student', 'freelancer']
  },
  subcategory: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  longDescription: {
    type: String,
    maxlength: 2000
  },
  preview: {
    thumbnail: {
      type: String,
      required: true // URL to thumbnail image
    },
    images: [{
      url: String,
      alt: String,
      caption: String
    }],
    demoUrl: String // URL to live demo
  },
  features: [{
    name: String,
    description: String,
    icon: String
  }],
  technologies: [{
    name: String,
    category: {
      type: String,
      enum: ['frontend', 'backend', 'database', 'deployment', 'design']
    }
  }],
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  estimatedTime: {
    setup: Number, // in minutes
    customization: Number // in minutes
  },
  structure: {
    sections: [{
      id: String,
      name: String,
      description: String,
      isRequired: {
        type: Boolean,
        default: true
      },
      fields: [{
        name: String,
        type: {
          type: String,
          enum: ['text', 'textarea', 'email', 'url', 'phone', 'date', 'select', 'multiselect', 'file', 'image']
        },
        label: String,
        placeholder: String,
        isRequired: {
          type: Boolean,
          default: false
        },
        validation: {
          minLength: Number,
          maxLength: Number,
          pattern: String,
          options: [String] // for select/multiselect
        }
      }]
    }]
  },
  design: {
    colorSchemes: [{
      name: String,
      primary: String,
      secondary: String,
      accent: String,
      background: String,
      text: String
    }],
    fonts: [{
      name: String,
      family: String,
      weights: [String]
    }],
    layout: {
      type: {
        type: String,
        enum: ['single-page', 'multi-page', 'portfolio-grid', 'blog-style']
      },
      responsive: {
        type: Boolean,
        default: true
      },
      animations: {
        type: Boolean,
        default: true
      }
    }
  },
  aiPrompts: {
    contentGeneration: {
      aboutSection: String,
      skillsSection: String,
      experienceSection: String,
      projectsSection: String,
      contactSection: String
    },
    styleCustomization: String,
    seoOptimization: String
  },
  files: {
    templateCode: {
      html: String, // Template HTML structure
      css: String,  // Template CSS
      js: String,   // Template JavaScript
      config: String // Template configuration
    },
    assets: [{
      name: String,
      url: String,
      type: {
        type: String,
        enum: ['image', 'icon', 'font', 'video']
      }
    }]
  },
  statistics: {
    views: {
      type: Number,
      default: 0
    },
    downloads: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
      },
      count: {
        type: Number,
        default: 0
      }
    }
  },
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  isPremium: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  version: {
    type: String,
    default: '1.0.0'
  },
  changelog: [{
    version: String,
    changes: [String],
    date: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
templateSchema.index({ category: 1, isActive: 1 });
templateSchema.index({ tags: 1 });
templateSchema.index({ slug: 1 });
templateSchema.index({ isPremium: 1, isActive: 1 });
templateSchema.index({ 'statistics.rating.average': -1 });
templateSchema.index({ 'statistics.downloads': -1 });

// Pre-save middleware to generate slug
templateSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

// Static method to get popular templates
templateSchema.statics.getPopular = function(limit = 10) {
  return this.find({ isActive: true })
    .sort({ 'statistics.downloads': -1, 'statistics.rating.average': -1 })
    .limit(limit);
};

// Static method to get featured templates
templateSchema.statics.getFeatured = function() {
  return this.find({ isFeatured: true, isActive: true })
    .sort({ 'statistics.rating.average': -1 });
};

// Instance method to increment views
templateSchema.methods.incrementViews = async function() {
  this.statistics.views += 1;
  await this.save();
};

// Instance method to increment downloads
templateSchema.methods.incrementDownloads = async function() {
  this.statistics.downloads += 1;
  await this.save();
};

// Instance method to add rating
templateSchema.methods.addRating = async function(rating) {
  const currentTotal = this.statistics.rating.average * this.statistics.rating.count;
  this.statistics.rating.count += 1;
  this.statistics.rating.average = (currentTotal + rating) / this.statistics.rating.count;
  await this.save();
};

// Virtual for formatted rating
templateSchema.virtual('formattedRating').get(function() {
  return this.statistics.rating.average.toFixed(1);
});

module.exports = mongoose.model('Template', templateSchema);
