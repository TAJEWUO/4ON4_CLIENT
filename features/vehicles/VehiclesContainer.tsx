"use client";

import { CarWidget } from "@/components/car-widget";
import { useEffect, useState } from "react";
import { apiGetVehicles } from "@/lib/api";
import type { Car } from "./vehicles.types";

export default function VehiclesContainer({ userId }: { userId: string }) {
  const [cars, setCars] = useState<Car[]>([]);

  useEffect(() => {
    loadCars();
  }, []);

  async function loadCars() {
    const { ok, data } = await apiGetVehicles(userId);
    if (ok) setCars(data.vehicles);
  }

  return (
    <div className="grid gap-4">
      {cars.map(car => (
        <CarWidget
          key={car.id}
          car={car}
          onDelete={() => {}}
        />
      ))}
    </div>
  );
}
