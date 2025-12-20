"use client";

type Props = {
  data: any;
  onChange: (key: string, value: any) => void;
  onBack: () => void;
  onNext: () => void;
};

export default function Step3Documents({
  data,
  onChange,
  onBack,
  onNext,
}: Props) {
  return (
    <div className="space-y-6">
      {/* National ID / Passport */}
      <div className="space-y-1">
        <label className="text-sm text-green-600">
          National ID / Passport Number
        </label>
        <input
          type="text"
          value={data.idNumber ?? ""}
          onChange={(e) => onChange("idNumber", e.target.value)}
          className="w-full rounded-lg border px-4 py-3 focus:border-green-500"
        />
      </div>

      {/* ID Image — UNCONTROLLED (IMPORTANT) */}
      <div className="space-y-1">
        <label className="text-sm text-green-600">
          ID / Passport Image
        </label>
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={(e) =>
            onChange("idImage", e.target.files?.[0] || null)
          }
          className="w-full text-sm"
        />
      </div>

      {/* TRA Number */}
      <div className="space-y-1">
        <label className="text-sm text-green-600">TRA Number</label>
        <input
          type="text"
          value={data.traNumber ?? ""}
          onChange={(e) => onChange("traNumber", e.target.value)}
          className="w-full rounded-lg border px-4 py-3 focus:border-green-500"
        />
      </div>

      {/* Driving License */}
      <div className="space-y-1">
        <label className="text-sm text-green-600">
          Driving License Number
        </label>
        <input
          type="text"
          value={data.licenseNumber ?? ""}
          onChange={(e) => onChange("licenseNumber", e.target.value)}
          className="w-full rounded-lg border px-4 py-3 focus:border-green-500"
        />
      </div>

      {/* Years of Experience — NORMALIZED */}
      <div className="space-y-1">
        <label className="text-sm text-green-600">
          Years of Experience
        </label>
        <input
          type="number"
          min={0}
          value={data.yearsOfExperience ?? ""}
          onChange={(e) =>
            onChange(
              "yearsOfExperience",
              e.target.value === ""
                ? ""
                : Number(e.target.value)
            )
          }
          className="w-full rounded-lg border px-4 py-3 focus:border-green-500"
        />
      </div>

      {/* NAVIGATION */}
      <div className="pt-20 flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-full border border-green-600 text-green-600 text-sm"
        >
          ← Previous
        </button>

        <button
          onClick={onNext}
          className="px-6 py-3 rounded-full bg-green-600 text-white text-sm"
        >
          REVIEW →
        </button>
      </div>
    </div>
  );
}
