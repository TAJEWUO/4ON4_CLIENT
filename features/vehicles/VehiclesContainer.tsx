"use client";

import { useEffect, useState } from "react";
import { CarWidget } from "@/components/car-widget";
import { getVehicles } from "./vehicles.service";
import type { Vehicle } from "./vehicles.types";
import { useSession } from "@/hooks/useSession";

export default function VehiclesContainer() {
  const { userId } = useSession();

  const [cars, setCars] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    getVehicles(userId)
      .then(setCars)
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <section>
        <h2>My Vehicles</h2>
        <p>Loading vehicles...</p>
      </section>
    );
  }

  return (
    <section>
      <h2>My Vehicles</h2>

      {cars.length === 0 ? (
        <div style={{ padding: 16, border: "1px solid #eee", borderRadius: 8 }}>
          <p>No vehicles added yet</p>
          <button>Add Vehicle</button>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {cars.map((car) => (
            <CarWidget
              key={car.id}
              car={car}
              onDelete={() => {}}
            />
          ))}
        </div>
      )}
    </section>
  );
}
