// app/user/dashboard/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { apiGetProfile, apiGetVehicles } from "@/lib/api";
import ProfileCard from "@/components/ProfileCard";
import VehicleCard from "@/components/VehicleCard";
import VehicleForm from "@/components/VehicleForm";
import { getUserId } from "@/utils/storage";

export default function DashboardPage() {
  const [profile, setProfile] = useState<any | null>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(()=> {
    const uid = getUserId();
    if (!uid) return;
    loadProfile(uid);
    loadVehicles(uid);
  },[]);

  async function loadProfile(uid: string) {
    const { ok, data } = await apiGetProfile(uid);
    if (ok) setProfile(data.profile || data);
  }

  async function loadVehicles(uid: string) {
    const { ok, data } = await apiGetVehicles(uid);
    if (ok) setVehicles(data.vehicles || data);
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <button className="px-3 py-1 bg-black text-white rounded" onClick={()=>setShowAdd(s=>!s)}>
          {showAdd ? "Close" : "Add Vehicle"}
        </button>
      </div>

      <section className="mt-6">
        <h2 className="text-lg font-medium">Profile</h2>
        <ProfileCard profile={profile} onReload={()=>{ const uid=getUserId(); if(uid) loadProfile(uid); }} />
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-medium">Your Vehicles</h2>
        {showAdd && <VehicleForm onSaved={() => { const uid=getUserId(); if(uid) loadVehicles(uid); setShowAdd(false); }} />}
        <div className="mt-4 space-y-3">
          {vehicles.length === 0 && <p>No vehicles yet.</p>}
          {vehicles.map(v => <VehicleCard key={v._id} vehicle={v} onDeleted={() => { const uid=getUserId(); if(uid) loadVehicles(uid); }} />)}
        </div>
      </section>
    </div>
  );
}
