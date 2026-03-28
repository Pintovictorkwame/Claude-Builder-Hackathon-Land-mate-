import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FiHome,
  FiFileText,
  FiAlertTriangle,
  FiBell,
  FiSettings,
  FiLogOut,
  FiArrowRight,
  FiClock,
  FiShield,
  FiTrendingUp,
  FiMenu,
  FiX,
  FiMessageSquare,
  FiSend,
  FiPaperclip,
  FiMic,
  FiUser,
  FiLock,
  FiCheckCircle,
  FiCamera,
  FiPlus,
  FiArrowUp,
  FiSearch,
  FiMapPin,
  FiGlobe,
  FiCommand,
  FiMap,
  FiSliders,
} from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLandMate } from "@/context/LandMateContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import botLogo from "@/assets/bot-logo.png";
import botLogoWhite from "@/assets/bot-logo-white.png";
import { toast } from "sonner";
import { api } from "@/lib/api";

import { Sidebar } from "@/components/Sidebar";

import {
  demoDocumentHistory,
  demoNotifications,
  demoChatHistory,
  ChatMessage,
} from "@/data/demoUser";

type PortalTab = "chat" | "history" | "profile";

const riskColors: Record<string, string> = {
  HIGH: "bg-destructive/10 text-destructive border-destructive/20",
  MEDIUM: "bg-risk-medium/10 text-risk-medium border-risk-medium/20",
  LOW: "bg-risk-low/10 text-risk-low border-risk-low/20",
};

const MessageFormatter = ({ content }: { content: string }) => {
  const formatText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="font-semibold text-foreground/90">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const lines = content.split("\n");
  return (
    <div className="space-y-1.5 text-[15px] leading-relaxed">
      {lines.map((line, i) => {
        // Numbered list
        const numMatch = line.match(/^(\s*\d+\.\s*)(.*)/);
        if (numMatch) {
          return (
            <div key={i} className="flex gap-2">
              <span className="font-medium text-foreground/70 shrink-0 select-none min-w-[1.2rem]">
                {numMatch[1].trim()}
              </span>
              <span className="flex-1">{formatText(numMatch[2])}</span>
            </div>
          );
        }

        // Bullet list
        const bullMatch = line.match(/^(\s*[-*]\s+)(.*)/);
        if (bullMatch) {
          return (
            <div key={i} className="flex gap-2">
              <span className="font-medium text-foreground/70 shrink-0 select-none text-lg leading-none mt-0.5 min-w-[1.2rem]">
                •
              </span>
              <span className="flex-1">{formatText(bullMatch[2])}</span>
            </div>
          );
        }

        if (line.trim() === "") {
          return <div key={i} className="h-2" />; // paragraph spacing
        }

        return <p key={i}>{formatText(line)}</p>;
      })}
    </div>
  );
};

interface ChatPageProps {
  tab?: PortalTab;
}

