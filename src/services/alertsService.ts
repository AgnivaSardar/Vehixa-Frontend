import { apiClient } from '../utils/apiClient';

export interface Alert {
  id: string;
  vehicleId: string;
  type: 'error' | 'warning' | 'info';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  isResolved: boolean;
  createdAt: string;
  resolvedAt?: string;
}

export const alertsService = {
  getAlerts: async (vehicleId: string): Promise<Alert[]> => {
    return apiClient.get<Alert[]>(`/alerts?vehicleId=${vehicleId}`);
  },

  getAlert: async (id: string): Promise<Alert> => {
    return apiClient.get<Alert>(`/alerts/${id}`);
  },

  createAlert: async (data: Omit<Alert, 'id' | 'createdAt' | 'isResolved'>): Promise<Alert> => {
    return apiClient.post<Alert>('/alerts', data);
  },

  resolveAlert: async (id: string): Promise<Alert> => {
    return apiClient.patch<Alert>(`/alerts/${id}`, { isResolved: true });
  },

  getActiveAlerts: async (vehicleId: string): Promise<Alert[]> => {
    return apiClient.get<Alert[]>(`/alerts?vehicleId=${vehicleId}&resolved=false`);
  },

  getAlertsBySeverity: async (vehicleId: string, severity: string): Promise<Alert[]> => {
    return apiClient.get<Alert[]>(`/alerts?vehicleId=${vehicleId}&severity=${severity}`);
  },

  acknowledgeAlert: async (id: string): Promise<Alert> => {
    return apiClient.patch<Alert>(`/alerts/${id}/acknowledge`);
  },
};
