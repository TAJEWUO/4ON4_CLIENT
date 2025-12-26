"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getVehicles } from "@/services/vehicle.service";
import { getImageUrl } from "@/lib/utils/imageUtils";
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
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Vehicles</h1>
            <p className="text-sm text-gray-500 mt-1">{vehicles.length} of 5 vehicles</p>
          </div>
          <button
            onClick={() => {
              if (vehicles.length >= 5) {
                alert("You can only add up to 5 vehicles. Please delete a vehicle before adding a new one.");
                return;
              }
              router.push("/user/app/vehicles/add");
            }}
            disabled={vehicles.length >= 5}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
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
            {vehicles.map((vehicle, index) => (
              <div
                key={vehicle._id || index}
                onClick={() => router.push(`/user/app/vehicles/${vehicle._id}`)}
                className="bg-white rounded-2xl shadow hover:shadow-lg transition cursor-pointer overflow-hidden"
              >
                {vehicle.images?.[0] ? (
                  <div className="relative w-full h-48 bg-gray-200">
                    <img
                      src={getImageUrl(vehicle.images[0]) || ""}
                      alt={vehicle.plateNumber}
                      className="w-full h-full object-cover"
                      onLoad={(e) => {
                        const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                        if (placeholder) placeholder.style.display = 'none';
                      }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                      <Car className="w-12 h-12 text-gray-400" />
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <Car className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {vehicle.plateNumber}
                  </h3>
                  {vehicle.model && (
                    <p className="text-sm text-gray-600 mt-1">{vehicle.model}</p>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>{vehicle.seatCount} seats</span>
                    {Array.isArray(vehicle.tripType) && vehicle.tripType.length > 0 && (
                      <span>{vehicle.tripType.join(", ")}</span>
                    )}
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
