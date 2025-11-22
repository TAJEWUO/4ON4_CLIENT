"use client";

import { useState, useEffect } from "react";
import { X, ArrowLeft } from "lucide-react";

const languageOptions = [
  "English",
  "Kiswahili",
  "Chinese",
  "French",
  "Spanish",
  "Korean",
  "Portuguese",
];

export default function DriverProfileModal({
  open,
  onClose,
  onSubmit,
  driver,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  driver?: any;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [citizenship, setCitizenship] = useState<"Kenyan" | "Foreigner" | "">(
    ""
  );
  const [level, setLevel] = useState<"BRONZE" | "SILVER" | "GOLD" | "">("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [languages, setLanguages] = useState<string[]>([]);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Load driver profile into modal
  useEffect(() => {
    if (driver) {
      setFirstName(driver.firstName || "");
      setLastName(driver.lastName || "");
      setCitizenship(driver.citizenship || "");
      setLevel(driver.level || "");
      setLicenseNumber(driver.licenseNumber || "");
      setNationalId(driver.nationalId || "");
      setLanguages(driver.languages || []);
      setImageUrl(
        driver.profileImage
          ? `http://192.168.0.104:3002/${driver.profileImage}`
          : null
      );
    }
  }, [driver]);

  if (!open) return null;

  const handleLanguageToggle = (lang: string) => {
    if (languages.includes(lang)) {
      setLanguages(languages.filter((l) => l !== lang));
    } else {
      setLanguages([...languages, lang]);
    }
  };

  const handleSubmit = () => {
    onSubmit({
      firstName,
      lastName,
      citizenship,
      level,
      licenseNumber,
      nationalId,
      languages,
      profileImage, // ✔ correct key for backend
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-auto">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-xl overflow-hidden">
        {/* HEADER */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-300">
          <button onClick={onClose} className="flex items-center gap-1 text-black">
            <ArrowLeft size={22} />
            Back
          </button>
          <button onClick={onClose} className="text-black">
            <X size={22} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-5 space-y-4">
          {/* PROFILE IMAGE */}
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
              {imageUrl ? (
                <img src={imageUrl} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
            </div>
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) {
                setProfileImage(f);
                setImageUrl(URL.createObjectURL(f));
              }
            }}
            className="w-full text-sm"
          />

          {/* NAME */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-black">First Name</label>
              <input
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-black">Last Name</label>
              <input
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          {/* CITIZENSHIP */}
          <div>
            <label className="text-sm text-black">Citizenship</label>
            <select
              value={citizenship}
              onChange={(e) => setCitizenship(e.target.value as any)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white"
            >
              <option value="">Select</option>
              <option value="Kenyan">Kenyan</option>
              <option value="Foreigner">Foreigner</option>
            </select>
          </div>

          {/* LEVEL */}
          <div>
            <label className="text-sm text-black">Level</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as any)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white"
            >
              <option value="">Select</option>
              <option value="BRONZE">BRONZE</option>
              <option value="SILVER">SILVER</option>
              <option value="GOLD">GOLD</option>
            </select>
          </div>

          {/* LICENSE */}
          <div>
            <label className="text-sm text-black">License Number</label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
            />
          </div>

          {/* NATIONAL ID */}
          <div>
            <label className="text-sm text-black">National ID / Passport</label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
            />
          </div>

          {/* LANGUAGES */}
          <div>
            <label className="text-sm text-black">Languages</label>

            <div className="flex flex-wrap gap-2 mt-2">
              {languageOptions.map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageToggle(lang)}
                  className={`px-3 py-1 rounded border text-sm ${
                    languages.includes(lang)
                      ? "bg-black text-white"
                      : "bg-white text-black"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-5 py-4 border-t border-gray-300 flex justify-between">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 text-sm"
          >
            Save Profile
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-400 rounded-md text-black hover:bg-gray-100 text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
