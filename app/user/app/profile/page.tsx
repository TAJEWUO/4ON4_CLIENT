"use client";

import { User } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col items-center space-y-3">
        <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
          <User size={32} />
        </div>
        <h2 className="text-lg font-semibold">John Doe</h2>
        <p className="text-sm text-gray-500">john@doe.com</p>
      </div>

      <div className="space-y-2 text-sm">
        <p><strong>Phone:</strong> +254 XXX XXX XXX</p>
        <p><strong>Location:</strong> Nairobi</p>
        <p><strong>Status:</strong> Active</p>
      </div>
    </div>
  );
}
