import { describe, it, expect } from 'vitest'

describe('Import Test', () => {
  it('should import templateService', async () => {
    const { templateService } = await import('../services/templateService')
    expect(templateService).toBeDefined()
    expect(typeof templateService.getTemplates).toBe('function')
  })
})
