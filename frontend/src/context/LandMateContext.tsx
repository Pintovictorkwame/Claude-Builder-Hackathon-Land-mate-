import React, { createContext, useContext, useState, useCallback } from 'react';

export type AppScreen = 'welcome' | 'login' | 'signup' | 'chat' | 'modeSelector' | 'documentUpload' | 'processSelector' | 'processing' | 'results';
export type AppMode = 'explain' | 'redFlags' | 'processGuide' | 'formAssist' | null;
export type Language = 'english' | 'twi' | 'pidgin';
export type DocType = 'indenture' | 'titleDeed' | 'lease' | 'glcForm' | 'unknown' | null;
export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface RedFlag {
  severity: RiskLevel;
  issue: string;
  explanation: string;
  recommendation: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ParsedResults {
  summary: string | null;
  keyPoints: string[] | null;
  importantDates: { label: string; date: string }[] | null;
  nextSteps: string[] | null;
  riskSummary: string | null;
  redFlags: RedFlag[] | null;
  missingElements: string[] | null;
  verdict: string | null;
  processName: string | null;
  steps: string[] | null;
  documentsNeeded: string[] | null;
  estimatedCost: string | null;
  watchOutFor: string[] | null;
  formName: string | null;
  fieldGuide: string | null;
  disclaimer: string | null;
}

interface LandMateContextType {
  screen: AppScreen;
  setScreen: (s: AppScreen) => void;
  mode: AppMode;
  setMode: (m: AppMode) => void;
  language: Language;
  setLanguage: (l: Language) => void;
  docType: DocType;
  setDocType: (d: DocType) => void;
  documentText: string | null;
  setDocumentText: (t: string | null) => void;
  documentFile: File | null;
  setDocumentFile: (f: File | null) => void;
  fileName: string | null;
  setFileName: (n: string | null) => void;
  results: ParsedResults | null;
  setResults: (r: ParsedResults | null) => void;
  chatHistory: ChatMessage[];
  addChatMessage: (msg: ChatMessage) => void;
  resetSession: () => void;
}

const LandMateContext = createContext<LandMateContextType | undefined>(undefined);

export const LandMateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [screen, setScreen] = useState<AppScreen>('welcome');
  const [mode, setMode] = useState<AppMode>(null);
  const [language, setLanguage] = useState<Language>('english');
  const [docType, setDocType] = useState<DocType>(null);
  const [documentText, setDocumentText] = useState<string | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [results, setResults] = useState<ParsedResults | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const addChatMessage = useCallback((msg: ChatMessage) => {
    setChatHistory(prev => [...prev, msg]);
  }, []);

  const resetSession = useCallback(() => {
    setScreen('welcome');
    setMode(null);
    setLanguage('english');
    setDocType(null);
    setDocumentText(null);
    setDocumentFile(null);
    setFileName(null);
    setResults(null);
    setChatHistory([]);
  }, []);

  return (
    <LandMateContext.Provider value={{
      screen, setScreen, mode, setMode, language, setLanguage,
      docType, setDocType, documentText, setDocumentText,
      documentFile, setDocumentFile,
      fileName, setFileName, results, setResults,
      chatHistory, addChatMessage, resetSession,
    }}>
      {children}
    </LandMateContext.Provider>
  );
};

export const useLandMate = () => {
  const ctx = useContext(LandMateContext);
  if (!ctx) throw new Error('useLandMate must be used within LandMateProvider');
  return ctx;
};
