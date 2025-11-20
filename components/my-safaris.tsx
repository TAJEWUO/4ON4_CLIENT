"use client"

import { useEffect, useState } from "react"

// SAFARI MODULE FILES
import SafariCard from "@/components/next-safari/safari"
import AddSafariModal from "@/components/next-safari/add-safari"
import UpdateSafariModal from "@/components/next-safari/update-safari"
import SafariNotificationPanel from "@/components/next-safari/safari-notification"

import { SafariTrip, SafariStatus } from "@/components/next-safari/types"



export default function MySafaris({
  safaris,
  setSafaris,
  isLoggedIn,
  onLoginClick,
}: {
  safaris: SafariTrip[]
  setSafaris: (s: SafariTrip[]) => void
  isLoggedIn: boolean
  onLoginClick: () => void
}) {
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState<SafariTrip | null>(null)

  // notification panel
  const [showNotifications, setShowNotifications] = useState(false)

  // check if notifications were shown this login
  useEffect(() => {
    if (!isLoggedIn) return

    const seen = localStorage.getItem("fouron4_notifications_seen")
    const publicPending = safaris.filter(
      (s) => s.source === "public" && s.status === "pending"
    )

    if (!seen && publicPending.length > 0) {
      setShowNotifications(true)
    }
  }, [isLoggedIn])

  // sort safaris by start date (nearest first)
  const sortedSafaris = [...(safaris || [])].sort((a, b) => {
    const aDate = a.startDate ? new Date(a.startDate).getTime() : 0
    const bDate = b.startDate ? new Date(b.startDate).getTime() : 0
    return aDate - bDate
  })

  const accepted = sortedSafaris.filter((s) => s.status === "accepted")
  const others = sortedSafaris.filter((s) => s.status !== "accepted")

  // handle public booking decisions
  const handleNotificationDecisions = (
    decisions: { id: string; status: SafariStatus }[]
  ) => {
    setSafaris(
      safaris.map((s) => {
        const found = decisions.find((d) => d.id === s.id)
        return found ? { ...s, status: found.status } : s
      })
    )

    // mark notification as seen for this login
    localStorage.setItem("fouron4_notifications_seen", "true")
  }

  // handle adding safari
  const handleAddSafari = (trip: SafariTrip) => {
    setSafaris([...(safaris || []), trip])
  }

  // handle update safari
  const handleUpdateSafari = (updated: SafariTrip) => {
    setSafaris(safaris.map((s) => (s.id === updated.id ? updated : s)))
  }

  if (!isLoggedIn) {
    return (
      <div className="text-center py-8 border border-gray-200 rounded-xl mt-4">
        <p className="text-gray-600 mb-3">Log in to view your safaris.</p>
        <button
          onClick={onLoginClick}
          className="px-4 py-2 bg-black text-white rounded-xl text-sm"
        >
          Login / Register
        </button>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-black">Next Safaris</h2>
        <button
          onClick={() => setShowAdd(true)}
          className="px-3 py-2 rounded-xl border border-black text-xs font-medium flex items-center gap-1"
        >
          + Add Safari
        </button>
      </div>

      {/* NO SAFARIS */}
      {sortedSafaris.length === 0 && (
        <div className="text-center py-8 border border-gray-200 rounded-xl">
          <p className="text-gray-600 mb-4">No safaris added yet.</p>
          <button
            onClick={() => setShowAdd(true)}
            className="px-4 py-2 bg-black text-white rounded-xl text-sm"
          >
            Add Manually
          </button>
        </div>
      )}

      {/* NEXT SAFARIS */}
      {accepted.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-2">Scheduled Safaris</h3>
          <div className="space-y-4">
            {accepted.map((safari) => (
              <SafariCard
                key={safari.id}
                trip={safari}
                showDeclineLinkRight
                onDecline={() =>
                  setSafaris(
                    safaris.map((s) =>
                      s.id === safari.id ? { ...s, status: "declined" } : s
                    )
                  )
                }
                onUpdateClick={() => setEditing(safari)}
              />
            ))}
          </div>
        </div>
      )}

      {/* OTHER SAFARIS (pending, declined, unattended) */}
      {others.length > 0 && (
        <div>
          {accepted.length > 0 && (
            <h3 className="text-sm font-semibold mb-2">Other Safaris</h3>
          )}
          <div className="space-y-4">
            {others.map((safari) => (
              <SafariCard
                key={safari.id}
                trip={safari}
                onAccept={() =>
                  setSafaris(
                    safaris.map((s) =>
                      s.id === safari.id ? { ...s, status: "accepted" } : s
                    )
                  )
                }
                onDecline={() =>
                  setSafaris(
                    safaris.map((s) =>
                      s.id === safari.id ? { ...s, status: "declined" } : s
                    )
                  )
                }
                onUpdateClick={() => setEditing(safari)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ADD SAFARI MODAL */}
      <AddSafariModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onSave={handleAddSafari}
      />

      {/* UPDATE SAFARI MODAL */}
      {editing && (
        <UpdateSafariModal
          open={true}
          trip={editing}
          onClose={() => setEditing(null)}
          onSave={handleUpdateSafari}
          onDecline={(updated) => {
            setSafaris(
              safaris.map((s) =>
                s.id === updated.id ? { ...updated, status: "declined" } : s
              )
            )
            setEditing(null)
          }}
        />
      )}

      {/* NOTIFICATION PANEL (PUBLIC BOOKINGS) */}
      <SafariNotificationPanel
        open={showNotifications}
        trips={safaris.filter(
          (s) => s.source === "public" && s.status === "pending"
        )}
        onDecisions={handleNotificationDecisions}
        onDone={() => {
          setShowNotifications(false)
          localStorage.setItem("fouron4_notifications_seen", "true")
        }}
      />
    </div>
  )
}
