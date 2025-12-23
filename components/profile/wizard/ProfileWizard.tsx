"use client";

import { useState, useEffect, useMemo } from "react";
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

type Props = {
  onSaved?: () => void; // optional callback to run after successful save
  // optional prop to initially open at a specific step (not required)
  startStep?: number;
};

function mapPayloadToForm(payload: any): ProfileFormData {
  if (!payload) {
    return {
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
    };
  }

  return {
    firstName: payload.firstName ?? "",
    lastName: payload.lastName ?? "",
    otherName: payload.otherName ?? "",
    phoneNumber: payload.phoneNumber ?? payload.phone ?? "",
    email: payload.email ?? "",
    languages: Array.isArray(payload.languages)
      ? payload.languages
      : typeof payload.languages === "string" && payload.languages.length
      ? payload.languages.split(",").map((s: string) => s.trim()).filter(Boolean)
      : [],
    level: (payload.level ?? "") as ProfileFormData["level"],
    idNumber: payload.idNumber ?? "",
    passportNumber: payload.passportNumber ?? "",
    drivingLicenseNumber: payload.drivingLicenseNumber ?? "",
    traNumber: payload.traNumber ?? "",
    yearsOfExperience:
      payload.yearsOfExperience !== undefined && payload.yearsOfExperience !== null
        ? Number(payload.yearsOfExperience)
        : "",
    bio: payload.bio ?? "",
  };
}

export default function ProfileWizard({ onSaved, startStep = 1 }: Props) {
  const [step, setStep] = useState<number>(startStep);
  const [formData, setFormData] = useState<ProfileFormData>(() => mapPayloadToForm(null));
  const [initialData, setInitialData] = useState<ProfileFormData | null>(null);
  const [existingAvatar, setExistingAvatar] = useState<string | null>(null);

  // load profile on mount and fill form + initial snapshot
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getProfile();
        const payload = data?.profile ?? data;
        if (!mounted || !payload) return;

        const mapped = mapPayloadToForm(payload);
        setFormData(mapped);
        setInitialData(mapped);
        
        // Extract existing avatar path
        const avatarPath = payload.profilePicture?.path || payload.profilePicture || null;
        setExistingAvatar(avatarPath);
      } catch (err) {
        // no profile or network error — keep defaults (new user)
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // update helper
  const updateField = <K extends keyof ProfileFormData>(field: K, value: ProfileFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Callback to reload avatar when changed
  const handleAvatarChanged = async () => {
    try {
      const data = await getProfile();
      const payload = data?.profile ?? data;
      const avatarPath = payload?.profilePicture?.path || payload?.profilePicture || null;
      setExistingAvatar(avatarPath);
    } catch (err) {
      console.error("Failed to reload avatar:", err);
    }
  };

  // dirty check: compare JSON-serialized initial snapshot vs current form data
  const isDirty = useMemo(() => {
    if (!initialData) {
      // no initial data => treat as dirty only if any meaningful field is filled
      const hasAny = Boolean(
        (formData.firstName && formData.firstName.trim()) ||
        (formData.phoneNumber && formData.phoneNumber.trim()) ||
        (formData.email && formData.email.trim()) ||
        (Array.isArray(formData.languages) && formData.languages.length > 0)
      );
      return hasAny;
    }
    try {
      return JSON.stringify(initialData) !== JSON.stringify(formData);
    } catch {
      return true;
    }
  }, [initialData, formData]);

  // minimal validity: require firstName or phoneNumber (you can add more rules)
  const isValid = useMemo(() => {
    return Boolean(
      (formData.firstName && formData.firstName.trim().length > 0) ||
      (formData.phoneNumber && formData.phoneNumber.trim().length > 6)
    );
  }, [formData]);

  // whether user can save: must be dirty and valid
  const canSave = isDirty && isValid;

  return (
    <>
      {step === 1 && (
        <WizardLayout title="STEP 1 — Basic Info" step={1}>
          <Step1BasicInfo 
            data={formData} 
            onChange={updateField} 
            onNext={() => setStep(2)}
            existingAvatar={existingAvatar}
            onAvatarChanged={handleAvatarChanged}
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