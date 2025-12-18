"use client";

import { useState } from "react";
import WizardLayout from "@/components/profile/wizard/WizardLayout";

import Step1Identity from "./Step1Identity";
import Step2Professional from "./Step2Professional";
import Step3Legal from "./Step3Legal";
import Step4Review from "./Step4Review";

export type ProfileDraft = {
  firstName: string;
  lastName: string;
  otherName: string;
  phoneNumber: string;
  email: string;
  guidingLevel: string;
  languages: string[];
  education: string;
  idNumber: string;
  idImage: File | null;
  traNumber: string;
  drivingLicense: string;
  yearsOfExperience: string;
};

export default function ProfileWizard() {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<ProfileDraft>({
    firstName: "",
    lastName: "",
    otherName: "",
    phoneNumber: "",
    email: "",
    guidingLevel: "",
    languages: [],
    education: "",
    idNumber: "",
    idImage: null,
    traNumber: "",
    drivingLicense: "",
    yearsOfExperience: "",
  });

  return (
    <WizardLayout step={step} onBack={() => setStep(step - 1)}>
      {step === 1 && (
        <Step1Identity profile={profile} setProfile={setProfile} onNext={() => setStep(2)} />
      )}
      {step === 2 && (
        <Step2Professional profile={profile} setProfile={setProfile} onNext={() => setStep(3)} onBack={() => setStep(1)} />
      )}
      {step === 3 && (
        <Step3Legal profile={profile} setProfile={setProfile} onNext={() => setStep(4)} onBack={() => setStep(2)} />
      )}
      {step === 4 && (
        <Step4Review profile={profile} onBack={() => setStep(3)} />
      )}
    </WizardLayout>
  );
}
