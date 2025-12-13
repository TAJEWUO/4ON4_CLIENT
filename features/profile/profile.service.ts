import { apiGetProfile } from "@/lib/api"
import type { Profile } from "./profile.types"

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { ok, data } = await apiGetProfile(userId)
  if (!ok) return null
  return data?.profile ?? data ?? null
}
