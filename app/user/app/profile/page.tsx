"use client";

import { useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import ProfileWizard from "@/components/profile/wizard/ProfileWizard";
import ProfileView from "@/components/profile/ProfileView";

export default function ProfilePage() {
  const { profile, loading, refresh, error } = useProfile();
  const [isEditing, setIsEditing] = useState(false);

  console.log("ProfilePage - State:", { profile, loading, error, isEditing });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    const isAuthError = error.includes("Not logged in") || error.includes("token");
    
    return (
      <div className="flex flex-col items-center justify-center h-screen px-4 text-center">
        <p className="text-red-600 mb-4">Error: {error}</p>
        
        {isAuthError ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Please log in to view your profile.
            </p>
            <button 
              onClick={() => window.location.href = "/user/auth/login"}
              className="px-6 py-2 bg-green-600 text-white rounded-full"
            >
              Go to Login
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Something went wrong. Try logging in again.
            </p>
            <button 
              onClick={refresh}
              className="px-6 py-2 bg-green-600 text-white rounded-full mr-2"
            >
              Retry
            </button>
            <button 
              onClick={() => window.location.href = "/user/auth/login"}
              className="px-6 py-2 bg-gray-600 text-white rounded-full"
            >
              Re-login
            </button>
          </div>
        )}
      </div>
    );
  }

  // Show wizard ONLY if user clicked "Edit" button
  // If no profile exists yet, show empty ProfileView which will prompt to create
  return (
    <>
      {isEditing ? (
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
