// features/profile/profile.ui-mapper.ts
import { Profile } from "./profile.types"
import { ProfileUI } from "./profile.ui-contract"

export function mapProfileToUI(profile: Profile): ProfileUI {
  return {
    id: profile.id,
    name: `${profile.firstName} ${profile.lastName}`,
    phone: profile.phone,
    level: profile.level,
    avatarUrl: profile.profilePicture,
  }
}
