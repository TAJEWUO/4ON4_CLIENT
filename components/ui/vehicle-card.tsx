"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Users, PanelsTopLeft } from "lucide-react"

export default function VehicleCard({
  plate,
  model,
  capacity,
  windowType,
  images,
  onClick,
}: {
  plate: string
  model?: string
  capacity: number
  windowType: "glass" | "canvas"
  images: string[]
  onClick?: () => void
}) {
  const [index, setIndex] = useState(0)

  const next = () => {
    setIndex((prev) => (prev + 1) % images.length)
  }

  const prev = () => {
    setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden cursor-pointer transition hover:shadow-xl"
    >
      {/* IMAGE AREA */}
      <div className="relative w-full h-56 bg-gray-100">

        {/* Number plate badge */}
        <div className="absolute top-2 left-2 bg-white px-3 py-1 rounded-md font-bold text-black shadow">
          {plate}
        </div>

        <img
          src={images[index]}
          className="w-full h-full object-cover"
          alt={plate}
        />

        {/* Slider arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                prev()
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1 rounded-full backdrop-blur"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                next()
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1 rounded-full backdrop-blur"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        {/* Dots */}
        <div className="absolute bottom-2 w-full flex justify-center gap-1">
          {images.map((_, i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full ${
                i === index ? "bg-black" : "bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px] bg-gray-300" />

      {/* Details */}
      <div className="p-4">
        <p className="text-lg font-semibold text-black mb-2">
          {model || "Vehicle"}
        </p>

        <div className="flex items-center gap-5 text-sm text-black">
          {/* Capacity */}
          <div className="flex items-center gap-1">
            <Users size={16} />
            <span>{capacity} seats</span>
          </div>

          {/* Window Type */}
          <div className="flex items-center gap-1">
            <PanelsTopLeft size={16} />
            <span>{windowType}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
