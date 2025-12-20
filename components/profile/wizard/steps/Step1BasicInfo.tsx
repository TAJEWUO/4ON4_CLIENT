"use client";
import { ProfileFormData } from "../ProfileWizard";

type Props = {
  data: ProfileFormData;
  onChange: <K extends keyof ProfileFormData>(
    field: K,
    value: ProfileFormData[K]
  ) => void;
  onNext: () => void;
};

export default function Step1BasicInfo({ data, onChange, onNext }: Props) {
  return (
    <div className="space-y-4">
      {[
        ["firstName", "First Name"],
        ["lastName", "Last Name"],
        ["otherName", "Other Name"],
        ["phoneNumber", "Phone Number"],
        ["email", "Email"],
      ].map(([key, label]) => (
        <div key={key}>
          <label className="text-sm text-green-600">{label}</label>
          <input
            className="w-full border rounded-lg px-4 py-2"
            value={(data as any)[key]}
            onChange={(e) => onChange(key as any, e.target.value)}
          />
        </div>
      ))}

      <div className="pt-24 flex justify-end">
        <button
          onClick={onNext}
          className="px-6 py-3 rounded-full bg-green-600 text-white"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
