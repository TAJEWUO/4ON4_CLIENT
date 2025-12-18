"use client";

import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";

const routes = [
  { path: "/user/app/about", index: 0 },
  { path: "/user/app", index: 1 },
  { path: "/user/app/vehicles", index: 2 },
];

export default function AppSwipeContainer({
  about,
  home,
  vehicles,
}: {
  about: ReactNode;
  home: ReactNode;
  vehicles: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const activeIndex =
    routes.find((r) => r.path === pathname)?.index ?? 1;

  return (
    <motion.div
      className="flex h-full w-[300vw]"
      animate={{ x: `-${activeIndex * 100}vw` }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.15}
      onDragEnd={(_, info) => {
        if (info.offset.x < -80 && activeIndex < 2) {
          router.push(routes[activeIndex + 1].path);
        }
        if (info.offset.x > 80 && activeIndex > 0) {
          router.push(routes[activeIndex - 1].path);
        }
      }}
    >
      <section className="w-screen h-full overflow-y-auto">
        {about}
      </section>
      <section className="w-screen h-full overflow-y-auto">
        {home}
      </section>
      <section className="w-screen h-full overflow-y-auto">
        {vehicles}
      </section>
    </motion.div>
  );
}
