"use client"

import { useState } from "react"
import { Plus, Edit2, Zap } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CarWidget } from "@/components/car-widget"
import { TripCard } from "@/components/trip-card"
import { NewsCard } from "@/components/news-card"

interface Vehicle {
  id: number
  numberPlate: string
  model: string
  color: string
  seats: number
}

interface Trip {
  id: number
  name: string
  startDate: string
  endDate: string
  locations: string[]
  isSelf: boolean
}

const mockNews = [
  {
    id: 1,
    title: "Safari Tourism Booms in East Africa",
    date: "2 days ago",
    excerpt: "Record number of tourists visit national parks this season with increased wildlife sightings...",
    image: "/placeholder.jpg",
    likes: 342,
    category: "Tourism",
    bgColor: "bg-orange-500",
    textColor: "text-white",
  },
  {
    id: 2,
    title: "New Routes Open for Adventure Seekers",
    date: "3 days ago",
    excerpt: "Eco-tourism routes expanded to promote sustainable travel and local communities...",
    image: "/placeholder.jpg",
    likes: 285,
    category: "Routes",
    bgColor: "bg-green-500",
    textColor: "text-white",
  },
  {
    id: 3,
    title: "Vehicle Safety Standards Updated",
    date: "5 days ago",
    excerpt: "New regulations ensure better passenger safety across all tourism vehicles...",
    image: "/placeholder.jpg",
    likes: 198,
    category: "Safety",
    bgColor: "bg-blue-500",
    textColor: "text-white",
  },
  {
    id: 4,
    title: "Travel Trends for 2025",
    date: "1 week ago",
    excerpt: "Industry experts predict shift towards personalized and immersive travel experiences...",
    image: "/placeholder.jpg",
    likes: 427,
    category: "Trends",
    bgColor: "bg-purple-500",
    textColor: "text-white",
  },
  {
    id: 5,
    title: "Sustainable Tourism Certification Program",
    date: "1 week ago",
    excerpt: "New certification helps travelers identify eco-friendly tourism operators...",
    image: "/placeholder.jpg",
    likes: 156,
    category: "Sustainability",
    bgColor: "bg-emerald-500",
    textColor: "text-white",
  },
]

