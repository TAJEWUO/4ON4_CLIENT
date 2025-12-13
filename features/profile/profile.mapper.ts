// features/profile/profile.mapper.ts
import { Profile } from "./profile.types";

export function mapProfileFromApi(raw: any): Profile {
  return {
    id: raw._id,

    profilePicture: raw.profilePicture ?? "",

    firstName: raw.firstName ?? "",
    lastName: raw.lastName ?? "",
    otherName: raw.otherName ?? "",

    phoneNumber: raw.phone ?? raw.phoneNumber ?? "",
    age: Number(raw.age ?? 0),

    yearsOfExperience: Number(raw.yearsOfExperience ?? 0),

    level: raw.level ?? "Bronze",

    languages: Array.isArray(raw.languages) ? raw.languages : [],

    educationLevel: raw.educationLevel ?? "",

    idNumber: raw.idNumber ?? "",
    idDocumentImage: raw.idDocumentImage ?? "",

    traNumber: raw.traNumber ?? "",

    employmentStatus: raw.employmentStatus ?? "Freelancer",

    role: raw.role ?? "Driver",
  };
}
