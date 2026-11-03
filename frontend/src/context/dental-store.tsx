"use client";

import React, { createContext, useContext, useState } from "react";
import {
  AIConversation,
  AIToolCallLog,
  Appointment,
  AutomationExecutionLog,
  AutomationJob,
  ChatMessage,
  Patient,
  PatientStatus,
  TenantClinic,
  ToothCondition,
  ToothRecord,
  TreatmentPlan,
} from "@/lib/types";
import {
  INITIAL_AI_CONVERSATIONS,
  INITIAL_APPOINTMENTS,
  INITIAL_AUTOMATION_LOGS,
  INITIAL_AUTOMATIONS,
  INITIAL_ODONTOGRAM,
  INITIAL_PATIENTS,
  INITIAL_TREATMENT_PLANS,
  TENANT_CLINICS,
} from "@/lib/mock-data";
import { formatTRY } from "@/lib/utils";

interface DentalStoreContextType {
  currentTenant: TenantClinic;
  tenants: TenantClinic[];
  switchTenant: (tenantId: string) => void;
  updateTenantInfo: (partial: Partial<TenantClinic>) => void;

  odontogram: ToothRecord[];
  updateToothRecord: (
    fdiNumber: number,
    condition: ToothCondition,
    plannedProcedure?: string,
    dentistNote?: string
  ) => void;

  treatmentPlans: TreatmentPlan[];
  addTreatmentPlan: (
    plan: Omit<TreatmentPlan, "id" | "tenantId" | "code" | "createdAt">
  ) => void;
  updateTreatmentPlan: (id: string, partial: Partial<TreatmentPlan>) => void;
  deleteTreatmentPlan: (id: string) => void;

  patients: Patient[];
  addPatient: (
    pat: Omit<
      Patient,
      | "id"
      | "tenantId"
      | "lastVisitDate"
      | "nextRecallDate"
      | "aiUrgencyScore"
      | "matchedTreatmentPlanIds"
      | "interactions"
    >
  ) => void;
  updatePatientStatus: (id: string, status: PatientStatus) => void;
  updatePatient: (id: string, partial: Partial<Patient>) => void;

  conversations: AIConversation[];
  sendPatientSimulationMessage: (conversationId: string, text: string) => void;
  sendCoordinatorMessage: (conversationId: string, text: string) => void;
  transferConversationToCoordinator: (conversationId: string) => void;

  appointments: Appointment[];
  addAppointment: (apt: Omit<Appointment, "id" | "tenantId">) => void;
  updateAppointmentStatus: (id: string, status: Appointment["status"]) => void;

  automations: AutomationJob[];
  automationLogs: AutomationExecutionLog[];
  toggleAutomation: (id: string) => void;
  triggerAutomationNow: (id: string) => void;
  updateAutomationSettings: (id: string, partial: Partial<AutomationJob>) => void;
}

const DentalStoreContext = createContext<DentalStoreContextType | undefined>(
  undefined
);

