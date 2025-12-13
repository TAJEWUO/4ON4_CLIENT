// features/vehicles/vehicles.service.ts
import { apiGetVehicles } from "@/lib/api";
import { mapVehicleFromApi } from "./vehicles.mapper";
import type { Vehicle } from "./vehicles.types";

export async function getVehicles(userId: string): Promise<Vehicle[]> {
  const { ok, data } = await apiGetVehicles(userId);

  if (!ok || !Array.isArray(data?.vehicles)) return [];

  return data.vehicles.map(mapVehicleFromApi);
}
