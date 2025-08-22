// Export all services
export { default as apiService } from './apiService';
export { default as aiService } from './aiService';

// Export types
export * from './types';

// Export specific service types
export type { 
  UserData, 
  AIUsageStats, 
  ImprovementSuggestion, 
  ImprovementAnalysis 
} from './aiService';

// Service instances for convenience
import apiService from './apiService';
import aiService from './aiService';

export const services = {
  api: apiService,
  ai: aiService,
};

// Connection testing utility
export const testBackendConnection = async (): Promise<{
  isConnected: boolean;
  status?: string;
  error?: string;
}> => {
  try {
    const isConnected = await apiService.testConnection();
    if (isConnected) {
      const healthData = await apiService.healthCheck();
      return {
        isConnected: true,
        status: healthData.status,
      };
    }
    return {
      isConnected: false,
      error: 'Backend server not responding',
    };
  } catch (error) {
    return {
      isConnected: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export default services;
