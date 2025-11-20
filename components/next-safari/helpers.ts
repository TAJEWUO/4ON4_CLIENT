// components/next-safari/helpers.ts

import { SafariTrip, SafariDocument } from "./types"

export type SafariFormState = {
  name: string
  destinations: string[]
  newDestination: string
  startText: string
  endText: string
  documents: SafariDocument[]
  notes: string
}

export function emptyFormState(): SafariFormState {
  return {
    name: "",
    destinations: [],
    newDestination: "",
    startText: "",
    endText: "",
    documents: [],
    notes: "",
  }
}

export function formStateFromTrip(trip: SafariTrip): SafariFormState {
  return {
    name: trip.name || "",
    destinations: trip.destinations || [],
    newDestination: "",
    startText: trip.startLabel || "",
    endText: trip.endLabel || "",
    documents: trip.documents || [],
    notes: trip.notes || "",
  }
}

export function formatDateLabel(iso: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ""
  const day = String(d.getDate()).padStart(2, "0")
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const year = String(d.getFullYear()).slice(-2)
  return `${day}/${month}/${year}`
}

export function parseDateFromText(text: string): string | undefined {
  const trimmed = text.trim()
  if (!trimmed) return undefined
  const parts = trimmed.split("/")
  if (parts.length < 3) return undefined

  let [dd, mm, yy] = parts
  const day = Number(dd)
  const month = Number(mm)
  let year = Number(yy)

  if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year)) return undefined

  // turn 25 → 2025 style
  if (year < 100) {
    const currentYear = new Date().getFullYear()
    const century = Math.floor(currentYear / 100) * 100
    year = century + year
  }

  const date = new Date(year, month - 1, day)
  if (isNaN(date.getTime())) return undefined

  return date.toISOString()
}

export function buildDatesFromForm(
  data: SafariFormState,
  previous?: SafariTrip
): Pick<SafariTrip, "startDate" | "endDate" | "startLabel" | "endLabel"> {
  const startISO = parseDateFromText(data.startText)
  const endISO = parseDateFromText(data.endText)

  return {
    startDate: startISO || previous?.startDate,
    endDate: endISO || previous?.endDate,
    startLabel: data.startText || previous?.startLabel,
    endLabel: data.endText || previous?.endLabel,
  }
}
