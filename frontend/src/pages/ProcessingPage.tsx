import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLandMate } from '@/context/LandMateContext';
import type { ParsedResults, RedFlag } from '@/context/LandMateContext';
import { api } from '@/lib/api';

const tips: Record<string, string[]> = {
  explain: [
    'Reading your document carefully...',
    'Identifying key clauses and dates...',
    'Preparing a plain-language summary...',
    'Almost done — finalising your results...',
  ],
  redFlags: [
    'Scanning for suspicious clauses...',
    'Checking against known fraud patterns...',
    'Verifying essential document elements...',
    'Preparing your risk assessment...',
  ],
  processGuide: [
    'Looking up the GLC process...',
    'Gathering required documents list...',
    'Checking current fees and offices...',
    'Building your step-by-step guide...',
  ],
  formAssist: [
    'Analysing your GLC form...',
    'Identifying each field requirement...',
    'Preparing examples and tips...',
    'Almost ready — finalising guidance...',
  ],
};

const ProcessingPage: React.FC = () => {
  const navigate = useNavigate();
  const { mode, setScreen, setResults, setDocType, documentFile, documentText } = useLandMate();
  const [tipIndex, setTipIndex] = useState(0);

  const currentTips = tips[mode || 'explain'];

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex(prev => (prev + 1) % currentTips.length);
    }, 2000);

    const processDocument = async () => {
      try {
        let answer = "";
        let source = "Unknown";
        
        if (documentFile) {
          const formData = new FormData();
          formData.append('file', documentFile);
          formData.append('message', `Please analyze this document based on the following mode: ${mode || 'explain'}. Provide a detailed summary, key points, risks, and next steps.`);
          
          const res = await api.post('/ocr/analyze', formData);
          if (res.success && res.data) {
            answer = res.data.answer;
            source = res.data.source || 'Uploaded Document';
            setDocType('unknown');
          } else {
            throw new Error(res.message || 'Analysis failed');
          }
        } else if (documentText) {
          const res = await api.post('/chat', { 
            message: `Please analyze this document based on the following mode: ${mode || 'explain'}. Here is the text: \n\n${documentText}` 
          });
          if (res.success && res.data) {
            answer = res.data.answer;
            source = res.data.source || 'Pasted Text';
            setDocType('unknown');
          } else {
            throw new Error(res.message || 'Analysis failed');
          }
        } else {
          // Fallback to mock if nothing is provided (e.g., during testing directly navigating here)
          setTimeout(() => navigate('/upload'), 1000);
          return;
        }

        // Mock parsing the text into a structure. In a real app, the backend should return structured JSON.
        const structure: ParsedResults = {
          summary: answer,
          keyPoints: ['Extracted from document analysis', 'See summary for details'],
          importantDates: [],
          nextSteps: ['Review the summary', 'Consult a land expert if risk is high'],
          riskSummary: 'Review required',
          redFlags: [],
          missingElements: [],
          verdict: 'Analysis complete based on provided text.',
          processName: null,
          steps: null,
          documentsNeeded: null,
          estimatedCost: null,
          watchOutFor: null,
          formName: null,
          fieldGuide: null,
          disclaimer: 'LandMate provides AI-generated guidance only. This is not legal advice. Always consult a licensed lawyer or the Ghana Lands Commission for official decisions.',
        };
        
        setResults(structure);
        navigate('/results');
      } catch (err) {
        console.error(err);
        // On error, navigate back
        navigate('/upload');
      }
    };

    processDocument();

    return () => {
      clearInterval(interval);
    };
  }, [currentTips, mode, navigate, setResults, setDocType, documentFile, documentText]);

  return (
    <div className="min-h-screen gradient-hero flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center"
      >
        {/* Spinner */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-primary-foreground/10" />
          <div className="absolute inset-0 rounded-full border-4 border-t-gold border-r-transparent border-b-transparent border-l-transparent animate-spin" />
          <div className="absolute inset-3 rounded-full border-4 border-t-transparent border-r-gold-light border-b-transparent border-l-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        </div>

        <h2 className="text-xl font-display font-bold text-primary-foreground mb-3">Analysing Your Document</h2>

        <motion.p
          key={tipIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-sm text-primary-foreground/70"
        >
          {currentTips[tipIndex]}
        </motion.p>
      </motion.div>
    </div>
  );
};

export default ProcessingPage;
