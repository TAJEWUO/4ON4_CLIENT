// features/profile/profile.types.ts

export interface Profile {
  id: string;

  profilePicture: string;

  firstName: string;
  lastName: string;
  otherName?: string;

  phone: string;

  age?: number;

  experienceYears?: number; // <-- FINAL CANONICAL NAME

  level: "Gold" | "Silver" | "Bronze";

  languages: string[];

  educationLevel?: string;

  idNumber?: string;
  idDocumentImage?: string;

  traNumber?: string;

  employmentStatus?: "Freelancer" | "Employed";
  role?: "Driver" | "CarOwner";
}
