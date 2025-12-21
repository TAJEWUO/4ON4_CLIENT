"use client";

import { useState, useEffect } from "react";
import WizardLayout from "./WizardLayout";

import Step1BasicInfo from "./steps/Step1BasicInfo";
import Step2LanguagesLevel from "./steps/Step2LanguagesLevel";
import Step3Documents from "./steps/Step3Documents";
import Step4ReviewSave from "./steps/Step4ReviewSave";

import { getProfile } from "@/features/profile/profile.service";

export type ProfileFormData = {
  firstName: string;
  lastName: string;
  otherName: string;
  phoneNumber: string;
  email: string;

  languages: string[];
  level: "GOLD" | "SILVER" | "BRONZE" | "";

  idNumber: string;
  passportNumber?: string;
  drivingLicenseNumber?: string;
  traNumber?: string;

  yearsOfExperience: number | "";
  bio: string;
};

export default function ProfileWizard() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: "",
    lastName: "",
    otherName: "",
    phoneNumber: "",
    email: "",
    languages: [],
    level: "",
    idNumber: "",
    passportNumber: "",
    drivingLicenseNumber: "",
    traNumber: "",
    yearsOfExperience: "",
    bio: "",
  });

  // Autofill from API when profile exists
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getProfile();
        const payload = data?.profile ?? data;
        if (!mounted || !payload) return;

        setFormData((prev) => ({
          ...prev,
          firstName: payload.firstName ?? prev.firstName,
          lastName: payload.lastName ?? prev.lastName,
          otherName: payload.otherName ?? prev.otherName,
          phoneNumber: payload.phoneNumber ?? payload.phone ?? prev.phoneNumber,
          email: payload.email ?? prev.email,
          languages: Array.isArray(payload.languages)
            ? payload.languages
            : (typeof payload.languages === "string" && payload.languages.length
                ? payload.languages.split(",").map((s: string) => s.trim()).filter(Boolean)
                : prev.languages),
          level: (payload.level ?? prev.level) as ProfileFormData["level"],
          idNumber: payload.idNumber ?? prev.idNumber,
          passportNumber: payload.passportNumber ?? prev.passportNumber,
          drivingLicenseNumber: payload.drivingLicenseNumber ?? prev.drivingLicenseNumber,
          traNumber: payload.traNumber ?? prev.traNumber,
          yearsOfExperience:
            payload.yearsOfExperience !== undefined && payload.yearsOfExperience !== null
              ? Number(payload.yearsOfExperience)
              : prev.yearsOfExperience,
          bio: payload.bio ?? prev.bio,
        }));
      } catch (err) {
        // No profile found or network error — ignore and let user fill the form
        // console.debug("ProfileWizard: no profile or failed to load", err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const updateField = <K extends keyof ProfileFormData>(
    field: K,
    value: ProfileFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      {step === 1 && (
        <WizardLayout title="STEP 1 — Basic Info" step={1}>
          <Step1BasicInfo
            data={formData}
            onChange={updateField}
            onNext={() => setStep(2)}
          />
        </WizardLayout>
      )}

      {step === 2 && (
        <WizardLayout title="STEP 2 — Languages & Level" step={2}>
          <Step2LanguagesLevel
            data={formData}
            onChange={updateField}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        </WizardLayout>
      )}

      {step === 3 && (
        <WizardLayout title="STEP 3 — Documents & Experience" step={3}>
          <Step3Documents
            data={formData}
            onChange={(key: string, value: any) => updateField(key as keyof ProfileFormData, value)}
            onBack={() => setStep(2)}
            onNext={() => setStep(4)}
          />
        </WizardLayout>
      )}

      {step === 4 && (
        <WizardLayout title="STEP 4 — Review & Save" step={4}>
          <Step4ReviewSave
            data={formData}
            onBack={() => setStep(3)}
          />
        </WizardLayout>
      )}
    </>
  );
}