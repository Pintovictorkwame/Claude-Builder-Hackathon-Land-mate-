import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiLock,
  FiArrowLeft,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { useLandMate } from "@/context/LandMateContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import botLogo from "@/assets/bot-logo.png";
import botLogoWhite from "@/assets/bot-logo-white.png";
import authBg from "@/assets/auth-bg.png";

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { setScreen } = useLandMate();
  const { signup, login } = useAuth();
  const { toast } = useToast();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }
    if (password.length < 6) {
      toast({
        title: "Weak password",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    const success = await signup(fullName, email, password);
    setLoading(false);
    if (success) {
      toast({ title: "Account created!", description: "Welcome to LandMate." });
      navigate("/chat");
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden">
        <img
          src={authBg}
          alt="Premium Land Intelligence"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-forest-dark/40 backdrop-blur-[2px]" />
        <div className="absolute bottom-[-60px] left-[-60px] w-[300px] h-[300px] rounded-full bg-gold/5 blur-2xl" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center relative z-10 px-12"
        >
          <img
            src={botLogoWhite}
            alt="LandMate"
            className="w-28 h-28 mx-auto mb-6 object-contain drop-shadow-lg"
            width={112}
            height={112}
          />
          <h2 className="text-3xl font-display font-bold text-primary-foreground mb-3">
            Join LandMate
          </h2>
          <p className="text-primary-foreground/70 max-w-sm mx-auto">
            Create your free account and start protecting your land investments
            with AI-powered intelligence.
          </p>
        </motion.div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8"
          >
            <FiArrowLeft className="w-4 h-4" /> Back to home
          </button>

          <div className="lg:hidden flex items-center gap-2 mb-6">
            <img
              src={botLogo}
              alt="LandMate"
              className="w-8 h-8"
              width={32}
              height={32}
            />
            <span className="font-display font-bold text-lg text-foreground">
              LandMate
            </span>
          </div>

          <h1 className="text-2xl font-display font-bold text-foreground mb-1">
            Create your account
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            Get started with free AI document analysis
          </p>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Full Name
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Kwame Asante"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-10 py-5 rounded-xl"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 py-5 rounded-xl"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 py-5 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <FiEyeOff className="w-4 h-4" />
                  ) : (
                    <FiEye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full gradient-gold text-forest-dark font-semibold py-5 rounded-xl shadow-gold hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-primary font-semibold hover:underline"
            >
              Log in
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupPage;
