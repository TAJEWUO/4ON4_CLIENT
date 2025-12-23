"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getVehicles } from "@/services/vehicle.service";
import { Plus, Loader2, Car } from "lucide-react";

export default function VehiclesPage() {
  const router = useRouter();
  const { token, userId } = useAuth();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    if (!userId || !token) {
      console.log("No userId or token, redirecting to login");
      router.push("/user/auth/login");
      return;
    }

    setLoading(true);
    const result = await getVehicles(userId, token);
    
    if (result.ok && result.data) {
      setVehicles(result.data.vehicles || []);
    } else {
      console.error("Failed to load vehicles:", result);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-green-600" />
        <p className="mt-4 text-gray-600">Loading vehicles...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Vehicles</h1>
          <button
            onClick={() => router.push("/user/app/vehicles/add")}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full font-medium hover:bg-green-700"
          >
            <Plus size={20} />
            Add Vehicle
          </button>
        </div>

        {vehicles.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-12 text-center">
            <Car className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              No vehicles yet
            </h2>
            <p className="text-gray-500 mb-6">
              Add your first vehicle to get started
            </p>
            <button
              onClick={() => router.push("/user/app/vehicles/add")}
              className="px-6 py-3 bg-green-600 text-white rounded-full font-medium hover:bg-green-700"
            >
              Add Your First Vehicle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle._id}
                onClick={() => router.push(`/user/app/vehicles/${vehicle._id}`)}
                className="bg-white rounded-2xl shadow hover:shadow-lg transition cursor-pointer overflow-hidden"
              >
                {vehicle.images?.[0] ? (
                  <img
                    src={`http://localhost:3002/${typeof vehicle.images[0] === 'string' ? vehicle.images[0] : vehicle.images[0]?.path}`}
                    alt={vehicle.plateNumber}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      console.error("List image failed to load:", e.currentTarget.src);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <Car className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    {vehicle.plateNumber}
                  </h3>
                  {vehicle.model && (
                    <p className="text-gray-600 mt-1">{vehicle.model}</p>
                  )}
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                    <span>{vehicle.seatCount} seats</span>
                    {vehicle.tripType && <span>{vehicle.tripType}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
