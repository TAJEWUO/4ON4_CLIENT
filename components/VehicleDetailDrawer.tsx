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
      {/* Full Page Modal */}
      <div
        className={`fixed inset-0 bg-white z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close button - Top Right */}
        <button
          onClick={onClose}
          className="fixed top-4 right-4 z-10 p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition shadow-lg"
        >
          <X className="w-6 h-6 text-gray-700" />
        </button>

        {/* Content */}
        <div className="overflow-y-auto h-full pb-6">
          {/* Header Section */}
          <div className="bg-gradient-to-b from-gray-50 to-white p-6 md:p-8 border-b border-gray-200">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {vehicle.plateNumber}
            </h1>
            {vehicle.model && (
              <p className="text-xl text-gray-600">{vehicle.model}</p>
            )}
          </div>

          {/* Main Image - Contained, not stretched */}
          <div className="relative w-full bg-gray-900 flex items-center justify-center" style={{ minHeight: '400px', maxHeight: '60vh' }}>
            {vehicle.images?.[0] ? (
              <img
                src={getImageUrl(vehicle.images[0]) || ""}
                alt={vehicle.plateNumber}
                className="max-w-full max-h-full object-contain"
                style={{ maxHeight: '60vh' }}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="w-full h-64 flex items-center justify-center">
                <Car className="w-20 h-20 text-gray-400" />
              </div>
            )}
          </div>

          {/* Vehicle Details */}
          <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8">
            {/* Key Specifications */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Key Specifications</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {/* Seat Count */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
                <div className="flex items-center gap-2 text-blue-700 mb-2">
                  <Users className="w-5 h-5" />
                  <span className="text-sm font-medium">Capacity</span>
                </div>
                <p className="text-2xl font-bold text-blue-900">
                  {vehicle.seatCount || 4} Seats
                </p>
              </div>

              {/* Color */}
              {vehicle.color && (
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border border-purple-200">
                  <div className="flex items-center gap-2 text-purple-700 mb-2">
                    <Palette className="w-5 h-5" />
                    <span className="text-sm font-medium">Color</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-900 capitalize">
                    {vehicle.color.toLowerCase()}
                  </p>
                </div>
              )}

              {/* Window Type */}
              {vehicle.windowType && (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
                  <div className="flex items-center gap-2 text-gray-700 mb-2">
                    <Square className="w-5 h-5" />
                    <span className="text-sm font-medium">Windows</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 capitalize">
                    {vehicle.windowType.toLowerCase()}
                  </p>
                </div>
              )}
            </div>
            </div>

            {/* Features */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Special Features</h2>
              <div className="flex flex-wrap gap-3">
                {vehicle.sunroof && (
                  <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-orange-50 text-orange-700 px-4 py-3 rounded-lg border border-orange-200 shadow-sm">
                    <Sun className="w-5 h-5" />
                    <span className="font-semibold">Sunroof</span>
                  </div>
                )}
                {vehicle.fourByFour && (
                  <div className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 px-4 py-3 rounded-lg border border-green-200 shadow-sm">
                    <Mountain className="w-5 h-5" />
                    <span className="font-semibold">4x4 Capability</span>
                  </div>
                )}
              </div>
            </div>

            {/* Trip Types */}
            {vehicle.tripType && vehicle.tripType.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Available Trip Types
                </h2>
                <div className="flex flex-wrap gap-3">
                  {vehicle.tripType.map((type, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 px-4 py-3 rounded-lg border border-indigo-200 shadow-sm"
                    >
                      <MapPin className="w-5 h-5" />
                      <span className="font-semibold capitalize">
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
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  Additional Information
                </h2>
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <p className="text-gray-700 leading-relaxed">
                    {vehicle.additionalFeatures}
                  </p>
                </div>
              </div>
            )}

            {/* Additional Images */}
            {vehicle.images && vehicle.images.length > 1 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Gallery
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {vehicle.images.slice(1).map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square bg-gray-900 rounded-xl overflow-hidden border-2 border-gray-200 hover:border-green-500 transition-all duration-200 cursor-pointer group"
                    >
                      <img
                        src={getImageUrl(image) || ""}
                        alt={`${vehicle.plateNumber} - ${index + 2}`}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
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
            <div className="flex justify-center pt-4 pb-8">
              <button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-12 rounded-2xl shadow-xl transition-all duration-200 transform hover:scale-105 hover:shadow-2xl">
                <span className="text-lg">Connect with Driver</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
