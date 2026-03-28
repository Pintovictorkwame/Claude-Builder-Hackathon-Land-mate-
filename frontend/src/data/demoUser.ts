export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  phone: string;
  region: string;
  joinedDate: string;
  documentsAnalyzed: number;
  redFlagsDetected: number;
  sessionsCompleted: number;
}

export interface DocumentHistory {
  id: string;
  fileName: string;
  docType: string;
  mode: string;
  date: string;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW' | null;
  summary: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'warning' | 'success';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const demoUser: UserProfile = {
  id: "usr_001",
  email: "kwame.asante@gmail.com",
  fullName: "Kwame Asante",
  avatarUrl: "",
  phone: "+233 24 123 4567",
  region: "Greater Accra",
  joinedDate: "2025-11-15",
  documentsAnalyzed: 12,
  redFlagsDetected: 3,
  sessionsCompleted: 18,
};

export const demoDocumentHistory: DocumentHistory[] = [
  {
    id: "doc_001",
    fileName: "Indenture_Plot_42_EastLegon.pdf",
    docType: "Indenture",
    mode: "Explain My Document",
    date: "2026-03-25",
    riskLevel: "LOW",
    summary: "Valid indenture for a 0.45-acre plot in East Legon. All parties identified, consideration duly noted.",
  },
  {
    id: "doc_002",
    fileName: "Title_Deed_Tema_Community25.pdf",
    docType: "Title Deed",
    mode: "Check for Red Flags",
    date: "2026-03-20",
    riskLevel: "HIGH",
    summary: "Missing stamp duty certificate. Grantor name mismatch with Land Registry records.",
  },
  {
    id: "doc_003",
    fileName: "Lease_Agreement_Spintex.pdf",
    docType: "Lease",
    mode: "Explain My Document",
    date: "2026-03-15",
    riskLevel: "MEDIUM",
    summary: "50-year lease with auto-renewal clause. Ground rent escalation terms need review.",
  },
  {
    id: "doc_004",
    fileName: "GLC_Form_Registration.pdf",
    docType: "GLC Form",
    mode: "Help Me Fill a Form",
    date: "2026-03-10",
    riskLevel: null,
    summary: "Land Title Registration form. All required fields guided and completed.",
  },
];

export const demoNotifications: Notification[] = [
  {
    id: "notif_001",
    title: "Analysis Complete",
    message: "Your indenture document has been fully analyzed. View results now.",
    date: "2026-03-25",
    read: false,
    type: "success",
  },
  {
    id: "notif_002",
    title: "Red Flag Alert",
    message: "High-risk issues detected in your Tema Title Deed. Immediate action recommended.",
    date: "2026-03-20",
    read: false,
    type: "warning",
  },
  {
    id: "notif_003",
    title: "Welcome to LandMate",
    message: "Start by uploading your first document or exploring GLC processes.",
    date: "2025-11-15",
    read: true,
    type: "info",
  },
];

export const demoChatHistory: ChatMessage[] = [
  {
    id: "msg_001",
    role: "assistant",
    content: "Hi Kwame! I'm your LandMate AI Agent. How can I help you understand land processes in Ghana today?",
    timestamp: "2026-03-27 10:00 AM",
  },
  {
    id: "msg_002",
    role: "user",
    content: "What are the steps to register a land title in the Greater Accra region?",
    timestamp: "2026-03-27 10:01 AM",
  },
  {
    id: "msg_003",
    role: "assistant",
    content: "Registering a land title in Greater Accra involves these main steps:\n\n1. **Search**: Conduct a search at the Lands Commission (Public and Vested Land Management Division).\n2. **Transaction**: Draft and sign the indenture/deed with the grantor.\n3. **Stamping**: Pay stamp duty at the Land Valuation Division.\n4. **Registration**: Submit the stamped document to the Land Registration Division for a Title Certificate.\n\nWould you like me to explain any of these steps in detail?",
    timestamp: "2026-03-27 10:02 AM",
  },
];
