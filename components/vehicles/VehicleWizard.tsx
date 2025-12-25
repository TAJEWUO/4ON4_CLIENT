"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createVehicle, updateVehicle } from "@/services/vehicle.service";
import { Camera, Check, Loader2 } from "lucide-react";

type VehicleFormData = {
  plateNumber: string;
  model: string;
  seatCount: number;
  tripType: string[];
  color: string;
  windowType: string;
  sunroof: boolean;
  fourByFour: boolean;
  additionalFeatures: string;
  images: File[];
};

type Props = {
  vehicle?: any; // Existing vehicle data for editing
  onSaved?: () => void;
};

const TRIP_TYPES = ["LONG", "CROSS COUNTRY", "CITY", "BY ROAD", "PHOTOGRAPHY"];
const COLORS = ["GREEN", "BEIGE", "BROWN", "CREAM", "DARK GREEN", "LIGHT GREEN"];
const WINDOW_TYPES = ["GLASS", "CANVA", "BOTH"];

export default function VehicleWizard({ vehicle, onSaved }: Props) {
  const router = useRouter();
  const { token, userId } = useAuth();
  const [status, setStatus] = useState<"idle" | "saving" | "success">("idle");

  const [formData, setFormData] = useState<VehicleFormData>({
    plateNumber: vehicle?.plateNumber || "",
    model: vehicle?.model || "",
    seatCount: vehicle?.seatCount || 4,
    tripType: vehicle?.tripType || [],
    color: vehicle?.color || "",
    windowType: vehicle?.windowType || "GLASS",
    sunroof: vehicle?.sunroof || false,
    fourByFour: vehicle?.fourByFour || false,
    additionalFeatures: vehicle?.additionalFeatures || "",
    images: [],
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 5);
      setFormData(prev => ({ ...prev, images: files }));
    }
  };

  const handleSave = async () => {
    if (!formData.plateNumber) {
      alert("Plate number is required");
      return;
    }

    // Validate images for new vehicles
    if (!vehicle && formData.images.length === 0) {
      alert("Please upload at least 1 image of your vehicle");
      return;
    }

    setStatus("saving");

    const formDataObj = new FormData();
    formDataObj.append("plateNumber", formData.plateNumber);
    formDataObj.append("model", formData.model);
    formDataObj.append("seatCount", formData.seatCount.toString());
    formDataObj.append("tripType", JSON.stringify(formData.tripType));
    formDataObj.append("color", formData.color);
    formDataObj.append("windowType", formData.windowType);
    formDataObj.append("sunroof", formData.sunroof.toString());
    formDataObj.append("fourByFour", formData.fourByFour.toString());
    formDataObj.append("additionalFeatures", formData.additionalFeatures);

    // Append images
    formData.images.forEach((image) => {
      formDataObj.append("images", image);
    });

    console.log("[VehicleWizard] Saving vehicle...");
    console.log("[VehicleWizard] Is update:", !!vehicle?._id);
    console.log("[VehicleWizard] Has token:", !!token);
    console.log("[VehicleWizard] Plate number:", formData.plateNumber);
    console.log("[VehicleWizard] Trip types:", formData.tripType);
    console.log("[VehicleWizard] Images count:", formData.images.length);

    const result = vehicle?._id
      ? await updateVehicle(vehicle._id, formDataObj, token || undefined)
      : await createVehicle(formDataObj, token || undefined);
    
    console.log("[VehicleWizard] Save result:", result);

    if (!result.ok) {
      console.error("Failed to save vehicle:", result);
      alert(`Failed to save vehicle: ${result.message || "Unknown error"}`);
      setStatus("idle");
      return;
    }

    setStatus("success");
    setTimeout(() => {
      if (onSaved) {
        onSaved();
      } else {
        router.push("/user/app/vehicles");
      }
    }, 1000);
  };

  if (status === "saving") {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-green-600" />
        <p className="mt-4 text-gray-600">Saving vehicle...</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center">
          <Check size={32} className="text-white" />
        </div>
        <p className="mt-4 text-green-600 font-semibold">Vehicle Saved!</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-24">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {vehicle ? "Edit Vehicle" : "Add New Vehicle"}
        </h1>

        {/* Plate Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Plate Number *
          </label>
          <input
            type="text"
            value={formData.plateNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, plateNumber: e.target.value.toUpperCase() }))}
            placeholder="KBA 112A"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Model */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Model
          </label>
          <input
            type="text"
            value={formData.model}
            onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
            placeholder="Toyota Land Cruiser"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Seat Count */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Seat Count
          </label>
          <select
            value={formData.seatCount}
            onChange={(e) => setFormData(prev => ({ ...prev, seatCount: parseInt(e.target.value) }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {[4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((num) => (
              <option key={num} value={num}>
                {num} seats
              </option>
            ))}
          </select>
        </div>

        {/* Trip Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Trip Type (Select one or more)
          </label>
          <div className="flex flex-wrap gap-2">
            {TRIP_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    tripType: prev.tripType.includes(type)
                      ? prev.tripType.filter(t => t !== type)
                      : [...prev.tripType, type]
                  }));
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  formData.tripType.includes(type)
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Color
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, color }))}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  formData.color === color
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-2">
              Or specify custom color
            </label>
            <input
              type="text"
              placeholder="e.g., Navy Blue, Pearl White..."
              value={!COLORS.includes(formData.color) ? formData.color : ""}
              onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Window Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Window Type
          </label>
          <div className="flex gap-2">
            {WINDOW_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, windowType: type }))}
                className={`flex-1 px-4 py-2 rounded-full text-sm font-medium transition ${
                  formData.windowType === type
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Sunroof */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Sunroof
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, sunroof: true }))}
              className={`flex-1 px-4 py-2 rounded-full text-sm font-medium transition ${
                formData.sunroof
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              YES
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, sunroof: false }))}
              className={`flex-1 px-4 py-2 rounded-full text-sm font-medium transition ${
                !formData.sunroof
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              NO
            </button>
          </div>
        </div>

        {/* 4x4 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            4x4
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, fourByFour: true }))}
              className={`flex-1 px-4 py-2 rounded-full text-sm font-medium transition ${
                formData.fourByFour
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              YES
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, fourByFour: false }))}
              className={`flex-1 px-4 py-2 rounded-full text-sm font-medium transition ${
                !formData.fourByFour
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              NO
            </button>
          </div>
        </div>

        {/* Additional Features */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Features (max 50 words)
          </label>
          <textarea
            value={formData.additionalFeatures}
            onChange={(e) => setFormData(prev => ({ ...prev, additionalFeatures: e.target.value }))}
            placeholder="WiFi, Cool box, Music system..."
            rows={3}
            maxLength={250}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.additionalFeatures.length}/250 characters
          </p>
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vehicle Images (1-5 images) *
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Camera className="w-12 h-12 mx-auto text-gray-400 mb-2" />
            <label className="cursor-pointer text-green-600 hover:text-green-700 font-medium">
              Choose Images
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            {formData.images.length > 0 ? (
              <div className="mt-4">
                <p className="text-sm font-medium text-green-600 mb-2">
                  {formData.images.length} of 5 images selected
                </p>
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="relative aspect-video bg-gray-100 rounded overflow-hidden">
                      <img
                        src={URL.createObjectURL(img)}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1 right-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {idx + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : vehicle?.images && vehicle.images.length > 0 ? (
              <p className="text-sm text-gray-600 mt-2">
                Currently has {vehicle.images.length} image(s)
              </p>
            ) : (
              <p className="text-sm text-gray-500 mt-2">
                Upload at least 1 image of your vehicle
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-full font-medium hover:bg-green-700"
          >
            Save Vehicle
          </button>
        </div>
      </div>
    </div>
  );
}
