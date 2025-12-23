"use client";

import { API_BASE } from "@/lib/http";
import { User, Camera } from "lucide-react";

type Props = {
  profile: any;
  onEdit: () => void;
};

export default function ProfileView({ profile, onEdit }: Props) {
  const avatarUrl = (() => {
    if (!profile) return null;
    const pic = profile.profilePicture ?? profile.profilePicture?.path ?? profile.avatarUrl ?? null;
    if (!pic) return null;
    if (typeof pic === "string") {
      if (pic.startsWith("http://") || pic.startsWith("https://")) return pic;
      return `${API_BASE}/${pic.replace(/^\/+/, "")}`;
    }
    if (pic?.path) return `${API_BASE}/${pic.path.replace(/^\/+/, "")}`;
    return null;
  })();

  return (
    <div className="px-4 pt-6 pb-28 space-y-6">
      <div className="flex flex-col items-center gap-3">
        {/* Profile Picture with Edit Icon */}
        <div 
          className="relative w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden cursor-pointer group"
          onClick={onEdit}
        >
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <User size={40} className="text-gray-600" />
          )}
          
          {/* Camera icon overlay on hover */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera size={24} className="text-white" />
          </div>
        </div>

        <h2 className="font-semibold text-lg">
          {profile?.firstName || "—"} {profile?.lastName || ""}
        </h2>
      </div>

      <div className="space-y-2 text-sm">
        <p><b>Phone:</b> {profile?.phoneNumber || "—"}</p>
        <p><b>Email:</b> {profile?.email || "—"}</p>
        <p><b>Languages:</b> {profile?.languages?.join(", ") || "—"}</p>
        <p><b>Level:</b> {profile?.level || "—"}</p>
        {profile?.yearsOfExperience && (
          <p><b>Experience:</b> {profile.yearsOfExperience} years</p>
        )}
        {profile?.bio && (
          <p><b>Bio:</b> {profile.bio}</p>
        )}
      </div>

      <button
        onClick={onEdit}
        className="w-full py-3 rounded-full bg-black text-white"
      >
        Edit Profile
      </button>
    </div>
  );
}
