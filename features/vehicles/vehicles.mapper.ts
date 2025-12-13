// features/vehicles/vehicles.mapper.ts
import { Vehicle } from "./vehicles.types";

export function mapVehicleFromApi(raw: any): Vehicle {
  return {
    id: raw._id,

    images: Array.isArray(raw.images)
      ? raw.images.slice(0, 3)
      : [],

    numberPlate: raw.numberPlate ?? raw.plate ?? "",
    model: raw.model ?? "",
    seats: Number(raw.seats ?? 0),

    tripType: raw.tripType ?? "",

    color: raw.color ?? "",
    windowType: raw.windowType ?? "other",

    sunroof: Boolean(raw.sunroof),
    fourByFour: Boolean(raw.fourByFour ?? raw.is4x4),
  };
}
