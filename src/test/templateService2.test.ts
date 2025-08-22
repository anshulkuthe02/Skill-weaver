import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock first, then import
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

describe('TemplateService Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should call apiService.get when getTemplates is called', async () => {
    const mockResponse = {
      templates: [],
      pagination: { page: 1, limit: 20, total: 0 }
    }

    // @ts-ignore
    apiService.get.mockResolvedValue(mockResponse)

    const result = await templateService.getTemplates()

    expect(apiService.get).toHaveBeenCalledWith('/templates')
    expect(result).toEqual(mockResponse)
  })

  it('should call apiService.get with template ID', async () => {
    const templateId = 'test-123'
    const mockResponse = {
      template: { id: templateId, name: 'Test Template' }
    }

    // @ts-ignore
    apiService.get.mockResolvedValue(mockResponse)

    const result = await templateService.getTemplate(templateId)

    expect(apiService.get).toHaveBeenCalledWith(`/templates/${templateId}`)
    expect(result).toEqual(mockResponse)
  })
})
