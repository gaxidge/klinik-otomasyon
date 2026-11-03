export type TreatmentCategory =
  | "İmplant Cerrahisi"
  | "Gülüş Tasarımı & Zirkonyum"
  | "Şeffaf Plak & Ortodonti"
  | "Kanal Tedavisi (Endodonti)"
  | "Diş Beyazlatma & Estetik"
  | "Gömülü 20'lik & Çene Cerrahisi"
  | "Diş Eti Tedavisi (Periodontoloji)"
  | "Pedodonti (Çocuk Diş)";

export type ToothCondition =
  | "Sağlam"
  | "İmplant"
  | "Zirkonyum / Kuron"
  | "Kanal + Dolgu"
  | "Tedavi Planlandı"
  | "Eksik Diş";

export interface ToothRecord {
  fdiNumber: number; // 18..11, 21..28, 48..41, 31..38
  name: string;
  quadrant: "Sağ Üst (1)" | "Sol Üst (2)" | "Sol Alt (3)" | "Sağ Alt (4)";
  condition: ToothCondition;
  plannedProcedure?: string;
  dentistNote?: string;
  lastUpdated?: string;
}

export type TreatmentPlanStatus =
  | "Devam Ediyor"
  | "Teklif Sunuldu"
  | "Laboratuvarda"
  | "Tamamlandı";

export type LabStatus =
  | "Yok"
  | "Ölçü Alındı (3D Tarama)"
  | "Altyapı / Zirkonyum Provada"
  | "Laboratuvardan Teslim Alındı";

export interface TreatmentPlan {
  id: string;
  tenantId: string;
  code: string;
  title: string;
  description: string;
  category: TreatmentCategory;
  status: TreatmentPlanStatus;
  labStatus: LabStatus;
  patientId: string;
  patientName: string;
  patientPhone: string;
  toothNumbers: number[]; // FDI numaraları örn. [11, 12, 21, 22] veya [36, 37]
  jawArea: string; // örn. "Üst Ön Estetik Bölge", "Sol Alt Molar Bölgesi", "Alt & Üst Çene Tam Ark"
  dentistName: string;
  chairUnit: string; // örn. "Ünit 1 (Cerrahi & İmplant)", "Ünit 2 (Protez & Estetik)"
  totalSessions: number;
  completedSessions: number;
  totalPrice: number;
  paidAmount: number;
  paymentPlan: string; // örn. "%40 Peşinat + 3 Taksit", "Kredi Kartı 6 Taksit"
  warrantyInfo: string; // örn. "Ömür Boyu İmplant + 5 Yıl Üst Yapı Garantisi"
  materialsUsed: string[]; // örn. ["Straumann SLA Roxolid İmplant", "3D Cerrahi Rehber", "Ivoclar Çok Katmanlı Zirkonyum"]
  image: string;
  createdAt: string;
  nextAppointmentDate?: string;
}

export type PatientStatus =
  | "Yeni Başvuru"
  | "Muayene & Planlama"
  | "Tedavisi Devam Eden"
  | "Tamamlandı & Kontrolde";

export type AnamnesisAlert =
  | "Sistemik Hastalık Yok"
  | "Penisilin Alerjisi"
  | "Kan Sulandırıcı Kullanımı"
  | "Diyabet (Tip 2)"
  | "Hipertansiyon"
  | "Dental Anksiyete (İğne Korkusu)"
  | "Hamilelik (2. Trimester)";

export interface PatientInteraction {
  id: string;
  date: string;
  channel: "WhatsApp" | "Telefon" | "Klinik Muayene" | "AI Triyaj" | "Kontrol Çağrısı";
  summary: string;
  staffName: string;
}

export interface Patient {
  id: string;
  tenantId: string;
  fullName: string;
  phone: string;
  email: string;
  age: number;
  bloodType: string;
  interestedTreatments: TreatmentCategory[];
  complaintSummary: string;
  anamnesisAlerts: AnamnesisAlert[];
  estimatedBudget: number;
  paidTotal: number;
  remainingBalance: number;
  status: PatientStatus;
  notes: string;
  lastVisitDate: string;
  nextRecallDate: string; // 6 aylık rutin kontrol tarihi
  source:
    | "WhatsApp AI"
    | "Instagram / Meta Reklam"
    | "Web Randevu Formu"
    | "Hasta Referansı"
    | "Sağlık Turizmi";
  assignedDentist: string;
  aiUrgencyScore: number; // 0-100 (ağrı / aciliyet / tedavi dönüşüm potansiyeli)
  matchedTreatmentPlanIds: string[];
  interactions: PatientInteraction[];
}

