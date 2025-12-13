export interface Profile {
  id: string
  firstName: string
  lastName: string
  otherName?: string
  phone: string
  age?: number
  experienceYears?: number
  level: "Gold" | "Silver" | "Bronze"
  languages: string[]
  educationLevel?: string
  idNumber?: string
  traNumber?: string
  employmentStatus?: "Freelancer" | "Employed"
  role?: "Driver" | "CarOwner"
   profilePicture: string; 
}
