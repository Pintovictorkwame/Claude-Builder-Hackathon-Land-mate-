import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  FiMessageSquare,
  FiFileText,
  FiSettings,
  FiLogOut,
  FiShield,
  FiMenu,
  FiX,
} from "react-icons/fi";
import botLogoWhite from "@/assets/bot-logo-white.png";

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  mobileOpen,
  setMobileOpen,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isHovered, setIsHovered] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const currentTab = location.pathname.replace("/", "") || "chat";

  const navItems = [
    {
      id: "chat",
      icon: <FiMessageSquare className="w-5 h-5 flex-shrink-0" />,
      label: "Chat",
    },
    {
      id: "profile",
      icon: <FiSettings className="w-5 h-5 flex-shrink-0" />,
      label: "Profile",
    },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#1b4332] text-white overflow-hidden">
      <div className="flex items-center h-20 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center justify-center w-20 flex-shrink-0">
          <img
            src={botLogoWhite}
            alt="LandMate"
            className="w-8 h-8 object-contain"
          />
        </div>
        <span
          className={`font-display text-lg font-bold whitespace-nowrap transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-100 md:opacity-0 md:hidden"}`}
        >
          LandMate AI
        </span>
      </div>

      <nav className="flex-1 py-4 space-y-2 overflow-x-hidden">
        {navItems.map((item) => (
          <div className="px-3" key={item.id}>
            <button
              onClick={() => {
                navigate(`/${item.id}`);
                setMobileOpen(false);
              }}
              title={!isHovered ? item.label : undefined}
              className={`relative flex items-center w-full h-12 rounded-xl transition-all ${
                currentTab === item.id
                  ? "bg-white/20 text-white shadow-sm"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              <div className="flex items-center justify-center w-[56px] flex-shrink-0">
                {item.icon}
              </div>
              <span
                className={`whitespace-nowrap transition-opacity duration-300 font-medium text-sm ${isHovered ? "opacity-100" : "opacity-100 md:opacity-0 md:hidden"}`}
              >
                {item.label}
              </span>
            </button>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 flex flex-col py-4 overflow-hidden flex-shrink-0">
        <div className="flex items-center h-12 mb-2 px-3">
          <div className="flex items-center justify-center w-[56px] flex-shrink-0">
            <div
              className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-[#1b4332] font-bold text-sm shadow-sm cursor-pointer"
              title={user?.fullName || "Guest"}
            >
              {user
                ? user.fullName
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                : "G"}
            </div>
          </div>
          <div
            className={`flex flex-col min-w-0 transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-100 md:opacity-0 md:hidden"}`}
          >
            <p className="text-sm font-medium text-white truncate w-32 text-left">
              {user ? user.fullName : "Guest User"}
            </p>
          </div>
        </div>

        <div className="px-3">
          <button
            onClick={user ? handleLogout : () => navigate("/login")}
            title={!isHovered ? (user ? "Logout" : "Sign In") : undefined}
            className="flex items-center h-12 w-full rounded-xl text-white/60 hover:bg-white/10 hover:text-white transition-all"
          >
            <div className="flex items-center justify-center w-[56px] flex-shrink-0">
              {user ? (
                <FiLogOut className="w-5 h-5 flex-shrink-0" />
              ) : (
                <FiShield className="w-5 h-5 flex-shrink-0" />
              )}
            </div>
            <span
              className={`whitespace-nowrap transition-opacity duration-300 font-medium text-sm ${isHovered ? "opacity-100" : "opacity-100 md:opacity-0 md:hidden"}`}
            >
              {user ? "Log out" : "Sign In"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="hidden md:block fixed top-0 left-0 h-screen z-40 transition-all duration-300 ease-in-out border-r border-[#1b4332]"
        style={{ width: isHovered ? "240px" : "80px" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-[#1b4332] transition-transform shadow-xl">
            <div
              className="absolute right-4 top-6 z-50 cursor-pointer text-white/70 hover:text-white"
              onClick={() => setMobileOpen(false)}
            >
              <FiX className="w-6 h-6" />
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
};