const ChatPage: React.FC<ChatPageProps> = ({ tab = "chat" }) => {
  const navigate = useNavigate();
  const { setScreen } = useLandMate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Chat/Enquiry State
  const [messages, setMessages] = useState<ChatMessage[]>(demoChatHistory);
  const [inputValue, setInputValue] = useState("");
  const [selectedProcess, setSelectedProcess] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const startSpeechRecognition = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error("Speech recognition is not supported in your browser.");
      return;
    }

    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join("");
        setInputValue(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
        if (event.error !== "no-speech") {
          toast.error(`Recording error: ${event.error}`);
        }
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }

    try {
      recognitionRef.current.start();
      setIsRecording(true);
      toast.info("Listening... Speak clearly into your microphone.");
    } catch (err) {
      console.error("Start recording failed:", err);
      setIsRecording(false);
    }
  }, []);

  const stopSpeechRecognition = useCallback(() => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      toast.success("Transcription complete.");
    }
  }, [isRecording]);

  const toggleRecording = () => {
    if (isRecording) {
      stopSpeechRecognition();
    } else {
      startSpeechRecognition();
    }
  };

  const handleSendMessage = async (text?: string) => {
    const content = text || inputValue;
    if (!content.trim() && selectedFiles.length === 0) return;

    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: content,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    try {
      let res;
      // Note: we copy selectedFiles to a local variable to use it before clearing it in state
      const filesToSend = [...selectedFiles];
      
      // Clear UI state immediately
      setInputValue("");
      setSelectedProcess(null);
      setSelectedFiles([]);

      if (filesToSend.length > 0) {
        // Backend takes one file per request using 'file' key
        const formData = new FormData();
        formData.append('file', filesToSend[0]);
        if (content.trim()) {
          formData.append('message', content);
        } else {
          formData.append('message', 'Please analyze this document.');
        }
        res = await api.post('/ocr/analyze', formData);
      } else {
        res = await api.post('/chat', { message: content });
      }

      if (res.success && res.data) {
        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: res.data.answer,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prev) => [...prev, aiResponse]);
      } else {
        throw new Error("Failed to get response");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to connect to LandMate AI.");
    }
  };

  const unreadCount = demoNotifications.filter((n) => !n.read).length;

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

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

        <div
          className={`flex-1 flex flex-col overflow-hidden ${tab !== "chat" ? "w-full max-w-5xl mx-auto p-6 md:p-8 overflow-y-auto" : "w-full"}`}
        >
          {tab === "chat" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col flex-1 relative overflow-hidden w-full max-w-4xl mx-auto"
            >
              {/* Chat Content Flow */}
              <div className="flex-1 overflow-y-auto px-4 pt-20 pb-4">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center relative pointer-events-none">
                    {/* Background Graphic */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] select-none pointer-events-none">
                      <span className="text-[30rem] md:text-[45rem] font-display font-black leading-none tracking-tighter">
                        LM
                      </span>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="relative z-10 pointer-events-auto"
                    >
                      <h1 className="text-5xl md:text-6xl font-display font-bold text-foreground mb-4 tracking-tight">
                        Hi, {user?.fullName?.split(" ")[0] || "Energy"}
                      </h1>
                      <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
                        Secure your land investments. Interact with LandMate AI
                        to explore Ghanaian land regulations and document
                        intelligence.
                      </p>
                    </motion.div>
                  </div>
                ) : (
                  <div className="max-w-3xl mx-auto space-y-6 pt-10">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-[2rem] p-5 shadow-sm ${
                            msg.role === "user"
                              ? "bg-primary text-primary-foreground rounded-br-none"
                              : "bg-muted/50 border border-border text-foreground rounded-tl-none"
                          }`}
                        >
                          <MessageFormatter content={msg.content} />
                          <p
                            className={`text-[10px] mt-2 opacity-60 ${msg.role === "user" ? "text-right" : "text-left"}`}
                          >
                            {msg.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Fixed Bottom Input Area */}
              <div className="w-full px-4 md:px-6 flex-shrink-0 z-30 pb-6 bg-background pt-2">
                <div className="max-w-3xl mx-auto flex flex-col items-center gap-4 md:gap-6">
                  {/* Floating Input Box */}
                  <div className="w-full bg-background border-2 border-border focus-within:border-primary/30 rounded-[28px] shadow-2xl overflow-hidden transition-all duration-300">
                    <div className="px-5 py-2.5 bg-muted/20 border-b border-border">
                      <p className="text-[10px] font-bold text-muted-foreground/60 flex items-center gap-1.5 uppercase tracking-widest">
                        <FiMessageSquare className="w-3 h-3" /> Chat: Land
                        document analysis and procedure support
                      </p>
                    </div>

                    <div className="relative">
                      {isRecording && (
                        <div className="flex items-center gap-3 px-6 pt-5 pb-1 animate-in fade-in slide-in-from-top-2">
                          <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                          </span>
                          <span className="text-red-500 font-medium text-sm animate-pulse">Listening... Speak clearly into your microphone</span>
                        </div>
                      )}
                      
                      {selectedFiles.length > 0 && (
                        <div className="flex flex-wrap gap-2 px-6 pt-4 pb-2">
                          {selectedFiles.map((file, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg border border-border shadow-sm text-sm"
                            >
                              <FiPaperclip className="w-3.5 h-3.5 text-muted-foreground" />
                              <span className="max-w-[150px] truncate text-foreground/80">
                                {file.name}
                              </span>
                              <button
                                onClick={() => removeFile(idx)}
                                className="text-muted-foreground hover:text-destructive"
                              >
                                <FiX className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <textarea
                        value={inputValue}
                        onChange={(e) => {
                          setInputValue(e.target.value);
                          e.target.style.height = "inherit";
                          e.target.style.height = `${e.target.scrollHeight}px`;
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder={isRecording ? "Listening..." : "How can I help you today?"}
                        rows={1}
                        className={`w-full bg-transparent border-none rounded-none px-6 pr-16 text-lg outline-none resize-none min-h-[80px] transition-all duration-300 ${isRecording ? 'placeholder:text-red-500/50 text-red-500/90' : 'placeholder:text-muted-foreground/40'} ${selectedFiles.length > 0 || isRecording ? "pt-2 pb-6" : "py-6"}`}
                        style={{ maxHeight: "200px" }}
                      />

                      <div className="flex items-center justify-between px-4 pb-4">
                        <div className="flex items-center gap-1">
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            className="hidden"
                            multiple
                          />
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="p-2 rounded-xl hover:bg-muted text-muted-foreground transition-colors"
                            title="Attach Files"
                          >
                            <FiPlus className="w-5 h-5" />
                          </button>

                          <button
                            onClick={toggleRecording}
                            className={`p-2 rounded-xl transition-all ${isRecording ? "bg-red-500/10 text-red-500 animate-pulse" : "hover:bg-muted text-muted-foreground"}`}
                            title="Voice Input"
                          >
                            <FiMic className="w-5 h-5" />
                          </button>

                          {selectedProcess && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="ml-2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted border border-border shadow-sm group animate-in slide-in-from-left-2 duration-300"
                            >
                              <span className="text-xs font-semibold text-foreground/70">
                                {selectedProcess === "Document Analysis" && (
                                  <FiFileText className="inline w-3 h-3 mr-1.5" />
                                )}
                                {selectedProcess === "Fraud Detection" && (
                                  <FiShield className="inline w-3 h-3 mr-1.5" />
                                )}
                                {selectedProcess === "Step Guide" && (
                                  <FiMap className="inline w-3 h-3 mr-1.5" />
                                )}
                                {selectedProcess === "Form Assist" && (
                                  <FiCommand className="inline w-3 h-3 mr-1.5" />
                                )}
                                {selectedProcess === "Recent Search" && (
                                  <FiClock className="inline w-3 h-3 mr-1.5" />
                                )}
                                {selectedProcess}
                              </span>
                              <button
                                onClick={() => setSelectedProcess(null)}
                                className="text-muted-foreground hover:text-destructive transition-colors"
                              >
                                <FiX className="w-3.5 h-3.5" />
                              </button>
                            </motion.div>
                          )}
                        </div>

                        <Button
                          onClick={() => handleSendMessage()}
                          disabled={
                            !inputValue.trim() && selectedFiles.length === 0
                          }
                          className="w-11 h-11 rounded-2xl bg-secondary-muted p-0 text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 flex items-center justify-center shrink-0"
                        >
                          <FiArrowUp className="w-6 h-6" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Quick Action Buttons (App Offers) */}
                  {!selectedProcess && (
                    <div className="flex flex-wrap justify-center gap-2 pb-2">
                    {[
                      {
                        label: "Document Analysis",
                        icon: <FiFileText className="w-4 h-4" />,
                        color: "bg-blue-500/10 text-blue-600",
                      },
                      {
                        label: "Fraud Detection",
                        icon: <FiShield className="w-4 h-4" />,
                        color: "bg-red-500/10 text-red-600",
                      },
                      {
                        label: "Step Guide",
                        icon: <FiMap className="w-4 h-4" />,
                        color: "bg-green-500/10 text-green-600",
                      },
                      {
                        label: "Form Assist",
                        icon: <FiCommand className="w-4 h-4" />,
                        color: "bg-orange-500/10 text-orange-600",
                      },
                      {
                        label: "Recent Search",
                        icon: <FiClock className="w-4 h-4" />,
                        color: "bg-purple-500/10 text-purple-600",
                      },
                    ].map((item, i) => (
                      <motion.button
                        key={item.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + i * 0.05 }}
                        onClick={() => setSelectedProcess(item.label)}
                        className={`flex items-center gap-2.5 px-4 py-2.5 rounded-[14px] border transition-all text-xs font-semibold ${
                          selectedProcess === item.label
                            ? "bg-primary/5 border-primary text-primary shadow-sm"
                            : "bg-card border-border/60 text-foreground/70 hover:border-primary/30 hover:bg-muted/30"
                        }`}
                      >
                        <span className={`${item.color} p-1 rounded-md`}>
                          {item.icon}
                        </span>
                        {item.label}
                      </motion.button>
                    ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {tab === "history" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="text-2xl font-display font-bold text-foreground mb-1">
                Document History
              </h1>
              <p className="text-muted-foreground mb-6">
                All your analyzed documents in one place.
              </p>
              <div className="space-y-3">
                {demoDocumentHistory.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-5 rounded-xl bg-card border border-border"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {doc.fileName}
                        </p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <Badge variant="outline" className="text-[10px]">
                            {doc.docType}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {doc.mode}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            •
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {doc.date}
                          </span>
                        </div>
                      </div>
                      {doc.riskLevel && (
                        <Badge
                          variant="outline"
                          className={`text-[10px] ml-2 ${riskColors[doc.riskLevel]}`}
                        >
                          {doc.riskLevel} RISK
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {doc.summary}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ChatPage;
