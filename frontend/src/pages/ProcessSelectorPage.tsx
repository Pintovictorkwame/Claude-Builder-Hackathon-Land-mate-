import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiArrowLeft, FiArrowRight, FiClock, FiDollarSign, FiAlertTriangle } from 'react-icons/fi';
import { useLandMate } from '@/context/LandMateContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { RiskLevel } from '@/context/LandMateContext';

interface GlcProcess {
  id: string;
  name: string;
  description: string;
  duration: string;
  cost: string;
  risk: RiskLevel;
  category: string;
}

const processes: GlcProcess[] = [
  { id: '1', name: 'Land Title Registration', description: 'Register your land at the Land Title Registry', duration: '3-6 months', cost: 'GH₵ 500-2,000', risk: 'LOW', category: 'Ownership & Registration' },
  { id: '2', name: 'Indenture Registration', description: 'Register a land purchase indenture', duration: '2-4 months', cost: 'GH₵ 300-1,000', risk: 'LOW', category: 'Ownership & Registration' },
  { id: '3', name: 'Land Search', description: 'Verify land ownership and encumbrances', duration: '1-2 weeks', cost: 'GH₵ 100-300', risk: 'LOW', category: 'Ownership & Registration' },
  { id: '4', name: 'Stamp Duty Payment', description: 'Pay stamp duty on your indenture', duration: '1-3 days', cost: '0.5% of property value', risk: 'MEDIUM', category: 'Document & Stamping' },
  { id: '5', name: 'Deed Registration', description: 'Register a deed at the Deeds Registry', duration: '1-3 months', cost: 'GH₵ 200-800', risk: 'LOW', category: 'Document & Stamping' },
  { id: '6', name: 'Consent to Assign (Stool Land)', description: 'Obtain consent from stool for land transfer', duration: '1-3 months', cost: 'Varies by stool', risk: 'HIGH', category: 'Special Land Types' },
  { id: '7', name: 'Vested Land Application', description: 'Apply for allocation of government vested land', duration: '3-12 months', cost: 'GH₵ 1,000+', risk: 'MEDIUM', category: 'Special Land Types' },
  { id: '8', name: 'Lease Renewal', description: 'Renew an expiring land lease', duration: '2-6 months', cost: 'GH₵ 500-1,500', risk: 'MEDIUM', category: 'Ownership & Registration' },
  { id: '9', name: 'Land Dispute Resolution', description: 'Resolve competing land ownership claims', duration: '6-24 months', cost: 'Varies', risk: 'HIGH', category: 'Disputes & Corrections' },
  { id: '10', name: 'Boundary Adjustment', description: 'Correct or adjust land boundaries officially', duration: '2-4 months', cost: 'GH₵ 300-1,000', risk: 'MEDIUM', category: 'Disputes & Corrections' },
];

const riskColors: Record<RiskLevel, string> = {
  HIGH: 'bg-risk-high/15 text-risk-high',
  MEDIUM: 'bg-risk-medium/15 text-risk-medium',
  LOW: 'bg-risk-low/15 text-risk-low',
};

const ProcessSelectorPage: React.FC = () => {
  const navigate = useNavigate();
  const { setDocumentText, setFileName } = useLandMate();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = processes.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const categories = [...new Set(filtered.map(p => p.category))];

  const handleContinue = () => {
    if (!selected) return;
    const process = processes.find(p => p.id === selected);
    if (process) {
      setDocumentText(process.name);
      setFileName(process.name);
    }
    navigate('/processing');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-hero px-6 pt-12 pb-8">
        <button onClick={() => navigate('/mode-selector')} className="text-primary-foreground/70 hover:text-primary-foreground mb-4 flex items-center gap-1 text-sm">
          <FiArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-2xl font-display font-bold text-primary-foreground">Select a GLC Process</h1>
        <p className="text-sm text-primary-foreground/70 mt-1">Choose the process you need guidance on</p>
      </div>

      <div className="px-6 -mt-4 pb-8 max-w-lg mx-auto">
        {/* Search */}
        <div className="relative mb-6">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search processes..."
            className="pl-10 bg-card border-border"
          />
        </div>

        {/* Process list */}
        <div className="space-y-6 mb-8">
          {categories.map(cat => (
            <div key={cat}>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{cat}</h3>
              <div className="space-y-2">
                {filtered.filter(p => p.category === cat).map((p, i) => (
                  <motion.button
                    key={p.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setSelected(p.id)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      selected === p.id ? 'border-primary bg-primary/5 shadow-forest' : 'border-border bg-card hover:border-primary/30'
                    }`}
                  >
                    <h4 className="font-semibold text-foreground text-sm">{p.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{p.description}</p>
                    <div className="flex gap-2 mt-3 flex-wrap">
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-muted text-muted-foreground">
                        <FiClock className="w-3 h-3" /> {p.duration}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-muted text-muted-foreground">
                        <FiDollarSign className="w-3 h-3" /> {p.cost}
                      </span>
                      <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full font-medium ${riskColors[p.risk]}`}>
                        {p.risk === 'HIGH' && <FiAlertTriangle className="w-3 h-3" />}
                        {p.risk} risk
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Button
          onClick={handleContinue}
          disabled={!selected}
          className="w-full gradient-gold text-forest-dark font-semibold py-6 rounded-xl shadow-gold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
        >
          Continue
          <FiArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default ProcessSelectorPage;
