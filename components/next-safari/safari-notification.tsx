"use client"

import { useState } from "react"
import SafariCard from "./safari"
import { SafariTrip, SafariStatus } from "./types"
import ConfirmDialog from "./confirm-dialog"
import { X } from "lucide-react"

type Props = {
  open: boolean
  trips: SafariTrip[]
  onDecisions: (decisions: { id: string; status: SafariStatus }[]) => void
  onDone: () => void
}

export default function SafariNotificationPanel({
  open,
  trips,
  onDecisions,
  onDone,
}: Props) {
  const [choices, setChoices] = useState<Record<string, SafariStatus>>({})
  const [confirmClose, setConfirmClose] = useState(false)

  if (!open || trips.length === 0) return null

  const setChoice = (id: string, status: SafariStatus) => {
    setChoices((prev) => ({ ...prev, [id]: status }))
  }

  const handleFinish = () => {
    // default anything untouched to “unattended”
    const all = trips.map((t) => ({
      id: t.id,
      status: choices[t.id] || "unattended" as SafariStatus,
    }))
    onDecisions(all)
    onDone()
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg max-h-[90vh] rounded-2xl shadow-xl flex flex-col">
        {/* header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div>
            <p className="text-sm font-semibold">New Public Bookings</p>
            <p className="text-[11px] text-gray-500">
              Review, accept, draft or decline each safari.
            </p>
          </div>
          <button onClick={() => setConfirmClose(true)}>
            <X size={18} />
          </button>
        </div>

        {/* list of cards */}
        <div className="px-4 py-3 overflow-y-auto space-y-3 text-sm">
          {trips.map((trip) => (
            <div key={trip.id} className="space-y-2">
              <SafariCard
                trip={trip}
                compactActions
                onUpdateClick={undefined}
                onAccept={() => setChoice(trip.id, "accepted")}
                onDecline={() => setChoice(trip.id, "declined")}
              />

              {/* choices row */}
              <div className="flex gap-2 text-[11px]">
                <button
                  onClick={() => setChoice(trip.id, "accepted")}
                  className={`px-2 py-1 rounded-full border text-xs ${
                    choices[trip.id] === "accepted"
                      ? "bg-green-600 text-white border-green-600"
                      : "border-green-600 text-green-700"
                  }`}
                >
                  Accept
                </button>
                <button
                  onClick={() => setChoice(trip.id, "unattended")}
                  className={`px-2 py-1 rounded-full border text-xs ${
                    choices[trip.id] === "unattended"
                      ? "bg-gray-900 text-white border-gray-900"
                      : "border-gray-500 text-gray-700"
                  }`}
                >
                  Draft
                </button>
                <button
                  onClick={() => setChoice(trip.id, "declined")}
                  className={`px-2 py-1 rounded-full border text-xs ${
                    choices[trip.id] === "declined"
                      ? "bg-red-600 text-white border-red-600"
                      : "border-red-600 text-red-700"
                  }`}
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* footer */}
        <div className="px-4 py-3 border-t border-gray-200 flex justify-end">
          <button
            onClick={handleFinish}
            className="px-4 py-2 rounded-xl bg-black text-white text-sm"
          >
            Done
          </button>
        </div>
      </div>

      {confirmClose && (
        <ConfirmDialog
          message="Close and send unhandled safaris to draft?"
          onCancel={() => setConfirmClose(false)}
          onConfirm={() => {
            setConfirmClose(false)
            handleFinish()
          }}
        />
      )}
    </div>
  )
}
