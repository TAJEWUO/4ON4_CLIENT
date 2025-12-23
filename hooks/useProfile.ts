"use client";

import { useState, useEffect, useCallback } from "react";
import { getProfile } from "@/features/profile/profile.service";
import { useAuth } from "@/contexts/AuthContext";

export function useProfile() {
  const { token } = useAuth();
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  const fetchProfile = useCallback(async () => {
    console.log("[useProfile] fetchProfile called");
    setLoading(true);
    setError(null);
    
    console.log("[useProfile] Token:", token ? "Present" : "Missing");
    
    if (!token) {
      console.warn("[useProfile] No token found! User needs to log in.");
      setError("Not logged in. Please log in first.");
      setLoading(false);
      return;
    }
    
    try {
      console.log("[useProfile] Calling getProfile with token");
      const result = await getProfile(token);
      console.log("[useProfile] Fetch result:", result);
      
      if (result.ok) {
        console.log("[useProfile] Success! Profile data:", result.data?.profile);
        setProfile(result.data?.profile ?? null);
      } else {
        console.error("[useProfile] Failed to fetch profile:", result.data);
        setError(result.data?.message || "Failed to fetch profile");
      }
    } catch (err) {
      console.error("[useProfile] Error:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, loading, error, refresh: fetchProfile };
}