"use client";

import { useState, useRef } from "react";
import { Camera, Trash2, Upload, Loader2, X, Plus } from "lucide-react";
import { getImageUrl } from "@/lib/utils/imageUtils";
import { deleteVehicleImage, updateVehicle } from "@/services/vehicle.service";

type Props = {
  vehicle: any;
  token: string;
  onUpdate: () => void;
};

export default function VehicleImageManager({ vehicle, token, onUpdate }: Props) {
  const [uploading, setUploading] = useState(false);
  const [deletingImage, setDeletingImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setUploading(true);

      const formData = new FormData();
      filesToUpload.forEach(file => {
        formData.append("images", file);
      });

      console.log(`[Image Manager] Uploading ${filesToUpload.length} new images to vehicle ${vehicle._id}`);

      const result = await updateVehicle(vehicle._id, formData, token);

      if (result.ok) {
        console.log("[Image Manager] Upload successful");
        onUpdate();
      } else {
        console.error("[Image Manager] Upload failed:", result);
        alert(result.message || "Failed to upload images");
      }
    } catch (error) {
      console.error("[Image Manager] Upload error:", error);
      alert("Failed to upload images");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDeleteImage = async (imagePath: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      setDeletingImage(imagePath);
      console.log("[Image Manager] Deleting image:", imagePath);

      const result = await deleteVehicleImage(vehicle._id, imagePath, token);

      if (result.ok) {
        console.log("[Image Manager] Image deleted successfully");
        onUpdate();
      } else {
        console.error("[Image Manager] Delete failed:", result);
        alert(result.message || "Failed to delete image");
      }
    } catch (error) {
      console.error("[Image Manager] Delete error:", error);
      alert("Failed to delete image");
    } finally {
      setDeletingImage(null);
    }
  };

  const currentImageCount = vehicle.images?.length || 0;
  const canAddMore = currentImageCount < 5;

  return (
    <div className="bg-white rounded-2xl shadow p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Vehicle Images</h2>
          <p className="text-sm text-gray-500">{currentImageCount} of 5 images</p>
        </div>
        
        {canAddMore && (
          <button
            onClick={handleAddImages}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Plus size={18} />
                Add Images
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

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {vehicle.images?.map((image: string, idx: number) => (
          <div
            key={idx}
            className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden group"
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
            
            {/* Image number badge */}
            <div className="absolute top-2 left-2 bg-black/50 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
              {idx + 1}
            </div>

            {/* Delete button */}
            <button
              onClick={() => handleDeleteImage(image)}
              disabled={deletingImage === image}
              className="absolute top-2 right-2 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 disabled:bg-gray-400"
              title="Delete image"
            >
              {deletingImage === image ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Trash2 size={16} />
              )}
            </button>
          </div>
        ))}

        {/* Add more placeholder */}
        {canAddMore && (
          <button
            onClick={handleAddImages}
            disabled={uploading}
            className="aspect-video bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Camera size={32} />
            <span className="text-xs mt-2">Add More</span>
          </button>
        )}
      </div>

      {!canAddMore && (
        <p className="text-sm text-gray-500 italic">
          Maximum of 5 images reached. Delete an image to add new ones.
        </p>
      )}
    </div>
  );
}
