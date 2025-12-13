// lib/utils/storage.ts

export function getUserId(): string | null {
  if (typeof window === "undefined") return null;

  try {
    return localStorage.getItem("userId");
  } catch {
    return null;
  }
}

export function setUserId(userId: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("userId", userId);
}

export function clearUserId() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("userId");
}
