import { apiClient } from '../utils/apiClient';

export interface ModelMetadata {
  id: string;
  modelVersion: string;
  name: string;
  description: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  trainedDate: string;
  lastUpdatedDate: string;
  supportedVehicleModels: string[];
  features: string[];
  performanceMetrics: Record<string, number>;
}

export const modelService = {
  getModelMetadata: async (): Promise<ModelMetadata> => {
    return apiClient.get<ModelMetadata>('/model-metadata');
  },

  getModelVersion: async (version: string): Promise<ModelMetadata> => {
    return apiClient.get<ModelMetadata>(`/model-metadata/${version}`);
  },

  listAvailableModels: async (): Promise<ModelMetadata[]> => {
    return apiClient.get<ModelMetadata[]>('/model-metadata/list');
  },

  getModelPerformance: async (version?: string): Promise<Record<string, number>> => {
    const query = version ? `?version=${version}` : '';
    return apiClient.get<Record<string, number>>(`/model-metadata/performance${query}`);
  },

  validateModel: async (version: string): Promise<{ valid: boolean; message: string }> => {
    return apiClient.get<{ valid: boolean; message: string }>(`/model-metadata/${version}/validate`);
  },
};
