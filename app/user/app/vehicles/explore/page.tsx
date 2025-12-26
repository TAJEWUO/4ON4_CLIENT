"use client";

import { useState, useEffect } from "react";
import { getAllVehicles } from "@/services/vehicle.service";
import { getImageUrl } from "@/lib/utils/imageUtils";
import { Car, ChevronRight, Search } from "lucide-react";
import VehicleDetailDrawer from "@/components/VehicleDetailDrawer";

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

export default function ExploreVehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Filter states
  const [searchPlate, setSearchPlate] = useState("");
  const [filterCapacity, setFilterCapacity] = useState("");
  const [filterColor, setFilterColor] = useState("");

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    setLoading(true);
    const result = await getAllVehicles(100);
    
    if (result.ok && result.data) {
      setVehicles(result.data.vehicles || []);
      setFilteredVehicles(result.data.vehicles || []);
    }
    setLoading(false);
  };

  // Apply filters
  useEffect(() => {
    let filtered = [...vehicles];

    if (searchPlate) {
      filtered = filtered.filter(v => 
        v.plateNumber.toLowerCase().includes(searchPlate.toLowerCase())
      );
    }

    if (filterCapacity) {
      filtered = filtered.filter(v => 
        v.seatCount?.toString() === filterCapacity
      );
    }

    if (filterColor) {
      filtered = filtered.filter(v => 
        v.color?.toLowerCase() === filterColor.toLowerCase()
      );
    }

    setFilteredVehicles(filtered);
  }, [searchPlate, filterCapacity, filterColor, vehicles]);

  const handleVehicleClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedVehicle(null), 300);
  };

  // Get unique capacities and colors
  const capacities = [...new Set(vehicles.map(v => v.seatCount).filter(Boolean))].sort((a, b) => a! - b!);
  const colors = [...new Set(vehicles.map(v => v.color?.toLowerCase()).filter(Boolean))].sort();

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Loading vehicles...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 pb-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 text-center">
          SELECT YOUR PREFERED <span className="text-green-600">4ON4</span> VEHICLE AND PRESS{" "}
          <span className="text-green-600">CONNECT</span> TO GET A DRIVER'S INPUT
        </h1>

        {/* Filters - Single Line */}
        <div className="flex gap-2 items-center mb-6 overflow-x-auto pb-2">
          {/* Search by plate */}
          <div className="relative flex-shrink-0">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
            <input
              type="text"
              placeholder="Plate"
              value={searchPlate}
              onChange={(e) => setSearchPlate(e.target.value)}
              className="pl-7 pr-2 py-1 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 w-24"
            />
          </div>

          {/* Capacity filter */}
          <select
            value={filterCapacity}
            onChange={(e) => setFilterCapacity(e.target.value)}
            className="px-2 py-1 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 flex-shrink-0"
          >
            <option value="">All Seats</option>
            {capacities.map(cap => (
              <option key={cap} value={cap}>{cap} seats</option>
            ))}
          </select>

          {/* Color filter */}
          <select
            value={filterColor}
            onChange={(e) => setFilterColor(e.target.value)}
            className="px-2 py-1 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 flex-shrink-0 capitalize"
          >
            <option value="">All Colors</option>
            {colors.map(color => (
              <option key={color} value={color} className="capitalize">{color}</option>
            ))}
          </select>

          {/* Results count */}
          <span className="text-xs text-gray-600 ml-auto flex-shrink-0">
            {filteredVehicles.length} vehicle{filteredVehicles.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Vehicles Grid */}
        {filteredVehicles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Car className="w-16 h-16 text-gray-400 mb-3" />
            <p className="text-gray-500">No vehicles match your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredVehicles.map((vehicle) => (
              <div
                key={vehicle._id}
                onClick={() => handleVehicleClick(vehicle)}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden transform hover:scale-105"
              >
                {/* Vehicle Image */}
                <div className="relative w-full h-36 bg-gradient-to-br from-gray-100 to-gray-200">
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

                {/* Vehicle Info */}
                <div className="p-3">
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {vehicle.plateNumber}
                  </p>
                  {vehicle.color && (
                    <p className="text-xs text-gray-600 truncate mt-0.5 capitalize">
                      {vehicle.color.toLowerCase()}
                    </p>
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
        )}
      </div>

      {/* Vehicle Detail Drawer */}
      {selectedVehicle && (
        <VehicleDetailDrawer
          vehicle={selectedVehicle}
          isOpen={isDrawerOpen}
          onClose={handleCloseDrawer}
        />
      )}
    </div>
  );
}
