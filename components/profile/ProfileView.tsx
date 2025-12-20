"use client";

type Props = {
  profile: any;
  onEdit: () => void;
};

export default function ProfileView({ profile, onEdit }: Props) {
  return (
    <div className="px-4 pt-6 pb-28 space-y-6">
      <div className="flex flex-col items-center gap-3">
        <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
          👤
        </div>

        <h2 className="font-semibold text-lg">
          {profile?.firstName || "—"} {profile?.lastName || ""}
        </h2>
      </div>

      <div className="space-y-2 text-sm">
        <p><b>Phone:</b> {profile?.phoneNumber || "—"}</p>
        <p><b>Languages:</b> {profile?.languages?.join(", ") || "—"}</p>
        <p><b>Level:</b> {profile?.level || "—"}</p>
      </div>

      <button
        onClick={onEdit}
        className="w-full py-3 rounded-full bg-black text-white"
      >
        Edit Profile
      </button>
    </div>
  );
}
