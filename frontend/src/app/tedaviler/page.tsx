"use client";

import React, { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Eye,
  X,
  Check,
  Activity,
  ShieldCheck,
  Layers,
  CreditCard,
  CheckCircle2,
  Stethoscope,
  Sparkles,
} from "lucide-react";
import { useDentalStore } from "@/context/dental-store";
import {
  CLINIC_CHAIRS,
  CLINIC_DENTISTS,
  TREATMENT_CATEGORIES,
} from "@/lib/mock-data";
import {
  LabStatus,
  ToothCondition,
  ToothRecord,
  TreatmentCategory,
  TreatmentPlan,
  TreatmentPlanStatus,
} from "@/lib/types";
import { cn, formatDateTR, formatTRY } from "@/lib/utils";

const TOOTH_CONDITIONS: ToothCondition[] = [
  "Sağlam",
  "İmplant",
  "Zirkonyum / Kuron",
  "Kanal + Dolgu",
  "Tedavi Planlandı",
  "Eksik Diş",
];

// Sade Klinik Diş Şeması Renk Paleti
const DARK_TOOTH_STYLES: Record<
  ToothCondition,
  {
    tile: string;
    numText: string;
    dot: string;
    crownFill: string;
    crownStroke: string;
  }
> = {
  Sağlam: {
    tile: "bg-white border-slate-200 hover:border-slate-300",
    numText: "text-slate-600",
    dot: "bg-slate-300",
    crownFill: "#F8FAFC",
    crownStroke: "#94A3B8",
  },
  İmplant: {
    tile: "bg-teal-50/80 border-teal-300 hover:bg-teal-50",
    numText: "text-teal-800",
    dot: "bg-teal-500",
    crownFill: "#CCFBF1",
    crownStroke: "#0D9488",
  },
  "Zirkonyum / Kuron": {
    tile: "bg-indigo-50/80 border-indigo-300 hover:bg-indigo-50",
    numText: "text-indigo-800",
    dot: "bg-indigo-500",
    crownFill: "#E0E7FF",
    crownStroke: "#4F46E5",
  },
  "Kanal + Dolgu": {
    tile: "bg-purple-50/80 border-purple-300 hover:bg-purple-50",
    numText: "text-purple-800",
    dot: "bg-purple-500",
    crownFill: "#F3E8FF",
    crownStroke: "#9333EA",
  },
  "Tedavi Planlandı": {
    tile: "bg-amber-50/90 border-amber-300 hover:bg-amber-50",
    numText: "text-amber-900",
    dot: "bg-amber-500",
    crownFill: "#FEF3C7",
    crownStroke: "#D97706",
  },
  "Eksik Diş": {
    tile: "bg-slate-50 border-dashed border-slate-300 opacity-55",
    numText: "text-slate-400",
    dot: "bg-slate-400",
    crownFill: "#F1F5F9",
    crownStroke: "#CBD5E1",
  },
};

const UPPER_RIGHT = [18, 17, 16, 15, 14, 13, 12, 11];
const UPPER_LEFT = [21, 22, 23, 24, 25, 26, 27, 28];
const LOWER_RIGHT = [48, 47, 46, 45, 44, 43, 42, 41];
const LOWER_LEFT = [31, 32, 33, 34, 35, 36, 37, 38];

