import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the apiService first
vi.mock('../services/apiService', () => ({
  apiService: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}))

// Import after mocking
const { templateService } = await import('../services/templateService')
const { apiService } = await import('../services/apiService')

describe('TemplateService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getTemplates', () => {
    it('should fetch templates without filters', async () => {
      const mockResponse = {
        templates: [
          { id: '1', name: 'Template 1', category: 'portfolio' },
          { id: '2', name: 'Template 2', category: 'resume' }
        ],
        pagination: { page: 1, limit: 20, total: 2 }
      }

      // @ts-expect-error - mocked function
      apiService.get.mockResolvedValue(mockResponse)

      const result = await templateService.getTemplates()

      expect(apiService.get).toHaveBeenCalledWith('/templates')
      expect(result).toEqual(mockResponse)
    })

    it('should fetch templates with filters', async () => {
      const filters = {
        category: 'portfolio',
        difficulty: 'beginner' as const,
        isPremium: false,
        sort: 'popular' as const,
        page: 1,
        limit: 10
      }

      const mockResponse = {
        templates: [{ id: '1', name: 'Template 1', category: 'portfolio' }],
        pagination: { page: 1, limit: 10, total: 1 }
      }

      // @ts-expect-error - mocked function
      apiService.get.mockResolvedValue(mockResponse)

      const result = await templateService.getTemplates(filters)

      expect(apiService.get).toHaveBeenCalledWith(
        '/templates?category=portfolio&difficulty=beginner&isPremium=false&sort=popular&page=1&limit=10'
      )
      expect(result).toEqual(mockResponse)
    })

    it('should handle search queries properly', async () => {
      const filters = {
        search: 'modern portfolio',
        tags: 'portfolio,design'
      }

      const mockResponse = {
        templates: [{ id: '1', name: 'Modern Portfolio', category: 'portfolio' }],
        pagination: { page: 1, limit: 20, total: 1 }
      }

      // @ts-expect-error - mocked function
      apiService.get.mockResolvedValue(mockResponse)

      const result = await templateService.getTemplates(filters)

      expect(apiService.get).toHaveBeenCalledWith(
        '/templates?search=modern%20portfolio&tags=portfolio%2Cdesign'
      )
      expect(result).toEqual(mockResponse)
    })

    it('should filter out null and undefined values', async () => {
      const filters = {
        category: 'portfolio',
        subcategory: undefined,
        difficulty: undefined,
        isPremium: false
      }

      // @ts-expect-error - mocked function
      apiService.get.mockResolvedValue({ templates: [], pagination: {} })

      await templateService.getTemplates(filters)

      expect(apiService.get).toHaveBeenCalledWith(
        '/templates?category=portfolio&isPremium=false'
      )
    })
  })

  describe('getTemplate', () => {
    it('should fetch a specific template by ID', async () => {
      const templateId = 'template-123'
      const mockResponse = {
        template: { id: templateId, name: 'Test Template', category: 'portfolio' },
        requiresPremium: false
      }

      // @ts-expect-error - mocked function
      apiService.get.mockResolvedValue(mockResponse)

      const result = await templateService.getTemplate(templateId)

      expect(apiService.get).toHaveBeenCalledWith(`/templates/${templateId}`)
      expect(result).toEqual(mockResponse)
    })

    it('should handle premium templates', async () => {
      const templateId = 'premium-template-123'
      const mockResponse = {
        template: { id: templateId, name: 'Premium Template', category: 'portfolio' },
        requiresPremium: true
      }

      // @ts-expect-error - mocked function
      apiService.get.mockResolvedValue(mockResponse)

      const result = await templateService.getTemplate(templateId)

      expect(result.requiresPremium).toBe(true)
    })
  })

  describe('getFeaturedTemplates', () => {
    it('should fetch featured templates', async () => {
      const mockResponse = {
        templates: [
          { id: '1', name: 'Featured 1', featured: true },
          { id: '2', name: 'Featured 2', featured: true }
        ]
      }

      // @ts-expect-error - mocked function
      apiService.get.mockResolvedValue(mockResponse)

      const result = await templateService.getFeaturedTemplates()

      expect(apiService.get).toHaveBeenCalledWith('/templates/featured')
      expect(result).toEqual(mockResponse)
    })
  })

  describe('getPopularTemplates', () => {
    it('should fetch popular templates with default limit', async () => {
      const mockResponse = {
        templates: [
          { id: '1', name: 'Popular 1', downloads: 1000 },
          { id: '2', name: 'Popular 2', downloads: 900 }
        ]
      }

      // @ts-expect-error - mocked function
      apiService.get.mockResolvedValue(mockResponse)

      const result = await templateService.getPopularTemplates()

      expect(apiService.get).toHaveBeenCalledWith('/templates/popular?limit=10')
      expect(result).toEqual(mockResponse)
    })

    it('should fetch popular templates with custom limit', async () => {
      const limit = 5
      const mockResponse = { templates: [] }

      // @ts-expect-error - mocked function
      apiService.get.mockResolvedValue(mockResponse)

      await templateService.getPopularTemplates(limit)

      expect(apiService.get).toHaveBeenCalledWith(`/templates/popular?limit=${limit}`)
    })
  })

  describe('getCategories', () => {
    it('should fetch template categories', async () => {
      const mockResponse = {
        categories: [
          { _id: 'portfolio', count: 15, subcategories: ['personal', 'business'] },
          { _id: 'resume', count: 8, subcategories: ['classic', 'modern'] }
        ]
      }

      // @ts-expect-error - mocked function
      apiService.get.mockResolvedValue(mockResponse)

      const result = await templateService.getCategories()

      expect(apiService.get).toHaveBeenCalledWith('/templates/categories')
      expect(result).toEqual(mockResponse)
    })
  })

  describe('downloadTemplate', () => {
    it('should download/use a template', async () => {
      const templateId = 'template-123'
      const mockResponse = {
        template: { id: templateId, name: 'Downloaded Template' }
      }

      // @ts-expect-error - mocked function
      apiService.post.mockResolvedValue(mockResponse)

      const result = await templateService.downloadTemplate(templateId)

      expect(apiService.post).toHaveBeenCalledWith(`/templates/${templateId}/download`)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('rateTemplate', () => {
    it('should rate a template', async () => {
      const templateId = 'template-123'
      const rating = 5
      const mockResponse = {
        newRating: '4.8',
        ratingCount: 25
      }

      // @ts-expect-error - mocked function
      apiService.post.mockResolvedValue(mockResponse)

      const result = await templateService.rateTemplate(templateId, rating)

      expect(apiService.post).toHaveBeenCalledWith(
        `/templates/${templateId}/rate`,
        { rating }
      )
      expect(result).toEqual(mockResponse)
    })

    it('should handle invalid ratings', async () => {
      const templateId = 'template-123'
      const invalidRating = 6

      // @ts-expect-error - mocked function
      apiService.post.mockRejectedValue(new Error('Rating must be between 1 and 5'))

      await expect(templateService.rateTemplate(templateId, invalidRating))
        .rejects.toThrow('Rating must be between 1 and 5')
    })
  })

  describe('searchTemplates', () => {
    it('should search templates with query', async () => {
      const query = 'portfolio design'
      const mockResponse = {
        templates: [{ id: '1', name: 'Portfolio Design Template' }],
        pagination: { page: 1, limit: 20, total: 1 }
      }

      // @ts-expect-error - mocked function
      apiService.get.mockResolvedValue(mockResponse)

      const result = await templateService.searchTemplates(query)

      expect(apiService.get).toHaveBeenCalledWith('/templates?search=portfolio%20design')
      expect(result).toEqual(mockResponse)
    })

    it('should search templates with query and filters', async () => {
      const query = 'portfolio'
      const filters = { category: 'business', difficulty: 'advanced' as const }
      
      // @ts-expect-error - mocked function
      apiService.get.mockResolvedValue({ templates: [], pagination: {} })

      await templateService.searchTemplates(query, filters)

      expect(apiService.get).toHaveBeenCalledWith(
        '/templates?category=business&difficulty=advanced&search=portfolio'
      )
    })
  })

  describe('getTemplatesByCategory', () => {
    it('should fetch templates by category', async () => {
      const category = 'portfolio'
      const mockResponse = {
        templates: [{ id: '1', name: 'Portfolio Template', category }],
        pagination: { page: 1, limit: 20, total: 1 }
      }

      // @ts-expect-error - mocked function
      apiService.get.mockResolvedValue(mockResponse)

      const result = await templateService.getTemplatesByCategory(category)

      expect(apiService.get).toHaveBeenCalledWith('/templates?category=portfolio')
      expect(result).toEqual(mockResponse)
    })
  })

  describe('checkTemplateAccess', () => {
    it('should return access granted for available templates', async () => {
      const templateId = 'template-123'
      const mockTemplate = { template: { id: templateId, name: 'Test Template' } }

      // @ts-expect-error - mocked function
      apiService.get.mockResolvedValue(mockTemplate)

      const result = await templateService.checkTemplateAccess(templateId)

      expect(result).toEqual({ hasAccess: true })
    })

    it('should return access denied for premium templates without subscription', async () => {
      const templateId = 'premium-template-123'
      const error = new Error('Premium subscription required')
      Object.assign(error, { status: 403 })

      // @ts-expect-error - mocked function
      apiService.get.mockRejectedValue(error)

      const result = await templateService.checkTemplateAccess(templateId)

      expect(result).toEqual({
        hasAccess: false,
        reason: 'Premium subscription required'
      })
    })

    it('should re-throw non-403 errors', async () => {
      const templateId = 'template-123'
      const error = new Error('Network error')
      Object.assign(error, { status: 500 })

      // @ts-expect-error - mocked function
      apiService.get.mockRejectedValue(error)

      await expect(templateService.checkTemplateAccess(templateId))
        .rejects.toThrow('Network error')
    })
  })

  describe('Error Handling', () => {
    it('should propagate API errors', async () => {
      const error = new Error('API Error')
      // @ts-expect-error - mocked function
      apiService.get.mockRejectedValue(error)

      await expect(templateService.getTemplates()).rejects.toThrow('API Error')
    })

    it('should handle network errors gracefully', async () => {
      const networkError = new Error('Network failed')
      // @ts-expect-error - mocked function
      apiService.get.mockRejectedValue(networkError)

      await expect(templateService.getFeaturedTemplates()).rejects.toThrow('Network failed')
    })
  })
})
