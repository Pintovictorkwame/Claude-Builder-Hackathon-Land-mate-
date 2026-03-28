import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiUpload, FiImage, FiType, FiArrowLeft, FiArrowRight, FiFile, FiX } from 'react-icons/fi';
import { useLandMate } from '@/context/LandMateContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

type UploadMethod = 'pdf' | 'image' | 'text';

const DocumentUploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { setScreen, setDocumentText, setFileName, setDocumentFile } = useLandMate();
  const [method, setMethod] = useState<UploadMethod>('pdf');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    if (method === 'pdf' && file.type !== 'application/pdf') {
      setError('Please upload a PDF file.');
      return;
    }
    if (method === 'image' && !['image/jpeg', 'image/png'].includes(file.type)) {
      setError('Please upload a JPG or PNG image.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be under 10MB.');
      return;
    }
    setSelectedFile(file);
    setFileName(file.name);
  };

  const handleContinue = () => {
    if (method === 'text') {
      if (!pastedText.trim()) {
        setError('Please paste your document text.');
        return;
      }
      setDocumentText(pastedText);
      setDocumentFile(null);
      setFileName('Pasted Document');
    } else if (!selectedFile) {
      setError('Please upload a file first.');
      return;
    } else {
      setDocumentFile(selectedFile);
      setDocumentText(null); // Will be extracted in ProcessingPage
    }
    navigate('/processing');
  };

  const methods: { id: UploadMethod; label: string; icon: React.ReactNode }[] = [
    { id: 'pdf', label: 'PDF', icon: <FiUpload className="w-4 h-4" /> },
    { id: 'image', label: 'Image', icon: <FiImage className="w-4 h-4" /> },
    { id: 'text', label: 'Paste Text', icon: <FiType className="w-4 h-4" /> },
  ];

  const canContinue = method === 'text' ? pastedText.trim().length > 0 : !!selectedFile;

  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-hero px-6 pt-12 pb-8">
        <button onClick={() => navigate('/mode-selector')} className="text-primary-foreground/70 hover:text-primary-foreground mb-4 flex items-center gap-1 text-sm">
          <FiArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-2xl font-display font-bold text-primary-foreground">Upload Your Document</h1>
        <p className="text-sm text-primary-foreground/70 mt-1">PDF, image, or paste your document text</p>
      </div>

      <div className="px-6 -mt-4 pb-8 max-w-lg mx-auto">
        {/* Method tabs */}
        <div className="flex gap-1 bg-muted rounded-xl p-1 mb-6">
          {methods.map(m => (
            <button
              key={m.id}
              onClick={() => { setMethod(m.id); setSelectedFile(null); setError(null); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                method === m.id ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {m.icon} {m.label}
            </button>
          ))}
        </div>

        {/* Upload area */}
        {method !== 'text' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6"
          >
            {!selectedFile ? (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-48 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-3 hover:border-primary/50 hover:bg-primary/5 transition-all"
              >
                <div className="p-3 rounded-full bg-muted">
                  {method === 'pdf' ? <FiUpload className="w-6 h-6 text-muted-foreground" /> : <FiImage className="w-6 h-6 text-muted-foreground" />}
                </div>
                <div className="text-center">
                  <p className="font-medium text-foreground">Tap to upload {method === 'pdf' ? 'PDF' : 'image'}</p>
                  <p className="text-xs text-muted-foreground mt-1">{method === 'pdf' ? 'PDF up to 10MB' : 'JPG or PNG up to 10MB'}</p>
                </div>
              </button>
            ) : (
              <div className="p-4 bg-card rounded-xl border border-border flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FiFile className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm truncate">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                </div>
                <button onClick={() => { setSelectedFile(null); setFileName(null); }} className="p-1.5 rounded-full hover:bg-muted">
                  <FiX className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept={method === 'pdf' ? '.pdf' : '.jpg,.jpeg,.png'}
              onChange={handleFileSelect}
              className="hidden"
            />
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
            <Textarea
              value={pastedText}
              onChange={e => { setPastedText(e.target.value); setError(null); }}
              placeholder="Paste your land document text here..."
              className="min-h-[200px] bg-card border-border text-foreground resize-none"
            />
            <p className="text-xs text-muted-foreground mt-2 text-right">{pastedText.length} characters</p>
          </motion.div>
        )}

        {error && (
          <p className="text-sm text-destructive mb-4 bg-destructive/10 p-3 rounded-lg">{error}</p>
        )}

        <Button
          onClick={handleContinue}
          disabled={!canContinue}
          className="w-full gradient-gold text-forest-dark font-semibold py-6 rounded-xl shadow-gold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
        >
          Analyse Document
          <FiArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default DocumentUploadPage;
