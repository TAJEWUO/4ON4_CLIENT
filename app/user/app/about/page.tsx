"use client";

import { useRouter } from "next/navigation";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";
import { useRef, useState } from "react";
import {
  ChevronRight,
  Settings,
  HelpCircle,
  Briefcase,
  Cpu,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  User,
  Camera,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

export default function AboutPage() {
  const router = useRouter();
  const { token, clearAuth } = useAuth();
  const { profile, loading, error, refresh } = useProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState<string | null>(null);

  const logout = () => {
    clearAuth();
    sessionStorage.clear();
    router.replace("/user/auth/login");
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!profile) {
      alert("Please create your profile first by clicking 'View Full Profile'");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("profilePicture", file);

      if (!token) {
        alert("Please log in again");
        router.push("/user/auth/login");
        return;
      }

      const response = await fetch(`${API_BASE}/api/profile/me/avatar`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
        body: formData,
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);
      
      const data = await response.json();
      console.log("Response data:", data);
      
      if (response.ok && data.data?.profilePicture?.path) {
        setCurrentAvatar(data.data.profilePicture.path);
        refresh(); // Refresh profile data
      } else {
        console.error("Upload failed:", data);
        alert(data.message || `Failed to upload image (${response.status})`);
      }
    } catch (error) {
      console.error("Failed to upload avatar:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const avatarUrl = (() => {
    if (!profile) return null;
    const pic = currentAvatar ?? profile.profilePicture ?? profile.profilePicture?.path ?? profile.avatarUrl ?? null;
    if (!pic) return null;
    if (typeof pic === "string") {
      if (pic.startsWith("http://") || pic.startsWith("https://")) return pic;
      return `${API_BASE}/${(pic as string).replace(/^\/+/, "")}`;
    }
    if (pic?.path) return `${API_BASE}/${(pic.path as string).replace(/^\/+/, "")}`;
    return null;
  })();

  return (
    <div className="px-4 pt-6 pb-28 space-y-10">
      {/* PROFILE PREVIEW */}
      <section className="flex flex-col items-center space-y-3">
        <div className="relative">
          <div 
            className="relative w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-gray-300 cursor-pointer group"
            onClick={handleAvatarClick}
          >
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <User size={40} className="text-gray-400" />
            )}

            {/* Camera overlay on hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera size={20} className="text-white" />
            </div>
          </div>

          {/* Camera/Plus button */}
          <button
            onClick={handleAvatarClick}
            disabled={uploading}
            className="absolute bottom-0 right-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center border-2 border-white shadow-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {avatarUrl ? (
              <Camera size={14} className="text-white" />
            ) : (
              <span className="text-white text-lg font-bold">+</span>
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
          <p className="text-xs text-gray-500">Uploading...</p>
        )}

        <h2 className="font-semibold text-xl text-center">
          {loading ? "Loading…" : profile ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim() || "User" : "No Profile"}
        </h2>

        <button
          onClick={() => router.push("/user/app/profile")}
          className="px-6 py-2 rounded-full bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition"
        >
          View Full Profile
        </button>
      </section>

      <hr className="border-gray-200" />

      {/* NAVIGATION */}
      <section className="space-y-2">
        <NavItem label="Settings" icon={<Settings size={18} />} route="/user/app/settings" />
        <NavItem label="FAQs" icon={<HelpCircle size={18} />} route="/user/app/faqs" />
        <NavItem label="4ON4 Careers" icon={<Briefcase size={18} />} route="/user/app/careers" />
        <NavItem label="Cloud & AI" icon={<Cpu size={18} />} route="/user/app/cloud-ai" />
      </section>

      {/* HELP & SUPPORT */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700">Help & Support</h3>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Phone size={16} /> +254 XXX XXX XXX
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Mail size={16} /> support@4on4.site
        </div>
      </section>

      {/* MAIN HQ */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700">MAIN HQ</h3>

        <a
          href="https://maps.app.goo.gl/pUWvLQ7hrbEBtFMM7"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/maps/main-hq.jpg"
            className="w-full h-40 object-cover rounded-lg"
            alt="Main HQ"
          />
        </a>

        <div className="flex gap-2 text-sm text-gray-600">
          <MapPin size={16} />
          <p>
            Ngara, Musindi Lane <br />
            Nairobi <br />
            OBSIDIAN TOWERS
          </p>
        </div>
      </section>

      {/* LOGOUT */}
      <button onClick={logout} className="text-red-600 text-sm font-medium">
        Log out
      </button>

      {/* QUICK CHAT */}
      <button className="fixed bottom-20 right-4 w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-lg" aria-label="Open chat">
        <MessageCircle />
      </button>
    </div>
  );
}

function NavItem({
  label,
  icon,
  route,
}: {
  label: string;
  icon: React.ReactNode;
  route: string;
}) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push(route)}
      className="w-full flex justify-between items-center py-3 text-sm"
    >
      <div className="flex items-center gap-3">
        {icon}
        <span>{label}</span>
      </div>
      <ChevronRight size={16} className="text-gray-400" />
    </button>
  );
}