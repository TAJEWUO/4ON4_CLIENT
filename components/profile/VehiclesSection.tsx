"use client";

import { useState, useEffect } from "react";
import { Car, ChevronDown, ChevronUp, X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { getVehicles } from "@/services/vehicle.service";
import { getImageUrl } from "@/lib/utils/imageUtils";
import { useAuth } from "@/contexts/AuthContext";

export default function VehiclesSection() {
  const { token, userId } = useAuth();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentVehicle, setCurrentVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVehicles();
  }, [userId, token]);

  const loadVehicles = async () => {
    if (!userId || !token) return;

    setLoading(true);
    const result = await getVehicles(userId, token);

    if (result.ok && result.data) {
      setVehicles(result.data.vehicles || []);
    }
    setLoading(false);
  };

  const openImageModal = (vehicle: any, imageIndex: number = 0) => {
    setCurrentVehicle(vehicle);
    setCurrentImageIndex(imageIndex);
    setSelectedImage(getImageUrl(vehicle.images[imageIndex]) || "");
  };

  const closeModal = () => {
    setSelectedImage(null);
    setCurrentVehicle(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (currentVehicle && currentVehicle.images) {
      const newIndex = (currentImageIndex + 1) % currentVehicle.images.length;
      setCurrentImageIndex(newIndex);
      setSelectedImage(getImageUrl(currentVehicle.images[newIndex]) || "");
    }
  };

  const prevImage = () => {
    if (currentVehicle && currentVehicle.images) {
      const newIndex =
        currentImageIndex === 0
          ? currentVehicle.images.length - 1
          : currentImageIndex - 1;
      setCurrentImageIndex(newIndex);
      setSelectedImage(getImageUrl(currentVehicle.images[newIndex]) || "");
    }
  };

  if (loading || vehicles.length === 0) {
    return null;
  }

  return (
    <>
      <section className="border-t border-gray-200 pt-5">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-3">
            <Car size={18} className="text-gray-600" />
            <h2 className="text-base font-semibold text-gray-800">
              My Vehicles ({vehicles.length})
            </h2>
          </div>
          {isExpanded ? (
            <ChevronUp size={18} className="text-gray-400" />
          ) : (
            <ChevronDown size={18} className="text-gray-400" />
          )}
        </button>

        {isExpanded && (
          <div className="mt-3 space-y-3">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle._id}
                className="border border-gray-200 rounded-xl p-4 bg-gray-50"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-sm">
                      {vehicle.plateNumber}
                    </h3>
                    {vehicle.model && (
                      <p className="text-xs text-gray-600">{vehicle.model}</p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-1.5 text-xs text-gray-500">
                      <span>{vehicle.seatCount} seats</span>
                      {Array.isArray(vehicle.tripType) && vehicle.tripType.length > 0 && (
                        <span>• {vehicle.tripType.join(", ")}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Vehicle Images Grid */}
                {vehicle.images && vehicle.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {vehicle.images.map((image: string, idx: number) => (
                      <div
                        key={idx}
                        onClick={() => openImageModal(vehicle, idx)}
                        className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden cursor-pointer group"
                      >
                        <img
                          src={getImageUrl(image) || ""}
                          alt={`${vehicle.plateNumber} - ${idx + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.style.display = "none";
                          }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                          <Maximize2
                            size={20}
                            className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Vehicle Details */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600">
                  {vehicle.tripType && (
                    <div>
                      <span className="font-medium">Trip Type:</span>{" "}
                      {vehicle.tripType}
                    </div>
                  )}
                  {vehicle.color && (
                    <div>
                      <span className="font-medium">Color:</span> {vehicle.color}
                    </div>
                  )}
                  {vehicle.windowType && (
                    <div>
                      <span className="font-medium">Windows:</span>{" "}
                      {vehicle.windowType}
                    </div>
                  )}
                  {vehicle.sunroof && (
                    <div className="text-green-600 font-medium">✓ Sunroof</div>
                  )}
                  {vehicle.fourByFour && (
                    <div className="text-green-600 font-medium">✓ 4x4</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Full-Screen Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center z-10"
          >
            <X size={24} className="text-white" />
          </button>

          {/* Image Counter */}
          {currentVehicle && currentVehicle.images.length > 1 && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
              {currentImageIndex + 1} / {currentVehicle.images.length}
            </div>
          )}

          {/* Previous Button */}
          {currentVehicle && currentVehicle.images.length > 1 && (
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
            >
              <ChevronLeft size={28} className="text-white" />
            </button>
          )}

          {/* Image */}
          <img
            src={selectedImage}
            alt="Vehicle"
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.style.display = "none";
            }}
          />

          {/* Next Button */}
          {currentVehicle && currentVehicle.images.length > 1 && (
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
            >
              <ChevronRight size={28} className="text-white" />
            </button>
          )}

          {/* Vehicle Info */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-6 py-3 rounded-full text-sm">
            {currentVehicle?.plateNumber} {currentVehicle?.model && `- ${currentVehicle.model}`}
          </div>
        </div>
      )}
    </>
  );
}
