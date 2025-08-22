const request = require('supertest');
const express = require('express');
const templateRoutes = require('../routes/templates');

// Mock the Template model
jest.mock('../models/Template', () => ({
  find: jest.fn(),
  findById: jest.fn(),
  findOne: jest.fn(),
  aggregate: jest.fn(),
  countDocuments: jest.fn()
}));

// Mock the auth middleware
jest.mock('../middleware/auth', () => ({
  optionalAuth: (req, res, next) => next(),
  requireAuth: (req, res, next) => {
    req.user = { id: 'user123', subscription: { plan: 'premium' } };
    next();
  },
  requireAdmin: (req, res, next) => {
    req.user = { id: 'admin123', role: 'admin' };
    next();
  }
}));

// Mock the error handler
jest.mock('../middleware/errorHandler', () => ({
  asyncHandler: (fn) => fn
}));

const Template = require('../models/Template');

// Create Express app for testing
const app = express();
app.use(express.json());
app.use('/api/templates', templateRoutes);

describe('Template Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/templates', () => {
    it('should fetch templates successfully', async () => {
      const mockTemplates = [
        { id: '1', name: 'Template 1', category: 'portfolio', isPremium: false },
        { id: '2', name: 'Template 2', category: 'resume', isPremium: false }
      ];

      Template.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockTemplates)
      });

      Template.countDocuments.mockResolvedValue(2);

      const response = await request(app)
        .get('/api/templates')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.templates).toEqual(mockTemplates);
      expect(response.body.pagination.total).toBe(2);
    });

    it('should filter templates by category', async () => {
      const mockTemplates = [
        { id: '1', name: 'Portfolio Template', category: 'portfolio', isPremium: false }
      ];

      Template.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockTemplates)
      });

      Template.countDocuments.mockResolvedValue(1);

      const response = await request(app)
        .get('/api/templates?category=portfolio')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.templates).toEqual(mockTemplates);
      expect(Template.find).toHaveBeenCalledWith(
        expect.objectContaining({
          category: 'portfolio',
          isActive: true
        })
      );
    });

    it('should filter out premium templates for free users', async () => {
      const mockTemplates = [
        { id: '1', name: 'Free Template', category: 'portfolio', isPremium: false }
      ];

      Template.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockTemplates)
      });

      Template.countDocuments.mockResolvedValue(1);

      const response = await request(app)
        .get('/api/templates')
        .expect(200);

      expect(Template.find).toHaveBeenCalledWith(
        expect.objectContaining({
          isPremium: false,
          isActive: true
        })
      );
    });

    it('should handle search queries', async () => {
      const mockTemplates = [
        { id: '1', name: 'Modern Portfolio', category: 'portfolio', isPremium: false }
      ];

      Template.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockTemplates)
      });

      Template.countDocuments.mockResolvedValue(1);

      const response = await request(app)
        .get('/api/templates?search=modern')
        .expect(200);

      expect(Template.find).toHaveBeenCalledWith(
        expect.objectContaining({
          $or: expect.arrayContaining([
            { name: { $regex: 'modern', $options: 'i' } },
            { description: { $regex: 'modern', $options: 'i' } },
            { tags: { $regex: 'modern', $options: 'i' } }
          ]),
          isActive: true
        })
      );
    });

    it('should handle pagination', async () => {
      const mockTemplates = [
        { id: '1', name: 'Template 1', category: 'portfolio', isPremium: false }
      ];

      Template.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockTemplates)
      });

      Template.countDocuments.mockResolvedValue(25);

      const response = await request(app)
        .get('/api/templates?page=2&limit=10')
        .expect(200);

      expect(response.body.pagination).toEqual({
        page: 2,
        limit: 10,
        total: 25,
        pages: 3
      });
    });
  });

  describe('GET /api/templates/:id', () => {
    it('should fetch a specific template', async () => {
      const mockTemplate = {
        id: 'template123',
        name: 'Test Template',
        category: 'portfolio',
        isPremium: false
      };

      Template.findById.mockResolvedValue(mockTemplate);

      const response = await request(app)
        .get('/api/templates/template123')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.template).toEqual(mockTemplate);
    });

    it('should return 404 for non-existent template', async () => {
      Template.findById.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/templates/nonexistent')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Template not found');
    });

    it('should indicate premium requirement', async () => {
      const mockTemplate = {
        id: 'premium123',
        name: 'Premium Template',
        category: 'portfolio',
        isPremium: true
      };

      Template.findById.mockResolvedValue(mockTemplate);

      const response = await request(app)
        .get('/api/templates/premium123')
        .expect(200);

      expect(response.body.requiresPremium).toBe(true);
    });
  });

  describe('GET /api/templates/featured', () => {
    it('should fetch featured templates', async () => {
      const mockTemplates = [
        { id: '1', name: 'Featured 1', featured: true, isPremium: false },
        { id: '2', name: 'Featured 2', featured: true, isPremium: false }
      ];

      Template.find.mockResolvedValue(mockTemplates);

      const response = await request(app)
        .get('/api/templates/featured')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.templates).toEqual(mockTemplates);
      expect(Template.find).toHaveBeenCalledWith({
        featured: true,
        isActive: true,
        isPremium: false
      });
    });
  });

  describe('GET /api/templates/popular', () => {
    it('should fetch popular templates', async () => {
      const mockTemplates = [
        { id: '1', name: 'Popular 1', downloads: 1000, isPremium: false },
        { id: '2', name: 'Popular 2', downloads: 900, isPremium: false }
      ];

      Template.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockTemplates)
      });

      const response = await request(app)
        .get('/api/templates/popular')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.templates).toEqual(mockTemplates);
    });

    it('should respect limit parameter', async () => {
      const mockTemplates = [
        { id: '1', name: 'Popular 1', downloads: 1000, isPremium: false }
      ];

      Template.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockTemplates)
      });

      const response = await request(app)
        .get('/api/templates/popular?limit=5')
        .expect(200);

      expect(Template.find().limit).toHaveBeenCalledWith(5);
    });
  });

  describe('GET /api/templates/categories', () => {
    it('should fetch template categories', async () => {
      const mockCategories = [
        { _id: 'portfolio', count: 15, subcategories: ['personal', 'business'] },
        { _id: 'resume', count: 8, subcategories: ['classic', 'modern'] }
      ];

      Template.aggregate.mockResolvedValue(mockCategories);

      const response = await request(app)
        .get('/api/templates/categories')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.categories).toEqual(mockCategories);
    });
  });

  describe('POST /api/templates/:id/download', () => {
    it('should download a template for authenticated user', async () => {
      const mockTemplate = {
        id: 'template123',
        name: 'Test Template',
        category: 'portfolio',
        isPremium: false,
        downloads: 5,
        save: jest.fn().mockResolvedValue(true)
      };

      Template.findById.mockResolvedValue(mockTemplate);

      // Mock authenticated request
      const response = await request(app)
        .post('/api/templates/template123/download')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(mockTemplate.downloads).toBe(6);
      expect(mockTemplate.save).toHaveBeenCalled();
    });

    it('should return 404 for non-existent template', async () => {
      Template.findById.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/templates/nonexistent/download')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Template not found');
    });
  });

  describe('POST /api/templates/:id/rate', () => {
    it('should rate a template', async () => {
      const mockTemplate = {
        id: 'template123',
        rating: 4.0,
        ratingCount: 10,
        ratings: [],
        save: jest.fn().mockResolvedValue(true)
      };

      Template.findById.mockResolvedValue(mockTemplate);

      const response = await request(app)
        .post('/api/templates/template123/rate')
        .send({ rating: 5 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.newRating).toBeDefined();
      expect(response.body.ratingCount).toBe(11);
    });

    it('should validate rating range', async () => {
      const response = await request(app)
        .post('/api/templates/template123/rate')
        .send({ rating: 6 })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Rating must be between 1 and 5');
    });

    it('should require rating field', async () => {
      const response = await request(app)
        .post('/api/templates/template123/rate')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      Template.find.mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app)
        .get('/api/templates')
        .expect(500);

      expect(response.body.success).toBe(false);
    });

    it('should handle invalid ObjectId', async () => {
      Template.findById.mockRejectedValue(new Error('Cast to ObjectId failed'));

      const response = await request(app)
        .get('/api/templates/invalid-id')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Sorting', () => {
    beforeEach(() => {
      Template.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([])
      });
      Template.countDocuments.mockResolvedValue(0);
    });

    it('should sort by popularity by default', async () => {
      await request(app)
        .get('/api/templates')
        .expect(200);

      expect(Template.find().sort).toHaveBeenCalledWith({ downloads: -1, createdAt: -1 });
    });

    it('should sort by rating when specified', async () => {
      await request(app)
        .get('/api/templates?sort=rating')
        .expect(200);

      expect(Template.find().sort).toHaveBeenCalledWith({ rating: -1, ratingCount: -1 });
    });

    it('should sort by newest when specified', async () => {
      await request(app)
        .get('/api/templates?sort=newest')
        .expect(200);

      expect(Template.find().sort).toHaveBeenCalledWith({ createdAt: -1 });
    });

    it('should sort by oldest when specified', async () => {
      await request(app)
        .get('/api/templates?sort=oldest')
        .expect(200);

      expect(Template.find().sort).toHaveBeenCalledWith({ createdAt: 1 });
    });

    it('should sort by name when specified', async () => {
      await request(app)
        .get('/api/templates?sort=name')
        .expect(200);

      expect(Template.find().sort).toHaveBeenCalledWith({ name: 1 });
    });
  });
});
