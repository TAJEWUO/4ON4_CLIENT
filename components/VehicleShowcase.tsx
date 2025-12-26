"use client";

import { useState, useEffect, useRef } from "react";
import { getAllVehicles } from "@/services/vehicle.service";
import { getImageUrl } from "@/lib/utils/imageUtils";
import { Car, ChevronRight } from "lucide-react";
import VehicleDetailDrawer from "./VehicleDetailDrawer";

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

export default function VehicleShowcase() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    setLoading(true);
    const result = await getAllVehicles(20);
    
    if (result.ok && result.data) {
      setVehicles(result.data.vehicles || []);
    }
    setLoading(false);
  };

  // Shuffle vehicles every 2-3 seconds
  useEffect(() => {
    if (vehicles.length === 0 || isPaused) return;

    const shuffleInterval = setInterval(() => {
      setVehicles(prev => {
        const shuffled = [...prev];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
      });
    }, 2500);

    return () => clearInterval(shuffleInterval);
  }, [vehicles.length, isPaused]);

  // Auto-scroll effect
  useEffect(() => {
    if (!scrollContainerRef.current || vehicles.length === 0 || isPaused) return;

    const container = scrollContainerRef.current;
    let scrollPosition = 0;
    const scrollSpeed = 1;
    
    const scroll = () => {
      if (!container) return;
      
      scrollPosition += scrollSpeed;
      
      if (scrollPosition >= container.scrollWidth / 2) {
        scrollPosition = 0;
      }
      
      container.scrollLeft = scrollPosition;
    };

    const scrollInterval = setInterval(scroll, 30);

    return () => clearInterval(scrollInterval);
  }, [vehicles.length, isPaused]);

  const handleVehicleClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDrawerOpen(true);
    setIsPaused(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setIsPaused(false);
    setTimeout(() => setSelectedVehicle(null), 300);
  };

  const infiniteVehicles = vehicles.length > 0 ? [...vehicles, ...vehicles] : [];

  if (loading) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-4 px-6">
          <h2 className="text-xl font-semibold text-gray-800">Available Vehicles</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 px-6 scrollbar-hide">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex-shrink-0 w-40 md:w-48 h-56 bg-gray-200 rounded-2xl animate-pulse shadow-lg"
            />
          ))}
        </div>
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="w-full px-6">
        <div className="flex flex-col items-center justify-center py-12">
          <Car className="w-16 h-16 text-gray-400 mb-3" />
          <p className="text-center text-gray-500">No vehicles available</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full relative">
        <div className="flex items-center justify-center mb-4 px-6">
          <h2 className="text-lg md:text-xl font-bold text-gray-900">
            4ON4 CERTIFIED TOUR VEHICLES, OPEN TO <span className="text-green-600">CONNECT</span>
          </h2>
        </div>

        <div 
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto pb-4 px-6 scrollbar-hide"
            style={{ scrollBehavior: 'auto' }}
          >
            {infiniteVehicles.map((vehicle, index) => (
              <div
                key={`${vehicle._id}-${index}`}
                onClick={() => handleVehicleClick(vehicle)}
                className="flex-shrink-0 w-40 md:w-48 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden transform hover:scale-105"
              >
                <div className="relative w-full h-36 md:h-40 bg-gradient-to-br from-gray-100 to-gray-200">
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
                      <Car className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                <div className="p-3">
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {vehicle.plateNumber}
                  </p>
                  {vehicle.color && (
                    <p className="text-xs text-gray-600 truncate mt-0.5 capitalize">{vehicle.color.toLowerCase()}</p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs font-medium text-gray-700">
                      {vehicle.seatCount || 4} seats
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedVehicle && (
        <VehicleDetailDrawer
          vehicle={selectedVehicle}
          isOpen={isDrawerOpen}
          onClose={handleCloseDrawer}
        />
      )}

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}
