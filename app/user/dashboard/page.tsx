"use client";

import TripsContainer from "@/features/trips/TripsContainer";
import VehiclesContainer from "@/features/vehicles/VehiclesContainer";
import { getUserId } from "@/lib/utils/storage";

export default function DashboardPage() {
  const userId = getUserId();
  if (!userId) return null;

  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      <VehiclesContainer userId={userId} />
      <TripsContainer userId={userId} />
    </div>
  );
}
///////git ap
