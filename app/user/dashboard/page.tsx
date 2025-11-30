"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import UserHeader from "@/components/user-header";
import SideMenu from "@/components/side-menu";
import MyVehicles from "@/components/my-vehicles";
import UserWidgets from "@/components/user-widgets";
import MySafaris from "@/components/my-safaris";
import UserFooter from "@/components/user-footer";

import AddVehicleModal from "@/components/ui/add-vehicle-modal";

import { apiGetProfile, apiGetVehicles } from "@/lib/api";

export default function UserDashboard() {
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [userProfile, setUserProfile] = useState<any>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [safaris, setSafaris] = useState<any[]>([]);

  const [addVehicleOpen, setAddVehicleOpen] = useState(false);

  // Listen for vehicle modal open events
  useEffect(() => {
    function openModal() {
      setAddVehicleOpen(true);
    }
    window.addEventListener("openAddVehicleModal", openModal);
    return () => window.removeEventListener("openAddVehicleModal", openModal);
  }, []);

  // Load user data, enforce login
  useEffect(() => {
    const load = async () => {
      const userId = localStorage.getItem("fouron4_user_id");
      if (!userId) {
        router.push("/user/auth/login");
        return;
      }

      setIsLoggedIn(true);

      const p = await apiGetProfile(userId);
      if (p.success) setUserProfile(p.user);

      const v = await apiGetVehicles(userId);
      if (v.success) setVehicles(v.vehicles);
    };

    load();
  }, [router]);

  const goToLogin = () => {
    router.push("/user/auth/login");
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <UserHeader
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        userName={
          userProfile
            ? `${userProfile.firstName || ""} ${userProfile.lastName || ""}`
            : "User"
        }
        isLoggedIn={isLoggedIn}
        onLoginClick={goToLogin}
      />

      <div className="flex flex-1">
        {menuOpen && isLoggedIn && (
          <SideMenu
            onClose={() => setMenuOpen(false)}
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            vehicles={vehicles}
            setVehicles={setVehicles}
          />
        )}

        <main className="flex-1 p-6 md:p-8 space-y-6">
          <MyVehicles
            vehicles={vehicles}
            setVehicles={setVehicles}
            isLoggedIn={isLoggedIn}
            onLoginClick={goToLogin}
          />

          <UserWidgets safaris={safaris} setSafaris={setSafaris} />

          <MySafaris
            safaris={safaris}
            setSafaris={setSafaris}
            isLoggedIn={isLoggedIn}
            onLoginClick={goToLogin}
          />
        </main>
      </div>

      <UserFooter />

      <AddVehicleModal
        open={addVehicleOpen}
        onClose={() => setAddVehicleOpen(false)}
        onSubmit={(data) => {
          const event = new CustomEvent("addVehicleFromDashboard", {
            detail: data,
          });
          window.dispatchEvent(event);
        }}
      />
    </div>
  );
}
