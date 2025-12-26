// services/vehicle.service.ts
// Vehicle service API functions

import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/utils/apiClient";

/**
 * Get all vehicles for a specific user by userId
 */
export async function getVehicles(userId: string, token?: string) {
  return apiGet(`/api/vehicle/${userId}`, token);
}

/**
 * Get all vehicles for the logged-in user
 */
export async function getUserVehicles(token?: string) {
  return apiGet("/api/vehicle/user", token);
}

/**
 * Get single vehicle by ID
 */
export async function getVehicleById(vehicleId: string, token?: string) {
  return apiGet(`/api/vehicle/single/${vehicleId}`, token);
}

/**
 * Create new vehicle
 */
export async function createVehicle(formData: FormData, token?: string) {
  return apiPost("/api/vehicle/upload", formData, token);
}

/**
 * Update existing vehicle
 */
export async function updateVehicle(vehicleId: string, formData: FormData, token?: string) {
  return apiPut(`/api/vehicle/${vehicleId}`, formData, token);
}

/**
 * Delete individual image from vehicle
 */
export async function deleteVehicleImage(vehicleId: string, imagePath: string, token?: string) {
  return apiDelete(`/api/vehicle/${vehicleId}/image`, { imagePath }, token);
}

/**
 * Delete entire vehicle
 */
export async function deleteVehicle(vehicleId: string, token?: string) {
  return apiDelete(`/api/vehicle/${vehicleId}`, undefined, token);
}
