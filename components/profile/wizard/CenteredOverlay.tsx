"use client";

import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function CenteredOverlay({ children }: Props) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white/5 rounded-lg p-6 text-center text-white max-w-xs w-full">
        {children}
      </div>
    </div>
  );
}