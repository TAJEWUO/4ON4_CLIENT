import { Bot, Cloud } from "lucide-react";

export default function CloudAIPage() {
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-lg font-semibold">4ON4 Cloud & AI</h1>

      <div className="flex gap-4">
        <div className="flex-1 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
          <Bot size={40} />
        </div>
        <div className="flex-1 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
          <Cloud size={40} />
        </div>
      </div>

      <p className="text-sm text-gray-600">
        AI-powered tools and cloud services to support guides, trips, and logistics.
      </p>
    </div>
  );
}
