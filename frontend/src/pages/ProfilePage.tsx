import React, { useState } from "react";
import {
  FiUser,
  FiLock,
  FiBell,
  FiCheckCircle,
  FiSettings,
  FiCamera,
  FiArrowRight,
  FiMenu,
} from "react-icons/fi";
import { Sidebar } from "@/components/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileSubTab, setProfileSubTab] = useState<
    "profile" | "password" | "notifications" | "verification"
  >("profile");

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <Sidebar mobileOpen={sidebarOpen} setMobileOpen={setSidebarOpen} />

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 md:ml-[80px] h-screen">
        {/* Mobile header */}
        <div className="md:hidden flex-shrink-0 flex items-center justify-between p-4 border-b border-border">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-foreground"
          >
            <FiMenu className="w-6 h-6" />
          </button>
          <span className="font-display font-bold text-foreground text-lg uppercase tracking-tight">
            LandMate AI
          </span>
          <div className="w-6" />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden w-full max-w-5xl mx-auto p-6 md:p-8 overflow-y-auto">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Main Content */}
            <div className="flex-1 bg-white border border-border rounded-3xl p-6 md:p-10 shadow-sm">
              {profileSubTab === "profile" ? (
                <div className="space-y-8">
                  {/* Avatar Section */}
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-border">
                        {user?.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full gradient-gold flex items-center justify-center text-forest-dark font-bold text-2xl uppercase">
                            {user?.fullName?.[0] || "G"}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Personal Information Form */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                    {/* Name and Email */}
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-primary flex items-center gap-1">
                        User Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        defaultValue={user?.fullName || ""}
                        placeholder="Full name"
                        className="bg-muted/50 border-none rounded-2xl h-14 px-4 focus-visible:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-primary">
                        Email Address
                      </Label>
                      <Input
                        defaultValue={user?.email || ""}
                        placeholder="examples@gmail.com"
                        readOnly
                        className="bg-muted/50 border-none rounded-2xl h-14 px-4 opacity-70"
                      />
                    </div>

                    {/* Phone and Gender */}
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-primary flex items-center gap-1">
                        Phone Number <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pr-2 border-r border-border h-1/2">
                          <span className="text-lg">🇬🇭</span>
                          <FiArrowRight className="w-3 h-3 text-muted-foreground rotate-90" />
                        </span>
                        <Input
                          defaultValue={
                            user?.phone?.replace("+233", "").trim() || ""
                          }
                          placeholder="024 123 4567"
                          className="bg-muted/50 border-none rounded-2xl h-14 pl-20 px-4 focus-visible:ring-primary/20"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-primary">
                        Gender
                      </Label>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-2 border border-border rounded-2xl px-5 py-4 bg-muted/50 flex-1 cursor-pointer hover:border-primary/30 transition-all">
                          <input
                            type="radio"
                            name="gender"
                            id="male"
                            className="w-4 h-4 accent-primary"
                            defaultChecked
                          />
                          <Label
                            htmlFor="male"
                            className="cursor-pointer font-medium text-foreground"
                          >
                            Male
                          </Label>
                        </div>
                        <div className="flex items-center gap-2 border border-border rounded-2xl px-5 py-4 bg-muted/50 flex-1 cursor-pointer hover:border-primary/30 transition-all">
                          <input
                            type="radio"
                            name="gender"
                            id="female"
                            className="w-4 h-4 accent-primary"
                          />
                          <Label
                            htmlFor="female"
                            className="cursor-pointer font-medium text-foreground"
                          >
                            Female
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button
                      onClick={() =>
                        toast.success("Profile updated successfully!")
                      }
                      className="bg-primary hover:bg-primary/90 text-white shadow-forest rounded-xl px-12 h-14 font-bold text-base transition-all"
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-primary mb-6">
                    <FiSettings className="w-10 h-10 animate-spin-slow" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary mb-2">
                    {profileSubTab.charAt(0).toUpperCase() +
                      profileSubTab.slice(1)}{" "}
                    Settings
                  </h3>
                  <p className="text-muted-foreground max-w-xs">
                    Settings for {profileSubTab} are currently being developed
                    and will be available shortly.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
