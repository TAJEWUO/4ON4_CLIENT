"use client";
import { ProfileFormData } from "../ProfileWizard";

const LANGUAGES = ["English", "Kiswahili", "French", "Spanish", "Italiano", "portuguese", "Korean", "Arabic", "Japanese", "Chinese", "Russian", "Hebrew", "Dutch", "Swedish", "Danish", "Norwegian", "Finnish", "Greek", "Czech", "Polish", "Hungarian", "Serbian", "Croatian", "Bulgarian", "Romanian", "TurkishMandarin"];
const LEVELS = ["GOLD", "SILVER", "BRONZE"] as const;

type Props = {
  data: ProfileFormData;
  onChange: <K extends keyof ProfileFormData>(
    field: K,
    value: ProfileFormData[K]
  ) => void;
  onBack: () => void;
  onNext: () => void;
};

export default function Step2LanguagesLevel({
  data,
  onChange,
  onBack,
  onNext,
}: Props) {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-green-600 mb-3">Languages (multiple)</p>
        <div className="flex flex-wrap gap-3">
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              onClick={() =>
                onChange(
                  "languages",
                  data.languages.includes(lang)
                    ? data.languages.filter((l) => l !== lang)
                    : [...data.languages, lang]
                )
              }
              className={`px-4 py-2 rounded-full border ${
                data.languages.includes(lang)
                  ? "bg-green-600 text-white"
                  : ""
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm text-green-600 mb-3">Level (choose one)</p>
        <div className="flex gap-3">
          {LEVELS.map((lvl) => (
            <button
              key={lvl}
              onClick={() => onChange("level", lvl)}
              className={`px-6 py-2 rounded-full border ${
                data.level === lvl ? "bg-green-600 text-white" : ""
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-24 flex justify-between">
        <button onClick={onBack} className="px-6 py-3 rounded-full border">
          ← Previous
        </button>
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
