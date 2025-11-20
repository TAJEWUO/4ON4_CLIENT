"use client";

import { useState } from "react";
import { apiUploadVehicle, apiGetVehicles } from "@/lib/api";

export default function MyVehicles({ vehicles, setVehicles, isLoggedIn, onLoginClick }: any) {
  const [uploading, setUploading] = useState(false);

  const handleAddVehicle = async (data: any) => {
    if (!isLoggedIn) return onLoginClick();

    try {
      setUploading(true);

      const userId = localStorage.getItem("fouron4_user_id");

      const form = new FormData();
      form.append("userId", userId!);
      form.append("plateNumber", data.plateNumber);
      form.append("capacity", data.capacity);
      form.append("windowType", data.windowType);
      form.append("model", data.model || "");

      if (data.images && data.images.length > 0) {
        for (let i = 0; i < data.images.length; i++) {
          form.append("images", data.images[i]);
        }
      }

      const res = await apiUploadVehicle(form);

      if (res.success) {
        const refresh = await apiGetVehicles(userId!);
        if (refresh.success) {
          setVehicles(refresh.vehicles);
        }
      }

    } catch (err) {
      console.log("Vehicle upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4">Your Vehicles</h2>

      {/* No vehicles */}
      {vehicles.length === 0 && (
        <div className="text-center py-6 border border-gray-300 rounded-xl">
          <p className="text-gray-600 mb-2">No vehicles added yet.</p>
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("openAddVehicleModal"));
              }
            }}
            className="px-4 py-2 bg-black text-white rounded-lg"
          >
            Add Vehicle
          </button>
        </div>
      )}

      {/* Vehicle list */}
      <div className="space-y-4">
        {vehicles.map((v: any) => (
          <div
            key={v._id}
            className="p-4 border border-gray-200 rounded-xl bg-gray-50 shadow-sm"
          >
            <p className="font-semibold">{v.model || "Unknown Model"}</p>
            <p className="text-sm">Plate: {v.plateNumber}</p>
            <p className="text-sm">Capacity: {v.capacity}</p>
            <p className="text-sm">Window: {v.windowType}</p>

            <div className="flex gap-2 mt-2">
              {v.images?.map((img: string) => (
                <img
                  key={img}
                  src={`http://192.168.0.104:3002${img}`}
                  className="w-20 h-16 object-cover rounded-md border"
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Uploading indicator */}
      {uploading && (
        <p className="text-center mt-3 text-gray-500 text-sm">Uploading...</p>
      )}
    </div>
  );
}
