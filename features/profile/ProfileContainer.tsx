"use client"

import { useEffect, useState } from "react"
import { fetchProfile } from "./profile.service"
import { mapProfileToUI } from "./profile.ui-mapper"
import type { ProfileUI } from "./profile.ui-contract"

export default function ProfileContainer({ userId }: { userId: string }) {
  const [profile, setProfile] = useState<ProfileUI | null>(null)

  useEffect(() => {
    fetchProfile(userId).then(data => {
      if (data) setProfile(mapProfileToUI(data))
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
