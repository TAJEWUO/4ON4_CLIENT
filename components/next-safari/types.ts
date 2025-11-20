// components/next-safari/types.ts

export type SafariStatus = "pending" | "accepted" | "declined" | "unattended"
export type SafariSource = "self" | "public"

export type SafariDocument = {
  id: string
  label: string
  url: string
}

export type SafariTrip = {
  id: string
  source: SafariSource
  status: SafariStatus

  name: string

  // travel details
  destinations: string[]
  startDate?: string          // ISO
  endDate?: string            // ISO
  startLabel?: string         // dd/mm/yy
  endLabel?: string           // dd/mm/yy

  // files
  documents: SafariDocument[]
  notes?: string

  createdAt: string           // ISO

  // for PUBLIC bookings
  guestName?: string
  agencyName?: string
}
