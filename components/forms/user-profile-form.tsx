"use client"

import type React from "react"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Upload, ArrowLeft, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ReviewModal } from "@/components/review-modal"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function UserProfileForm() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [showReview, setShowReview] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    otherName: "",
    phoneNumber: "",
    age: "",
    experience: "",
    idType: "",
    idNumber: "",
    traNumber: "",
    level: "",
    language: "",
    education: "",
    profileImage: null as File | null,
    idImage: null as File | null,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, [field]: file }))
    }
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
    console.log("Form submitted:", formData)
    alert("Profile saved successfully!")
    setShowReview(false)
  }

  const handleEdit = () => {
    setShowReview(false)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-black hover:text-black/70 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-semibold">Back</span>
        </button>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 hover:bg-black/5 rounded-lg transition-colors"
          aria-label="Menu"
        >
          {isMenuOpen ? <X size={20} className="text-black" /> : <Menu size={20} className="text-black" />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="mb-6 border border-black/10 rounded-lg bg-white py-2 space-y-1">
          <Link
            href="/"
            className="block px-4 py-2 text-sm text-black hover:bg-black/5 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="#about"
            className="block px-4 py-2 text-sm text-black hover:bg-black/5 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
          <Link
            href="#faqs"
            className="block px-4 py-2 text-sm text-black hover:bg-black/5 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            FAQs
          </Link>
          <Link
            href="#terms"
            className="block px-4 py-2 text-sm text-black hover:bg-black/5 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Terms & Conditions
          </Link>
          <Link
            href="#contact"
            className="block px-4 py-2 text-sm text-black hover:bg-black/5 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-black mb-2">User Profile</h1>
        <p className="text-black/60">Complete your profile information</p>
      </div>

      <div className="flex gap-2 mb-8">
        {[1, 2, 3, 4].map((page) => (
          <div
            key={page}
            className={`h-1 flex-1 rounded-full transition-all ${page <= currentPage ? "bg-black" : "bg-black/10"}`}
          />
        ))}
      </div>

      <div className="border border-black/10 rounded-lg p-6 sm:p-8 bg-white mb-8">
        {currentPage === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-black mb-6">Personal Information</h2>
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                First Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="John"
                className="w-full px-4 py-3 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Last Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Doe"
                className="w-full px-4 py-3 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-2">Other Name</label>
              <input
                type="text"
                name="otherName"
                value={formData.otherName}
                onChange={handleInputChange}
                placeholder="Middle name"
                className="w-full px-4 py-3 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Phone Number <span className="text-red-600">*</span>
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="+254 712 345 678"
                className="w-full px-4 py-3 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 text-black"
              />
            </div>
          </div>
        )}

        {currentPage === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-black mb-6">Additional Information</h2>
            <div>
              <label className="block text-sm font-semibold text-black mb-2">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="25"
                className="w-full px-4 py-3 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-2">Years of Experience</label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                placeholder="5"
                className="w-full px-4 py-3 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                ID Type <span className="text-red-600">*</span>
              </label>
              <select
                name="idType"
                value={formData.idType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 text-black"
              >
                <option value="">Select ID Type</option>
                <option value="national">National ID</option>
                <option value="passport">Passport</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-2">ID/Passport Number</label>
              <input
                type="text"
                name="idNumber"
                value={formData.idNumber}
                onChange={handleInputChange}
                placeholder="12345678"
                className="w-full px-4 py-3 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 text-black"
              />
            </div>
          </div>
        )}

        {currentPage === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-black mb-6">Professional Details</h2>
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Level <span className="text-red-600">*</span>
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 text-black"
              >
                <option value="">Select Level</option>
                <option value="gold">Gold</option>
                <option value="silver">Silver</option>
                <option value="bronze">Bronze</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Language <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                placeholder="English, Swahili"
                className="w-full px-4 py-3 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-2">Level of Education</label>
              <select
                name="education"
                value={formData.education}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 text-black"
              >
                <option value="">Select Education Level</option>
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="tertiary">Tertiary</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-2">TRA Number</label>
              <input
                type="text"
                name="traNumber"
                value={formData.traNumber}
                onChange={handleInputChange}
                placeholder="TRA123456"
                className="w-full px-4 py-3 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 text-black"
              />
            </div>
          </div>
        )}

        {currentPage === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-black mb-6">Upload Documents</h2>
            <div>
              <label className="block text-sm font-semibold text-black mb-3">
                Profile Picture <span className="text-red-600">*</span>
              </label>
              <label className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-black/20 rounded-lg cursor-pointer hover:border-black/40 transition-colors bg-black/2">
                <div className="flex flex-col items-center gap-2">
                  <Upload size={24} className="text-black/60" />
                  <span className="text-sm text-black/60">Click to upload or drag and drop</span>
                  {formData.profileImage && (
                    <span className="text-sm font-semibold text-black">{formData.profileImage.name}</span>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "profileImage")}
                  className="hidden"
                />
              </label>
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-3">ID/Passport Picture (Optional)</label>
              <label className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-black/20 rounded-lg cursor-pointer hover:border-black/40 transition-colors bg-black/2">
                <div className="flex flex-col items-center gap-2">
                  <Upload size={24} className="text-black/60" />
                  <span className="text-sm text-black/60">Click to upload or drag and drop</span>
                  {formData.idImage && (
                    <span className="text-sm font-semibold text-black">{formData.idImage.name}</span>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "idImage")}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}
      </div>

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
        title="User Profile"
        onConfirm={handleConfirmSave}
        onEdit={handleEdit}
        onClose={() => setShowReview(false)}
      />
    </div>
  )
}
