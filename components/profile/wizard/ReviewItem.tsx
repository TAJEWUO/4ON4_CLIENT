"use client";

import React from "react";

type Props = {
  label: string;
  value?: React.ReactNode;
};

export default function ReviewItem({ label, value }: Props) {
  return (
    <div className="flex justify-between items-start">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-sm text-gray-900 text-right ml-4">{value ?? "-"}</div>
    </div>
  );
}