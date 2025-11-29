"use client";

import { Plus } from "lucide-react";

export default function DriverPreview({
  driver,
  onClick,
}: {
  driver?: {
    firstName: string;
    lastName: string;
    image?: string; // Stored in DB as filename only
  };
  onClick: () => void;
}) {
  // If NO DRIVER exists — show blank add profile block
  if (!driver) {
    return (
      <div className="w-full flex flex-col items-center py-6">
        {/* Empty circle with + button */}
        <button
          onClick={onClick}
          className="w-20 h-20 rounded-full bg-gray-200 border border-gray-400 flex items-center justify-center hover:bg-gray-300 transition"
        >
          <Plus size={28} className="text-black" />
        </button>

        {/* Add profile link */}
        <button
          onClick={onClick}
          className="mt-3 text-black underline text-sm"
        >
          Add Driver Profile
        </button>
      </div>
    );
  }

  // DRIVER EXISTS — show profile
  return (
    <div
      onClick={onClick}
      className="w-full bg-white border border-gray-300 rounded-lg shadow p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition"
    >
      {/* Driver Image */}
      <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
        {driver.image ? (
          <img
            src={`http://192.168.0.101:3002/uploads/drivers/
${driver.image}`}
            className="w-full h-full object-cover"
            alt="Driver"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
            No Img
          </div>
        )}
      </div>

      {/* Driver Name */}
      <div className="flex flex-col">
        <p className="text-black font-semibold text-sm">
          {driver.firstName} {driver.lastName}
        </p>
        <p className="text-gray-500 text-xs">Driver Profile</p>
      </div>
    </div>
  );
}
