export default function Step3Legal({ profile, setProfile, onNext }: any) {
  return (
    <div className="space-y-4">
      <input placeholder="National ID / Passport"
        value={profile.idNumber}
        onChange={e => setProfile({ ...profile, idNumber: e.target.value })} />

      <input type="file"
        onChange={e => setProfile({ ...profile, idImage: e.target.files?.[0] })} />

      <input placeholder="TRA Number"
        value={profile.traNumber}
        onChange={e => setProfile({ ...profile, traNumber: e.target.value })} />

      <input placeholder="Driving License Number"
        value={profile.drivingLicense}
        onChange={e => setProfile({ ...profile, drivingLicense: e.target.value })} />

      <input placeholder="Years of Experience"
        value={profile.yearsOfExperience}
        onChange={e => setProfile({ ...profile, yearsOfExperience: e.target.value })} />

      <button onClick={onNext} className="btn-primary">
        Review →
      </button>
    </div>
  );
}
