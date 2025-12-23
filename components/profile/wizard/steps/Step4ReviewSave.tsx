"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { saveProfile } from "@/features/profile/profile.service";
import { useAuth } from "@/contexts/AuthContext";

const CenteredOverlay = ({ children }: { children: React.ReactNode }) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
    {children}
  </div>
);

const ReviewItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between py-2 border-b border-gray-200">
    <span className="font-medium text-gray-700">{label}:</span>
    <span className="text-gray-900">{value}</span>
  </div>
);

type Props = {
  data: any;
  onBack: () => void;
  onSaved?: () => void; // optional callback
  canSave?: boolean; // indicates whether Save should be enabled
};

export default function Step4ReviewSave({ data, onBack, onSaved, canSave = true }: Props) {
  const router = useRouter();
  const { token, clearAuth } = useAuth();
  const [status, setStatus] = useState<"idle" | "saving" | "success">("idle");

  const handleSave = async () => {
    if (!canSave) {
      alert("No changes to save or required fields missing.");
      return;
    }

    setStatus("saving");

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value === null || value === undefined) return;

      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
        return;
      }

      if (value instanceof File) {
        formData.append(key, value);
        return;
      }

      formData.append(key, String(value));
    });

    console.log("Saving profile with data:", data);

    const result = await saveProfile(formData, token || undefined);
    
    if (!result.ok) {
      console.error("Failed to save profile:", result);
      
      // Check if it's an auth error
      if (result.message?.includes("Token") || result.message?.includes("authorization")) {
        alert("Your session has expired. Please log in again.");
        clearAuth();
        router.replace("/user/auth/login");
        return;
      }
      
      alert(`Failed to save profile: ${result.message || "Unknown error"}`);
      setStatus("idle");
      return;
    }

    console.log("Profile saved successfully:", result.data);

    setTimeout(() => {
      setStatus("success");
      setTimeout(() => {
        if (onSaved) {
          onSaved();
        } else {
          router.replace("/user/app/about");
        }
      }, 800);
    }, 600);
  };

  return (
    <div className="relative min-h-[60vh]">
      {status === "idle" && (
        <>
          <div className="space-y-4 text-sm">
            <ReviewItem label="Name" value={`${data.firstName || ""} ${data.lastName || ""}`} />
            <ReviewItem label="Phone" value={data.phoneNumber || data.phone || "-"} />
            <ReviewItem label="Email" value={data.email || "-"} />
            <ReviewItem label="Languages" value={Array.isArray(data.languages) ? data.languages.join(", ") : data.languages || "-"} />
            <ReviewItem label="Level" value={data.level || "-"} />
            <ReviewItem label="ID / Passport" value={data.idNumber || data.passportNumber || "-"} />
            <ReviewItem label="TRA Number" value={data.traNumber || "-"} />
            <ReviewItem label="License Number" value={data.drivingLicenseNumber || data.licenseNumber || "-"} />
            <ReviewItem label="Experience" value={`${data.yearsOfExperience || 0} years`} />
          </div>

          <div className="pt-24 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <button onClick={onBack} className="px-6 py-3 rounded-full border border-green-600 text-green-600 text-sm">
                ← Previous
              </button>

              <button
                onClick={handleSave}
                disabled={!canSave}
                className={`px-10 py-4 rounded-full text-sm font-medium ${
                  canSave ? "bg-green-600 text-white" : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                SAVE PROFILE
              </button>
            </div>

            {!canSave && (
              <p className="text-xs text-gray-500">
                Make changes and ensure required fields (First name or Phone) are filled to enable Save.
              </p>
            )}
          </div>
        </>
      )}

      {status === "saving" && (
        <CenteredOverlay>
          <div className="w-24 h-24 rounded-full border-4 border-white border-t-transparent animate-spin" />
          <p className="mt-6 text-white text-sm tracking-wide">Saving profile…</p>
        </CenteredOverlay>
      )}

      {status === "success" && (
        <CenteredOverlay>
          <div className="w-24 h-24 rounded-full border-4 border-green-500 flex items-center justify-center">
            <Check size={48} className="text-green-500" />
          </div>
          <p className="mt-6 text-green-500 font-semibold">Thank you</p>
          <p className="text-sm text-gray-300">Your profile has been saved successfully</p>
        </CenteredOverlay>
      )}
    </div>
  );
}