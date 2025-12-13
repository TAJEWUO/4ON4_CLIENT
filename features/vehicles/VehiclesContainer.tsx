"use client";

import { useEffect, useState } from "react";
import { CarWidget } from "@/components/car-widget";
import { getVehicles } from "./vehicles.service";
import { mapVehicleToCarWidget } from "./vehicles.ui-mapper";
import type { Vehicle } from "./vehicles.types";

export default function VehiclesContainer({ userId }: { userId: string }) {
  const [cars, setCars] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVehicles(userId)
      .then(setCars)
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <p>Loading vehicles…</p>;
  if (cars.length === 0) return <p>No vehicles yet.</p>;

  return (
    <div className="grid gap-4">
      {cars.map((car) => {
        const uiCar = mapVehicleToCarWidget(car);

        return (
          <CarWidget
            key={uiCar.id}
            car={uiCar}
            onDelete={() => {}}
          />
        );
      })}
    </div>
  );
}
