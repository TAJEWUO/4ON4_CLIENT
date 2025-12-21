"use client"

import { useEffect, useState } from "react"
import { getProfile } from "./profile.service"
import { mapProfileToUI } from "./profile.ui-mapper"
import type { ProfileUI } from "./profile.ui-contract"

export default function ProfileContainer({ userId }: { userId: string }) {
  const [profile, setProfile] = useState<ProfileUI | null>(null)

  useEffect(() => {
    // currently backend provides GET /api/profile/me — use getProfile()
    // If you later implement GET /api/profile/:userId, replace this with fetchProfile(userId)
    getProfile()
      .then((data) => {
        const payload = (data && (data.profile ?? data)) as any
        if (payload) setProfile(mapProfileToUI(payload))
      })
      .catch((err) => {
        // optional: handle error (console here)
        console.error("Failed to load profile", err)
      })
  }, [userId])

  if (!profile) return null

  return (
    <div className="border p-4 rounded">
      <p className="font-semibold">{profile.name}</p>
      <p className="text-sm">{profile.phone}</p>
      <p className="text-xs">{profile.level}</p>
    </div>
  )
}