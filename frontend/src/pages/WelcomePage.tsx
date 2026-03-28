import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FiShield,
  FiArrowRight,
  FiFileText,
  FiAlertTriangle,
  FiMap,
  FiZap,
  FiCheck,
  FiStar,
} from "react-icons/fi";
import { useLandMate } from "@/context/LandMateContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import botLogo from "@/assets/bot-logo.png";
import botLogoWhite from "@/assets/bot-logo-white.png";

const features = [
  {
    icon: <FiFileText className="w-5 h-5" />,
    title: "Document Analysis",
    desc: "AI-powered plain-language summaries of complex land documents",
  },
  {
    icon: <FiAlertTriangle className="w-5 h-5" />,
    title: "Fraud Detection",
    desc: "Instantly spot red flags, forgeries, and missing elements",
  },
  {
    icon: <FiMap className="w-5 h-5" />,
    title: "Process Guide",
    desc: "Step-by-step guidance through GLC registration processes",
  },
  {
    icon: <FiZap className="w-5 h-5" />,
    title: "Form Assistant",
    desc: "Smart field-by-field help completing official forms",
  },
];

const stats = [
  { value: "10K+", label: "Documents Analyzed" },
  { value: "98%", label: "Accuracy Rate" },
  { value: "5min", label: "Avg. Analysis Time" },
];

const testimonials = [
  {
    name: "Ama Mensah",
    role: "Property Buyer, Accra",
    text: "LandMate caught a forged signature on my indenture that I would have never noticed. Saved me millions of cedis.",
  },
  {
    name: "Kofi Boateng",
    role: "Real Estate Agent",
    text: "I use LandMate for every transaction now. The AI analysis is faster and more thorough than manual review.",
  },
];

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const { setScreen } = useLandMate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={botLogo}
              alt="LandMate"
              className="w-8 h-8"
              width={32}
              height={32}
            />
            <span className="font-display font-bold text-lg text-foreground">
              Land<span className="text-gradient-gold">Mate</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Button
                onClick={() => navigate("/chat")}
                size="sm"
                className="gradient-gold text-forest-dark font-semibold shadow-gold hover:opacity-90"
              >
                Go to Chat
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/login")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Log in
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate("/signup")}
                  className="gradient-gold text-forest-dark font-semibold shadow-gold hover:opacity-90"
                >
                  Sign up
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="gradient-hero pt-28 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-[-100px] right-[-80px] w-[400px] h-[400px] rounded-full bg-gold/10 blur-3xl" />
        <div className="absolute bottom-[-60px] left-[-60px] w-[300px] h-[300px] rounded-full bg-gold/5 blur-2xl" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-3xl mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-6 "
          >
            <img
              src={botLogoWhite}
              alt="LandMate AI Agent"
              className="w-24 h-24 mx-auto object-contain drop-shadow-lg"
              width={96}
              height={96}
            />
          </motion.div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 mb-6">
            <FiZap className="w-3.5 h-3.5 text-gold" />
            <span className="text-xs font-medium text-primary-foreground/80">
              AI-Powered Land Document Intelligence
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-display font-bold text-primary-foreground mb-5 leading-tight">
            Your AI Agent for
            <br />
            <span className="text-gradient-gold">Ghana Land</span> Documents
          </h1>

          <p className="text-lg md:text-xl text-primary-foreground/75 mb-8 max-w-xl mx-auto font-body leading-relaxed">
            Understand documents, detect fraud, navigate Lands Commission
            processes — all in plain language, powered by AI.
          </p>

          <div className="flex flex-col items-center sm:flex-row gap-4 mb-4 justify-center">
            <Button
              onClick={() => navigate("/chat")}
              className="gradient-gold text-forest-dark font-bold py-7 px-8 rounded-2xl shadow-gold hover:opacity-90 transition-all text-lg"
            >
              Start Analysis
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/login")}
              className="border-primary/30 text-primary-foreground font-bold py-7 px-8 rounded-2xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all text-lg"
            >
              Log In to Portal
            </Button>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-8 mt-12">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.15 }}
                className="text-center"
              >
                <div className="text-2xl md:text-3xl font-display font-bold text-gold">
                  {s.value}
                </div>
                <div className="text-xs text-primary-foreground/60 mt-1">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
              Everything You Need for{" "}
              <span className="text-gradient-gold">Land Security</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Four powerful AI tools designed specifically for Ghana's land
              documentation system.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-forest transition-all group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center text-primary-foreground mb-4 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-lg font-display font-bold text-foreground mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-card">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
              How It Works
            </h2>
            <p className="text-muted-foreground">
              Three simple steps to secure your land transactions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Upload Document",
                desc: "Take a photo or upload your PDF — we support indentures, title deeds, leases, and GLC forms.",
              },
              {
                step: "02",
                title: "AI Analyzes",
                desc: "Our AI agent reads, interprets, and cross-references your document against known patterns.",
              },
              {
                step: "03",
                title: "Get Results",
                desc: "Receive a clear summary, risk assessment, and actionable next steps in your preferred language.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-full gradient-gold text-forest-dark flex items-center justify-center mx-auto mb-4 text-xl font-display font-bold shadow-gold">
                  {item.step}
                </div>
                <h3 className="font-display font-bold text-foreground text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-display font-bold text-foreground text-center mb-12"
          >
            Trusted by <span className="text-gradient-gold">Thousands</span>
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, x: i === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl bg-card border border-border"
              >
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <FiStar key={j} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-foreground mb-4 text-sm leading-relaxed italic">
                  "{t.text}"
                </p>
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    {t.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto gradient-hero rounded-3xl p-10 md:p-14 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-[200px] h-[200px] rounded-full bg-gold/10 blur-3xl" />
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-4 relative z-10">
            Ready to Protect Your Land?
          </h2>
          <p className="text-primary-foreground/70 mb-8 max-w-md mx-auto relative z-10">
            Join thousands of Ghanaians using AI to secure their property
            rights. Free, no registration required.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center relative z-10">
            <Button
              onClick={() => navigate("/chat")}
              className="gradient-gold text-forest-dark font-semibold text-lg px-8 py-6 rounded-xl shadow-gold hover:opacity-90"
            >
              Start Analyzing <FiArrowRight className="ml-2" />
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/signup")}
              className="border-primary-foreground/30 text-primary-foreground bg-transparent hover:bg-primary-foreground/10 text-lg px-8 py-6 rounded-xl"
            >
              Create Free Account
            </Button>
          </div>

          <div className="flex justify-center gap-6 mt-8 relative z-10">
            {["No credit card", "Instant results", "Multi-language"].map(
              (t) => (
                <span
                  key={t}
                  className="flex items-center gap-1.5 text-xs text-primary-foreground/60"
                >
                  <FiCheck className="w-3.5 h-3.5 text-gold" /> {t}
                </span>
              ),
            )}
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img
              src={botLogo}
              alt="LandMate"
              className="w-6 h-6"
              width={24}
              height={24}
              loading="lazy"
            />
            <span className="font-display font-bold text-sm text-foreground">
              LandMate
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2026 LandMate. AI-powered land document intelligence for Ghana.
          </p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span className="hover:text-foreground cursor-pointer">
              Privacy
            </span>
            <span className="hover:text-foreground cursor-pointer">Terms</span>
            <span className="hover:text-foreground cursor-pointer">
              Contact
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WelcomePage;
