"use client"

import { useState } from "react"
import DriverPreview from "./ui/driver-preview"
import DriverProfileModal from "./ui/driver-profile-modal"

export default function DriverPage() {
  const [driver, setDriver] = useState<any>(null)
  const [open, setOpen] = useState(false)

  return (
    <div className="w-full max-w-xl mx-auto p-4">

      {/* DRIVER PREVIEW */}
      <DriverPreview
        driver={driver}
        onClick={() => setOpen(true)}
      />

      {/* DRIVER FORM MODAL */}
      <DriverProfileModal
        open={open}
        onClose={() => setOpen(false)}
        driver={driver}
        onSubmit={(data) => {
          // SAVE OR UPDATE DRIVER
          setDriver({
            ...data,
            image: data.image ? URL.createObjectURL(data.image) : driver?.image,
          })
        }}
      />
    </div>
  )
}
