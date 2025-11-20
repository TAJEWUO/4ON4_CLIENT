"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import UserHeader from "@/components/user-header";
import SideMenu from "@/components/side-menu";
import MyVehicles from "@/components/my-vehicles";
import UserWidgets from "@/components/user-widgets";
import MySafaris from "@/components/my-safaris";
import UserFooter from "@/components/user-footer";
import AuthModal from "@/components/auth-modal";

import { apiGetProfile, apiGetVehicles } from "@/lib/api";

export default function UserDashboard() {
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [userProfile, setUserProfile] = useState<any>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [safaris, setSafaris] = useState<any[]>([]);

  const [showAuthModal, setShowAuthModal] = useState(false);

  // ----------------------------
  // LOAD USER DATA FROM BACKEND
  // ----------------------------
  useEffect(() => {
    const load = async () => {
      const userId = localStorage.getItem("fouron4_user_id");
      if (!userId) return;

      setIsLoggedIn(true);

      // Fetch user profile
      const p = await apiGetProfile(userId);
      if (p.success) setUserProfile(p.user);

      // Fetch vehicles
      const v = await apiGetVehicles(userId);
      if (v.success) setVehicles(v.vehicles);
    };

    load();
  }, []);

  // ----------------------------
  // AFTER LOGIN SUCCESS
  // ----------------------------
  const handleAuthSuccess = (user: any) => {
    localStorage.setItem("fouron4_user_id", user._id);
    setUserProfile(user);
    setIsLoggedIn(true);
    setShowAuthModal(false);

    router.push("/user/dashboard");
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      
      {/* HEADER */}
      <UserHeader
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        userName={
          userProfile
            ? `${userProfile.firstName || ""} ${userProfile.lastName || ""}`
            : "User"
        }
        isLoggedIn={isLoggedIn}
        onLoginClick={() => setShowAuthModal(true)}
      />

      <div className="flex flex-1">
        
        {/* SIDE MENU */}
        {menuOpen && isLoggedIn && (
          <SideMenu
            onClose={() => setMenuOpen(false)}
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            vehicles={vehicles}
            setVehicles={setVehicles}
          />
        )}

        {/* MAIN PAGE CONTENT */}
        <main className="flex-1 p-6 md:p-8 space-y-6">
          
          {/* VEHICLES */}
          <MyVehicles
            vehicles={vehicles}
            setVehicles={setVehicles}
            isLoggedIn={isLoggedIn}
            onLoginClick={() => setShowAuthModal(true)}
          />

          {/* WIDGETS (unchanged) */}
          <UserWidgets safaris={safaris} setSafaris={setSafaris} />

          {/* SAFARI LIST */}
          <MySafaris
            safaris={safaris}
            setSafaris={setSafaris}
            isLoggedIn={isLoggedIn}
            onLoginClick={() => setShowAuthModal(true)}
          />

        </main>
      </div>

      <UserFooter />

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} onSuccess={handleAuthSuccess} />
      )}
    </div>
  );
}
