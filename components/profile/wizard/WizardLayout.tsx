"use client";

export default function WizardLayout({
  step,
  children,
  onBack,
}: {
  step: number;
  children: React.ReactNode;
  onBack?: () => void;
}) {
  return (
    <div className="min-h-screen bg-white p-4 flex flex-col">
      {/* Header */}
      <div className="mb-4 border-b pb-3">
        <div className="text-xs text-gray-500">Profile Setup</div>
        <div className="text-sm font-semibold">Step {step} of 4</div>
      </div>

      {/* Content */}
      <div className="flex-1">{children}</div>

      {/* Footer */}
      {step > 1 && (
        <button
          onClick={onBack}
          className="mt-4 text-sm text-gray-600"
        >
          ← Previous
        </button>
      )}
    </div>
  );
}
