"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getVehicleById, deleteVehicle } from "@/services/vehicle.service";
import { ChevronLeft, ChevronRight, Edit2, Trash2, Loader2, Check, X } from "lucide-react";
import VehicleWizard from "@/components/vehicles/VehicleWizard";

export default function VehicleDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { token } = useAuth();
  const vehicleId = params?.id as string;

  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadVehicle();
  }, [vehicleId]);

  const loadVehicle = async () => {
    if (!vehicleId || !token) return;

    setLoading(true);
    const result = await getVehicleById(vehicleId, token);

    console.log("Vehicle fetch result:", result);

    if (result.ok && result.data) {
      console.log("Vehicle data:", result.data);
      // Backend returns { ok: true, data: { vehicle: {...} } }
      const vehicleData = result.data.vehicle || result.data;
      console.log("Setting vehicle:", vehicleData);
      console.log("Vehicle images:", vehicleData.images);
      console.log("Vehicle images type:", typeof vehicleData.images);
      if (vehicleData.images && vehicleData.images.length > 0) {
        console.log("First image:", vehicleData.images[0]);
      }
      setVehicle(vehicleData);
    } else {
      console.error("Failed to load vehicle:", result);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this vehicle?")) return;

    setDeleting(true);
    const result = await deleteVehicle(vehicleId, token || undefined);

    if (result.ok) {
      router.push("/user/app/vehicles");
    } else {
      console.error("Failed to delete vehicle:", result);
      alert("Failed to delete vehicle");
      setDeleting(false);
    }
  };

  const nextImage = () => {
    if (vehicle?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % vehicle.images.length);
    }
  };

  const prevImage = () => {
    if (vehicle?.images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? vehicle.images.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-green-600" />
        <p className="mt-4 text-gray-600">Loading vehicle...</p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <X className="w-16 h-16 text-red-500 mb-4" />
        <p className="text-gray-600">Vehicle not found</p>
      </div>
    );
  }

  if (editing) {
    return (
      <VehicleWizard
        vehicle={vehicle}
        onSaved={() => {
          setEditing(false);
          loadVehicle();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Image Swiper */}
      <div className="relative w-full h-80 bg-gray-200">
        {vehicle.images && vehicle.images.length > 0 ? (
          <>
            <img
              src={`http://localhost:3002/${typeof vehicle.images[currentImageIndex] === 'string' ? vehicle.images[currentImageIndex] : vehicle.images[currentImageIndex]?.path}`}
              alt={vehicle.plateNumber}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error("Image failed to load:", e.currentTarget.src);
                e.currentTarget.style.display = 'none';
              }}
            />
            {vehicle.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
                >
                  <ChevronRight size={24} />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {vehicle.images.map((_: any, idx: number) => (
                    <div
                      key={idx}
                      className={`w-2 h-2 rounded-full ${
                        idx === currentImageIndex ? "bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No images
          </div>
        )}
      </div>

      {/* Vehicle Details */}
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {vehicle.plateNumber}
            </h1>
            {vehicle.model && (
              <p className="text-xl text-gray-600 mt-1">{vehicle.model}</p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setEditing(true)}
              className="p-3 bg-green-600 text-white rounded-full hover:bg-green-700"
            >
              <Edit2 size={20} />
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 disabled:opacity-50"
            >
              {deleting ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}
            </button>
          </div>
        </div>

        {/* Details Grid */}
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <DetailRow label="Seat Count" value={vehicle.seatCount} />
          <DetailRow label="Trip Type" value={vehicle.tripType} />
          <DetailRow label="Color" value={vehicle.color} />
          <DetailRow label="Window Type" value={vehicle.windowType} />
          <DetailRow
            label="Sunroof"
            value={
              <span className={vehicle.sunroof ? "text-green-600" : "text-gray-500"}>
                {vehicle.sunroof ? "YES" : "NO"}
              </span>
            }
          />
          <DetailRow
            label="4x4"
            value={
              <span className={vehicle.fourByFour ? "text-green-600" : "text-gray-500"}>
                {vehicle.fourByFour ? "YES" : "NO"}
              </span>
            }
          />
          {vehicle.additionalFeatures && (
            <DetailRow
              label="Additional Features"
              value={vehicle.additionalFeatures}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex justify-between items-start border-b border-gray-100 pb-3 last:border-0">
      <span className="text-gray-600 font-medium">{label}</span>
      <span className="text-gray-900 text-right">{value}</span>
    </div>
  );
}
