// components/footer.tsx
"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t p-3 flex justify-around text-sm">
      <Link href="/user/app">Home</Link>
      <Link href="/user/app/vehicles">Vehicles</Link>
      <Link href="/user/app/about">About</Link>
    </footer>
  );
}
