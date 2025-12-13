"use client"

import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface ReviewData {
  [key: string]: any
}

interface ReviewModalProps {
  isOpen: boolean
  data: ReviewData
  title: string
  onConfirm: () => void
  onEdit: () => void
  onClose: () => void
}

export function ReviewModal({ isOpen, data, title, onConfirm, onEdit, onClose }: ReviewModalProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const entries = Object.entries(data).filter(([_, value]) => value !== null && value !== "" && value !== false)
  const itemsPerPage = 4
  const totalPages = Math.ceil(entries.length / itemsPerPage)
  const currentEntries = entries.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/10 p-6">
          <h2 className="text-2xl font-bold text-black">Review {title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-lg transition-colors" aria-label="Close">
            <X size={24} className="text-black" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {currentEntries.map(([key, value]) => (
              <div key={key} className="border border-black/10 rounded-lg p-4">
                <p className="text-xs font-semibold text-black/60 uppercase mb-1">{key.replace(/([A-Z])/g, " $1")}</p>
                <p className="text-sm text-black font-medium break-words">
                  {Array.isArray(value) ? value.join(", ") : String(value)}
                </p>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-black/10">
              <button
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className="p-2 hover:bg-black/5 disabled:opacity-50 rounded-lg transition-colors"
              >
                <ChevronLeft size={20} className="text-black" />
              </button>
              <span className="text-sm text-black/60">
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage === totalPages - 1}
                className="p-2 hover:bg-black/5 disabled:opacity-50 rounded-lg transition-colors"
              >
                <ChevronRight size={20} className="text-black" />
              </button>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="border-t border-black/10 p-6 flex gap-3">
          <Button
            onClick={onEdit}
            variant="outline"
            className="flex-1 border-black text-black hover:bg-black/5 bg-transparent"
          >
            Edit
          </Button>
          <Button onClick={onConfirm} className="flex-1 bg-black text-white hover:bg-black/90">
            Confirm & Save
          </Button>
        </div>
      </div>
    </div>
  )
}
