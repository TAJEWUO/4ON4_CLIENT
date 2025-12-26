"use client";

import { useEffect } from "react";
import { getImageUrl } from "@/lib/utils/imageUtils";
import { X, Car, Users, Palette, Square, Sun, Mountain, MapPin } from "lucide-react";

interface Vehicle {
  _id: string;
  plateNumber: string;
  model?: string;
  images?: string[];
  seatCount?: number;
  color?: string;
  tripType?: string[];
  windowType?: string;
  sunroof?: boolean;
  fourByFour?: boolean;
  additionalFeatures?: string;
}

interface VehicleDetailDrawerProps {
  vehicle: Vehicle;
  isOpen: boolean;
  onClose: () => void;
}

export default function VehicleDetailDrawer({
  vehicle,
  isOpen,
  onClose,
}: VehicleDetailDrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Centered Drawer */}
        <div
          className={`relative w-full max-w-2xl max-h-[85vh] bg-white rounded-3xl shadow-2xl transform transition-all duration-300 ${
            isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with close button */}
          <div className="sticky top-0 bg-white border-b border-gray-200 rounded-t-3xl p-4 flex items-center justify-between z-10">
            <h2 className="text-xl font-bold text-gray-900">Vehicle Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(85vh-5rem)] pb-6">
          {/* Vehicle Image */}
          <div className="relative w-full h-64 md:h-80 bg-gray-100">
            {vehicle.images?.[0] ? (
              <img
                src={getImageUrl(vehicle.images[0]) || ""}
                alt={vehicle.plateNumber}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Car className="w-20 h-20 text-gray-400" />
              </div>
            )}
          </div>

          {/* Vehicle Details */}
          <div className="p-6 space-y-6">
            {/* Plate Number & Model */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{vehicle.plateNumber}</h3>
              {vehicle.model && (
                <p className="text-lg text-gray-600 mt-1">{vehicle.model}</p>
              )}
            </div>

            {/* Basic Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Seat Count */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">Seats</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {vehicle.seatCount || 4}
                </p>
              </div>

              {/* Color */}
              {vehicle.color && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Palette className="w-4 h-4" />
                    <span className="text-sm">Color</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 capitalize">
                    {vehicle.color.toLowerCase()}
                  </p>
                </div>
              )}

              {/* Window Type */}
              {vehicle.windowType && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Square className="w-4 h-4" />
                    <span className="text-sm">Windows</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 capitalize">
                    {vehicle.windowType.toLowerCase()}
                  </p>
                </div>
              )}
            </div>

            {/* Features */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Features</h4>
              <div className="flex flex-wrap gap-2">
                {vehicle.sunroof && (
                  <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg">
                    <Sun className="w-4 h-4" />
                    <span className="text-sm font-medium">Sunroof</span>
                  </div>
                )}
                {vehicle.fourByFour && (
                  <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-lg">
                    <Mountain className="w-4 h-4" />
                    <span className="text-sm font-medium">4x4</span>
                  </div>
                )}
              </div>
            </div>

            {/* Trip Types */}
            {vehicle.tripType && vehicle.tripType.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Available for
                </h4>
                <div className="flex flex-wrap gap-2">
                  {vehicle.tripType.map((type, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-2 rounded-lg"
                    >
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm font-medium capitalize">
                        {type.toLowerCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Features */}
            {vehicle.additionalFeatures && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Additional Features
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {vehicle.additionalFeatures}
                </p>
              </div>
            )}

            {/* Additional Images */}
            {vehicle.images && vehicle.images.length > 1 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  More Photos
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {vehicle.images.slice(1).map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden"
                    >
                      <img
                        src={getImageUrl(image) || ""}
                        alt={`${vehicle.plateNumber} - ${index + 2}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Connect Button */}
            <div className="flex justify-center mt-6">
              <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105">
                Connect
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
