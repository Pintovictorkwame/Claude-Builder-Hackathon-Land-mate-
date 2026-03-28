import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiChevronDown, FiChevronUp, FiAlertTriangle, FiCheckCircle, FiCalendar, FiSend, FiRefreshCw, FiShare2 } from 'react-icons/fi';
import { useLandMate } from '@/context/LandMateContext';
import type { RiskLevel, ChatMessage } from '@/context/LandMateContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { toast } from 'sonner';

type TabId = 'results' | 'redFlags' | 'nextSteps' | 'askLandmate';

const tabs: { id: TabId; label: string }[] = [
  { id: 'results', label: 'Results' },
  { id: 'redFlags', label: 'Red Flags' },
  { id: 'nextSteps', label: 'Next Steps' },
  { id: 'askLandmate', label: 'Ask LandMate' },
];

const severityColors: Record<RiskLevel, { bg: string; text: string; badge: string }> = {
  HIGH: { bg: 'bg-risk-high/10', text: 'text-risk-high', badge: 'bg-risk-high text-primary-foreground' },
  MEDIUM: { bg: 'bg-risk-medium/10', text: 'text-risk-medium', badge: 'bg-risk-medium text-primary-foreground' },
  LOW: { bg: 'bg-risk-low/10', text: 'text-risk-low', badge: 'bg-risk-low text-primary-foreground' },
};

const ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const { results, fileName, docType, chatHistory, addChatMessage, resetSession } = useLandMate();
  const [activeTab, setActiveTab] = useState<TabId>('results');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({ summary: true });
  const [chatInput, setChatInput] = useState('');

  if (!results) return null;

  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const content = chatInput;
    const userMsg: ChatMessage = { role: 'user', content, timestamp: new Date() };
    addChatMessage(userMsg);
    setChatInput('');

    try {
      const res = await api.post('/chat', { message: content });
      if (res.success && res.data) {
        const botMsg: ChatMessage = {
          role: 'assistant',
          content: res.data.answer,
          timestamp: new Date(),
        };
        addChatMessage(botMsg);
      } else {
        throw new Error("Failed to get response");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to connect to LandMate AI.");
    }
  };

  const riskBadge = results.riskSummary?.includes('HIGH') ? 'HIGH' : results.riskSummary?.includes('MEDIUM') ? 'MEDIUM' : 'LOW';

  const suggestions = [
    'Is this land safe to buy?',
    'What documents do I need?',
    'How much will registration cost?',
    'Explain stamp duty to me',
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="gradient-hero px-6 pt-10 pb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-primary-foreground/60 truncate">{fileName}</p>
            <div className="flex items-center gap-2 mt-1">
              {docType && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-foreground/20 text-primary-foreground font-medium uppercase">
                  {docType}
                </span>
              )}
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${severityColors[riskBadge as RiskLevel].badge}`}>
                {riskBadge} RISK
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
          <Button onClick={() => navigate('/chat')} className="w-full gradient-gold text-forest-dark font-bold py-6 rounded-xl shadow-gold hover:opacity-90">
            Go to Chat
          </Button>
          <Button onClick={() => navigate('/mode-selector')} variant="outline" className="w-full border-primary/20 bg-background text-foreground py-6 rounded-xl hover:bg-muted font-semibold">
            Start New Analysis
          </Button>
        </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 -mb-4">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex-1 py-2.5 text-xs font-medium rounded-t-lg transition-all ${
                activeTab === t.id
                  ? 'bg-background text-foreground'
                  : 'text-primary-foreground/60 hover:text-primary-foreground/80'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'results' && (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-6 py-6 space-y-4">
              {/* Summary */}
              <CollapsibleSection title="Summary" expanded={expandedSections.summary} onToggle={() => toggleSection('summary')}>
                <p className="text-sm text-foreground/80 leading-relaxed">{results.summary}</p>
              </CollapsibleSection>

              {/* Key Points */}
              <CollapsibleSection title="Key Points" expanded={expandedSections.keyPoints} onToggle={() => toggleSection('keyPoints')}>
                <ol className="space-y-3">
                  {results.keyPoints?.map((point, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full gradient-hero text-primary-foreground flex items-center justify-center text-xs font-bold">{i + 1}</span>
                      <span className="text-foreground/80 leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ol>
              </CollapsibleSection>

              {/* Important Dates */}
              <CollapsibleSection title="Important Dates" expanded={expandedSections.dates} onToggle={() => toggleSection('dates')}>
                <div className="space-y-2">
                  {results.importantDates?.map((d, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                      <FiCalendar className="w-4 h-4 text-accent flex-shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">{d.label}</p>
                        <p className="text-sm font-medium text-foreground">{d.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleSection>

              <Disclaimer text={results.disclaimer} />
            </motion.div>
          )}

          {activeTab === 'redFlags' && (
            <motion.div key="redFlags" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-6 py-6 space-y-4">
              {/* Risk summary */}
              {results.redFlags && (
                <div className="p-4 rounded-xl bg-card border border-border">
                  <p className="text-sm font-medium text-foreground mb-3">Risk Summary</p>
                  <div className="flex gap-3">
                    {(['HIGH', 'MEDIUM', 'LOW'] as RiskLevel[]).map(level => {
                      const count = results.redFlags?.filter(f => f.severity === level).length || 0;
                      return (
                        <div key={level} className={`flex-1 p-3 rounded-lg text-center ${severityColors[level].bg}`}>
                          <p className={`text-2xl font-bold ${severityColors[level].text}`}>{count}</p>
                          <p className="text-[10px] text-muted-foreground uppercase">{level}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Red flag cards */}
              {results.redFlags?.map((flag, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-4 rounded-xl border-l-4 bg-card ${
                    flag.severity === 'HIGH' ? 'border-l-risk-high' : flag.severity === 'MEDIUM' ? 'border-l-risk-medium' : 'border-l-risk-low'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${severityColors[flag.severity].badge}`}>{flag.severity}</span>
                    <h4 className="text-sm font-semibold text-foreground">{flag.issue}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{flag.explanation}</p>
                  <div className="flex items-start gap-1.5 text-xs text-primary">
                    <FiCheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    <span>{flag.recommendation}</span>
                  </div>
                </motion.div>
              ))}

              {results.missingElements && results.missingElements.length > 0 && (
                <div className="p-4 rounded-xl bg-risk-medium/5 border border-risk-medium/20">
                  <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
                    <FiAlertTriangle className="w-4 h-4 text-risk-medium" /> Missing Elements
                  </p>
                  <ul className="space-y-1.5">
                    {results.missingElements.map((el, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-risk-medium" />
                        {el}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Disclaimer text={results.disclaimer} />
            </motion.div>
          )}

          {activeTab === 'nextSteps' && (
            <motion.div key="nextSteps" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-6 py-6">
              <div className="relative pl-8">
                {/* Vertical line */}
                <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-border" />
                <div className="space-y-6">
                  {results.nextSteps?.map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="relative"
                    >
                      <div className="absolute -left-5 w-6 h-6 rounded-full gradient-hero text-primary-foreground flex items-center justify-center text-xs font-bold border-2 border-background">
                        {i + 1}
                      </div>
                      <p className="text-sm text-foreground/80 leading-relaxed">{step}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="mt-6">
                <Disclaimer text={results.disclaimer} />
              </div>
            </motion.div>
          )}

          {activeTab === 'askLandmate' && (
            <motion.div key="askLandmate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-[calc(100vh-180px)]">
              {/* Pinned summary */}
              <div className="px-6 py-3 border-b border-border">
                <details className="text-xs">
                  <summary className="text-muted-foreground cursor-pointer font-medium">📄 Document Summary</summary>
                  <p className="mt-2 text-muted-foreground leading-relaxed">{results.summary}</p>
                </details>
              </div>

              {/* Chat messages */}
              <div className="flex-1 overflow-auto px-6 py-4 space-y-4">
                {chatHistory.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground mb-4">Ask anything about your document</p>
                  </div>
                )}
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-xl text-sm ${
                      msg.role === 'user'
                        ? 'gradient-hero text-primary-foreground rounded-br-sm'
                        : 'bg-card border border-border text-foreground rounded-bl-sm'
                    }`}>
                      {msg.role === 'assistant' && (
                        <p className="text-[10px] font-bold text-accent mb-1">LandMate</p>
                      )}
                      <p className="leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Suggestions */}
              {chatHistory.length === 0 && (
                <div className="px-6 pb-2 flex gap-2 overflow-x-auto">
                  {suggestions.map(s => (
                    <button
                      key={s}
                      onClick={() => { setChatInput(s); }}
                      className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full bg-muted text-muted-foreground hover:bg-muted/80 border border-border"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {/* Input bar */}
              <div className="px-6 py-3 border-t border-border flex gap-2">
                <Input
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your question..."
                  className="flex-1 bg-card border-border"
                  maxLength={500}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!chatInput.trim()}
                  className="gradient-gold text-forest-dark px-4 hover:opacity-90 disabled:opacity-40"
                >
                  <FiSend className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Reusable collapsible section
const CollapsibleSection: React.FC<{
  title: string;
  expanded?: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}> = ({ title, expanded, onToggle, children }) => (
  <div className="bg-card rounded-xl border border-border overflow-hidden">
    <button onClick={onToggle} className="w-full flex items-center justify-between p-4 text-left">
      <h3 className="font-semibold text-foreground">{title}</h3>
      {expanded ? <FiChevronUp className="w-4 h-4 text-muted-foreground" /> : <FiChevronDown className="w-4 h-4 text-muted-foreground" />}
    </button>
    <AnimatePresence>
      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden"
        >
          <div className="px-4 pb-4">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const Disclaimer: React.FC<{ text: string | null }> = ({ text }) => (
  <div className="p-3 rounded-lg bg-muted/50 border border-border mt-4">
    <p className="text-[10px] text-muted-foreground leading-relaxed">
      ⚖️ {text || 'LandMate provides AI-generated guidance only. This is not legal advice.'}
    </p>
  </div>
);

export default ResultsPage;
