// features/vehicles/vehicles.types.ts

export interface Vehicle {
  id: string;

  images: string[]; // max 3 URLs

  numberPlate: string;
  model: string;
  seats: number;

  tripType: string;

  color: string;
  windowType: "glass" | "canvas" | "other";

  sunroof: boolean;
  fourByFour: boolean;
}
