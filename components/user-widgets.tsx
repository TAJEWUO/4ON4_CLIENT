"use client"

import { useState } from "react"

export default function UserWidgets({ safaris, setSafaris }: any) {
  const [showCalendarForm, setShowCalendarForm] = useState(false)
  const [tripName, setTripName] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const handleAddTrip = () => {
    if (tripName && startDate && endDate) {
      setSafaris([
        ...safaris,
        {
          id: Date.now(),
          name: tripName,
          startDate,
          endDate,
          status: "scheduled",
        },
      ])
      setTripName("")
      setStartDate("")
      setEndDate("")
      setShowCalendarForm(false)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white rounded-xl p-6 border-2 border-black">
        <h3 className="font-semibold text-black mb-4">My Calendar</h3>
        <button
          onClick={() => setShowCalendarForm(!showCalendarForm)}
          className="w-full px-3 py-2 bg-black hover:bg-gray-800 text-white rounded text-sm font-semibold transition-all"
        >
          Add Trip
        </button>

        {showCalendarForm && (
          <div className="mt-4 space-y-3">
            <input
              type="text"
              placeholder="Trip Name"
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
              className="w-full px-2 py-1 bg-white border border-gray-300 rounded text-black text-sm placeholder-gray-500 focus:outline-none focus:border-black"
            />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-2 py-1 bg-white border border-gray-300 rounded text-black text-sm focus:outline-none focus:border-black"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-2 py-1 bg-white border border-gray-300 rounded text-black text-sm focus:outline-none focus:border-black"
            />
            <button
              onClick={handleAddTrip}
              className="w-full py-1 bg-black hover:bg-gray-800 text-white rounded text-sm font-semibold transition-all"
            >
              Save Trip
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl p-6 border-2 border-black">
        <h3 className="font-semibold text-black mb-4">Widget 2</h3>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="inline-block animate-spin mb-2">
              <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full"></div>
            </div>
            <p className="text-gray-600 text-sm">Loading</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border-2 border-black">
        <h3 className="font-semibold text-black mb-4">Widget 3</h3>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="inline-block animate-spin mb-2">
              <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full"></div>
            </div>
            <p className="text-gray-600 text-sm">Loading</p>
          </div>
        </div>
      </div>
    </div>
  )
}
