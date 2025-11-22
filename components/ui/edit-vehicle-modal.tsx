"use client";

import { useEffect, useState, ChangeEvent } from "react";

type WindowType = "glass" | "canvas";

type EditVehicleModalProps = {
  open: boolean;
  onClose: () => void;
  vehicle: any | null;
  onSubmit: (data: {
    plateNumber: string;
    capacity: number;
    windowType: WindowType;
    model?: string;
    images: File[];
  }) => void;
};

export default function EditVehicleModal({
  open,
  onClose,
  vehicle,
  onSubmit,
}: EditVehicleModalProps) {
  const [plateNumber, setPlateNumber] = useState("");
  const [capacity, setCapacity] = useState<number | "">("");
  const [windowType, setWindowType] = useState<WindowType | "">("");
  const [model, setModel] = useState("");
  const [images, setImages] = useState<File[]>([]);

  useEffect(() => {
    if (vehicle && open) {
      setPlateNumber(vehicle.plateNumber || "");
      setCapacity(vehicle.capacity || "");
      setWindowType((vehicle.windowType as WindowType) || "");
      setModel(vehicle.model || "");
      setImages([]);
    }
  }, [vehicle, open]);

  if (!open || !vehicle) return null;

  const handleFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const fileArray = Array.from(files).slice(0, 3);
    setImages(fileArray);
  };

  const handleSave = () => {
    if (!plateNumber.trim()) {
      alert("Plate number required");
      return;
    }
    if (!capacity) {
      alert("Capacity required");
      return;
    }
    if (!windowType) {
      alert("Window type required");
      return;
    }

    onSubmit({
      plateNumber: plateNumber.trim(),
      capacity: Number(capacity),
      windowType: windowType as WindowType,
      model: model.trim() || undefined,
      images,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-md shadow-lg p-5">
        <h2 className="text-lg font-semibold text-black mb-4">Edit Vehicle</h2>

        {/* PLATE */}
        <label className="block text-sm text-black mb-1">Car Plate Number *</label>
        <input
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 text-sm"
          value={plateNumber}
          onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
        />

        {/* CAPACITY */}
        <label className="block text-sm text-black mb-1">Capacity *</label>
        <input
          type="number"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 text-sm"
          value={capacity}
          onChange={(e) => setCapacity(Number(e.target.value))}
        />

        {/* WINDOW TYPE */}
        <label className="block text-sm text-black mb-1">Window Type *</label>
        <div className="flex gap-3 mb-4">
          <button
            type="button"
            onClick={() => setWindowType("glass")}
            className={`flex-1 border rounded px-3 py-2 text-sm ${
              windowType === "glass" ? "bg-black text-white" : "bg-white text-black"
            }`}
          >
            Glass
          </button>
          <button
            type="button"
            onClick={() => setWindowType("canvas")}
            className={`flex-1 border rounded px-3 py-2 text-sm ${
              windowType === "canvas" ? "bg-black text-white" : "bg-white text-black"
            }`}
          >
            Canvas
          </button>
        </div>

        {/* MODEL */}
        <label className="block text-sm text-black mb-1">Model (optional)</label>
        <input
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 text-sm"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        />

        {/* IMAGES */}
        <label className="block text-sm text-black mb-1">
          Replace Vehicle Images (max 3) (optional)
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          className="w-full text-sm mb-2"
          onChange={handleFilesChange}
        />

        <p className="text-xs text-gray-500 mb-4">
          If you upload new images, they will replace the old ones.
        </p>

        <div className="flex justify-between mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border border-gray-400 rounded-md text-black hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm bg-black text-white rounded-md hover:bg-gray-800"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
