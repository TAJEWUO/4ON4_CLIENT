"use client";
import { useState, useRef } from "react";
import { ProfileFormData } from "../ProfileWizard";
import { User, Camera } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

async function httpPost(endpoint: string, body: string) {
  const token = typeof window !== "undefined" ? localStorage.getItem("fouron4_access") : null;
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      credentials: "include",
      body,
    });
    const data = await res.json();
    return { ok: res.ok, data };
  } catch (err) {
    return { ok: false, data: { message: "Network error" } };
  }
}

type Props = {
  data: ProfileFormData;
  onChange: <K extends keyof ProfileFormData>(
    field: K,
    value: ProfileFormData[K]
  ) => void;
  onNext: () => void;
  existingAvatar?: string | null; // Path to existing profile picture
  onAvatarChanged?: () => void; // Callback when avatar is updated
};

export default function Step1BasicInfo({ 
  data, 
  onChange, 
  onNext, 
  existingAvatar,
  onAvatarChanged 
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState<string | null>(existingAvatar || null);

  const avatarUrl = (() => {
    if (!currentAvatar) return null;
    if (currentAvatar.startsWith("http://") || currentAvatar.startsWith("https://")) {
      return currentAvatar;
    }
    return `${API_BASE}/${currentAvatar.replace(/^\/+/, "")}`;
  })();

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("profilePicture", file);

      const response = await httpPost("/api/profile/me/avatar", formData);
      
      if (response.profilePicture?.path) {
        setCurrentAvatar(response.profilePicture.path);
        onAvatarChanged?.(); // Notify parent that avatar changed
      }
    } catch (error) {
      console.error("Failed to upload avatar:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Profile Picture Upload */}
      <div className="flex flex-col items-center mb-6">
        <div 
          className="relative w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden cursor-pointer group"
          onClick={handleAvatarClick}
        >
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <User size={40} className="text-gray-600" />
          )}
          
          {/* Camera icon overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera size={24} className="text-white" />
          </div>

          {/* Plus icon if no avatar */}
          {!avatarUrl && (
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white">
              <span className="text-white text-xs font-bold">+</span>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <p className="text-xs text-gray-500 mt-2">
          {uploading ? "Uploading..." : "Tap to change photo"}
        </p>
      </div>

      {[
        ["firstName", "First Name"],
        ["lastName", "Last Name"],
        ["otherName", "Other Name"],
        ["phoneNumber", "Phone Number"],
        ["email", "Email"],
      ].map(([key, label]) => (
        <div key={key}>
          <label className="text-sm text-green-600">{label}</label>
          <input
            className="w-full border rounded-lg px-4 py-2"
            value={(data as any)[key]}
            onChange={(e) => onChange(key as any, e.target.value)}
          />
        </div>
      ))}

      <div className="pt-24 flex justify-end">
        <button
          onClick={onNext}
          className="px-6 py-3 rounded-full bg-green-600 text-white"
          disabled={uploading}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
