import { apiClient } from '../utils/apiClient';

export interface HealthPrediction {
  id: string;
  vehicleId: string;
  timestamp: string;
  overallHealth: number;
  components: {
    engine: number;
    transmission: number;
    battery: number;
    suspension: number;
    brakes: number;
    [key: string]: number;
  };
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  predictedServiceDate?: string;
}

export interface LiveEvaluationRequest {
  engineTemp?: number;
  batteryVoltage?: number;
  rpm?: number;
  oilPressure?: number;
  mileage?: number;
  vibrationLevel?: number;
  fuelEfficiency?: number;
  ambientTemperature?: number;
  coolantLevel?: number;
  errorCodesCount?: number;
}

export interface LiveEvaluationResponse {
  overallHealth: number;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';
  status: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  failureProbability: number;
  confidenceScore: number;
  predictedFailureDays: number;
  modelVersion: string;
  components: {
    engine: number;
    transmission: number;
    battery: number;
    cooling: number;
    suspension: number;
  };
  recommendations: string[];
}

export const healthService = {
  getAllPredictions: async (vehicleId?: string): Promise<any[]> => {
    const query = vehicleId ? `?vehicleId=${vehicleId}` : '';
    return apiClient.get<any[]>(`/health-predictions${query}`);
  },

  getHealthPrediction: async (vehicleId: string): Promise<HealthPrediction> => {
    return apiClient.get<HealthPrediction>(`/health-predictions/${vehicleId}`);
  },

  getHealthHistory: async (
    vehicleId: string,
    limit?: number
  ): Promise<HealthPrediction[]> => {
    const query = limit ? `?limit=${limit}` : '';
    return apiClient.get<HealthPrediction[]>(`/health-predictions/${vehicleId}/history${query}`);
  },

  analyzeHealth: async (vehicleId: string): Promise<HealthPrediction> => {
    return apiClient.post<HealthPrediction>(`/health-predictions/${vehicleId}/analyze`);
  },

  getComponentHealth: async (
    vehicleId: string,
    component: string
  ): Promise<{ component: string; health: number; status: string }> => {
    return apiClient.get<{ component: string; health: number; status: string }>(
      `/health-predictions/${vehicleId}/components/${component}`
    );
  },

  evaluateLive: async (vehicleId: string, telemetryData: LiveEvaluationRequest): Promise<LiveEvaluationResponse> => {
    return apiClient.post<LiveEvaluationResponse>('/health-predictions/evaluate', {
      vehicleId,
      ...telemetryData
    });
  },
};