function DiagnosticToothSvg({
  tooth,
  isUpper,
}: {
  tooth: ToothRecord;
  isUpper: boolean;
}) {
  const style = DARK_TOOTH_STYLES[tooth.condition];
  const isMolar = [6, 7, 8].includes(tooth.fdiNumber % 10);
  const isImplant = tooth.condition === "İmplant";
  const isMissing = tooth.condition === "Eksik Diş";
  const isEndo = tooth.condition === "Kanal + Dolgu";
  const isPlanned = tooth.condition === "Tedavi Planlandı";

  return (
    <svg viewBox="0 0 36 54" className="h-12 w-7 shrink-0" aria-hidden="true">
      {isUpper ? (
        <>
          {!isMissing &&
            (isImplant ? (
              <g stroke="#22D3EE" strokeWidth="1.6" fill="#083344">
                <rect x="13" y="3" width="10" height="19" rx="2" />
                <line x1="13" y1="8" x2="23" y2="8" />
                <line x1="13" y1="13" x2="23" y2="13" />
                <line x1="13" y1="18" x2="23" y2="18" />
              </g>
            ) : isMolar ? (
              <path
                d="M10 22 L12 4 C13 2 15 2 16 6 L18 14 L20 6 C21 2 23 2 24 4 L26 22 Z"
                fill={isEndo ? "#581C87" : "#334155"}
                stroke={isEndo ? "#C084FC" : "#64748B"}
                strokeWidth="1.4"
              />
            ) : (
              <path
                d="M13 22 L16 4 C17 2 19 2 20 4 L23 22 Z"
                fill={isEndo ? "#581C87" : "#334155"}
                stroke={isEndo ? "#C084FC" : "#64748B"}
                strokeWidth="1.4"
              />
            ))}
          <rect
            x="6"
            y="22"
            width="24"
            height="24"
            rx="7"
            fill={style.crownFill}
            stroke={style.crownStroke}
            strokeWidth="1.8"
            strokeDasharray={isMissing ? "3 2" : undefined}
          />
          {isPlanned && <circle cx="18" cy="34" r="4.5" fill="#D97706" />}
        </>
      ) : (
        <>
          <rect
            x="6"
            y="7"
            width="24"
            height="24"
            rx="7"
            fill={style.crownFill}
            stroke={style.crownStroke}
            strokeWidth="1.8"
            strokeDasharray={isMissing ? "3 2" : undefined}
          />
          {isPlanned && <circle cx="18" cy="19" r="4.5" fill="#D97706" />}
          {!isMissing &&
            (isImplant ? (
              <g stroke="#22D3EE" strokeWidth="1.6" fill="#083344">
                <rect x="13" y="31" width="10" height="19" rx="2" />
                <line x1="13" y1="36" x2="23" y2="36" />
                <line x1="13" y1="41" x2="23" y2="41" />
                <line x1="13" y1="46" x2="23" y2="46" />
              </g>
            ) : isMolar ? (
              <path
                d="M10 31 L12 49 C13 51 15 51 16 47 L18 39 L20 47 C21 51 23 51 24 49 L26 31 Z"
                fill={isEndo ? "#581C87" : "#334155"}
                stroke={isEndo ? "#C084FC" : "#64748B"}
                strokeWidth="1.4"
              />
            ) : (
              <path
                d="M13 31 L16 49 C17 51 19 51 20 49 L23 31 Z"
                fill={isEndo ? "#581C87" : "#334155"}
                stroke={isEndo ? "#C084FC" : "#64748B"}
                strokeWidth="1.4"
              />
            ))}
        </>
      )}
    </svg>
  );
}

