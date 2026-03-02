// Export all API services
export { usersService } from './usersService';
export { vehiclesService } from './vehiclesService';
export { telemetryService } from './telemetryService';
export { healthService } from './healthService';
export { recommendationsService } from './recommendationsService';
export { alertsService } from './alertsService';
export { modelService } from './modelService';

// Export types
export type { LoginRequest, RegisterRequest, LoginResponse, User } from './usersService';
export type { Vehicle, VehicleCreateRequest } from './vehiclesService';
export type { TelemetryData, TelemetryQueryParams } from './telemetryService';
export type { HealthPrediction } from './healthService';
export type { Recommendation } from './recommendationsService';
export type { Alert } from './alertsService';
export type { ModelMetadata } from './modelService';

// Export API client
export { apiClient } from '../utils/apiClient';
