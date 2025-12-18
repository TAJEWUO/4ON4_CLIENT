"use client";

import { useRouter } from "next/navigation";
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

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    router.replace("/user/auth/login");
  };

  return (
    <div className="px-4 pt-6 pb-28 space-y-10">
      {/* PROFILE PREVIEW */}
      <section className="flex flex-col items-center space-y-3">
        <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center">
          <User />
        </div>
        <h2 className="font-semibold text-lg"></h2>
        <button
          onClick={() => router.push("/user/app/profile")}
          className="text-sm text-blue-600"
        >
          Add Profile
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
      <button className="fixed bottom-20 right-4 w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-lg">
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
