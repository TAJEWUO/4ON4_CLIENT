"use client";

import { useState, useEffect } from "react";
import {
  apiUploadVehicle,
  apiGetVehicles,
  apiDeleteVehicle,
  apiUpdateVehicle,
} from "@/lib/api";
import VehicleCard from "./ui/vehicle-card";
import EditVehicleModal from "./ui/edit-vehicle-modal";

const BACKEND_URL = "https://fouron4-backend-1.onrender.com";

export default function MyVehicles({
  vehicles,
  setVehicles,
  isLoggedIn,
  onLoginClick,
}: any) {
  const [uploading, setUploading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<any | null>(null);

  useEffect(() => {
    function handleAddFromDashboard(e: any) {
      if (!e.detail) return;
      handleAddVehicle(e.detail);
    }

    window.addEventListener("addVehicleFromDashboard", handleAddFromDashboard);
    return () =>
      window.removeEventListener(
        "addVehicleFromDashboard",
        handleAddFromDashboard
      );
  }, [isLoggedIn]);

  const refreshVehicles = async () => {
    const userId = localStorage.getItem("fouron4_user_id");
    if (!userId) return;

    const res = await apiGetVehicles(userId);
    if (res.success) setVehicles(res.vehicles);
  };

  const handleAddVehicle = async (data: any) => {
    if (!isLoggedIn) return onLoginClick();

    try {
      setUploading(true);

      const userId = localStorage.getItem("fouron4_user_id");
      if (!userId) return;

      const form = new FormData();
      form.append("userId", userId);
      form.append("plateNumber", data.plateNumber);
      form.append("capacity", String(data.capacity));
      form.append("windowType", data.windowType);
      form.append("model", data.model || "");

      if (data.images && data.images.length > 0) {
        for (let i = 0; i < data.images.length; i++) {
          form.append("images", data.images[i]);
        }
      }

      const res = await apiUploadVehicle(form);
      if (res.success) await refreshVehicles();
    } catch (err) {
      console.log("Vehicle upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    if (!confirm("Delete this vehicle?")) return;

    try {
      const res = await apiDeleteVehicle(vehicleId);
      if (res.success) {
        setVehicles((list: any[]) => list.filter((v) => v._id !== vehicleId));
      }
    } catch (err) {
      console.log("Delete vehicle failed:", err);
    }
  };

  const handleUpdateVehicle = async (data: any) => {
    if (!selectedVehicle) return;

    try {
      const form = new FormData();
      form.append("plateNumber", data.plateNumber);
      form.append("capacity", String(data.capacity));
      form.append("windowType", data.windowType);
      form.append("model", data.model || "");

      if (data.images && data.images.length > 0) {
        for (let i = 0; i < data.images.length; i++) {
          form.append("images", data.images[i]);
        }
      }

      const res = await apiUpdateVehicle(selectedVehicle._id, form);
      if (res.success) await refreshVehicles();
    } catch (err) {
      console.log("Update vehicle failed:", err);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4">Your Vehicles</h2>

      {vehicles.length === 0 && (
        <div className="text-center py-6 border border-gray-300 rounded-xl">
          <p className="text-gray-600 mb-2">No vehicles added yet.</p>
          <button
            onClick={() =>
              window.dispatchEvent(new CustomEvent("openAddVehicleModal"))
            }
            className="px-4 py-2 bg-black text-white rounded-lg"
          >
            Add Vehicle
          </button>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {vehicles.map((v: any) => {
          const imageUrls =
            v.images && v.images.length > 0
              ? v.images.map((img: string) => `${BACKEND_URL}/${img}`)
              : ["https://via.placeholder.com/300x200?text=No+Image"];

          return (
            <VehicleCard
              key={v._id}
              plate={v.plateNumber || v.plate || "N/A"}
              model={v.model}
              capacity={v.capacity || 0}
              windowType={(v.windowType as "glass" | "canvas") || "glass"}
              images={imageUrls}
              onClick={() => {}} // REQUIRED FIX
              onEdit={() => {
                setSelectedVehicle(v);
                setEditOpen(true);
              }}
              onDelete={() => handleDeleteVehicle(v._id)}
            />
          );
        })}
      </div>

      {uploading && (
        <p className="text-center mt-3 text-gray-500 text-sm">Uploading...</p>
      )}

      <EditVehicleModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        vehicle={selectedVehicle}
        onSubmit={handleUpdateVehicle}
      />
    </div>
  );
}
