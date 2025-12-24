"use client";

import { User, Camera, Edit, Mail, Phone, Globe, Award, Briefcase, FileText, CreditCard, Book } from "lucide-react";
import { useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

type Props = {
  profile: any;
  onEdit: () => void;
};

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-start gap-3 py-3 border-b border-gray-100">
    <div className="mt-1 text-gray-500">{icon}</div>
    <div className="flex-1">
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-sm font-medium text-gray-900">{value || "—"}</p>
    </div>
  </div>
);

export default function ProfileView({ profile, onEdit }: Props) {
  const { token } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState<string | null>(null);

  const avatarUrl = (() => {
    if (!profile) return null;
    const pic = currentAvatar ?? profile.profilePicture ?? profile.profilePicture?.path ?? profile.avatarUrl ?? null;
    if (!pic) return null;
    if (typeof pic === "string") {
      if (pic.startsWith("http://") || pic.startsWith("https://")) return pic;
      return `${API_BASE}/${pic.replace(/^\/+/, "")}`;
    }
    if (pic?.path) return `${API_BASE}/${pic.path.replace(/^\/+/, "")}`;
    return null;
  })();

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!profile) {
      alert("Profile not found. Please refresh the page.");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("profilePicture", file);

      if (!token) {
        alert("Please log in again");
        window.location.href = "/user/auth/login";
        return;
      }

      const response = await fetch(`${API_BASE}/api/profile/me/avatar`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
        body: formData,
      });

      const data = await response.json();
      
      if (response.ok && data.data?.profilePicture?.path) {
        setCurrentAvatar(data.data.profilePicture.path);
      } else {
        console.error("Upload failed:", data);
        alert(data.message || "Failed to upload image");
      }
    } catch (error) {
      console.error("Failed to upload avatar:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-green-600 to-green-800 px-4 pt-8 pb-20 relative">
        <div className="flex flex-col items-center gap-4">
          {/* Profile Picture */}
          <div className="relative">
            <div 
              className="relative w-28 h-28 rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-white shadow-lg cursor-pointer group"
              onClick={handleAvatarClick}
            >
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={48} className="text-gray-400" />
              )}
              
              {/* Camera overlay on hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera size={24} className="text-white" />
              </div>
            </div>

            {/* Camera button - always visible */}
            <button
              onClick={handleAvatarClick}
              disabled={uploading}
              className="absolute bottom-0 right-0 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              title={avatarUrl ? "Change photo" : "Add photo"}
            >
              {avatarUrl ? (
                <Camera size={18} className="text-white" />
              ) : (
                <span className="text-white text-xl font-bold">+</span>
              )}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {uploading && (
            <p className="text-xs text-white">Uploading...</p>
          )}

          {/* Name */}
          <div className="text-center text-white">
            <h1 className="text-2xl font-bold">
              {profile?.firstName || "—"} {profile?.lastName || ""}
            </h1>
            {profile?.level && (
              <p className="text-sm text-green-100 mt-1 font-medium">{profile.level} Level</p>
            )}
          </div>
        </div>
      </div>

      {/* Content Card */}
      <div className="mx-4 -mt-12 bg-white rounded-2xl shadow-lg p-6 space-y-6">
        {/* Contact Information */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
          <div className="space-y-1">
            <InfoRow icon={<Phone size={18} />} label="Phone Number" value={profile?.phoneNumber || profile?.phone} />
            <InfoRow icon={<Mail size={18} />} label="Email Address" value={profile?.email} />
          </div>
        </section>

        {/* Professional Details */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Professional Details</h2>
          <div className="space-y-1">
            <InfoRow 
              icon={<Globe size={18} />} 
              label="Languages" 
              value={Array.isArray(profile?.languages) ? profile.languages.join(", ") : profile?.languages || "—"} 
            />
            <InfoRow 
              icon={<Briefcase size={18} />} 
              label="Years of Experience" 
              value={profile?.yearsOfExperience ? `${profile.yearsOfExperience} years` : "—"} 
            />
            <InfoRow 
              icon={<Book size={18} />} 
              label="Level of Education" 
              value={profile?.levelOfEducation} 
            />
          </div>
        </section>

        {/* Documents & IDs */}
        {(profile?.idNumber || profile?.passportNumber || profile?.drivingLicenseNumber || profile?.traNumber) && (
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Documents & Identification</h2>
            <div className="space-y-1">
              {profile?.idNumber && <InfoRow icon={<CreditCard size={18} />} label="ID Number" value={profile.idNumber} />}
              {profile?.passportNumber && <InfoRow icon={<FileText size={18} />} label="Passport Number" value={profile.passportNumber} />}
              {profile?.drivingLicenseNumber && <InfoRow icon={<CreditCard size={18} />} label="Driving License" value={profile.drivingLicenseNumber} />}
              {profile?.traNumber && <InfoRow icon={<Award size={18} />} label="TRA Number" value={profile.traNumber} />}
            </div>
          </section>
        )}

        {/* Bio */}
        {profile?.bio && (
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">About Me</h2>
            <p className="text-sm text-gray-700 leading-relaxed">{profile.bio}</p>
          </section>
        )}

        {/* Edit Button */}
        <button
          onClick={onEdit}
          className="w-full py-3 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
        >
          <Edit size={18} />
          Edit Profile
        </button>
      </div>
    </div>
  );
}
