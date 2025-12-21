// hooks/use-toast.tsx
"use client";

import { useEffect, useState } from "react";

type ToastItem = {
  id: string;
  title?: string;
  description?: string;
  action?: any;
  duration?: number;
};

// simple global store + listeners
let toastsStore: ToastItem[] = [];
let listeners: Array<(ts: ToastItem[]) => void> = [];

function notify() {
  listeners.forEach((l) => {
    try {
      l(toastsStore);
    } catch (e) {
      // ignore listener errors
    }
  });
}

export function addToast(input: Omit<ToastItem, "id">) {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const item: ToastItem = { id, ...input };
  toastsStore = [...toastsStore, item];
  notify();

  // auto-remove after duration if provided
  if (item.duration && item.duration > 0) {
    setTimeout(() => removeToast(id), item.duration);
  }
  return id;
}

export function removeToast(id: string) {
  toastsStore = toastsStore.filter((t) => t.id !== id);
  notify();
}

export function clearToasts() {
  toastsStore = [];
  notify();
}

/**
 * useToast hook — named export
 * returns { toasts, addToast, removeToast, clearToasts }
 */
export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>(toastsStore);

  useEffect(() => {
    const listener = (ts: ToastItem[]) => setToasts(ts);
    listeners.push(listener);
    // sync initial state
    setToasts(toastsStore);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  return {
    toasts,
    addToast,
    removeToast,
    clearToasts,
  };
}