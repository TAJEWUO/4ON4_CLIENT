"use client";

export default function Header() {
  return (
    <header className="h-14 px-4 flex items-center justify-between
      bg-black/80 backdrop-blur-md shadow-sm z-50">
      
      <span className="text-white font-bold text-lg">4ON4</span>

      <button className="w-9 h-9 rounded-full bg-white/90 shadow-inner" />
    </header>
  );
}
