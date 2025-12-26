"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { refreshToken as refreshTokenAPI } from "@/lib/auth-api";

type AuthContextType = {
  token: string | null;
  userId: string | null;
  setAuth: (token: string, userId: string) => void;
  clearAuth: () => void;
  refreshAccessToken: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
  userId: null,
  setAuth: () => {},
  clearAuth: () => {},
  refreshAccessToken: async () => false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Initialize from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("fouron4_access");
    const storedUserId = localStorage.getItem("fouron4_user_id");
    
    if (storedToken && storedUserId) {
      console.log("[AuthContext] Initializing from localStorage");
      setToken(storedToken);
      setUserId(storedUserId);
    }
  }, []);

  // Listen for token refresh events from apiClient
  useEffect(() => {
    const handleTokenRefresh = (event: CustomEvent) => {
      const { token: newToken, userId: newUserId } = event.detail;
      console.log("[AuthContext] Token refreshed via event, updating state");
      setToken(newToken);
      setUserId(newUserId);
    };

    window.addEventListener("tokenRefreshed", handleTokenRefresh as EventListener);
    
    return () => {
      window.removeEventListener("tokenRefreshed", handleTokenRefresh as EventListener);
    };
  }, []);

  useEffect(() => {
    console.log("[AuthContext] Token changed:", token ? "Present" : "None");
    console.log("[AuthContext] UserId:", userId);
  }, [token, userId]);

  const setAuth = (newToken: string, newUserId: string) => {
    console.log("[AuthContext] Setting auth - userId:", newUserId);
    console.log("[AuthContext] Setting auth - token:", newToken ? "Present" : "None");
    
    // Save to both state and localStorage
    localStorage.setItem("fouron4_access", newToken);
    localStorage.setItem("fouron4_user_id", newUserId);
    
    setToken(newToken);
    setUserId(newUserId);
  };

  const clearAuth = () => {
    console.log("[AuthContext] Clearing auth");
    
    // Clear both state and localStorage
    localStorage.removeItem("fouron4_access");
    localStorage.removeItem("fouron4_user_id");
    localStorage.removeItem("fouron4_refresh");
    
    setToken(null);
    setUserId(null);
  };

  const refreshAccessToken = async (): Promise<boolean> => {
    try {
      console.log("[AuthContext] Attempting to refresh token");
      const { ok, data } = await refreshTokenAPI();
      
      if (ok && data?.accessToken) {
        console.log("[AuthContext] Token refreshed successfully");
        const currentUserId = localStorage.getItem("fouron4_user_id");
        if (currentUserId) {
          setAuth(data.accessToken, currentUserId);
          return true;
        }
      }
      
      console.log("[AuthContext] Token refresh failed");
      clearAuth();
      return false;
    } catch (error) {
      console.error("[AuthContext] Token refresh error:", error);
      clearAuth();
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ token, userId, setAuth, clearAuth, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  console.log("[useAuth] Called - token:", context.token ? "Present" : "None");
  return context;
}
