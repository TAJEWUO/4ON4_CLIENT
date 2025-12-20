"use client";

import { ReactNode } from "react";

type Props = {
  title: string;
  step: number;
  children: ReactNode;
};

export default function WizardLayout({ title, step, children }: Props) {
  return (
    <div className="px-4 pt-6 pb-28 max-w-xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-lg font-semibold">
          Profile Setup — Step {step} of 4
        </h1>
        <p className="text-sm text-gray-500 mt-1">{title}</p>
      </div>

      {/* CONTENT — THIS WAS MISSING */}
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
}
