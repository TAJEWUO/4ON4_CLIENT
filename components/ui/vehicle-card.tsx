"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Users, PanelsTopLeft } from "lucide-react";
import { buildImageUrl } from "@/lib/api";

export default function VehicleCard({
  plate,
  model,
  capacity,
  windowType,
  images,
  onClick,
  onEdit,
  onDelete,
}: {
  plate: string;
  model: string;
  capacity: number;
  windowType: string;
  images: string[];
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [index, setIndex] = useState(0);

  return (
    <div
      onClick={onClick}
      className="w-full bg-white border rounded-lg shadow hover:shadow-md cursor-pointer flex flex-col"
    >
      {/* IMAGE */}
      <div className="relative w-full h-40 bg-gray-200 flex items-center justify-center overflow-hidden">
        {images && images.length > 0 ? (
          <img
            src={buildImageUrl(`uploads/vehicles/${images[index]}`)}
            className="w-full h-full object-cover"
            alt={plate}
          />
        ) : (
          <div className="text-gray-500 text-sm">No Image</div>
        )}

        {/* LEFT ARROW */}
        {images.length > 1 && (
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white p-1 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
            }}
          >
            <ChevronLeft size={20} className="text-black" />
          </button>
        )}

        {/* RIGHT ARROW */}
        {images.length > 1 && (
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white p-1 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
            }}
          >
            <ChevronRight size={20} className="text-black" />
          </button>
        )}
      </div>

      {/* DETAILS */}
      <div className="p-4">
        <p className="text-black font-semibold">{plate}</p>
        <p className="text-gray-600 text-sm">
          <Users className="inline mr-1" size={14} /> {capacity} seats
        </p>
        <p className="text-gray-600 text-sm">
          <PanelsTopLeft className="inline mr-1" size={14} /> {windowType}
        </p>

        <div className="flex justify-between mt-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit && onEdit();
            }}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded"
          >
            Edit
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete && onDelete();
            }}
            className="px-3 py-1 text-sm bg-red-600 text-white rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
