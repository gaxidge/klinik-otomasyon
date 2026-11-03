"use client";

import React, { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Phone,
  Mail,
  Sparkles,
  LayoutGrid,
  List,
  X,
  ShieldAlert,
  HeartPulse,
  Users,
  Wallet,
  CalendarClock,
} from "lucide-react";
import { useDentalStore } from "@/context/dental-store";
import {
  AnamnesisAlert,
  Patient,
  PatientStatus,
  TreatmentCategory,
} from "@/lib/types";
import { ANAMNESIS_ALERTS, TREATMENT_CATEGORIES } from "@/lib/mock-data";
import { cn, formatDateTR, formatTRY } from "@/lib/utils";

const PATIENT_STATUSES: PatientStatus[] = [
  "Yeni Başvuru",
  "Muayene & Planlama",
  "Tedavisi Devam Eden",
  "Tamamlandı & Kontrolde",
];

const COLUMN_ACCENTS: Record<
  PatientStatus,
  { bar: string; badge: string; dot: string }
> = {
  "Yeni Başvuru": {
    bar: "bg-cyan-500",
    badge: "bg-cyan-50 text-cyan-800 border-cyan-200",
    dot: "bg-cyan-500",
  },
  "Muayene & Planlama": {
    bar: "bg-amber-500",
    badge: "bg-amber-50 text-amber-800 border-amber-200",
    dot: "bg-amber-500",
  },
  "Tedavisi Devam Eden": {
    bar: "bg-indigo-600",
    badge: "bg-indigo-50 text-indigo-800 border-indigo-200",
    dot: "bg-indigo-600",
  },
  "Tamamlandı & Kontrolde": {
    bar: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-800 border-emerald-200",
    dot: "bg-emerald-500",
  },
};

