import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiFileText, FiAlertTriangle, FiMap, FiEdit3, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { useLandMate, AppMode, Language } from '@/context/LandMateContext';
import { Button } from '@/components/ui/button';

const modes: { id: AppMode; title: string; desc: string; icon: React.ReactNode; template: string }[] = [
  { id: 'explain', title: 'Explain My Document', desc: 'Get a plain-language summary of your land document', icon: <FiFileText className="w-6 h-6" />, template: 'Template A' },
  { id: 'redFlags', title: 'Check for Red Flags', desc: 'Detect fraud risks and missing elements', icon: <FiAlertTriangle className="w-6 h-6" />, template: 'Template B' },
  { id: 'processGuide', title: 'Guide Me Through a Process', desc: 'Step-by-step GLC process guidance', icon: <FiMap className="w-6 h-6" />, template: 'Template C' },
  { id: 'formAssist', title: 'Help Me Fill a Form', desc: 'Field-by-field form completion help', icon: <FiEdit3 className="w-6 h-6" />, template: 'Template D' },
];

const languages: { id: Language; label: string; flag: string }[] = [
  { id: 'english', label: 'English', flag: '🇬🇧' },
  { id: 'twi', label: 'Twi', flag: '🇬🇭' },
  { id: 'pidgin', label: 'Pidgin', flag: '🇳🇬' },
];

const ModeSelectorPage: React.FC = () => {
  const navigate = useNavigate();
  const { mode, setMode, language, setLanguage } = useLandMate();

  const handleContinue = () => {
    if (!mode) return;
    if (mode === 'processGuide') {
      navigate('/process-selector');
    } else {
      navigate('/upload');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-hero px-6 pt-12 pb-8">
        <button onClick={() => navigate('/chat')} className="text-primary-foreground/70 hover:text-primary-foreground mb-4 flex items-center gap-1 text-sm">
          <FiArrowLeft className="w-4 h-4" /> Back to Chat
        </button>
        <h1 className="text-2xl font-display font-bold text-primary-foreground">What would you like to do?</h1>
        <p className="text-sm text-primary-foreground/70 mt-1">Select one option to get started</p>
      </div>

      <div className="px-6 -mt-4 pb-8 max-w-lg mx-auto">
        {/* Mode cards */}
        <div className="space-y-3 mb-8">
          {modes.map((m, i) => (
            <motion.button
              key={m.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setMode(m.id)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                mode === m.id
                  ? 'border-primary bg-primary/5 shadow-forest'
                  : 'border-border bg-card hover:border-primary/30'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-lg ${mode === m.id ? 'gradient-hero text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  {m.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{m.title}</h3>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">{m.template}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{m.desc}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Language selector */}
        <div className="mb-8">
          <p className="text-sm font-medium text-foreground mb-3">Response Language</p>
          <div className="flex gap-2">
            {languages.map(l => (
              <button
                key={l.id}
                onClick={() => setLanguage(l.id)}
                className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                  language === l.id
                    ? 'gradient-hero text-primary-foreground shadow-forest'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {l.flag} {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Continue */}
        <Button
          onClick={handleContinue}
          disabled={!mode}
          className="w-full gradient-gold text-forest-dark font-semibold py-6 rounded-xl shadow-gold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
        >
          Continue
          <FiArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default ModeSelectorPage;
