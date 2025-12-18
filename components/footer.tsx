"use client";

import { usePathname, useRouter } from "next/navigation";
import { Car, Home, Info } from "lucide-react";

const items = [
  { label: "About", href: "/user/app/about", icon: Info },
  { label: "Home", href: "/user/app", icon: Home },
  { label: "Vehicles", href: "/user/app/vehicles", icon: Car },
];

export default function Footer() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t z-50">
      <nav className="flex justify-around h-16 items-center">
        {items.map(({ label, href, icon: Icon }) => {
          const active =
            href === "/user/app"
              ? pathname === "/user/app"
              : pathname.startsWith(href);

          return (
            <button
              key={label}
              onClick={() => router.push(href)}
              className="relative flex flex-col items-center"
            >
              {active && (
                <span className="absolute -top-3 w-16 h-16 rounded-full
                  bg-gray-100 shadow-md scale-110 transition-all" />
              )}

              <Icon
                size={active ? 28 : 20}
                className={`relative z-10 transition-all ${
                  active ? "text-black" : "text-gray-400"
                }`}
              />

              <span
                className={`relative z-10 text-[11px] transition-all ${
                  active ? "font-semibold text-black" : "text-gray-400"
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </nav>
    </footer>
  );
}
