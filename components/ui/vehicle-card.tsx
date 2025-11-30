"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Users, PanelsTopLeft } from "lucide-react";

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
      <div className="relative w-full h-40 bg-gray-200 overflow-hidden">
        {images.length > 0 ? (
          <img
            src={images[index]}
            className="w-full h-full object-cover"
            alt={plate}
          />
        ) : (
          <div className="text-gray-500 text-sm text-center">No Image</div>
        )}

        {images.length > 1 && (
          <>
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white p-1 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
              }}
            >
              <ChevronLeft size={20} />
            </button>

            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white p-1 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                setIndex((prev) =>
                  prev === images.length - 1 ? 0 : prev + 1
                );
              }}
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      <div className="p-4">
        <p className="font-semibold">{plate}</p>

        <p className="text-gray-600 text-sm flex items-center gap-1">
          <Users size={14} /> {capacity} seats
        </p>

        <p className="text-gray-600 text-sm flex items-center gap-1">
          <PanelsTopLeft size={14} /> {windowType}
        </p>

        <div className="flex justify-between mt-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded"
          >
            Edit
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
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
