"use client";

import { useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import ProfileWizard from "@/components/profile/wizard/ProfileWizard";
import ProfileView from "@/components/profile/ProfileView";

export default function ProfilePage() {
  const { profile, loading, refresh } = useProfile();
  const [isEditing, setIsEditing] = useState(false);

  // Show wizard if: no profile exists (new user) OR user clicked "Edit"
  const showWizard = !profile || isEditing;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <>
      {showWizard ? (
        <ProfileWizard
          onSaved={() => {
            refresh(); // Reload profile data
            setIsEditing(false); // Exit edit mode
          }}
        />
      ) : (
        <ProfileView
          profile={profile}
          onEdit={() => setIsEditing(true)} // Enter edit mode
        />
      )}
    </>
  );
}
