"use client";

import { useRouter } from "next/navigation";
import { useProfile } from "@/hooks/useProfile";
import { API_BASE } from "@/lib/http";
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
} from "lucide-react";

export default function AboutPage() {
  const router = useRouter();
  const { profile, loading, error, refresh } = useProfile();

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    router.replace("/user/auth/login");
  };

  const avatarUrl = (() => {
    if (!profile) return null;
    // backend may return profilePicture as { path: 'uploads/users/...' } or as string
    const pic = profile.profilePicture ?? profile.profilePicture?.path ?? profile.avatarUrl ?? null;
    if (!pic) return null;
    if (typeof pic === "string") {
      if (pic.startsWith("http://") || pic.startsWith("https://")) return pic;
      // relative path from backend
      return `${API_BASE}/${(pic as string).replace(/^\/+/, "")}`;
    }
    // object with path
    if (pic?.path) return `${API_BASE}/${(pic.path as string).replace(/^\/+/, "")}`;
    return null;
  })();

  return (
    <div className="px-4 pt-6 pb-28 space-y-10">
      {/* PROFILE PREVIEW */}
      <section className="flex flex-col items-center space-y-3">
        <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User />
            </div>
          )}
        </div>

        <h2 className="font-semibold text-lg">
          {loading ? "Loading…" : profile ? ((`${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim() || profile.phoneNumber) ?? profile.phone) || "" : "No profile"}
        </h2>

        <button
          onClick={() => router.push("/user/app/profile")}
          className="text-sm text-blue-600"
        >
          {profile ? "View Full Profile" : "Add Profile"}
        </button>

        {profile && (
          <p className="text-xs text-gray-500">
            {profile.level ? profile.level : ""}
          </p>
        )}
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