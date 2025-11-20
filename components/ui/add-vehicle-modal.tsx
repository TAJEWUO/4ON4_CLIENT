"use client";

import { useState, useEffect } from "react";

type AddVehicleModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (vehicle: {
    plate: string;
    capacity: number;
    windowType: "glass" | "canvas";
    model?: string;
    images: File[];
  }) => void;
};

export default function AddVehicleModal({
  open,
  onClose,
  onSubmit,
}: AddVehicleModalProps) {
  const [isOpen, setIsOpen] = useState(open);

  const [plate, setPlate] = useState("");
  const [capacity, setCapacity] = useState<number | "">("");
  const [windowType, setWindowType] = useState<"glass" | "canvas" | "">("");
  const [model, setModel] = useState("");
  const [images, setImages] = useState<File[]>([]);

  // Listen for the SideMenu "openAddVehicleModal" event
  useEffect(() => {
    function openModal() {
      setIsOpen(true);
    }

    window.addEventListener("openAddVehicleModal", openModal);

    return () => window.removeEventListener("openAddVehicleModal", openModal);
  }, []);

  // Sync external open prop into internal isOpen
  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  // Reset form whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setPlate("");
      setCapacity("");
      setWindowType("");
      setModel("");
      setImages([]);
    }
  }, [isOpen]);

  function closeAll() {
    setIsOpen(false);
    onClose();
  }

  if (!isOpen) return null;

  // Handle image selection
  function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files).slice(0, 3);
    setImages(fileArray);
  }

  // Submit
  function handleSubmit() {
    if (!plate.trim()) return alert("Plate number required");
    if (!capacity) return alert("Capacity required");
    if (!windowType) return alert("Window type required");

    onSubmit({
      plate: plate.trim(),
      capacity,
      windowType,
      model: model.trim() || undefined,
      images,
    });

    closeAll();
  }

  const capacityOptions = Array.from({ length: 11 }, (_, i) => i + 4);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-md shadow-lg p-5">
        <h2 className="text-lg font-semibold text-black mb-4">Add New Vehicle</h2>

        {/* PLATE */}
        <label className="block text-sm text-black mb-1">Car Plate Number *</label>
        <input
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 text-sm"
          value={plate}
          onChange={(e) => setPlate(e.target.value.toUpperCase())}
          placeholder="e.g. KDA 112A"
        />

        {/* CAPACITY */}
        <label className="block text-sm text-black mb-1">Capacity *</label>
        <select
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 text-sm bg-white"
          value={capacity === "" ? "" : String(capacity)}
          onChange={(e) => setCapacity(Number(e.target.value))}
        >
          <option value="">Select capacity</option>
          {capacityOptions.map((c) => (
            <option key={c} value={c}>
              {c} seats
            </option>
          ))}
        </select>

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
          placeholder="e.g. Toyota Hiace"
        />

        {/* IMAGES */}
        <label className="block text-sm text-black mb-1">
          Vehicle Images (max 3)
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          className="w-full text-sm"
          onChange={handleFilesChange}
        />

        {images.length > 0 && (
          <ul className="mt-2 text-xs text-gray-700 list-disc list-inside">
            {images.map((file, i) => (
              <li key={i}>{file.name}</li>
            ))}
          </ul>
        )}

        {/* BUTTONS */}
        <div className="flex justify-between mt-6">
          <button
            onClick={closeAll}
            className="px-4 py-2 text-sm border border-gray-400 rounded-md text-black hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm bg-black text-white rounded-md hover:bg-gray-800"
          >
            Save Vehicle
          </button>
        </div>
      </div>
    </div>
  );
}
