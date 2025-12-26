"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getVehicleById, deleteVehicle, updateVehicle, deleteVehicleImage } from "@/services/vehicle.service";
import { getImageUrl } from "@/lib/utils/imageUtils";
import { ChevronLeft, ChevronRight, Edit2, Trash2, Loader2, Check, X, Car, Plus, Camera } from "lucide-react";
import VehicleWizard from "@/components/vehicles/VehicleWizard";

export default function VehicleDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { token } = useAuth();
  const vehicleId = params?.id as string;

  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<number>>(new Set());
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deletingImagePath, setDeletingImagePath] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadVehicle();
  }, [vehicleId]);

  // Reset image errors and index when vehicle changes
  useEffect(() => {
    setImageLoadErrors(new Set());
    setCurrentImageIndex(0);
  }, [vehicleId]);

  // Auto-skip to next valid image if current one fails
  useEffect(() => {
    if (vehicle?.images && imageLoadErrors.has(currentImageIndex)) {
      const validIndices = vehicle.images
        .map((_, idx) => idx)
        .filter(idx => !imageLoadErrors.has(idx));
      
      if (validIndices.length > 0) {
        setCurrentImageIndex(validIndices[0]);
      }
    }
  }, [imageLoadErrors, currentImageIndex, vehicle]);

  const loadVehicle = async () => {
    if (!vehicleId || !token) return;

    setLoading(true);
    const result = await getVehicleById(vehicleId, token);

    console.log("Vehicle fetch result:", result);

    if (result.ok && result.data) {
      console.log("Vehicle data:", result.data);
      // Backend returns { ok: true, data: { vehicle: {...} } }
      const vehicleData = result.data.vehicle || result.data;
      console.log("Setting vehicle:", vehicleData);
      console.log("Vehicle images:", vehicleData.images);
      console.log("Vehicle images type:", typeof vehicleData.images);
      if (vehicleData.images && vehicleData.images.length > 0) {
        console.log("First image:", vehicleData.images[0]);
      }
      setVehicle(vehicleData);
    } else {
      console.error("Failed to load vehicle:", result);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this vehicle?")) return;

    console.log("Deleting vehicle:", vehicleId);
    setDeleting(true);
    const result = await deleteVehicle(vehicleId, token || undefined);

    console.log("Delete vehicle result:", result);
    if (result.ok) {
      console.log("Vehicle deleted successfully, navigating to list");
      router.push("/user/app/vehicles");
    } else {
      console.error("Failed to delete vehicle:", result);
      alert(result.message || "Failed to delete vehicle");
      setDeleting(false);
    }
  };

  const nextImage = () => {
    if (vehicle?.images) {
      let nextIndex = (currentImageIndex + 1) % vehicle.images.length;
      let attempts = 0;
      
      // Skip over failed images
      while (imageLoadErrors.has(nextIndex) && attempts < vehicle.images.length) {
        nextIndex = (nextIndex + 1) % vehicle.images.length;
        attempts++;
      }
      
      setCurrentImageIndex(nextIndex);
    }
  };

  const prevImage = () => {
    if (vehicle?.images) {
      let prevIndex = currentImageIndex === 0 ? vehicle.images.length - 1 : currentImageIndex - 1;
      let attempts = 0;
      
      // Skip over failed images
      while (imageLoadErrors.has(prevIndex) && attempts < vehicle.images.length) {
        prevIndex = prevIndex === 0 ? vehicle.images.length - 1 : prevIndex - 1;
        attempts++;
      }
      
      setCurrentImageIndex(prevIndex);
    }
  };

  const openImageModal = (index: number) => {
    setModalImageIndex(index);
    setModalOpen(true);
  };

  const closeImageModal = () => {
    setModalOpen(false);
  };

  const nextModalImage = () => {
    if (vehicle?.images) {
      setModalImageIndex((prev) => (prev + 1) % vehicle.images.length);
    }
  };

  const prevModalImage = () => {
    if (vehicle?.images) {
      setModalImageIndex((prev) => (prev - 1 + vehicle.images.length) % vehicle.images.length);
    }
  };

  const handleAddImages = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const currentImageCount = vehicle.images?.length || 0;
    const availableSlots = 5 - currentImageCount;

    if (availableSlots <= 0) {
      alert("Maximum 5 images allowed. Please delete some images first.");
      return;
    }

    const filesToUpload = Array.from(files).slice(0, availableSlots);

    if (filesToUpload.length < files.length) {
      alert(`Only ${availableSlots} slot(s) available. Uploading ${filesToUpload.length} image(s).`);
    }

    try {
      setUploadingImage(true);
      const formData = new FormData();
      filesToUpload.forEach(file => {
        formData.append("images", file);
      });

      const result = await updateVehicle(vehicle._id, formData, token || "");

      if (result.ok) {
        loadVehicle();
      } else {
        alert(result.message || "Failed to upload images");
      }
    } catch (error) {
      alert("Failed to upload images");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDeleteImage = async (imagePath: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      setDeletingImagePath(imagePath);
      const result = await deleteVehicleImage(vehicle._id, imagePath, token || "");

      if (result.ok) {
        loadVehicle();
      } else {
        alert(result.message || "Failed to delete image");
      }
    } catch (error) {
      alert("Failed to delete image");
    } finally {
      setDeletingImagePath(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-green-600" />
        <p className="mt-4 text-gray-600">Loading vehicle...</p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <X className="w-16 h-16 text-red-500 mb-4" />
        <p className="text-gray-600">Vehicle not found</p>
      </div>
    );
  }

  if (editing) {
    return (
      <VehicleWizard
        vehicle={vehicle}
        onSaved={() => {
          setEditing(false);
          loadVehicle();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Vehicle Details */}
      <div className="max-w-2xl mx-auto p-5 space-y-5 pt-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              {vehicle.plateNumber}
            </h1>
            {vehicle.model && (
              <p className="text-base text-gray-600 mt-1">{vehicle.model}</p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              title="Edit vehicle details"
            >
              <Edit2 size={18} />
              <span className="text-sm font-medium">Edit</span>
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition"
              title="Delete vehicle"
            >
              {deleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
              <span className="text-sm font-medium">{deleting ? "Deleting..." : "Delete"}</span>
            </button>
          </div>
        </div>

        {/* Thumbnail Images Grid */}
        <div className="bg-white rounded-2xl shadow-md p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">
              Images ({vehicle.images?.length || 0} of 5)
            </h3>
            {vehicle.images?.length < 5 && (
              <button
                onClick={handleAddImages}
                disabled={uploadingImage}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-full text-xs font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
              >
                {uploadingImage ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Plus size={14} />
                    Add
                  </>
                )}
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {vehicle.images && vehicle.images.length > 0 ? (
              vehicle.images.map((image: string, idx: number) => (
                <div
                  key={idx}
                  className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden group"
                >
                  <img
                    src={getImageUrl(image) || ""}
                    alt={`${vehicle.plateNumber} - ${idx + 1}`}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => openImageModal(idx)}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  {/* Hover overlay for view */}
                  <div 
                    onClick={() => openImageModal(idx)}
                    className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center cursor-pointer"
                  >
                    <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-medium">View</span>
                  </div>
                  {/* Image number */}
                  <div className="absolute top-1 left-1 bg-black/60 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center pointer-events-none">
                    {idx + 1}
                  </div>
                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteImage(image);
                    }}
                    disabled={deletingImagePath === image}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 disabled:bg-gray-400"
                    title="Delete image"
                  >
                    {deletingImagePath === image ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Trash2 size={12} />
                    )}
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-3 sm:col-span-4 md:col-span-5 flex flex-col items-center justify-center py-8 text-gray-400">
                <Camera size={32} />
                <p className="text-sm mt-2">No images yet</p>
              </div>
            )}

            {/* Add more placeholder */}
            {vehicle.images?.length > 0 && vehicle.images.length < 5 && (
              <button
                onClick={handleAddImages}
                disabled={uploadingImage}
                className="aspect-square bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Camera size={24} />
                <span className="text-xs mt-1">Add</span>
              </button>
            )}
          </div>
        </div>

        {/* Details Grid */}
        <div className="bg-white rounded-2xl shadow-md p-5 space-y-3">
          <DetailRow label="Seat Count" value={`${vehicle.seatCount} seats`} />
          <DetailRow 
            label="Trip Type" 
            value={Array.isArray(vehicle.tripType) && vehicle.tripType.length > 0 
              ? vehicle.tripType.join(", ") 
              : "Not specified"} 
          />
          <DetailRow label="Color" value={vehicle.color} />
          <DetailRow label="Window Type" value={vehicle.windowType} />
          <DetailRow
            label="Sunroof"
            value={
              <span className={vehicle.sunroof ? "text-green-600" : "text-gray-500"}>
                {vehicle.sunroof ? "YES" : "NO"}
              </span>
            }
          />
          <DetailRow
            label="4x4"
            value={
              <span className={vehicle.fourByFour ? "text-green-600" : "text-gray-500"}>
                {vehicle.fourByFour ? "YES" : "NO"}
              </span>
            }
          />
          {vehicle.additionalFeatures && (
            <DetailRow
              label="Additional Features"
              value={vehicle.additionalFeatures}
            />
          )}
        </div>
      </div>

      {/* Floating Image Modal */}
      {modalOpen && vehicle.images && vehicle.images.length > 0 && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={closeImageModal}
        >
          <div 
            className="relative w-full max-w-4xl aspect-video bg-gray-900 rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: '75vh' }}
          >
            {/* Close button */}
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-gray-800 z-10 transition"
            >
              <X size={20} />
            </button>

            {/* Image */}
            <img
              src={getImageUrl(vehicle.images[modalImageIndex]) || ""}
              alt={`${vehicle.plateNumber} - ${modalImageIndex + 1}`}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "";
              }}
            />

            {/* Navigation buttons */}
            {vehicle.images.length > 1 && (
              <>
                <button
                  onClick={prevModalImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 hover:bg-white text-gray-800 flex items-center justify-center transition"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={nextModalImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 hover:bg-white text-gray-800 flex items-center justify-center transition"
                >
                  <ChevronRight size={24} />
                </button>

                {/* Image counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium">
                  {modalImageIndex + 1} / {vehicle.images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex justify-between items-start border-b border-gray-100 pb-2 last:border-0">
      <span className="text-sm text-gray-500 font-medium">{label}</span>
      <span className="text-sm text-gray-700 text-right">{value}</span>
    </div>
  );
}
