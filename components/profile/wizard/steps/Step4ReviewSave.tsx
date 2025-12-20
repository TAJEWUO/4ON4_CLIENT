"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { saveProfile } from "@/features/profile/profile.service";

type Props = {
  data: any;
  onBack: () => void;
};

export default function Step4ReviewSave({ data, onBack }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "saving" | "success">("idle");

  const handleSave = async () => {
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

    try {
      await saveProfile(formData);

      setTimeout(() => {
        setStatus("success");
        setTimeout(() => {
          router.replace("/user/app/about");
        }, 1200);
      }, 1200);
    } catch (err) {
      console.error(err);
      alert("Failed to save profile. Please try again.");
      setStatus("idle");
    }
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

          <div className="pt-24 flex justify-between">
            <button onClick={onBack} className="px-6 py-3 rounded-full border border-green-600 text-green-600 text-sm">
              ← Previous
            </button>

            <button onClick={handleSave} className="px-10 py-4 rounded-full bg-green-600 text-white text-sm font-medium">
              SAVE PROFILE
            </button>
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

function ReviewItem({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between border-b pb-2">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-right">{value && String(value).length ? value : "-"}</span>
    </div>
  );
}

function CenteredOverlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">{children}</div>
  );
}