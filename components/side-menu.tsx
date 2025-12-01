"use client";

import { useState, useEffect, useRef } from "react";
import { X, User, Users, PanelsTopLeft, Plus } from "lucide-react";
import DriverProfileModal from "./ui/driver-profile-modal";
import { apiUpdateProfile, BASE_URL, buildImageUrl } from "@/lib/api";

type SideMenuProps = {
  onClose: () => void;
  userProfile: any;
  setUserProfile: (v: any) => void;
  vehicles: any[];
  setVehicles: (v: any[]) => void;
};

export default function SideMenu({
  onClose,
  userProfile,
  setUserProfile,
  vehicles = [],
  setVehicles,
}: SideMenuProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [showDriverModal, setShowDriverModal] = useState(false);

  // CLICK OUTSIDE TO CLOSE (but keep open when driver modal is open)
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        // Don't close main menu if profile modal is open
        if (showDriverModal) return;
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showDriverModal, onClose]);

  // Does this user have at least some profile info filled?
  const hasProfile =
    !!userProfile &&
    (userProfile.firstName ||
      userProfile.lastName ||
      userProfile.citizenship ||
      userProfile.level);

  // Build profile image URL if exists
  const profileImageUrl = userProfile?.profileImage
  ? buildImageUrl(userProfile.profileImage)
  : null;

  return (
    <>
      {/* BACKDROP */}
      <div className="fixed inset-0 bg-black/40 z-40" />

      {/* PANEL */}
      <div
        ref={panelRef}
        className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50
                   overflow-y-auto transform transition-transform p-4 flex flex-col"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Account</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* DRIVER PROFILE SECTION */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">Driver Profile</h3>

          {/* NO PROFILE YET */}
          {!hasProfile && (
            <div className="flex flex-col items-center gap-3 py-4 border border-gray-300 rounded-lg">
              <button
                onClick={() => setShowDriverModal(true)}
                className="w-20 h-20 rounded-full bg-gray-200 border border-gray-400 flex items-center justify-center"
              >
                <Plus size={32} className="text-black" />
              </button>
              <button
                onClick={() => setShowDriverModal(true)}
                className="text-black underline text-sm"
              >
                Add Driver Profile
              </button>
            </div>
          )}

          {/* PROFILE EXISTS */}
          {hasProfile && (
            <div
              onClick={() => setShowDriverModal(true)}
              className="flex items-center gap-3 p-3 bg-gray-100 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200"
            >
              <div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                {profileImageUrl ? (
                  // fetched profile image from backend
                  <img
                    src={profileImageUrl}
                    className="w-full h-full object-cover"
                    alt="Driver profile"
                  />
                ) : (
                  <User className="w-full h-full p-3 text-gray-500" />
                )}
              </div>

              <div>
                <p className="font-semibold text-black text-sm">
                  {userProfile.firstName || ""} {userProfile.lastName || ""}
                </p>
                {userProfile.level && (
                  <p className="text-xs text-gray-600">
                    Level: {userProfile.level}
                  </p>
                )}
                {userProfile.citizenship && (
                  <p className="text-xs text-gray-600">
                    {userProfile.citizenship}
                  </p>
                )}
                <p className="text-xs text-gray-600 mt-1">
                  Tap to edit profile
                </p>
              </div>
            </div>
          )}
        </div>

        {/* VEHICLE SECTION */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">Your Vehicles</h3>

          {vehicles.length === 0 && (
            <div className="p-4 border border-gray-300 rounded-lg text-center text-sm text-gray-600 mb-3">
              No vehicles added yet.
            </div>
          )}

          {vehicles.map((v: any, index: number) => (
            <div
              key={v._id || index}
              className="p-3 border border-gray-200 rounded-lg bg-gray-100 mb-2"
            >
              <p className="font-semibold text-sm">
                {v.model || "Vehicle"}
              </p>
              <p className="text-xs text-gray-600 mb-2">
                Plate:{" "}
                <span className="font-mono">
                  {v.plateNumber || v.plate || "N/A"}
                </span>
              </p>

              <div className="flex items-center gap-4 text-xs text-black">
                <div className="flex items-center gap-1">
                  <Users size={14} /> {v.capacity || "-"} seats
                </div>
                <div className="flex items-center gap-1">
                  <PanelsTopLeft size={14} /> {v.windowType || "-"}
                </div>
              </div>
            </div>
          ))}

          {/* ADD VEHICLE BUTTON */}
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                const event = new CustomEvent("openAddVehicleModal");
                window.dispatchEvent(event);
              }
            }}
            className="w-full mt-3 py-2 bg-black text-white rounded-md text-sm"
          >
            Add New Vehicle
          </button>
        </div>

        {/* LINKS */}
        <div className="space-y-3 mb-6">
          <button className="block w-full text-left text-sm text-black hover:underline">
            About
          </button>
          <button className="block w-full text-left text-sm text-black hover:underline">
            Help
          </button>
          <button className="block w-full text-left text-sm text-black hover:underline">
            FAQs
          </button>
        </div>

        {/* LOGOUT */}
        <div className="mt-auto mb-4">
          <button
            className="w-full py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
            onClick={() => {
              localStorage.removeItem("isLoggedIn");
              localStorage.removeItem("fouron4_user_id");
              window.location.href = "/user/auth";
            }}
          >
            Log Out
          </button>
        </div>
      </div>

      {/* DRIVER PROFILE MODAL */}
      <DriverProfileModal
        open={showDriverModal}
        onClose={() => setShowDriverModal(false)}
        driver={userProfile}
        onSubmit={async (data: any) => {
          try {
            const userId = localStorage.getItem("fouron4_user_id");
            if (!userId) return;

            const form = new FormData();
            form.append("firstName", data.firstName || "");
            form.append("lastName", data.lastName || "");
            form.append("citizenship", data.citizenship || "");
            form.append("level", data.level || "");
            form.append("licenseNumber", data.licenseNumber || "");
            form.append("nationalId", data.nationalId || "");
            form.append("languages", JSON.stringify(data.languages || []));

            if (data.image instanceof File) {
              form.append("profileImage", data.image);
            }

            const res = await apiUpdateProfile(userId, form);

            if (res.success && res.user) {
              setUserProfile(res.user);
            }
          } catch (e) {
            console.error("Profile update failed:", e);
          }
        }}
      />
    </>
  );
}
