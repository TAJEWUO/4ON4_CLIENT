"use client";

import { TripCard } from "@/components/trip-card";
import { useEffect, useState } from "react";
import { apiGetTrips } from "@/lib/api"; // later service
import type { Trip } from "./trips.types";

export default function TripsContainer({ userId }: { userId: string }) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrips();
  }, []);

  async function loadTrips() {
    try {
      const { ok, data } = await apiGetTrips(userId);
      if (ok) setTrips(data.trips);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <p>Loading trips…</p>;
  if (trips.length === 0) return <p>No trips yet.</p>;

  return (
    <div className="space-y-4">
      {trips.map(trip => (
        <TripCard
          key={trip.id}
          trip={trip}
          onEdit={() => {}}
          onDelete={() => {}}
        />
      ))}
    </div>
  );
}
