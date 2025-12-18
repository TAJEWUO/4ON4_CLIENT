export default function Step1Identity({ profile, setProfile, onNext }: any) {
  const valid =
    profile.firstName && profile.lastName && profile.phoneNumber;

  return (
    <div className="space-y-4">
      <input placeholder="First Name *" value={profile.firstName}
        onChange={e => setProfile({ ...profile, firstName: e.target.value })} />

      <input placeholder="Last Name *" value={profile.lastName}
        onChange={e => setProfile({ ...profile, lastName: e.target.value })} />

      <input placeholder="Other Name" value={profile.otherName}
        onChange={e => setProfile({ ...profile, otherName: e.target.value })} />

      <input placeholder="Phone Number *" value={profile.phoneNumber}
        onChange={e => setProfile({ ...profile, phoneNumber: e.target.value })} />

      <input placeholder="Email" value={profile.email}
        onChange={e => setProfile({ ...profile, email: e.target.value })} />

      <button disabled={!valid} onClick={onNext} className="btn-primary">
        Next →
      </button>
    </div>
  );
}
