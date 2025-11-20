"use client"

import { useState } from "react"
import { ChevronUp, ChevronDown, FileText, X } from "lucide-react"
import { SafariTrip } from "./types"
import ConfirmDialog from "./confirm-dialog"

export default function SafariCard({
  trip,
  onUpdateClick,
  onAccept,
  onDecline,
}: {
  trip: SafariTrip
  onUpdateClick?: () => void
  onAccept?: () => void
  onDecline?: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [showDeclineConfirm, setShowDeclineConfirm] = useState(false)

  return (
    <div className="rounded-2xl border border-gray-300 bg-white p-4 shadow-md">
      {/* TOP ROW */}
      <div className="flex justify-between items-center">
        {/* TYPE TAG */}
        <span
          className={`px-2 py-0.5 text-xs rounded-full border ${
            trip.source === "public"
              ? "bg-red-50 border-red-400 text-red-700"
              : "bg-gray-100 border-gray-400 text-gray-700"
          }`}
        >
          {trip.source === "public" ? "4ON4" : "SELF"}
        </span>

        <button onClick={() => setExpanded(!expanded)}>
          {expanded ? <ChevronUp /> : <ChevronDown />}
        </button>
      </div>

      {/* IF NOT EXPANDED → show summarized card */}
      {!expanded && (
        <div className="mt-3">
          <p className="font-semibold text-black text-sm">
            {trip.startLabel} – {trip.endLabel}
          </p>
          {trip.name && (
            <p className="text-xs text-gray-700 mt-1">{trip.name}</p>
          )}
        </div>
      )}

      {/* EXPANDED VIEW */}
      {expanded && (
        <div className="mt-4">
          {/* DATE */}
          <p className="font-bold text-black text-base text-center">
            {trip.startLabel} – {trip.endLabel}
          </p>

          {/* NAME */}
          {trip.name && (
            <p className="text-sm text-center mt-2 font-medium">
              {trip.name}
            </p>
          )}

          {/* DESTINATIONS */}
          {trip.destinations?.length > 0 && (
            <div className="mt-3 space-y-1">
              {trip.destinations.map((d, i) => (
                <p key={i} className="text-sm text-gray-700 text-center">
                  {d}
                </p>
              ))}
            </div>
          )}

          {/* OPTIONAL NOTES */}
          {trip.notes && (
            <p className="text-xs text-gray-600 mt-3 text-center italic">
              {trip.notes}
            </p>
          )}

          {/* DOCUMENTS (3 per row) */}
          {trip.documents?.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-2 place-items-center">
              {trip.documents.map((doc) => (
                <a
                  key={doc.id}
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-xl border border-gray-300 bg-gray-50 text-[10px] flex flex-col items-center w-full"
                >
                  <FileText size={14} className="mb-1" />
                  DOC
                </a>
              ))}
            </div>
          )}

          {/* BUTTONS */}
          <div className="mt-5 flex flex-col gap-3 w-full">

            {/* ACCEPT BUTTON (only for pending/public) */}
            {trip.status === "pending" && trip.source === "public" && onAccept && (
              <button
                onClick={onAccept}
                className="w-full py-2 bg-green-600 text-white rounded-xl text-sm"
              >
                ACCEPT
              </button>
            )}

            {/* UPDATE BUTTON */}
            {onUpdateClick && (
              <button
                onClick={onUpdateClick}
                className="w-full py-2 border border-gray-500 rounded-xl text-sm"
              >
                UPDATE
              </button>
            )}

            {/* DECLINE BUTTON → CONFIRMATION POPUP */}
            {onDecline && (
              <>
                <button
                  onClick={() => setShowDeclineConfirm(true)}
                  className="w-full py-2 bg-red-600 text-white rounded-xl text-sm"
                >
                  DECLINE
                </button>

                {showDeclineConfirm && (
                  <ConfirmDialog
                    message="Confirm declining this safari?"
                    onCancel={() => setShowDeclineConfirm(false)}
                    onConfirm={() => {
                      setShowDeclineConfirm(false)
                      onDecline()
                    }}
                  />
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
