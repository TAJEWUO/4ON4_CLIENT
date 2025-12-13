"use client"

import type React from "react"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ReviewModal } from "@/components/review-modal"

export function VehicleProfileForm() {
  const [currentPage, setCurrentPage] = useState(1)
  const [showReview, setShowReview] = useState(false)
  const router = useRouter()
  const [formData, setFormData] = useState({
    numberPlate: "",
    seats: "",
    color: "",
    windowType: "",
    tripType: "",
    model: "",
    wifi: false,
    sunroof: false,
    coolBox: false,
    images: [] as File[],
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files].slice(0, 3),
    }))
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const nextPage = () => {
    if (currentPage < 4) setCurrentPage(currentPage + 1)
  }

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }

  const handleSubmit = () => {
    setShowReview(true)
  }

  const handleConfirmSave = () => {
    console.log("Vehicle form submitted:", formData)
    alert("Vehicle profile saved successfully!")
    setShowReview(false)
    router.push("/")
  }

  const handleEdit = () => {
    setShowReview(false)
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-black">Vehicle Profile</h1>
        <button
          onClick={handleBack}
          className="p-2 hover:bg-black/5 rounded-lg transition-colors"
          aria-label="Close vehicle profile form"
        >
          <X size={24} className="text-black" />
        </button>
      </div>
      <p className="text-black/60 mb-8">Add your vehicle information</p>

      {/* Progress Indicator */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3, 4].map((page) => (
          <div
            key={page}
            className={`h-1 flex-1 rounded-full transition-all ${page <= currentPage ? "bg-black" : "bg-black/10"}`}
          />
        ))}
      </div>

      {/* Form Content */}
      <div className="border border-black/10 rounded-lg p-6 sm:p-8 bg-white mb-8">
        {/* Page 1 */}
        {currentPage === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-black mb-6">Vehicle Basics</h2>
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Number Plate <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="numberPlate"
                value={formData.numberPlate}
                onChange={handleInputChange}
                placeholder="KEN 001A"
                className="w-full px-4 py-3 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 text-black uppercase"
              />
            </div>
          </div>
        )}

        {/* Page 2 */}
        {currentPage === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-black mb-6">Vehicle Details</h2>
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Number of Seats <span className="text-red-600">*</span>
              </label>
              <select
                name="seats"
                value={formData.seats}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 text-black"
              >
                <option value="">Select number of seats</option>
                {[4, 5, 6, 7, 8, 9, 10, 12, 14].map((n) => (
                  <option key={n} value={n}>
                    {n} Seats
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Color <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                placeholder="Pearl White"
                className="w-full px-4 py-3 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Window Type <span className="text-red-600">*</span>
              </label>
              <select
                name="windowType"
                value={formData.windowType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 text-black"
              >
                <option value="">Select window type</option>
                <option value="glass">Glass</option>
                <option value="canvas">Canvas</option>
                <option value="both">Both</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Trip Type <span className="text-red-600">*</span>
              </label>
              <select
                name="tripType"
                value={formData.tripType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 text-black"
              >
                <option value="">Select trip type</option>
                <option value="centralized">Centralized</option>
                <option value="by-road">By-road</option>
                <option value="both">Both</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-2">Model</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                placeholder="Toyota Land Cruiser"
                className="w-full px-4 py-3 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 text-black"
              />
            </div>
          </div>
        )}

        {/* Page 3 */}
        {currentPage === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-black mb-6">Additional Features</h2>
            <div className="space-y-4">
              <label className="flex items-center gap-3 p-4 border border-black/10 rounded-lg cursor-pointer hover:bg-black/2 transition-colors">
                <input
                  type="checkbox"
                  name="wifi"
                  checked={formData.wifi}
                  onChange={handleInputChange}
                  className="w-5 h-5 cursor-pointer"
                />
                <span className="font-semibold text-black">WiFi</span>
              </label>
              <label className="flex items-center gap-3 p-4 border border-black/10 rounded-lg cursor-pointer hover:bg-black/2 transition-colors">
                <input
                  type="checkbox"
                  name="sunroof"
                  checked={formData.sunroof}
                  onChange={handleInputChange}
                  className="w-5 h-5 cursor-pointer"
                />
                <span className="font-semibold text-black">Sunroof/Open Roof</span>
              </label>
              <label className="flex items-center gap-3 p-4 border border-black/10 rounded-lg cursor-pointer hover:bg-black/2 transition-colors">
                <input
                  type="checkbox"
                  name="coolBox"
                  checked={formData.coolBox}
                  onChange={handleInputChange}
                  className="w-5 h-5 cursor-pointer"
                />
                <span className="font-semibold text-black">Cool Box</span>
              </label>
            </div>
          </div>
        )}

        {/* Page 4 */}
        {currentPage === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-black mb-6">Vehicle Images</h2>
            <div>
              <label className="block text-sm font-semibold text-black mb-3">
                Upload Vehicle Images (Max 3) <span className="text-red-600">*</span>
              </label>
              <label className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-black/20 rounded-lg cursor-pointer hover:border-black/40 transition-colors bg-black/2">
                <div className="flex flex-col items-center gap-2">
                  <Upload size={24} className="text-black/60" />
                  <span className="text-sm text-black/60">Click to upload or drag and drop</span>
                  <span className="text-xs text-black/40">PNG, JPG, GIF up to 10MB</span>
                </div>
                <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
              {formData.images.length > 0 && (
                <div className="mt-4 space-y-2">
                  {formData.images.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-black/2 border border-black/10 rounded-lg"
                    >
                      <span className="text-sm text-black">{file.name}</span>
                      <button
                        onClick={() => removeImage(index)}
                        className="text-red-600 hover:text-red-700 font-semibold text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3 sm:gap-4">
        <Button
          onClick={prevPage}
          disabled={currentPage === 1}
          variant="outline"
          className="flex-1 border-black text-black hover:bg-black/5 disabled:opacity-50 bg-transparent"
        >
          <ChevronLeft size={18} />
          Previous
        </Button>
        {currentPage < 4 ? (
          <Button onClick={nextPage} className="flex-1 bg-black text-white hover:bg-black/90">
            Next
            <ChevronRight size={18} />
          </Button>
        ) : (
          <Button onClick={handleSubmit} className="flex-1 bg-black text-white hover:bg-black/90">
            Review & Save
          </Button>
        )}
      </div>

      <ReviewModal
        isOpen={showReview}
        data={formData}
        title="Vehicle Profile"
        onConfirm={handleConfirmSave}
        onEdit={handleEdit}
        onClose={() => setShowReview(false)}
      />
    </div>
  )
}
