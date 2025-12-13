// features/profile/profile.ui-contract.ts
export interface ProfileUI {
  id: string
  name: string
  phone: string
  level: "Gold" | "Silver" | "Bronze"
  avatarUrl: string
}
