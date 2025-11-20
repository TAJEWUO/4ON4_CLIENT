"use client"

import { useState } from "react"
import { X, ChevronLeft, ChevronRight, Users, PanelsTopLeft } from "lucide-react"

export default function FullVehicleModal({
  open,
  onClose,
  vehicle,
  onEdit,
}: {
  open: boolean
  onClose: () => void
  onEdit?: () => void
  vehicle?: {
    plate: string
    model?: string
    capacity: number
    windowType: "glass" | "canvas"
    images: string[]
  }
}) {
  if (!open || !vehicle) return null

  const { plate, model, capacity, windowType, images } = vehicle
  const [index, setIndex] = useState(0)

  const next = () => setIndex((prev) => (prev + 1) % images.length)
  const prev = () => setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      
      <div className="bg-white w-full max-w-lg rounded-lg shadow-xl overflow-hidden relative">

        {/* HEADER */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-300">
          <h2 className="text-xl font-semibold text-black">Vehicle Profile</h2>

          <button
            onClick={onClose}
            className="text-black hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* IMAGE SECTION */}
        <div className="relative w-full h-64 bg-gray-200">
          
          {/* Number plate */}
          <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded-md font-bold text-black shadow">
            {plate}
          </div>

          {/* Image */}
          <img
            src={images[index]}
            className="w-full h-full object-cover"
            alt={plate}
          />

          {/* Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1 rounded-full"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={next}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1 rounded-full"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Image dots */}
          {images.length > 1 && (
            <div className="absolute bottom-3 flex justify-center w-full gap-1">
              {images.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 w-2 rounded-full ${
                    i === index ? "bg-black" : "bg-gray-400"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* DETAILS SECTION */}
        <div className="p-5">

          {/* Model */}
          <p className="text-lg font-semibold text-black mb-3">
            {model || "Vehicle Model Unknown"}
          </p>

          {/* Details */}
          <div className="flex flex-col gap-3 text-black text-sm">

            {/* Capacity */}
            <div className="flex items-center gap-2">
              <Users size={18} />
              <span>{capacity} seats</span>
            </div>

            {/* Window Type */}
            <div className="flex items-center gap-2">
              <PanelsTopLeft size={18} />
              <span>{windowType === "glass" ? "Glass Windows" : "Canvas Windows"}</span>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-5 py-4 border-t border-gray-300 flex justify-between">

          {/* Edit Button */}
          <button
            onClick={onEdit}
            className="px-4 py-2 text-sm bg-black text-white rounded-md hover:bg-gray-900"
          >
            Edit Vehicle
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border border-gray-400 rounded-md text-black hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
