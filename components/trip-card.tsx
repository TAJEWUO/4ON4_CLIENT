"use client"

import { Calendar, MapPin, Edit2, Trash2, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Trip {
  id: number
  name: string
  startDate: string
  endDate: string
  locations: string[]
  isSelf: boolean
}

export function TripCard({
  trip,
  onEdit,
  onDelete,
}: {
  trip: Trip
  onEdit: (trip: Trip) => void
  onDelete: (id: number) => void
}) {
  return (
    <div className="border border-black/10 rounded-lg p-5 sm:p-6 hover:border-black/30 transition-colors">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-black text-lg">{trip.name}</h3>
          {trip.isSelf && (
            <span className="px-2 py-1 bg-black/10 text-black text-xs font-semibold rounded">[self]</span>
          )}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-black/70">
          <Calendar size={16} className="text-black/60 flex-shrink-0" />
          <span>
            {trip.startDate} to {trip.endDate}
          </span>
        </div>
        <div className="space-y-1">
          {trip.locations.map((location, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-black/70">
              <MapPin size={16} className="text-black/60 flex-shrink-0" />
              <span>{location}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4 border-t border-black/10">
        <Button onClick={() => onEdit(trip)} size="sm" className="flex-1 bg-black text-white hover:bg-black/90 gap-1">
          <Edit2 size={16} />
          <span className="hidden sm:inline">Edit</span>
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1 border-black text-black hover:bg-black/5 bg-transparent gap-1"
        >
          <Share2 size={16} />
          <span className="hidden sm:inline">Share</span>
        </Button>
        <Button
          onClick={() => onDelete(trip.id)}
          size="sm"
          variant="outline"
          className="flex-1 border-red-500 text-red-600 hover:bg-red-50 bg-transparent gap-1"
        >
          <Trash2 size={16} />
          <span className="hidden sm:inline">Delete</span>
        </Button>
      </div>
    </div>
  )
}