export function Dashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [trips, setTrips] = useState<Trip[]>([])
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null)
  const [showTripForm, setShowTripForm] = useState(false)
  const [tripFormData, setTripFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    locationInput: "",
    locations: [] as string[],
  })

  const handleDeleteVehicle = (id: number) => {
    setVehicles(vehicles.filter((v) => v.id !== id))
  }

  const handleSubmitTrip = () => {
    if (!tripFormData.name || !tripFormData.startDate || !tripFormData.endDate || tripFormData.locations.length === 0) {
      alert("Please fill all required fields (name, dates, at least one location)")
      return
    }

    if (editingTrip) {
      setTrips(
        trips.map((t) =>
          t.id === editingTrip.id
            ? {
                ...t,
                name: tripFormData.name,
                startDate: tripFormData.startDate,
                endDate: tripFormData.endDate,
                locations: tripFormData.locations,
              }
            : t,
        ),
      )
    } else {
      setTrips([
        ...trips,
        {
          id: Date.now(),
          name: tripFormData.name,
          startDate: tripFormData.startDate,
          endDate: tripFormData.endDate,
          locations: tripFormData.locations,
          isSelf: true,
        },
      ])
    }

    resetTripForm()
  }

  const handleAddLocation = () => {
    if (tripFormData.locationInput.trim()) {
      setTripFormData((prev) => ({
        ...prev,
        locations: [...prev.locations, prev.locationInput.trim()],
        locationInput: "",
      }))
    }
  }

  const handleRemoveLocation = (index: number) => {
    setTripFormData((prev) => ({
      ...prev,
      locations: prev.locations.filter((_, i) => i !== index),
    }))
  }

  const handleDeleteTrip = (id: number) => {
    setTrips(trips.filter((t) => t.id !== id))
  }

  const handleEditTrip = (trip: Trip) => {
    setEditingTrip(trip)
    setTripFormData({
      name: trip.name,
      startDate: trip.startDate,
      endDate: trip.endDate,
      locationInput: "",
      locations: trip.locations,
    })
    setShowTripForm(true)
  }

  const resetTripForm = () => {
    setShowTripForm(false)
    setEditingTrip(null)
    setTripFormData({
      name: "",
      startDate: "",
      endDate: "",
      locationInput: "",
      locations: [],
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* My Vehicles Section */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-black">My Vehicles</h2>
          </div>

          {vehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {vehicles.map((vehicle) => (
                <CarWidget key={vehicle.id} car={vehicle} onDelete={handleDeleteVehicle} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-black/10 rounded-lg bg-black/2">
              <p className="text-black/60 mb-4">No vehicles added yet</p>
              <Link href="/vehicle-profile">
                <Button className="bg-black text-white hover:bg-black/90">Add Your First Vehicle</Button>
              </Link>
            </div>
          )}
        </section>

        {/* Premium Button */}
        <Link href="/coming-soon">
          <Button className="w-full gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold h-12">
            <Zap size={20} />
            Upgrade to Premium 
          </Button>
        </Link>

        {/* Edit Profile Button */}
        <div className="flex gap-3 flex-col sm:flex-row">
          <Link href="/user-profile" className="flex-1">
            
          </Link>
        </div>

        {/* Upcoming Trips Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-black">Upcoming Trips</h2>
            <Button onClick={() => setShowTripForm(true)} className="gap-2 bg-black text-white hover:bg-black/90">
              <Plus size={18} />
              <span className="hidden sm:inline">Add Trip</span>
            </Button>
          </div>

          {showTripForm && (
            <div className="border border-black/10 rounded-lg p-6 bg-white mb-6 space-y-6">
              <div className="flex justify-between items-center border-b border-black/10 pb-4">
                <h3 className="text-lg font-bold text-black">{editingTrip ? "Edit Trip" : "Add New Trip"}</h3>
                <button onClick={resetTripForm} className="text-black/60 hover:text-black text-2xl leading-none">
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Trip Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={tripFormData.name}
                    onChange={(e) => setTripFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Masai Mara Adventure"
                    className="w-full px-4 py-2 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 text-black"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      Start Date <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="date"
                      value={tripFormData.startDate}
                      onChange={(e) => setTripFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                      className="w-full px-4 py-2 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      End Date <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="date"
                      value={tripFormData.endDate}
                      onChange={(e) => setTripFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                      className="w-full px-4 py-2 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 text-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Locations <span className="text-red-600">*</span>
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={tripFormData.locationInput}
                      onChange={(e) => setTripFormData((prev) => ({ ...prev, locationInput: e.target.value }))}
                      placeholder="e.g., Masai Mara National Reserve"
                      className="flex-1 px-4 py-2 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 text-black"
                    />
                    <Button onClick={handleAddLocation} className="bg-black text-white hover:bg-black/90">
                      Add
                    </Button>
                  </div>

                  {tripFormData.locations.length > 0 && (
                    <div className="space-y-2">
                      {tripFormData.locations.map((location, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between px-3 py-2 bg-black/5 border border-black/10 rounded-lg"
                        >
                          <span className="text-sm text-black">{location}</span>
                          <button
                            onClick={() => handleRemoveLocation(index)}
                            className="text-red-600 hover:text-red-700 text-lg leading-none"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 border-t border-black/10 pt-4">
                <Button
                  onClick={resetTripForm}
                  variant="outline"
                  className="flex-1 border-black text-black hover:bg-black/5 bg-transparent"
                >
                  Cancel
                </Button>
                <Button onClick={handleSubmitTrip} className="flex-1 bg-black text-white hover:bg-black/90">
                  {editingTrip ? "Update Trip" : "Create Trip"}
                </Button>
              </div>
            </div>
          )}

          {trips.length > 0 ? (
            <div className="space-y-4">
              {trips.map((trip) => (
                <TripCard key={trip.id} trip={trip} onEdit={handleEditTrip} onDelete={handleDeleteTrip} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border border-black/10 rounded-lg bg-black/2">
              <p className="text-black/60">No trips added yet</p>
            </div>
          )}
        </section>

        {/* Latest News Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-black">Latest News</h2>
            <Link href="/all-news" className="text-black/60 hover:text-black text-sm font-semibold">
              Show all →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {mockNews.map((news) => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Dashboard