export type ToolCallName =
  | "AnalyzeSymptomsTriage"
  | "SearchTreatmentPlans"
  | "CheckPatientAnamnesis"
  | "CreatePatientRecord"
  | "ScheduleChairAppointment"
  | "SendTreatmentQuoteCard"
  | "TransferToCoordinator";

export interface AIToolCallLog {
  id: string;
  toolName: ToolCallName;
  timestamp: string;
  argumentsJson: string;
  resultSummary: string;
  durationMs: number;
  status: "success" | "warning";
}

export interface ChatMessage {
  id: string;
  sender: "patient" | "ai" | "coordinator" | "system";
  content: string;
  timestamp: string;
  toolCalls?: AIToolCallLog[];
  attachedTreatments?: {
    id: string;
    code: string;
    title: string;
    category: TreatmentCategory;
    price: number;
    sessions: string;
    dentistName: string;
    warrantyInfo: string;
    image: string;
  }[];
}

export interface AIConversation {
  id: string;
  tenantId: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  channel: "WhatsApp Cloud API" | "Instagram DM & Web";
  status:
    | "AI Triyaj Aktif"
    | "Hekim / Koordinatör Bekliyor"
    | "Randevu Planlandı"
    | "Tamamlandı";
  unreadCount: number;
  lastMessageAt: string;
  extractedContext: {
    complaint: string;
    targetCategory: TreatmentCategory;
    toothArea: string;
    painLevel: "Acil (Şiddetli Ağrı / Şişlik)" | "Orta Hassasiyet" | "Estetik / Planlı";
    anamnesisNote: string;
    estimatedQuoteRange: string;
  };
  aiSummary: string;
  messages: ChatMessage[];
}

export type AppointmentStatus =
  | "Onaylandı"
  | "Beklemede"
  | "Koltukta / İşlemde"
  | "Tamamlandı"
  | "İptal / Erteleme";

export interface Appointment {
  id: string;
  tenantId: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  treatmentPlanId: string;
  treatmentCode: string;
  treatmentTitle: string;
  toothNumbers: string; // örn. "#11, #12, #21, #22" veya "#38 Gömülü"
  chairUnit: string; // örn. "Ünit 1 (Cerrahi)"
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  durationMinutes: number;
  status: AppointmentStatus;
  dentistName: string;
  createdBy: "AI Asistan" | "Hasta Koordinatörü";
  reminderSent: boolean;
  patientConfirmed: boolean;
  reminderChannel: "WhatsApp + SMS" | "WhatsApp" | "Telefon Teyidi";
  notes: string;
}

export interface AutomationJob {
  id: string;
  name: string;
  description: string;
  schedule: string;
  category:
    | "Gece & Acil Triyaj"
    | "Randevu & Ünit Koruma"
    | "Cerrahi Sonrası Bakım"
    | "Tedavi Teklif Takibi"
    | "6 Aylık Rutin Kontrol"
    | "Protez & Laboratuvar"
    | "Gün Sonu Klinik Raporu";
  isActive: boolean;
  lastRunAt: string;
  nextRunAt: string;
  totalRuns30d: number;
  successRate: number;
  steps: string[];
  impactBadge: string;
  timingOptions: string[];
  selectedTiming: string;
  recipientLabel: string;
  whatsappTemplate: string;
  whatsappPreview: string;
}

export interface AutomationExecutionLog {
  id: string;
  jobId: string;
  jobName: string;
  executedAt: string;
  durationMs: number;
  status: "Başarılı" | "Atlandı" | "Uyarı";
  detail: string;
  affectedEntity: string;
}

export interface TenantClinic {
  id: string;
  name: string;
  plan: "Poliklinik Pro" | "Muayenehane" | "ADSM Kurumsal";
  city: string;
  licenseNumber: string;
  chiefDentist: string;
  phone: string;
  whatsappConnected: boolean;
  whatsappNumber: string;
  aiModel: string;
  activeDentists: number;
  totalChairs: number;
}
