"use client"

import { useRef, useState } from "react"
import { X, FileText, Plus } from "lucide-react"
import {
  SafariFormState,
  formStateFromTrip,
  buildDatesFromForm,
} from "./helpers"
import { SafariTrip, SafariDocument } from "./types"
import ConfirmDialog from "./confirm-dialog"

type Props = {
  open: boolean
  trip: SafariTrip
  onClose: () => void
  onSave: (updated: SafariTrip) => void
  onDecline: (updated: SafariTrip) => void // mark as declined
}

export default function UpdateSafariModal({
  open,
  trip,
  onClose,
  onSave,
  onDecline,
}: Props) {
  const [form, setForm] = useState<SafariFormState>(formStateFromTrip(trip))
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [showDeclineConfirm, setShowDeclineConfirm] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  if (!open) return null

  const handleField = (field: keyof SafariFormState, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const addDestination = () => {
    const text = form.newDestination.trim()
    if (!text) return
    setForm((prev) => ({
      ...prev,
      destinations: [...prev.destinations, text],
      newDestination: "",
    }))
  }

  const removeDestination = (index: number) => {
    setForm((prev) => ({
      ...prev,
      destinations: prev.destinations.filter((_, i) => i !== index),
    }))
  }

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newDocs: SafariDocument[] = []
    for (let i = 0; i < files.length; i++) {
      const f = files[i]
      const url = URL.createObjectURL(f)
      newDocs.push({
        id: `${Date.now()}-${i}-${f.name}`,
        label: f.name,
        url,
      })
    }

    setForm((prev) => ({
      ...prev,
      documents: [...prev.documents, ...newDocs],
    }))
    e.target.value = ""
  }

  const removeDoc = (id: string) => {
    setForm((prev) => ({
      ...prev,
      documents: prev.documents.filter((d) => d.id !== id),
    }))
  }

  const handleDatePickerChange = (
    which: "startText" | "endText",
    value: string
  ) => {
    if (!value) return
    const date = new Date(value)
    if (isNaN(date.getTime())) return
    const dd = String(date.getDate()).padStart(2, "0")
    const mm = String(date.getMonth() + 1).padStart(2, "0")
    const yy = String(date.getFullYear()).slice(-2)
    const formatted = `${dd}/${mm}/${yy}`
    handleField(which, formatted)
  }

  const handleSave = () => {
    const updated: SafariTrip = {
      ...trip,
      name: form.name || trip.name,
      destinations: form.destinations,
      documents: form.documents,
      notes: form.notes,
      ...buildDatesFromForm(form, trip),
    }
    onSave(updated)
    onClose()
  }

  const handleDeclineConfirmed = () => {
    const updated: SafariTrip = {
      ...trip,
      name: form.name || trip.name,
      destinations: form.destinations,
      documents: form.documents,
      notes: form.notes,
      status: "declined",
      ...buildDatesFromForm(form, trip),
    }
    onDecline(updated)
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h3 className="text-sm font-semibold">Update Safari</h3>
          <button onClick={() => setShowCancelConfirm(true)}>
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="px-4 py-3 space-y-3 overflow-y-auto text-sm">
          {/* DATES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <DateField
              label="Start Date"
              value={form.startText}
              onChange={(v) => handleField("startText", v)}
              onPickDate={(v) => handleDatePickerChange("startText", v)}
            />
            <DateField
              label="End Date"
              value={form.endText}
              onChange={(v) => handleField("endText", v)}
              onPickDate={(v) => handleDatePickerChange("endText", v)}
            />
          </div>

          {/* TRIP NAME */}
          <div>
            <label className="text-xs block mb-1">Trip Name</label>
            <input
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
              value={form.name}
              onChange={(e) => handleField("name", e.target.value)}
            />
          </div>

          {/* DESTINATIONS */}
          <div>
            <label className="text-xs block mb-1">Destinations</label>
            <div className="flex gap-2 mb-2">
              <input
                className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm"
                placeholder="Add destination"
                value={form.newDestination}
                onChange={(e) => handleField("newDestination", e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addDestination()
                  }
                }}
              />
              <button
                onClick={addDestination}
                className="px-3 py-2 rounded-xl border border-gray-400 text-xs flex items-center gap-1"
              >
                <Plus size={12} />
                Add
              </button>
            </div>

            {form.destinations.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.destinations.map((d, i) => (
                  <span
                    key={`${d}-${i}`}
                    className="flex items-center gap-1 px-3 py-1 rounded-full border border-gray-300 text-xs bg-gray-50"
                  >
                    {d}
                    <button onClick={() => removeDestination(i)}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* NOTES */}
          <div>
            <label className="text-xs block mb-1">
              Guest / Notes (optional)
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm min-h-[60px]"
              value={form.notes}
              onChange={(e) => handleField("notes", e.target.value)}
            />
          </div>

          {/* DOCUMENTS */}
          <div>
            <label className="text-xs block mb-1">Documents</label>
            <div className="flex gap-2 mb-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-2 rounded-xl border border-gray-400 text-xs flex items-center gap-1"
              >
                <FileText size={12} />
                Add Document
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFilesSelected}
              />
            </div>

            {form.documents.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.documents.map((doc) => (
                  <span
                    key={doc.id}
                    className="flex items-center gap-1 px-3 py-1 rounded-full border border-gray-300 text-xs bg-gray-50"
                  >
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1"
                    >
                      <FileText size={12} />
                      <span className="truncate max-w-[120px]">
                        {doc.label}
                      </span>
                    </a>
                    <button onClick={() => removeDoc(doc.id)}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-4 py-3 border-t border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <button
            onClick={() => setShowDeclineConfirm(true)}
            className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm"
          >
            Decline Trip
          </button>

          <div className="flex gap-2 md:ml-auto">
            <button
              onClick={() => setShowCancelConfirm(true)}
              className="px-4 py-2 rounded-xl border border-gray-400 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-black text-white text-sm"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      {showCancelConfirm && (
        <ConfirmDialog
          message="Cancel changes to this safari?"
          onCancel={() => setShowCancelConfirm(false)}
          onConfirm={onClose}
        />
      )}

      {showDeclineConfirm && (
        <ConfirmDialog
          message="Confirm declining this safari?"
          onCancel={() => setShowDeclineConfirm(false)}
          onConfirm={handleDeclineConfirmed}
        />
      )}
    </div>
  )
}

/* same DateField as in add-safari */
function DateField({
  label,
  value,
  onChange,
  onPickDate,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  onPickDate: (v: string) => void
}) {
  return (
    <div>
      <label className="text-xs block mb-1">{label}</label>
      <div className="flex items-center gap-2">
        <input
          className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm"
          placeholder="dd/mm/yy"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <input
          type="date"
          className="w-9 h-9 border border-gray-300 rounded-md text-[10px]"
          onChange={(e) => onPickDate(e.target.value)}
        />
      </div>
    </div>
  )
}
