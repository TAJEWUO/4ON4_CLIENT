const LANGS = ["English","Kiswahili","German","French","Spanish","Portuguese","Korean","Mandarin","Japanese","Russian","Latvian"];

export default function Step2Professional({ profile, setProfile, onNext }: any) {
  return (
    <div className="space-y-4">
      <select value={profile.guidingLevel}
        onChange={e => setProfile({ ...profile, guidingLevel: e.target.value })}>
        <option value="">Guiding Level</option>
        <option value="GOLD">Gold</option>
        <option value="SILVER">Silver</option>
        <option value="BRONZE">Bronze</option>
      </select>

      <div className="space-y-2">
        <p className="text-sm">Languages *</p>
        {LANGS.map(l => (
          <label key={l} className="block">
            <input
              type="checkbox"
              checked={profile.languages.includes(l)}
              onChange={() =>
                setProfile({
                  ...profile,
                  languages: profile.languages.includes(l)
                    ? profile.languages.filter((x: string) => x !== l)
                    : [...profile.languages, l],
                })
              }
            /> {l}
          </label>
        ))}
      </div>

      <input placeholder="Level of Education"
        value={profile.education}
        onChange={e => setProfile({ ...profile, education: e.target.value })} />

      <button disabled={!profile.languages.length} onClick={onNext} className="btn-primary">
        Next →
      </button>
    </div>
  );
}
