"use client"

import { useState } from "react"
import { Edit2, Trash2, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Car {
  id: number
  numberPlate: string
  model: string
  color: string
  seats: number
}

export function CarWidget({ car, onDelete }: { car: Car; onDelete: (id: number) => void }) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (isExpanded) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* Close Button */}
          <div className="sticky top-0 flex justify-between items-center p-6 border-b border-black/10 bg-white">
            <h3 className="text-xl font-bold text-black">{car.model}</h3>
            <button onClick={() => setIsExpanded(false)} className="text-black/60 hover:text-black transition-colors">
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Vehicle Details */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-black/10 p-4 rounded-lg">
                  <p className="text-xs text-black/60 mb-1">Number Plate</p>
                  <p className="font-semibold text-black">{car.numberPlate}</p>
                </div>
                <div className="border border-black/10 p-4 rounded-lg">
                  <p className="text-xs text-black/60 mb-1">Color</p>
                  <p className="font-semibold text-black">{car.color}</p>
                </div>
                <div className="border border-black/10 p-4 rounded-lg">
                  <p className="text-xs text-black/60 mb-1">Model</p>
                  <p className="font-semibold text-black">{car.model}</p>
                </div>
                <div className="border border-black/10 p-4 rounded-lg">
                  <p className="text-xs text-black/60 mb-1">Seats</p>
                  <p className="font-semibold text-black">{car.seats}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-black/10">
              <Button className="flex-1 bg-black text-white hover:bg-black/90 gap-2">
                <Edit2 size={18} />
                Edit
              </Button>
              <Button
                onClick={() => {
                  onDelete(car.id)
                  setIsExpanded(false)
                }}
                variant="outline"
                className="flex-1 border-red-500 text-red-600 hover:bg-red-50 bg-transparent"
              >
                <Trash2 size={18} />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => setIsExpanded(true)}
      className="bg-white border border-black/10 rounded-lg overflow-hidden hover:border-black/30 transition-all group"
    >
      <div className="relative h-40 sm:h-48 bg-black/5 overflow-hidden">
        {/* Placeholder for vehicle image */}
        <div className="w-full h-full flex items-center justify-center text-black/20">Vehicle Image</div>
      </div>
      <div className="p-4 space-y-3">
        <div>
          <p className="text-xs text-black/60 mb-1">Number Plate</p>
          <p className="font-bold text-black text-lg">{car.numberPlate}</p>
        </div>
        <div className="flex items-start justify-between">
          <div className="text-left flex-1">
            <p className="text-sm text-black/80">{car.model}</p>
            <p className="text-xs text-black/60">{car.color}</p>
          </div>
          <ChevronRight size={18} className="text-black/40 mt-1" />
        </div>
      </div>
    </button>
  )
}
