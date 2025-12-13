"use client";

import { useEffect, useState } from "react";
import { TripCard } from "@/components/trip-card";
import { getTrips } from "./trips.service";
import { mapTripToTripCard } from "./trips.ui-mapper";
import type { Trip } from "./trips.types";

export default function TripsContainer({ userId }: { userId: string }) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTrips(userId)
      .then(setTrips)
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <p>Loading trips…</p>;
  if (trips.length === 0) return <p>No trips yet.</p>;

  return (
    <div className="space-y-4">
      {trips.map((trip) => {
        const uiTrip = mapTripToTripCard(trip);

        return (
          <TripCard
            key={uiTrip.id}
            trip={uiTrip}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        );
      })}
    </div>
  );
}
