import { apiClient } from '../utils/apiClient';

export interface Recommendation {
  id: string;
  vehicleId: string;
  type: 'maintenance' | 'safety' | 'performance' | 'efficiency';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  estimatedCost?: number;
  recommendedDate?: string;
  createdAt: string;
}

export const recommendationsService = {
  getRecommendations: async (vehicleId: string): Promise<Recommendation[]> => {
    return apiClient.get<Recommendation[]>(`/recommendations?vehicleId=${vehicleId}`);
  },

  getRecommendation: async (id: string): Promise<Recommendation> => {
    return apiClient.get<Recommendation>(`/recommendations/${id}`);
  },

  generateRecommendations: async (vehicleId: string): Promise<Recommendation[]> => {
    return apiClient.post<Recommendation[]>(`/recommendations/generate?vehicleId=${vehicleId}`);
  },

  dismissRecommendation: async (id: string): Promise<void> => {
    return apiClient.patch<void>(`/recommendations/${id}`, { dismissed: true });
  },

  getRecommendationsByType: async (
    vehicleId: string,
    type: string
  ): Promise<Recommendation[]> => {
    return apiClient.get<Recommendation[]>(`/recommendations?vehicleId=${vehicleId}&type=${type}`);
  },

  getRecommendationsBySeverity: async (
    vehicleId: string,
    severity: string
  ): Promise<Recommendation[]> => {
    return apiClient.get<Recommendation[]>(`/recommendations?vehicleId=${vehicleId}&severity=${severity}`);
  },
};
