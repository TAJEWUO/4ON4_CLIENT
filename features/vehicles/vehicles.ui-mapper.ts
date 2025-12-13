import type { Vehicle } from "./vehicles.types";

export function mapVehicleToCarWidget(vehicle: Vehicle) {
  return {
    id: Number(vehicle.id),
    numberPlate: vehicle.numberPlate,
    model: vehicle.model,
    color: vehicle.color,
    seats: vehicle.seats,
  };
}
