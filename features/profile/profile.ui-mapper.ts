import { Profile } from "./profile.types";

export interface ProfileUI {
  id: string;
  fullName: string;
  phone: string;
  level: Profile["level"];
  avatarUrl: string;
}

export function mapProfileToUI(profile: Profile): ProfileUI {
  return {
    id: profile.id,
    fullName: `${profile.firstName} ${profile.lastName}`,
    phone: profile.phone,
    level: profile.level,
    avatarUrl: profile.profilePicture,
  };
}