export default function PatientsCrmPage() {
  const {
    patients,
    treatmentPlans,
    addPatient,
    updatePatientStatus,
    updatePatient,
  } = useDentalStore();

  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Tümü");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("35");
  const [bloodType, setBloodType] = useState("A Rh+");
  const [prefCategory, setPrefCategory] =
    useState<TreatmentCategory>("İmplant Cerrahisi");
  const [complaint, setComplaint] = useState("");
  const [selectedAnamnesis, setSelectedAnamnesis] = useState<AnamnesisAlert>(
    "Sistemik Hastalık Yok"
  );
  const [estimatedBudget, setEstimatedBudget] = useState("45000");
  const [status, setStatus] = useState<PatientStatus>("Yeni Başvuru");
  const [assignedDentist, setAssignedDentist] = useState("Dt. Kerem Alptekin");
  const [notes, setNotes] = useState("");
  const [newNoteText, setNewNoteText] = useState("");

  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.fullName.toLowerCase().includes(q) ||
        p.phone.toLowerCase().includes(q) ||
        p.complaintSummary.toLowerCase().includes(q) ||
        p.interestedTreatments.some((t) => t.toLowerCase().includes(q));
      const matchesStatus =
        statusFilter === "Tümü" || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [patients, searchQuery, statusFilter]);

  const criticalAnamnesisCount = patients.filter((p) =>
    p.anamnesisAlerts.some((a) => a !== "Sistemik Hastalık Yok")
  ).length;
  const totalOpenBalance = patients.reduce(
    (s, p) => s + p.remainingBalance,
    0
  );

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    const est = Number(estimatedBudget) || 35000;
    addPatient({
      fullName: fullName.trim() || "Yeni Hasta",
      phone: phone.trim() || "0532 000 00 00",
      email: email.trim() || "hasta@ornek.com",
      age: Number(age) || 34,
      bloodType,
      interestedTreatments: [prefCategory],
      complaintSummary:
        complaint.trim() ||
        `${prefCategory} kapsamında ilk muayene ve panoramik röntgen talebi.`,
      anamnesisAlerts: [selectedAnamnesis],
      estimatedBudget: est,
      paidTotal: 0,
      remainingBalance: est,
      status,
      notes: notes.trim() || "İlk muayene ve anamnez kaydı açıldı.",
      source: "Web Randevu Formu",
      assignedDentist,
    });
    setIsAddModalOpen(false);
    setFullName("");
    setPhone("");
    setEmail("");
    setComplaint("");
    setNotes("");
  };

  const handleAddInteraction = (pat: Patient) => {
    if (!newNoteText.trim()) return;
    const newInt = {
      id: `int-${Date.now()}`,
      date: new Date().toLocaleString("tr-TR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      channel: "Klinik Muayene" as const,
      summary: newNoteText.trim(),
      staffName: pat.assignedDentist,
    };
    const updated = {
      ...pat,
      lastVisitDate: new Date().toISOString().slice(0, 10),
      interactions: [newInt, ...pat.interactions],
    };
    updatePatient(pat.id, updated);
    setSelectedPatient(updated);
    setNewNoteText("");
  };

  const isCriticalAnamnesis = (alert: AnamnesisAlert) =>
    alert !== "Sistemik Hastalık Yok";

  return (
    <div className="space-y-6">
      {/* ÜST ÖZET KARTLARI & KONTROL BARI */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-[#0B1120] via-[#111E38] to-[#0D283A] p-6 text-white shadow-xl lg:col-span-6 flex flex-col justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-400/15 px-3 py-0.5 text-[11px] font-semibold text-cyan-300 ring-1 ring-cyan-400/30">
              Medikal Kartotek & Anamnez Güvenliği
            </span>
            <h1 className="mt-2.5 text-2xl font-bold tracking-tight">
              Hasta Dosyaları & Klinik CRM
            </h1>
            <p className="mt-1 text-xs text-slate-300 leading-relaxed">
              Hastaların sistemik hastalık / ilaç alerjisi uyarılarını, devam eden tedavi bakiyelerini ve 6 aylık rutin kontrollerini tek ekrandan yönetin.
            </p>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-400 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-md transition hover:bg-cyan-300 cursor-pointer"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              Yeni Hasta & Anamnez Aç
            </button>

            <div className="inline-flex rounded-xl border border-white/15 bg-white/5 p-1">
              <button
                onClick={() => setViewMode("kanban")}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer",
                  viewMode === "kanban"
                    ? "bg-white text-slate-950"
                    : "text-slate-300 hover:text-white"
                )}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                Swimlane Pano
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer",
                  viewMode === "table"
                    ? "bg-white text-slate-950"
                    : "text-slate-300 hover:text-white"
                )}
              >
                <List className="h-3.5 w-3.5" />
                Kartotek Listesi
              </button>
            </div>
          </div>
        </div>

        {/* 3 Mini Medikal Gösterge Kartı */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:col-span-6">
          <div className="rounded-3xl border border-rose-200/80 bg-gradient-to-br from-rose-50/80 to-white p-5 flex flex-col justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-sm">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-extrabold text-rose-950">
                {criticalAnamnesisCount} Hasta
              </div>
              <div className="text-xs font-semibold text-rose-800 mt-0.5">
                Kritik Tıbbi Anamnez Uyarısı
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Penisilin alerjisi, kan sulandırıcı, diyabet
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-white p-5 flex flex-col justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-sm">
              <Wallet className="h-5 w-5" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
                {formatTRY(totalOpenBalance)}
              </div>
              <div className="text-xs font-semibold text-slate-700 mt-0.5">
                Tahsil Bekleyen Bakiye
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Seans bazlı taksitlendirilen hastalar
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-white p-5 flex flex-col justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm">
              <CalendarClock className="h-5 w-5" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-extrabold text-slate-900">
                {patients.length} Dosya
              </div>
              <div className="text-xs font-semibold text-slate-700 mt-0.5">
                6 Aylık Recall Takibinde
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Otomatik diş taşı & implant kontrolü
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ARAMA VE AŞAMA FİLTRESİ */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-[0_8px_30px_rgb(15,23,42,0.03)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Hasta adı, telefon, kan grubu, anamnez uyarısı veya tedavi branşı ara..."
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {["Tümü", ...PATIENT_STATUSES].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={cn(
                "px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border transition cursor-pointer",
                statusFilter === st
                  ? "bg-slate-900 text-cyan-300 border-slate-900"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
              )}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* GÖRÜNÜM 1: SWIMLANE KANBAN PANO */}
      {viewMode === "kanban" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {PATIENT_STATUSES.map((colStatus) => {
            const colPatients = filteredPatients.filter(
              (p) => p.status === colStatus
            );
            const acc = COLUMN_ACCENTS[colStatus];
            return (
              <div
                key={colStatus}
                className="rounded-3xl border border-slate-200/80 bg-white/75 p-4 backdrop-blur-md flex flex-col gap-3.5"
              >
                <div className={cn("h-1.5 w-16 rounded-full", acc.bar)} />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">
                    {colStatus}
                  </span>
                  <span className="rounded-full bg-slate-900 px-2.5 py-0.5 text-xs font-bold text-cyan-300">
                    {colPatients.length}
                  </span>
                </div>

                <div className="space-y-3.5">
                  {colPatients.map((pat) => {
                    const criticalAlerts = pat.anamnesisAlerts.filter(
                      isCriticalAnamnesis
                    );
                    const paidPct = Math.round(
                      (pat.paidTotal / Math.max(1, pat.estimatedBudget)) * 100
                    );

                    return (
                      <div
                        key={pat.id}
                        onClick={() => setSelectedPatient(pat)}
                        className="group rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs transition hover:border-cyan-400 hover:shadow-md cursor-pointer space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-xs font-bold text-cyan-300">
                              {pat.fullName
                                .split(" ")
                                .map((s) => s[0])
                                .join("")
                                .slice(0, 2)}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-slate-900 group-hover:text-cyan-700 transition">
                                {pat.fullName}
                              </div>
                              <div className="text-[11px] text-slate-500">
                                {pat.age} Yaş ·{" "}
                                <span className="font-semibold text-slate-700">
                                  {pat.bloodType}
                                </span>
                              </div>
                            </div>
                          </div>
                          <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                            {pat.source}
                          </span>
                        </div>

                        {/* Tıbbi Anamnez Uyarı Rozeti */}
                        {criticalAlerts.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {criticalAlerts.map((al) => (
                              <span
                                key={al}
                                className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-700 ring-1 ring-inset ring-rose-200"
                              >
                                <ShieldAlert className="h-3.5 w-3.5 text-rose-600" />
                                {al}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50/70 px-2 py-0.5 text-[10.5px] font-semibold text-emerald-800">
                            <HeartPulse className="h-3 w-3 text-emerald-600" />
                            Sistemik Hastalık Yok
                          </span>
                        )}

                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {pat.complaintSummary}
                        </p>

                        {/* Finansal İlerleme */}
                        <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-500">
                              Plan:{" "}
                              <strong className="text-slate-900">
                                {formatTRY(pat.estimatedBudget)}
                              </strong>
                            </span>
                            <span className="font-semibold text-emerald-700">
                              %{paidPct} Ödendi
                            </span>
                          </div>
                          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500"
                              style={{ width: `${paidPct}%` }}
                            />
                          </div>
                        </div>

                        <div className="pt-1 flex items-center justify-between text-xs">
                          <span className="text-[11px] font-medium text-slate-500 truncate">
                            {pat.assignedDentist}
                          </span>
                          <select
                            value={pat.status}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>
                              updatePatientStatus(
                                pat.id,
                                e.target.value as PatientStatus
                              )
                            }
                            className="px-2 py-1 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-700"
                          >
                            {PATIENT_STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* GÖRÜNÜM 2: TABLO KARTOTEK */
        <div className="rounded-3xl border border-slate-200/80 bg-white overflow-hidden shadow-[0_8px_30px_rgb(15,23,42,0.03)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-900 text-[11px] font-bold uppercase tracking-wider text-slate-300">
                  <th className="py-3.5 px-5">Hasta & Kan Grubu</th>
                  <th className="py-3.5 px-5">Tıbbi Anamnez Uyarısı</th>
                  <th className="py-3.5 px-5">İlgili Branş</th>
                  <th className="py-3.5 px-5">Sorumlu Hekim</th>
                  <th className="py-3.5 px-5">Tedavi / Açık Bakiye</th>
                  <th className="py-3.5 px-5">6 Aylık Recall</th>
                  <th className="py-3.5 px-5">Aşama</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredPatients.map((pat) => (
                  <tr
                    key={pat.id}
                    onClick={() => setSelectedPatient(pat)}
                    className="hover:bg-cyan-50/40 transition cursor-pointer"
                  >
                    <td className="py-4 px-5">
                      <div className="font-bold text-slate-900">
                        {pat.fullName}
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        {pat.phone} · {pat.age} Yaş ({pat.bloodType})
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex flex-wrap gap-1">
                        {pat.anamnesisAlerts.map((al) => (
                          <span
                            key={al}
                            className={cn(
                              "px-2.5 py-0.5 rounded-lg text-[11px] font-semibold",
                              isCriticalAnamnesis(al)
                                ? "bg-rose-50 text-rose-700 border border-rose-200"
                                : "bg-slate-100 text-slate-600"
                            )}
                          >
                            {al}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-5 font-semibold text-slate-800">
                      {pat.interestedTreatments.join(", ")}
                    </td>
                    <td className="py-4 px-5 text-slate-700 font-medium">
                      {pat.assignedDentist}
                    </td>
                    <td className="py-4 px-5">
                      <div className="font-bold text-slate-900">
                        {formatTRY(pat.estimatedBudget)}
                      </div>
                      <div className="text-[11px] text-amber-700 font-medium">
                        Açık: {formatTRY(pat.remainingBalance)}
                      </div>
                    </td>
                    <td className="py-4 px-5 text-slate-600 font-medium">
                      {formatDateTR(pat.nextRecallDate)}
                    </td>
                    <td className="py-4 px-5">
                      <span
                        className={cn(
                          "px-2.5 py-1 rounded-full text-[11px] font-bold border",
                          COLUMN_ACCENTS[pat.status].badge
                        )}
                      >
                        {pat.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SAĞDAN AÇILAN KLİNİK HASTA ÇEKMECESİ (Slide-Over Drawer) */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xl h-full overflow-y-auto p-6 sm:p-7 shadow-2xl border-l border-slate-200 space-y-6">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span
                  className={cn(
                    "px-2.5 py-0.5 rounded-full text-xs font-bold border",
                    COLUMN_ACCENTS[selectedPatient.status].badge
                  )}
                >
                  {selectedPatient.status}
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-2">
                  {selectedPatient.fullName}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" />
                    {selectedPatient.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    {selectedPatient.email}
                  </span>
                  <span>
                    {selectedPatient.age} Yaş · Kan:{" "}
                    <strong>{selectedPatient.bloodType}</strong>
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedPatient(null)}
                className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-900">
                <ShieldAlert className="h-4 w-4 text-rose-600" />
                Tıbbi Anamnez & Hekim Uyarı Notu
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {selectedPatient.anamnesisAlerts.map((al) => (
                  <span
                    key={al}
                    className="rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-rose-800 ring-1 ring-inset ring-rose-200"
                  >
                    {al}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-xs text-slate-700 leading-relaxed">
                {selectedPatient.notes}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
                <div className="text-[11px] text-slate-500">Toplam Plan</div>
                <div className="text-base font-extrabold text-slate-900 mt-0.5">
                  {formatTRY(selectedPatient.estimatedBudget)}
                </div>
              </div>
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-3.5">
                <div className="text-[11px] text-emerald-700">Tahsilat</div>
                <div className="text-base font-extrabold text-emerald-950 mt-0.5">
                  {formatTRY(selectedPatient.paidTotal)}
                </div>
              </div>
              <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-3.5">
                <div className="text-[11px] text-amber-800">Açık Bakiye</div>
                <div className="text-base font-extrabold text-amber-950 mt-0.5">
                  {formatTRY(selectedPatient.remainingBalance)}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Klinik Seans ve İletişim Kayıtları
              </h3>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Yeni hekim/seans notu girin..."
                  className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2 text-xs focus:border-cyan-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleAddInteraction(selectedPatient)}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer"
                >
                  Ekle
                </button>
              </div>

              <div className="space-y-2.5">
                {selectedPatient.interactions.map((int) => (
                  <div
                    key={int.id}
                    className="rounded-2xl border border-slate-200/80 bg-slate-50 p-3.5 text-xs"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-bold text-slate-900">
                        {int.channel} · {int.staffName}
                      </span>
                      <span>{int.date}</span>
                    </div>
                    <p className="mt-1.5 text-slate-700">{int.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Yeni Hasta Ekle Modalı */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Yeni Hasta & Tıbbi Anamnez Kaydı Aç
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  İlaç alerjisi ve sistemik hastalık bilgileri kartoteğe işlenir.
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddPatient} className="space-y-3.5 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Örn: Deniz Karahan"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Telefon
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0532 000 00 00"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Yaş
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Kan Grubu
                  </label>
                  <select
                    value={bloodType}
                    onChange={(e) => setBloodType(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="A Rh+">A Rh+</option>
                    <option value="0 Rh+">0 Rh+</option>
                    <option value="B Rh+">B Rh+</option>
                    <option value="AB Rh+">AB Rh+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Tahmini Plan (TL)
                  </label>
                  <input
                    type="number"
                    value={estimatedBudget}
                    onChange={(e) => setEstimatedBudget(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    İlgilendiği Tedavi Branşı
                  </label>
                  <select
                    value={prefCategory}
                    onChange={(e) =>
                      setPrefCategory(e.target.value as TreatmentCategory)
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
                    Tıbbi Anamnez Uyarısı
                  </label>
                  <select
                    value={selectedAnamnesis}
                    onChange={(e) =>
                      setSelectedAnamnesis(e.target.value as AnamnesisAlert)
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                  >
                    {ANAMNESIS_ALERTS.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Şikayet Özeti
                </label>
                <textarea
                  rows={2}
                  value={complaint}
                  onChange={(e) => setComplaint(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-xs font-bold text-white cursor-pointer"
                >
                  Hasta Kartını Oluştur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
