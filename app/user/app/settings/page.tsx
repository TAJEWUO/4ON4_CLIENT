"use client";

import { ChevronRight, Lock, Phone, Mail, Bell, Globe, Moon, Shield, FileText, UserX } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="p-4 space-y-10 pb-24">
      <h1 className="text-lg font-semibold">Settings</h1>

      {/* ───────── ACCOUNT & SECURITY ───────── */}
      <Section title="Account & Security">
        <SettingItem icon={<Lock size={18} />} label="Change Password" />
        <SettingItem icon={<Phone size={18} />} label="Update Phone Number" />
        <SettingItem icon={<Mail size={18} />} label="Update Email Address" />
      </Section>

      {/* ───────── APP PREFERENCES ───────── */}
      <Section title="App Preferences">
        <SettingItem icon={<Bell size={18} />} label="Notifications" />
        <SettingItem icon={<Globe size={18} />} label="Language" />
        <SettingItem icon={<Moon size={18} />} label="Appearance" />
      </Section>

      {/* ───────── PRIVACY & LEGAL ───────── */}
      <Section title="Privacy & Legal">
        <SettingItem icon={<Shield size={18} />} label="Privacy Policy" />
        <SettingItem icon={<FileText size={18} />} label="Terms & Conditions" />
      </Section>

      {/* ───────── ACCOUNT ACTIONS ───────── */}
      <Section title="Account">
        <button className="w-full flex items-center justify-between py-3 text-sm text-red-600">
          <div className="flex items-center gap-3">
            <UserX size={18} />
            <span>Deactivate Account</span>
          </div>
        </button>
      </Section>
    </div>
  );
}

/* ───────── REUSABLE COMPONENTS ───────── */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold text-gray-700">{title}</h2>
      <div className="space-y-1">{children}</div>
    </section>
  );
}

function SettingItem({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button className="w-full flex items-center justify-between py-3 text-sm">
      <div className="flex items-center gap-3">
        {icon}
        <span>{label}</span>
      </div>
      <ChevronRight size={16} className="text-gray-400" />
    </button>
  );
}
