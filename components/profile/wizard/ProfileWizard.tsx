"use client";

import { useState } from "react";
import WizardLayout from "./WizardLayout";

import Step1BasicInfo from "./steps/Step1BasicInfo";
import Step2LanguagesLevel from "./steps/Step2LanguagesLevel";
import Step3Documents from "./steps/Step3Documents";
import Step4ReviewSave from "./steps/Step4ReviewSave";

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
