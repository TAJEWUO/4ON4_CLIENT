"use client"

import { ChevronRight } from "lucide-react"

export default function DriverCard({
  name,
  image,
  onClick,
}: {
  name: string
  image?: string
  onClick: () => void
}) {
  return (
    <div
      onClick={onClick}
      className="w-full bg-white border border-gray-300 rounded-lg shadow p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition"
    >
      {/* PROFILE IMAGE */}
      <div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden">
        {image ? (
          <img src={image} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
            No Img
          </div>
        )}
      </div>

      {/* NAME */}
      <div className="flex-1">
        <p className="text-black font-semibold text-sm">{name}</p>
        <p className="text-gray-500 text-xs">Driver Profile</p>
      </div>

      {/* ARROW */}
      <ChevronRight className="text-black" size={20} />
    </div>
  )
}
