import { apiClient } from '../utils/apiClient';

export interface Vehicle {
  vehicleId: string;
  userId: string;
  vehicleNumber: string | null;
  model: string | null;
  manufacturer: string | null;
  year: number | null;
  vehicleType: string | null;
  vin: string | null;
  engineType: string | null;
  fuelType: string;
  registrationDate: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleCreateRequest {
  vehicleNumber?: string;
  model?: string;
  manufacturer?: string;
  year?: number;
  vehicleType?: string;
  vin?: string;
  engineType?: string;
  fuelType: string;
  registrationDate?: string;
  status?: string;
}

export const vehiclesService = {
  getAllVehicles: async (): Promise<Vehicle[]> => {
    return apiClient.get<Vehicle[]>('/vehicles');
  },

  getVehicle: async (id: string): Promise<Vehicle> => {
    return apiClient.get<Vehicle>(`/vehicles/${id}`);
  },

  createVehicle: async (data: VehicleCreateRequest): Promise<Vehicle> => {
    return apiClient.post<Vehicle>('/vehicles', data);
  },

  updateVehicle: async (id: string, data: Partial<Vehicle>): Promise<Vehicle> => {
    return apiClient.put<Vehicle>(`/vehicles/${id}`, data);
  },

  deleteVehicle: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/vehicles/${id}`);
  },

  getVehicleHealth: async (id: string): Promise<{ currentHealth: number }> => {
    return apiClient.get<{ currentHealth: number }>(`/vehicles/${id}/health`);
  },
};
