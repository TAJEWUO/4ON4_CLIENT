export default function Step4Review({ profile, onBack }: any) {
  return (
    <div className="space-y-4">
      <pre className="bg-gray-100 p-3 text-xs rounded">
        {JSON.stringify(profile, null, 2)}
      </pre>

      <button className="btn-primary">
        SAVE PROFILE
      </button>

      <button onClick={onBack} className="text-sm text-gray-500">
        ← Edit
      </button>
    </div>
  );
}