export default function TreatmentsPage() {
  const {
    odontogram,
    updateToothRecord,
    treatmentPlans,
    patients,
    addTreatmentPlan,
    updateTreatmentPlan,
    deleteTreatmentPlan,
  } = useDentalStore();

  const [selectedFdi, setSelectedFdi] = useState<number>(16);
  const [filterBySelectedTooth, setFilterBySelectedTooth] =
    useState<boolean>(false);

  const selectedTooth =
    odontogram.find((t) => t.fdiNumber === selectedFdi) || odontogram[0];

  const [toothProcDraft, setToothProcDraft] = useState(
    selectedTooth.plannedProcedure || ""
  );
  const [toothNoteDraft, setToothNoteDraft] = useState(
    selectedTooth.dentistNote || ""
  );
  const [toothSavedBadge, setToothSavedBadge] = useState(false);

  const handleSelectTooth = (fdi: number) => {
    setSelectedFdi(fdi);
    const found = odontogram.find((t) => t.fdiNumber === fdi);
    if (found) {
      setToothProcDraft(found.plannedProcedure || "");
      setToothNoteDraft(found.dentistNote || "");
    }
  };

  const handleSaveToothChanges = (newCondition?: ToothCondition) => {
    const cond = newCondition || selectedTooth.condition;
    updateToothRecord(
      selectedTooth.fdiNumber,
      cond,
      toothProcDraft,
      toothNoteDraft
    );
    setToothSavedBadge(true);
    setTimeout(() => setToothSavedBadge(false), 2000);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Tümü");
  const [selectedStatus, setSelectedStatus] = useState<string>("Tümü");

  const [inspectedPlan, setInspectedPlan] = useState<TreatmentPlan | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<TreatmentPlan | null>(null);

  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] =
    useState<TreatmentCategory>("İmplant Cerrahisi");
  const [formStatus, setFormStatus] =
    useState<TreatmentPlanStatus>("Devam Ediyor");
  const [formLabStatus, setFormLabStatus] = useState<LabStatus>(
    "Ölçü Alındı (3D Tarama)"
  );
  const [formPatientName, setFormPatientName] = useState("Berna Kavaklı");
  const [formPatientPhone, setFormPatientPhone] = useState("0532 489 12 65");
  const [formTeethText, setFormTeethText] = useState("16, 26");
  const [formJawArea, setFormJawArea] = useState("Üst Çene Molar Bölgesi");
  const [formDentist, setFormDentist] = useState("Dt. Kerem Alptekin");
  const [formChair, setFormChair] = useState(CLINIC_CHAIRS[0]);
  const [formTotalSessions, setFormTotalSessions] = useState("4");
  const [formCompletedSessions, setFormCompletedSessions] = useState("1");
  const [formTotalPrice, setFormTotalPrice] = useState("54000");
  const [formPaidAmount, setFormPaidAmount] = useState("25000");
  const [formPaymentPlan, setFormPaymentPlan] = useState(
    "%50 Peşinat + 2 Taksit"
  );
  const [formWarranty, setFormWarranty] = useState(
    "Ömür Boyu İmplant + 5 Yıl Üst Yapı Garantisi"
  );
  const [formMaterialsText, setFormMaterialsText] = useState(
    "Straumann SLA İmplant, 3D Dijital Cerrahi Rehber, Monolitik Zirkonyum"
  );
  const [formImageUrl, setFormImageUrl] = useState(
    "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1000&q=80"
  );

  const filteredPlans = useMemo(() => {
    return treatmentPlans.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.patientName.toLowerCase().includes(q) ||
        p.dentistName.toLowerCase().includes(q) ||
        p.jawArea.toLowerCase().includes(q);

      const matchesCategory =
        selectedCategory === "Tümü" || p.category === selectedCategory;
      const matchesStatus =
        selectedStatus === "Tümü" || p.status === selectedStatus;
      const matchesTooth =
        !filterBySelectedTooth || p.toothNumbers.includes(selectedFdi);

      return matchesQuery && matchesCategory && matchesStatus && matchesTooth;
    });
  }, [
    treatmentPlans,
    searchQuery,
    selectedCategory,
    selectedStatus,
    filterBySelectedTooth,
    selectedFdi,
  ]);

  const openCreateModal = (prefillTooth?: number) => {
    setEditingPlan(null);
    setFormTitle("Straumann SLA İmplant + CAD/CAM Zirkonyum Kuron");
    setFormDescription(
      "3D dijital cerrahi rehber eşliğinde atravmatik implant uygulaması ve dijital ağız içi tarama ile zirkonyum üst yapı restorasyonu."
    );
    setFormCategory("İmplant Cerrahisi");
    setFormStatus("Devam Ediyor");
    setFormLabStatus("Ölçü Alındı (3D Tarama)");
    setFormPatientName(patients[0]?.fullName || "Berna Kavaklı");
    setFormPatientPhone(patients[0]?.phone || "0532 489 12 65");
    setFormTeethText(prefillTooth ? String(prefillTooth) : "16, 26");
    setFormJawArea(
      prefillTooth
        ? `Diş #${prefillTooth} Bölgesi`
        : "Üst Çene Bilateral Molar"
    );
    setFormDentist("Dt. Kerem Alptekin");
    setFormChair(CLINIC_CHAIRS[0]);
    setFormTotalSessions("3");
    setFormCompletedSessions("1");
    setFormTotalPrice("42000");
    setFormPaidAmount("20000");
    setFormPaymentPlan("₺20.000 Peşinat + 2 Taksit");
    setFormWarranty("Ömür Boyu Straumann Sertifikalı Garanti");
    setFormMaterialsText(
      "Straumann SLA İmplant, 3Shape Dijital Ölçü, Ivoclar Zirkonyum"
    );
    setFormImageUrl(
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1000&q=80"
    );
    setIsModalOpen(true);
  };

  const openEditModal = (plan: TreatmentPlan) => {
    setEditingPlan(plan);
    setFormTitle(plan.title);
    setFormDescription(plan.description);
    setFormCategory(plan.category);
    setFormStatus(plan.status);
    setFormLabStatus(plan.labStatus);
    setFormPatientName(plan.patientName);
    setFormPatientPhone(plan.patientPhone);
    setFormTeethText(plan.toothNumbers.join(", "));
    setFormJawArea(plan.jawArea);
    setFormDentist(plan.dentistName);
    setFormChair(plan.chairUnit);
    setFormTotalSessions(String(plan.totalSessions));
    setFormCompletedSessions(String(plan.completedSessions));
    setFormTotalPrice(String(plan.totalPrice));
    setFormPaidAmount(String(plan.paidAmount));
    setFormPaymentPlan(plan.paymentPlan);
    setFormWarranty(plan.warrantyInfo);
    setFormMaterialsText(plan.materialsUsed.join(", "));
    setFormImageUrl(plan.image);
    setIsModalOpen(true);
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedTeeth = formTeethText
      .split(",")
      .map((s) => Number(s.replace(/[^0-9]/g, "")))
      .filter((n) => n >= 11 && n <= 48);

    const payload = {
      title: formTitle.trim() || "Yeni Klinik Tedavi Planı",
      description: formDescription.trim() || "Klinik tedavi protokolü.",
      category: formCategory,
      status: formStatus,
      labStatus: formLabStatus,
      patientId: "pat-201",
      patientName: formPatientName.trim() || "Berna Kavaklı",
      patientPhone: formPatientPhone.trim() || "0532 489 12 65",
      toothNumbers: parsedTeeth.length > 0 ? parsedTeeth : [16],
      jawArea: formJawArea.trim() || "Üst Çene",
      dentistName: formDentist,
      chairUnit: formChair,
      totalSessions: Number(formTotalSessions) || 3,
      completedSessions: Number(formCompletedSessions) || 1,
      totalPrice: Number(formTotalPrice) || 35000,
      paidAmount: Number(formPaidAmount) || 15000,
      paymentPlan: formPaymentPlan.trim() || "Peşinat + Taksit",
      warrantyInfo: formWarranty.trim() || "Klinik Sertifikalı Garanti",
      materialsUsed: formMaterialsText
        .split(",")
        .map((m) => m.trim())
        .filter(Boolean),
      image:
        formImageUrl.trim() ||
        "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1000&q=80",
      nextAppointmentDate: "2026-11-06",
    };

    if (editingPlan) {
      updateTreatmentPlan(editingPlan.id, payload);
    } else {
      addTreatmentPlan(payload);
    }
    setIsModalOpen(false);
  };

  const handleQuickCollectPayment = (plan: TreatmentPlan, amount: number) => {
    const newPaid = Math.min(plan.totalPrice, plan.paidAmount + amount);
    const updatedStatus =
      newPaid >= plan.totalPrice && plan.completedSessions >= plan.totalSessions
        ? "Tamamlandı"
        : plan.status;
    updateTreatmentPlan(plan.id, {
      paidAmount: newPaid,
      status: updatedStatus,
    });
    setInspectedPlan({
      ...plan,
      paidAmount: newPaid,
      status: updatedStatus,
    });
  };

  const statusBadgeColor = (s: TreatmentPlanStatus) => {
    switch (s) {
      case "Devam Ediyor":
        return "bg-cyan-50 text-cyan-800 border-cyan-200";
      case "Laboratuvarda":
        return "bg-indigo-50 text-indigo-800 border-indigo-200";
      case "Teklif Sunuldu":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "Tamamlandı":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
    }
  };

  const renderDiagnosticTooth = (fdi: number, isUpper: boolean) => {
    const t = odontogram.find((x) => x.fdiNumber === fdi);
    if (!t) return null;
    const st = DARK_TOOTH_STYLES[t.condition];
    const isSelected = selectedFdi === fdi;

    return (
      <button
        key={fdi}
        type="button"
        onClick={() => handleSelectTooth(fdi)}
        className={cn(
          "flex flex-col items-center justify-between rounded-xl border p-1.5 transition-all cursor-pointer",
          st.tile,
          isSelected &&
            "ring-2 ring-teal-500 border-teal-500 bg-teal-50 scale-105"
        )}
        title={`#${fdi} ${t.name} — ${t.condition}`}
      >
        {isUpper && (
          <span
            className={cn(
              "text-[10.5px] font-mono font-bold",
              isSelected ? "text-teal-900" : st.numText
            )}
          >
            {fdi}
          </span>
        )}
        <DiagnosticToothSvg tooth={t} isUpper={isUpper} />
        {!isUpper && (
          <span
            className={cn(
              "text-[10.5px] font-mono font-bold",
              isSelected ? "text-teal-900" : st.numText
            )}
          >
            {fdi}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="space-y-6">
      {/* SADE & FERAH ODONTOGRAM DİŞ ŞEMASI KARTI */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-2xs">
        {/* Başlık */}
        <div className="flex flex-col gap-4 border-b border-slate-100 pb-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900">
              İnteraktif Diş Şeması (FDI 32 Diş Odontogram)
            </h1>
            <p className="mt-0.5 text-xs text-slate-500">
              Diş üzerine tıklayarak durumunu güncelleyebilir, hekim notu ekleyebilir veya yeni tedavi planı açabilirsiniz.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {TOOTH_CONDITIONS.map((cond) => (
              <span
                key={cond}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700"
              >
                <span
                  className={cn(
                    "h-2 w-2 rounded-full",
                    DARK_TOOTH_STYLES[cond].dot
                  )}
                />
                {cond}
              </span>
            ))}
          </div>
        </div>

        {/* 32 Diş Arkı + Sağ Denetleyici Panel */}
        <div className="mt-5 grid grid-cols-1 gap-6 xl:grid-cols-12">
          {/* Sol 8 Sütun: Üst ve Alt Çene Arkı */}
          <div className="space-y-3 overflow-x-auto pb-1 xl:col-span-8">
            {/* Üst Çene (Maxilla) */}
            <div className="min-w-[660px] rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5">
              <div className="mb-2 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                <span>Sağ Üst (18–11)</span>
                <span className="text-teal-700 font-bold">
                  ÜST ÇENE (MAXILLA)
                </span>
                <span>Sol Üst (21–28)</span>
              </div>
              <div
                className="grid gap-1.5"
                style={{ gridTemplateColumns: "repeat(16, minmax(0, 1fr))" }}
              >
                {UPPER_RIGHT.map((fdi) => renderDiagnosticTooth(fdi, true))}
                {UPPER_LEFT.map((fdi) => renderDiagnosticTooth(fdi, true))}
              </div>
            </div>

            {/* Alt Çene (Mandibula) */}
            <div className="min-w-[660px] rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5">
              <div
                className="grid gap-1.5"
                style={{ gridTemplateColumns: "repeat(16, minmax(0, 1fr))" }}
              >
                {LOWER_RIGHT.map((fdi) => renderDiagnosticTooth(fdi, false))}
                {LOWER_LEFT.map((fdi) => renderDiagnosticTooth(fdi, false))}
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                <span>Sağ Alt (48–41)</span>
                <span className="text-teal-700 font-bold">
                  ALT ÇENE (MANDIBULA)
                </span>
                <span>Sol Alt (31–38)</span>
              </div>
            </div>
          </div>

          {/* Sağ 4 Sütun: Seçili Diş Klinik Denetleyicisi */}
          <div className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 xl:col-span-4">
            <div className="space-y-3.5">
              <div className="flex items-start justify-between gap-2 border-b border-slate-200/80 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-teal-600 px-2 py-0.5 font-mono text-xs font-bold text-white">
                      Diş #{selectedTooth.fdiNumber}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      {selectedTooth.quadrant}
                    </span>
                  </div>
                  <h3 className="mt-1 text-sm font-bold text-slate-900">
                    {selectedTooth.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => openCreateModal(selectedTooth.fdiNumber)}
                  className="inline-flex items-center gap-1 rounded-lg bg-teal-600 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-teal-700 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Plan Ekle
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">
                  Dişin Klinik Durumu
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {TOOTH_CONDITIONS.map((cond) => (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => handleSaveToothChanges(cond)}
                      className={cn(
                        "flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-left text-xs font-medium transition cursor-pointer",
                        selectedTooth.condition === cond
                          ? "border-teal-600 bg-teal-50 text-teal-900 font-semibold"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      )}
                    >
                      <span
                        className={cn(
                          "h-2 w-2 rounded-full",
                          DARK_TOOTH_STYLES[cond].dot
                        )}
                      />
                      <span className="truncate">{cond}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Uygulanan / Planlanan İşlem
                </label>
                <input
                  type="text"
                  value={toothProcDraft}
                  onChange={(e) => setToothProcDraft(e.target.value)}
                  placeholder="Örn: Straumann SLA İmplant + Zirkonyum"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-teal-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Hekim Muayene Notu
                </label>
                <input
                  type="text"
                  value={toothNoteDraft}
                  onChange={(e) => setToothNoteDraft(e.target.value)}
                  placeholder="Örn: Periapikal lezyon izlendi"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-teal-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-200/80 pt-3">
              <button
                type="button"
                onClick={() => setFilterBySelectedTooth(!filterBySelectedTooth)}
                className={cn(
                  "rounded-lg border px-2.5 py-1.5 text-xs font-medium transition cursor-pointer",
                  filterBySelectedTooth
                    ? "border-teal-600 bg-teal-50 text-teal-800"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                )}
              >
                {filterBySelectedTooth
                  ? `#${selectedTooth.fdiNumber} Filtresi Aktif ✓`
                  : `#${selectedTooth.fdiNumber} Planlarını Filtrele`}
              </button>

              <button
                type="button"
                onClick={() => handleSaveToothChanges()}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 cursor-pointer"
              >
                {toothSavedBadge ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    Kaydedildi
                  </>
                ) : (
                  "Kaydet"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ARAMA, FİLTRE & YENİ PROTOKOL BAR */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgb(15,23,42,0.03)] space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Aktif Klinik Tedavi Dosyaları & Protez Laboratuvar Takibi
            </h2>
            <p className="text-xs text-slate-500">
              Hastaların devam eden implant, zirkonyum, şeffaf plak ve endodonti süreçleri
            </p>
          </div>

          <button
            onClick={() => openCreateModal()}
            className="inline-flex items-center gap-2 self-start lg:self-auto rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-cyan-500/20 transition hover:opacity-95 cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            Yeni Tedavi Planı Oluştur
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Protokol kodu (DNT-2041), hasta adı, sorumlu hekim veya kullanılan materyal ara..."
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-cyan-500"
            />
          </div>

          <div className="md:col-span-4">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold focus:outline-none focus:border-cyan-500"
            >
              <option value="Tümü">Tüm Klinik Aşamalar ({treatmentPlans.length})</option>
              <option value="Devam Ediyor">Devam Ediyor</option>
              <option value="Laboratuvarda">Laboratuvarda (Zirkonyum / Plak)</option>
              <option value="Teklif Sunuldu">Teklif Sunuldu (Onay Bekliyor)</option>
              <option value="Tamamlandı">Tamamlandı</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {["Tümü", ...TREATMENT_CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border cursor-pointer",
                selectedCategory === cat
                  ? "bg-slate-900 text-cyan-300 border-slate-900"
                  : "bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* TEDAVİ PROTOKOL DOSYALARI (Modern Medikal Dossier Kartları) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredPlans.map((plan) => {
          const remaining = Math.max(0, plan.totalPrice - plan.paidAmount);
          const sessionPct = Math.round(
            (plan.completedSessions / Math.max(1, plan.totalSessions)) * 100
          );

          return (
            <div
              key={plan.id}
              className="group rounded-3xl border border-slate-200/90 bg-white p-6 shadow-[0_8px_30px_rgb(15,23,42,0.03)] transition hover:border-cyan-400/70 hover:shadow-lg flex flex-col justify-between gap-5"
            >
              <div className="space-y-4">
                {/* Üst Bilgi: Kod, Branş, Diş Numaraları ve Durum */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded-xl bg-slate-900 px-2.5 py-1 font-mono text-xs font-bold text-cyan-300">
                      {plan.code}
                    </span>
                    <span className="rounded-xl bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {plan.category}
                    </span>
                  </div>
                  <span
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-bold",
                      statusBadgeColor(plan.status)
                    )}
                  >
                    {plan.status}
                  </span>
                </div>

                {/* Başlık ve Hasta Özeti */}
                <div className="flex items-start gap-4">
                  <img
                    src={plan.image}
                    alt={plan.title}
                    className="h-20 w-24 shrink-0 rounded-2xl object-cover ring-1 ring-slate-200"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">
                      {plan.title}
                    </h3>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span>
                        Hasta:{" "}
                        <strong className="text-slate-900">
                          {plan.patientName}
                        </strong>
                      </span>
                      <span>
                        Hekim:{" "}
                        <strong className="text-slate-800">
                          {plan.dentistName}
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* FDI Diş Rozetleri & Çene Bölgesi */}
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200/70 bg-slate-50/80 px-4 py-2.5 text-xs">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-semibold text-slate-500">
                      İlgili Dişler:
                    </span>
                    {plan.toothNumbers.map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handleSelectTooth(num)}
                        className="rounded-lg bg-cyan-500/15 px-2 py-0.5 font-mono text-xs font-bold text-cyan-900 ring-1 ring-cyan-500/30 hover:bg-cyan-500/25 cursor-pointer"
                      >
                        #{num}
                      </button>
                    ))}
                  </div>
                  <span className="font-medium text-slate-600">
                    {plan.jawArea}
                  </span>
                </div>

                {/* Seans & Protez Laboratuvar Barı */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-600">
                        Seans İlerlemesi
                      </span>
                      <span className="font-bold text-slate-900">
                        {plan.completedSessions} / {plan.totalSessions} Seans
                      </span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600"
                        style={{ width: `${sessionPct}%` }}
                      />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5 flex flex-col justify-center">
                    <div className="text-[11px] font-medium text-slate-400">
                      Protez & Dijital Lab Durumu
                    </div>
                    <div className="mt-0.5 flex items-center gap-1.5 text-xs font-bold text-indigo-900">
                      <Layers className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                      <span className="truncate">{plan.labStatus}</span>
                    </div>
                  </div>
                </div>

                {/* Kullanılan Materyaller */}
                <div className="flex flex-wrap gap-1.5">
                  {plan.materialsUsed.map((mat) => (
                    <span
                      key={mat}
                      className="rounded-lg border border-slate-200/80 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700"
                    >
                      {mat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Alt Finansal Özet & İşlem Butonları */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="text-[10.5px] font-medium uppercase text-slate-400">
                      Toplam Tutar
                    </div>
                    <div className="text-base font-extrabold text-slate-900 tabular-nums">
                      {formatTRY(plan.totalPrice)}
                    </div>
                  </div>
                  <div className="h-7 w-px bg-slate-200" />
                  <div>
                    <div className="text-[10.5px] font-medium uppercase text-emerald-600">
                      Tahsil Edilen
                    </div>
                    <div className="text-sm font-bold text-emerald-700 tabular-nums">
                      {formatTRY(plan.paidAmount)}
                    </div>
                  </div>
                  {remaining > 0 && (
                    <div>
                      <div className="text-[10.5px] font-medium uppercase text-amber-600">
                        Kalan
                      </div>
                      <div className="text-sm font-bold text-amber-700 tabular-nums">
                        {formatTRY(remaining)}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setInspectedPlan(plan)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5 text-cyan-300" />
                    Dosya & Tahsilat
                  </button>
                  <button
                    onClick={() => openEditModal(plan)}
                    className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 cursor-pointer"
                    title="Düzenle"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => deleteTreatmentPlan(plan.id)}
                    className="rounded-xl border border-slate-200 p-2 text-rose-600 hover:bg-rose-50 cursor-pointer"
                    title="Sil"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tedavi Dosyası & Hızlı Tahsilat Modalı */}
      {inspectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold bg-slate-900 text-cyan-300">
                    {inspectedPlan.code}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-cyan-50 text-cyan-800 border border-cyan-200">
                    {inspectedPlan.category}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 mt-1.5">
                  {inspectedPlan.title}
                </h2>
              </div>
              <button
                onClick={() => setInspectedPlan(null)}
                className="p-1.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {inspectedPlan.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
              <div>
                <div className="text-slate-400 text-[11px]">Toplam Bedel</div>
                <div className="font-bold text-slate-900 text-sm mt-0.5">
                  {formatTRY(inspectedPlan.totalPrice)}
                </div>
              </div>
              <div>
                <div className="text-slate-400 text-[11px]">Tahsil Edilen</div>
                <div className="font-bold text-emerald-700 text-sm mt-0.5">
                  {formatTRY(inspectedPlan.paidAmount)}
                </div>
              </div>
              <div>
                <div className="text-slate-400 text-[11px]">FDI Diş No</div>
                <div className="font-bold text-slate-800 mt-0.5">
                  #{inspectedPlan.toothNumbers.join(", #")}
                </div>
              </div>
              <div>
                <div className="text-slate-400 text-[11px]">Seans</div>
                <div className="font-bold text-slate-800 mt-0.5">
                  {inspectedPlan.completedSessions}/{inspectedPlan.totalSessions} Seans
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0B1120] to-[#112238] text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-cyan-300 font-semibold">
                  Hasta & Ödeme Planı ({inspectedPlan.paymentPlan})
                </div>
                <div className="text-sm font-bold mt-1">
                  {inspectedPlan.patientName} — {inspectedPlan.patientPhone}
                </div>
                <div className="text-xs text-slate-300 mt-0.5">
                  Hekim: {inspectedPlan.dentistName} · {inspectedPlan.warrantyInfo}
                </div>
              </div>

              {inspectedPlan.totalPrice > inspectedPlan.paidAmount && (
                <button
                  type="button"
                  onClick={() =>
                    handleQuickCollectPayment(
                      inspectedPlan,
                      Math.min(
                        10000,
                        inspectedPlan.totalPrice - inspectedPlan.paidAmount
                      )
                    )
                  }
                  className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-400 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-300 transition cursor-pointer shrink-0"
                >
                  <CreditCard className="h-4 w-4" />
                  +₺
                  {Math.min(
                    10000,
                    inspectedPlan.totalPrice - inspectedPlan.paidAmount
                  ).toLocaleString("tr-TR")}{" "}
                  Tahsilat İşle
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Yeni Tedavi Planı Ekle / Düzenle Modalı */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {editingPlan
                    ? `Tedavi Planını Düzenle (${editingPlan.code})`
                    : "Yeni Klinik Tedavi Planı Oluştur"}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Seçilen diş numaraları 3D FDI Odontogram konsoluna otomatik işlenir.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePlan} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Tedavi Branşı
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) =>
                      setFormCategory(e.target.value as TreatmentCategory)
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                  >
                    {TREATMENT_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Klinik Durumu
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) =>
                      setFormStatus(e.target.value as TreatmentPlanStatus)
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="Devam Ediyor">Devam Ediyor</option>
                    <option value="Teklif Sunuldu">Teklif Sunuldu</option>
                    <option value="Laboratuvarda">Laboratuvarda</option>
                    <option value="Tamamlandı">Tamamlandı</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Protez / Lab Aşaması
                  </label>
                  <select
                    value={formLabStatus}
                    onChange={(e) =>
                      setFormLabStatus(e.target.value as LabStatus)
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="Yok">Yok (Cerrahi / Klinik İçi)</option>
                    <option value="Ölçü Alındı (3D Tarama)">
                      Ölçü Alındı (3D Tarama)
                    </option>
                    <option value="Altyapı / Zirkonyum Provada">
                      Altyapı / Zirkonyum Provada
                    </option>
                    <option value="Laboratuvardan Teslim Alındı">
                      Laboratuvardan Teslim Alındı
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Tedavi Planı Başlığı
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Hasta Adı Soyadı
                  </label>
                  <input
                    type="text"
                    required
                    value={formPatientName}
                    onChange={(e) => setFormPatientName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Hasta Telefonu
                  </label>
                  <input
                    type="text"
                    value={formPatientPhone}
                    onChange={(e) => setFormPatientPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    FDI Diş Numaraları (Virgülle)
                  </label>
                  <input
                    type="text"
                    value={formTeethText}
                    onChange={(e) => setFormTeethText(e.target.value)}
                    placeholder="Örn: 16, 26"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Çene / Bölge Tanımı
                  </label>
                  <input
                    type="text"
                    value={formJawArea}
                    onChange={(e) => setFormJawArea(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Sorumlu Hekim
                  </label>
                  <select
                    value={formDentist}
                    onChange={(e) => setFormDentist(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                  >
                    {CLINIC_DENTISTS.map((d) => {
                      const short = d.split(" (")[0];
                      return (
                        <option key={short} value={short}>
                          {d}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Toplam Bedel (TL)
                  </label>
                  <input
                    type="number"
                    required
                    value={formTotalPrice}
                    onChange={(e) => setFormTotalPrice(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Alınan Ödeme (TL)
                  </label>
                  <input
                    type="number"
                    value={formPaidAmount}
                    onChange={(e) => setFormPaidAmount(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Toplam Seans
                  </label>
                  <input
                    type="number"
                    value={formTotalSessions}
                    onChange={(e) => setFormTotalSessions(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Tamamlanan Seans
                  </label>
                  <input
                    type="number"
                    value={formCompletedSessions}
                    onChange={(e) => setFormCompletedSessions(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-xs font-bold text-white cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Kaydet</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