export function DentalStoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [tenants, setTenants] = useState<TenantClinic[]>(TENANT_CLINICS);
  const [currentTenantId, setCurrentTenantId] = useState<string>("tenant-1");

  const [odontogram, setOdontogram] =
    useState<ToothRecord[]>(INITIAL_ODONTOGRAM);
  const [allTreatmentPlans, setAllTreatmentPlans] = useState<TreatmentPlan[]>(
    INITIAL_TREATMENT_PLANS
  );
  const [allPatients, setAllPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [allConversations, setAllConversations] = useState<AIConversation[]>(
    INITIAL_AI_CONVERSATIONS
  );
  const [allAppointments, setAllAppointments] = useState<Appointment[]>(
    INITIAL_APPOINTMENTS
  );
  const [automations, setAutomations] =
    useState<AutomationJob[]>(INITIAL_AUTOMATIONS);
  const [automationLogs, setAutomationLogs] = useState<
    AutomationExecutionLog[]
  >(INITIAL_AUTOMATION_LOGS);

  const currentTenant =
    tenants.find((t) => t.id === currentTenantId) || tenants[0];

  const switchTenant = (tenantId: string) => {
    setCurrentTenantId(tenantId);
  };

  const updateTenantInfo = (partial: Partial<TenantClinic>) => {
    setTenants((prev) =>
      prev.map((t) => (t.id === currentTenantId ? { ...t, ...partial } : t))
    );
  };

  const treatmentPlans = allTreatmentPlans.filter(
    (p) => p.tenantId === currentTenantId
  );
  const patients = allPatients.filter((p) => p.tenantId === currentTenantId);
  const conversations = allConversations.filter(
    (c) => c.tenantId === currentTenantId
  );
  const appointments = allAppointments.filter(
    (a) => a.tenantId === currentTenantId
  );

  const updateToothRecord = (
    fdiNumber: number,
    condition: ToothCondition,
    plannedProcedure?: string,
    dentistNote?: string
  ) => {
    const today = new Date().toISOString().slice(0, 10);
    setOdontogram((prev) =>
      prev.map((t) =>
        t.fdiNumber === fdiNumber
          ? {
              ...t,
              condition,
              plannedProcedure:
                plannedProcedure !== undefined
                  ? plannedProcedure
                  : t.plannedProcedure,
              dentistNote:
                dentistNote !== undefined ? dentistNote : t.dentistNote,
              lastUpdated: today,
            }
          : t
      )
    );
  };

  const addTreatmentPlan: DentalStoreContextType["addTreatmentPlan"] = (
    newPlan
  ) => {
    const nextNum = 2075 + allTreatmentPlans.length * 4;
    const created: TreatmentPlan = {
      ...newPlan,
      id: `trt-${Date.now()}`,
      tenantId: currentTenantId,
      code: `DNT-${nextNum}`,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setAllTreatmentPlans((prev) => [created, ...prev]);

    // Odontogram üzerinde seçilen dişleri otomatik işaretle
    if (created.toothNumbers.length > 0) {
      const cond: ToothCondition =
        created.category === "İmplant Cerrahisi"
          ? "İmplant"
          : created.category === "Gülüş Tasarımı & Zirkonyum"
          ? "Zirkonyum / Kuron"
          : created.category === "Kanal Tedavisi (Endodonti)"
          ? "Kanal + Dolgu"
          : "Tedavi Planlandı";

      setOdontogram((prev) =>
        prev.map((t) =>
          created.toothNumbers.includes(t.fdiNumber)
            ? {
                ...t,
                condition: cond,
                plannedProcedure: created.title,
                lastUpdated: created.createdAt,
              }
            : t
        )
      );
    }

    setAutomationLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        jobId: "job-703",
        jobName: "Yeni Tedavi Planı & Odontogram Kaydı",
        executedAt: new Date().toLocaleString("tr-TR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        durationMs: 220,
        status: "Başarılı",
        detail: `${created.patientName} için ${created.code} (${created.title}) planı oluşturuldu ve FDI diş şemasına işlendi.`,
        affectedEntity: `${created.code} · ${created.patientName}`,
      },
      ...prev,
    ]);
  };

  const updateTreatmentPlan = (id: string, partial: Partial<TreatmentPlan>) => {
    setAllTreatmentPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...partial } : p))
    );
  };

  const deleteTreatmentPlan = (id: string) => {
    setAllTreatmentPlans((prev) => prev.filter((p) => p.id !== id));
  };

  const addPatient: DentalStoreContextType["addPatient"] = (newPat) => {
    const matched = treatmentPlans
      .filter((p) => newPat.interestedTreatments.includes(p.category))
      .map((p) => p.id);

    const created: Patient = {
      ...newPat,
      id: `pat-${Date.now()}`,
      tenantId: currentTenantId,
      lastVisitDate: new Date().toISOString().slice(0, 10),
      nextRecallDate: "2027-05-03",
      aiUrgencyScore: newPat.anamnesisAlerts.some(
        (a) => a !== "Sistemik Hastalık Yok"
      )
        ? 90
        : 82,
      matchedTreatmentPlanIds: matched.slice(0, 2),
      interactions: [
        {
          id: `int-${Date.now()}`,
          date: new Date().toLocaleString("tr-TR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          channel: "Klinik Muayene",
          summary:
            "Hasta kartı, tıbbi anamnez bilgileri ve tedavi beklentisi kaydedildi.",
          staffName: newPat.assignedDentist || "Dt. Kerem Alptekin",
        },
      ],
    };
    setAllPatients((prev) => [created, ...prev]);
  };

  const updatePatientStatus = (id: string, status: PatientStatus) => {
    setAllPatients((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status,
              lastVisitDate: new Date().toISOString().slice(0, 10),
            }
          : p
      )
    );
  };

  const updatePatient = (id: string, partial: Partial<Patient>) => {
    setAllPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...partial } : p))
    );
  };

  // AI Hasta Asistanı: Klinik protokolleri ve gerçek tedavi veritabanı üzerinde Function Calling simülasyonu
  const sendPatientSimulationMessage = (
    conversationId: string,
    text: string
  ) => {
    const nowTime = new Date().toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const nowFull = new Date().toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-u`,
      sender: "patient",
      content: text,
      timestamp: nowTime,
    };

    const lower = text.toLowerCase();
    const toolCalls: AIToolCallLog[] = [];
    let aiReply = "";
    let attachedTreatments: ChatMessage["attachedTreatments"] = undefined;
    let newStatus: AIConversation["status"] | undefined = undefined;

    // 1. Hekim veya Hasta Koordinatörüne aktarım talebi
    if (
      lower.includes("hekim") ||
      lower.includes("doktor") ||
      lower.includes("koordinatör") ||
      lower.includes("yetkili") ||
      lower.includes("röntgen") ||
      lower.includes("indirim")
    ) {
      toolCalls.push({
        id: `tc-${Date.now()}-1`,
        toolName: "TransferToCoordinator",
        timestamp: nowFull,
        argumentsJson: JSON.stringify({
          conversationId,
          reason:
            "Hasta doğrudan hekim değerlendirmesi / özel ödeme planı talep etti",
          assignedDentist: "Dt. Kerem Alptekin",
        }),
        resultSummary:
          "Görüşme Başhekim Dt. Kerem Alptekin ve Hasta Koordinatörüne devredildi.",
        durationMs: 76,
        status: "warning",
      });
      aiReply =
        "Talebinizi hemen **Başhekimimiz Dt. Kerem Alptekin** ve **Hasta Koordinatörümüze** aktardım. Paylaştığınız klinik bilgiler ve röntgen/fiyat talebiniz ekranlarına düştü; birkaç dakika içinde sizinle doğrudan iletişime geçeceklerdir.";
      newStatus = "Hekim / Koordinatör Bekliyor";
    }
    // 2. Acil Diş Ağrısı / Şişlik / Apse Triyajı
    else if (
      lower.includes("ağrı") ||
      lower.includes("zonkl") ||
      lower.includes("şiş") ||
      lower.includes("apse") ||
      lower.includes("kanama") ||
      lower.includes("20'lik") ||
      lower.includes("yirmilik")
    ) {
      toolCalls.push({
        id: `tc-${Date.now()}-triage`,
        toolName: "AnalyzeSymptomsTriage",
        timestamp: nowFull,
        argumentsJson: JSON.stringify({
          query: text,
          detectedSymptoms: ["akut ağrı", "ödem/şişlik", "acil muayene"],
          urgencyScore: 96,
        }),
        resultSummary:
          "Acil Klinik Triyaj: Yüksek Öncelik (96/100). Ünit 1 nöbet bloğu kontrol edildi.",
        durationMs: 92,
        status: "warning",
      });

      const surgicalPlan =
        treatmentPlans.find(
          (p) =>
            p.category === "Gömülü 20'lik & Çene Cerrahisi" ||
            p.category === "Kanal Tedavisi (Endodonti)"
        ) || treatmentPlans[0];

      if (surgicalPlan) {
        attachedTreatments = [
          {
            id: surgicalPlan.id,
            code: surgicalPlan.code,
            title: surgicalPlan.title,
            category: surgicalPlan.category,
            price: surgicalPlan.totalPrice,
            sessions: `${surgicalPlan.totalSessions} Seans`,
            dentistName: surgicalPlan.dentistName,
            warrantyInfo: surgicalPlan.warrantyInfo,
            image: surgicalPlan.image,
          },
        ];
      }

      aiReply =
        "Çok geçmiş olsun! Belirttiğiniz şiddetli ağrı ve şişlik bulgularını **Acil Triyaj (Öncelikli Hasta)** olarak işaretledim.\n\nKliniğimize gelene kadar ağrıyan bölgeye dışarıdan sıcak kompres uygulamamanızı ve diş üzerine aspirin/alkol koymamanızı önemle rica ederiz. Herhangi bir **antibiyotik/ilaç alerjiniz** var mı? Bugün **saat 15:00**'te **Ünit 1**'de acil muayene ve panoramik röntgen randevunuzu hemen onaylayayım mı?";
    }
    // 3. Randevu oluşturma talebi
    else if (
      lower.includes("randevu") ||
      lower.includes("muayene") ||
      lower.includes("yarın") ||
      lower.includes("bugün") ||
      lower.includes("saat")
    ) {
      const conv = allConversations.find((c) => c.id === conversationId);
      const targetPlan = treatmentPlans[0];
      toolCalls.push({
        id: `tc-${Date.now()}-apt`,
        toolName: "ScheduleChairAppointment",
        timestamp: nowFull,
        argumentsJson: JSON.stringify({
          patientName: conv?.patientName || "Hasta",
          treatmentCode: targetPlan?.code || "DNT-2041",
          chairUnit: "Ünit 1 (Cerrahi & İmplant)",
          date: "2026-11-05",
          time: "14:30",
          dentistName: "Dt. Kerem Alptekin",
        }),
        resultSummary: `Ünit 1 randevusu oluşturuldu (05.11.2026 14:30) ve WhatsApp konum/onay hatırlatması kuruldu.`,
        durationMs: 118,
        status: "success",
      });

      if (conv && targetPlan) {
        const newApt: Appointment = {
          id: `apt-${Date.now()}`,
          tenantId: currentTenantId,
          patientId: conv.patientId,
          patientName: conv.patientName,
          patientPhone: conv.patientPhone,
          treatmentPlanId: targetPlan.id,
          treatmentCode: targetPlan.code,
          treatmentTitle: "İlk Muayene + Panoramik Röntgen & Tedavi Planlama",
          toothNumbers: conv.extractedContext.toothArea || "Genel Muayene",
          chairUnit: "Ünit 1 (Cerrahi & İmplant)",
          date: "2026-11-05",
          time: "14:30",
          durationMinutes: 45,
          status: "Onaylandı",
          dentistName: "Dt. Kerem Alptekin",
          createdBy: "AI Asistan",
          reminderSent: false,
          patientConfirmed: true,
          reminderChannel: "WhatsApp + SMS",
          notes: `AI Asistan üzerinden hasta talebiyle oluşturuldu: "${text}"`,
        };
        setAllAppointments((prev) => [newApt, ...prev]);
      }

      aiReply = `Muayene ve Panoramik Röntgen randevunuzu **05.11.2026 Perşembe saat 14:30** için **Başhekimimiz Dt. Kerem Alptekin (Ünit 1)** takvimine kaydettim.\n\nRandevunuzdan 24 saat ve 2 saat önce kliniğimizin konumu ve hazırlık notları WhatsApp'ınıza otomatik olarak gönderilecektir.`;
      newStatus = "Randevu Planlandı";
    }
    // 4. Tedavi & Fiyat Sorgulama (Sadece klinikteki doğrulanmış protokoller!)
    else {
      const matched = treatmentPlans.filter((p) => {
        if (lower.includes("implant") && p.category !== "İmplant Cerrahisi")
          return false;
        if (
          (lower.includes("zirkonyum") ||
            lower.includes("gülüş") ||
            lower.includes("lamina") ||
            lower.includes("kaplama")) &&
          p.category !== "Gülüş Tasarımı & Zirkonyum"
        )
          return false;
        if (
          (lower.includes("plak") ||
            lower.includes("invisalign") ||
            lower.includes("tel") ||
            lower.includes("ortodonti")) &&
          p.category !== "Şeffaf Plak & Ortodonti"
        )
          return false;
        if (
          (lower.includes("kanal") || lower.includes("dolgu")) &&
          p.category !== "Kanal Tedavisi (Endodonti)"
        )
          return false;
        if (
          (lower.includes("beyazlatma") || lower.includes("bleaching")) &&
          p.category !== "Diş Beyazlatma & Estetik"
        )
          return false;
        return true;
      });

      const results = matched.length > 0 ? matched.slice(0, 2) : treatmentPlans.slice(0, 2);

      toolCalls.push({
        id: `tc-${Date.now()}-search`,
        toolName: "SearchTreatmentPlans",
        timestamp: nowFull,
        argumentsJson: JSON.stringify({
          query: text,
          tenantId: currentTenantId,
          tdbCompliant: true,
        }),
        resultSummary: `Klinik veritabanında ${results.length} doğrulanmış tedavi protokolü bulundu (${results
          .map((r) => r.code)
          .join(", ")}).`,
        durationMs: 108,
        status: "success",
      });

      toolCalls.push({
        id: `tc-${Date.now()}-send`,
        toolName: "SendTreatmentQuoteCard",
        timestamp: nowFull,
        argumentsJson: JSON.stringify({
          treatmentCodes: results.map((r) => r.code),
        }),
        resultSummary: `${results.length} adet tedavi protokolü ve garanti bilgisi hastaya iletildi.`,
        durationMs: 84,
        status: "success",
      });

      attachedTreatments = results.map((p) => ({
        id: p.id,
        code: p.code,
        title: p.title,
        category: p.category,
        price: p.totalPrice,
        sessions: `${p.totalSessions} Seans`,
        dentistName: p.dentistName,
        warrantyInfo: p.warrantyInfo,
        image: p.image,
      }));

      aiReply =
        `Kliniğimizin güncel tedavi protokollerini inceledim. Talebinize uygun **${results.length} doğrulanmış tedavi paketimiz** aşağıdadır:\n\n` +
        results
          .map(
            (p) =>
              `• **${p.code} – ${p.title}**\n  Hekim: ${p.dentistName} | Süre: ${p.totalSessions} Seans | **${formatTRY(
                p.totalPrice
              )}** (${p.warrantyInfo})`
          )
          .join("\n\n") +
        `\n\nÜcretsiz panoramik röntgen değerlendirmesi ve net tedavi planlaması için size uygun bir muayene randevusu oluşturmamı ister misiniz?`;
    }

    const aiMsg: ChatMessage = {
      id: `msg-${Date.now()}-ai`,
      sender: "ai",
      content: aiReply,
      timestamp: nowTime,
      toolCalls,
      attachedTreatments,
    };

    setAllConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              status: newStatus || c.status,
              lastMessageAt: nowTime,
              messages: [...c.messages, userMsg, aiMsg],
            }
          : c
      )
    );
  };

  const sendCoordinatorMessage = (conversationId: string, text: string) => {
    const nowTime = new Date().toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const coordMsg: ChatMessage = {
      id: `msg-${Date.now()}-coord`,
      sender: "coordinator",
      content: text,
      timestamp: nowTime,
    };
    setAllConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              lastMessageAt: nowTime,
              messages: [...c.messages, coordMsg],
            }
          : c
      )
    );
  };

  const transferConversationToCoordinator = (conversationId: string) => {
    const nowTime = new Date().toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const sysMsg: ChatMessage = {
      id: `msg-${Date.now()}-sys`,
      sender: "system",
      content:
        "Görüşme Hasta Koordinatörü / Hekim kontrolüne alındı. AI otomatik yanıtlayıcı bu hasta için duraklatıldı.",
      timestamp: nowTime,
    };
    setAllConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              status: "Hekim / Koordinatör Bekliyor",
              messages: [...c.messages, sysMsg],
            }
          : c
      )
    );
  };

  const addAppointment: DentalStoreContextType["addAppointment"] = (apt) => {
    const created: Appointment = {
      ...apt,
      id: `apt-${Date.now()}`,
      tenantId: currentTenantId,
    };
    setAllAppointments((prev) => [created, ...prev]);
  };

  const updateAppointmentStatus = (
    id: string,
    status: Appointment["status"]
  ) => {
    setAllAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  const toggleAutomation = (id: string) => {
    setAutomations((prev) =>
      prev.map((job) =>
        job.id === id ? { ...job, isActive: !job.isActive } : job
      )
    );
  };

  const updateAutomationSettings = (
    id: string,
    partial: Partial<AutomationJob>
  ) => {
    setAutomations((prev) =>
      prev.map((job) => (job.id === id ? { ...job, ...partial } : job))
    );
  };

  const triggerAutomationNow = (id: string) => {
    const job = automations.find((j) => j.id === id);
    if (!job) return;
    const nowStr = new Date().toLocaleString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    setAutomations((prev) =>
      prev.map((j) =>
        j.id === id
          ? { ...j, lastRunAt: nowStr, totalRuns30d: j.totalRuns30d + 1 }
          : j
      )
    );
    setAutomationLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        jobId: job.id,
        jobName: job.name,
        executedAt: nowStr,
        durationMs: 195,
        status: "Başarılı",
        detail: `${job.recipientLabel} için WhatsApp klinik şablonu çalıştırıldı ve doğrulandı.`,
        affectedEntity: job.name,
      },
      ...prev,
    ]);
  };

  return (
    <DentalStoreContext.Provider
      value={{
        currentTenant,
        tenants,
        switchTenant,
        updateTenantInfo,
        odontogram,
        updateToothRecord,
        treatmentPlans,
        addTreatmentPlan,
        updateTreatmentPlan,
        deleteTreatmentPlan,
        patients,
        addPatient,
        updatePatientStatus,
        updatePatient,
        conversations,
        sendPatientSimulationMessage,
        sendCoordinatorMessage,
        transferConversationToCoordinator,
        appointments,
        addAppointment,
        updateAppointmentStatus,
        automations,
        automationLogs,
        toggleAutomation,
        triggerAutomationNow,
        updateAutomationSettings,
      }}
    >
      {children}
    </DentalStoreContext.Provider>
  );
}

export function useDentalStore() {
  const ctx = useContext(DentalStoreContext);
  if (!ctx) {
    throw new Error("useDentalStore must be used within DentalStoreProvider");
  }
  return ctx;
}
