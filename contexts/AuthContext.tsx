"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type AuthContextType = {
  token: string | null;
  userId: string | null;
  setAuth: (token: string, userId: string) => void;
  clearAuth: () => void;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
  userId: null,
  setAuth: () => {},
  clearAuth: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    console.log("[AuthContext] Token changed:", token ? "Present" : "None");
    console.log("[AuthContext] UserId:", userId);
  }, [token, userId]);

  const setAuth = (newToken: string, newUserId: string) => {
    console.log("[AuthContext] Setting auth - userId:", newUserId);
    console.log("[AuthContext] Setting auth - token:", newToken ? "Present" : "None");
    setToken(newToken);
    setUserId(newUserId);
  };

  const clearAuth = () => {
    console.log("[AuthContext] Clearing auth");
    setToken(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ token, userId, setAuth, clearAuth }}>
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
