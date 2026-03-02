import { apiClient } from '../utils/apiClient';

export interface TelemetryData {
  id: string;
  vehicleId: string;
  timestamp: string;
  speed: number;
  rpm: number;
  engineTemperature: number;
  fuelLevel: number;
  batteryVoltage: number;
  odometer: number;
  [key: string]: unknown;
}

export interface TelemetryQueryParams {
  vehicleId: string;
  startTime?: string;
  endTime?: string;
  limit?: number;
  offset?: number;
}

export const telemetryService = {
  getTelemetryData: async (params: TelemetryQueryParams): Promise<TelemetryData[]> => {
    const queryString = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined) as [string, string][]
    ).toString();
    return apiClient.get<TelemetryData[]>(`/telemetry?${queryString}`);
  },

  getLatestTelemetry: async (vehicleId: string): Promise<TelemetryData> => {
    return apiClient.get<TelemetryData>(`/telemetry/latest/${vehicleId}`);
  },

  recordTelemetry: async (data: Omit<TelemetryData, 'id' | 'timestamp'>): Promise<TelemetryData> => {
    return apiClient.post<TelemetryData>('/telemetry', data);
  },

  getTelemetryStats: async (vehicleId: string, timeRange?: string): Promise<unknown> => {
    const query = timeRange ? `?timeRange=${timeRange}` : '';
    return apiClient.get<unknown>(`/telemetry/stats/${vehicleId}${query}`);
  },
};
