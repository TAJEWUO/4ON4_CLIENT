"use client";

import { useEffect, useState } from "react";
import { apiGetProfile, apiGetVehicles } from "@/lib/api";
import { getUserId } from "@/lib/utils/storage";

// Optional UI components you already have
import Dashboard from "@/components/dashboard";
import TripCard from "@/components/trip-card";
import CarWidget from "@/components/car-widget";

export default function DashboardPage() {
  const [profile, setProfile] = useState<any | null>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const uid = getUserId();
    if (!uid) {
      setLoading(false);
      return;
    }

    Promise.all([loadProfile(uid), loadVehicles(uid)])
      .finally(() => setLoading(false));
  }, []);

  async function loadProfile(uid: string) {
    try {
      const { ok, data } = await apiGetProfile(uid);
      if (ok) setProfile(data?.profile ?? data ?? null);
    } catch {
      setProfile(null);
    }
  }

  async function loadVehicles(uid: string) {
    try {
      const { ok, data } = await apiGetVehicles(uid);
      if (ok) setVehicles(data?.vehicles ?? data ?? []);
    } catch {
      setVehicles([]);
    }
  }

  if (loading) {
    return <div className="p-4">Loading dashboard...</div>;
  }

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto">
      {/* OPTIONAL MAIN DASHBOARD LAYOUT */}
      <Dashboard />

      {/* Profile Section */}
      <section>
        <h2 className="text-xl font-semibold">Your Profile</h2>
        {profile ? (
          <div className="p-3 border rounded bg-white mt-2">
            <p><strong>Name:</strong> {profile.name ?? "N/A"}</p>
            <p><strong>Phone:</strong> {profile.phone ?? "N/A"}</p>
          </div>
        ) : (
          <p className="text-gray-500 text-sm mt-2">No profile data available.</p>
        )}
      </section>

      {/* Vehicle Section */}
      <section>
        <h2 className="text-xl font-semibold">Your Vehicles</h2>

        {vehicles.length === 0 && (
          <p className="text-gray-500 text-sm">You have no vehicles yet.</p>
        )}

        {vehicles.length > 0 && (
          <div className="grid grid-cols-1 gap-3 mt-3">
            {vehicles.map((v) => (
              <CarWidget key={v._id} vehicle={v} />
            ))}
          </div>
        )}
      </section>

      {/* Optional Trips Section */}
      <section>
        <h2 className="text-xl font-semibold">Your Trips</h2>
        <TripCard />
      </section>
    </div>
  );
}
