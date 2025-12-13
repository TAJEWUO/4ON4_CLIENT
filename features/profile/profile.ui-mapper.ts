import type { Profile } from "./profile.types"
import type { ProfileUI } from "./profile.ui-contract"

export function mapProfileToUI(profile: Profile): ProfileUI {
  return {
    name: `${profile.firstName} ${profile.lastName}`,
    phone: profile.phone,
    level: profile.level,
    avatarUrl: profile.avatarUrl,
  }
}
