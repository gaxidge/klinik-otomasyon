"use client";

import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  Phone,
  Bell,
  Plus,
  CheckCircle2,
  X,
  Bot,
  Stethoscope,
  Activity,
  Clock,
} from "lucide-react";
import { useDentalStore } from "@/context/dental-store";
import { AppointmentStatus } from "@/lib/types";
import { CLINIC_CHAIRS, CLINIC_DENTISTS } from "@/lib/mock-data";
import { cn, formatDateTR } from "@/lib/utils";

const NOVEMBER_DAYS = [
  { date: "2026-11-02", dayNum: "02", dayName: "Pazartesi" },
  { date: "2026-11-03", dayNum: "03", dayName: "Salı" },
  { date: "2026-11-04", dayNum: "04", dayName: "Çarşamba" },
  { date: "2026-11-05", dayNum: "05", dayName: "Perşembe" },
  { date: "2026-11-06", dayNum: "06", dayName: "Cuma" },
  { date: "2026-11-07", dayNum: "07", dayName: "Cumartesi" },
  { date: "2026-11-08", dayNum: "08", dayName: "Pazar" },
];

export default function AppointmentsPage() {
  const {
    appointments,
    patients,
    treatmentPlans,
    addAppointment,
    updateAppointmentStatus,
  } = useDentalStore();

  const [selectedDate, setSelectedDate] = useState<string>("Tümü");
  const [selectedChairFilter, setSelectedChairFilter] =
    useState<string>("Tümü");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedPatientId, setSelectedPatientId] = useState(
    patients[0]?.id || ""
  );
  const [selectedPlanId, setSelectedPlanId] = useState(
    treatmentPlans[0]?.id || ""
  );
  const [date, setDate] = useState("2026-11-05");
  const [time, setTime] = useState("14:00");
  const [chairUnit, setChairUnit] = useState(CLINIC_CHAIRS[0]);
  const [dentistName, setDentistName] = useState("Dt. Kerem Alptekin");
  const [toothNumbers, setToothNumbers] = useState("#16, #26");
  const [reminderChannel, setReminderChannel] = useState<
    "WhatsApp + SMS" | "WhatsApp" | "Telefon Teyidi"
  >("WhatsApp + SMS");
  const [notes, setNotes] = useState("");

  const filteredAppointments = appointments.filter((a) => {
    const matchDate = selectedDate === "Tümü" || a.date === selectedDate;
    const matchChair =
      selectedChairFilter === "Tümü" || a.chairUnit === selectedChairFilter;
    return matchDate && matchChair;
  });

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const pat = patients.find((p) => p.id === selectedPatientId);
    const plan = treatmentPlans.find((tp) => tp.id === selectedPlanId);

    addAppointment({
      patientId: pat?.id || "pat-custom",
      patientName: pat?.fullName || "Berna Kavaklı",
      patientPhone: pat?.phone || "0532 489 12 65",
      treatmentPlanId: plan?.id || "trt-101",
      treatmentCode: plan?.code || "DNT-2041",
      treatmentTitle:
        plan?.title || "Straumann İmplant & Zirkonyum Üst Yapı Seansı",
      toothNumbers:
        toothNumbers.trim() ||
        (plan ? `#${plan.toothNumbers.join(", #")}` : "#16"),
      chairUnit,
      date,
      time,
      durationMinutes: 45,
      status: "Onaylandı",
      dentistName,
      createdBy: "Hasta Koordinatörü",
      reminderSent: false,
      patientConfirmed: true,
      reminderChannel,
      notes:
        notes.trim() ||
        "Ünit hazırlığı ve sterilizasyon protokolü tamamlandı.",
    });

    setIsModalOpen(false);
    setNotes("");
  };

  const statusColor = (s: AppointmentStatus) => {
    switch (s) {
      case "Onaylandı":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "Beklemede":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "Koltukta / İşlemde":
        return "bg-cyan-50 text-cyan-800 border-cyan-200";
      case "Tamamlandı":
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "İptal / Erteleme":
        return "bg-rose-50 text-rose-700 border-rose-200";
    }
  };

  return (
    <div className="space-y-7">
      {/* SADE & FERAH ÜNİT TAKVİM BAŞLIĞI */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Poliklinik Randevu & Ünit Planlama
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Hekim koltuklarını, 3D Tomografi odasını ve WhatsApp "Geliyorum" onaylarını yönetin.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 self-start sm:self-auto rounded-xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-2xs transition hover:bg-teal-700 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Yeni Ünit Randevusu Aç
          </button>
        </div>

        {/* Ünit Filtre Butonları */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {["Tümü", ...CLINIC_CHAIRS].map((ch) => (
              <button
                key={ch}
                onClick={() => setSelectedChairFilter(ch)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-medium border transition cursor-pointer",
                  selectedChairFilter === ch
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                )}
              >
                {ch === "Tümü" ? "Tüm Ünitler & CBCT" : ch}
              </button>
            ))}
          </div>

          <button
            onClick={() => setSelectedDate("Tümü")}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-medium border transition cursor-pointer",
              selectedDate === "Tümü"
                ? "bg-teal-50 text-teal-800 border-teal-200 font-semibold"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            )}
          >
            Tüm Haftayı Göster ({appointments.length})
          </button>
        </div>

        {/* 7 Günlük Yatay Şerit */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {NOVEMBER_DAYS.map((d) => {
            const dayApts = appointments.filter((a) => a.date === d.date);
            const isSelected = selectedDate === d.date;
            return (
              <button
                key={d.date}
                onClick={() => setSelectedDate(isSelected ? "Tümü" : d.date)}
                className={cn(
                  "p-3 rounded-xl border text-left transition cursor-pointer",
                  isSelected
                    ? "bg-teal-600 text-white border-teal-600 shadow-xs"
                    : "bg-slate-50/70 hover:bg-slate-100/80 border-slate-200/80 text-slate-900"
                )}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "text-[11px] font-medium",
                      isSelected ? "text-teal-100" : "text-slate-500"
                    )}
                  >
                    {d.dayName}
                  </span>
                  {dayApts.length > 0 && (
                    <span
                      className={cn(
                        "text-[10px] font-semibold px-1.5 py-0.5 rounded-md",
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-teal-50 text-teal-700"
                      )}
                    >
                      {dayApts.length} Seans
                    </span>
                  )}
                </div>
                <div className="text-lg font-bold mt-1">
                  {d.dayNum} Kas
                </div>
                <div className="mt-2 space-y-1">
                  {dayApts.slice(0, 2).map((a) => (
                    <div
                      key={a.id}
                      className={cn(
                        "text-[10.5px] px-1.5 py-0.5 rounded truncate font-medium",
                        isSelected
                          ? "bg-white/15 text-white"
                          : "bg-white border border-slate-200/70 text-slate-600"
                      )}
                    >
                      {a.time} · {a.patientName.split(" ")[0]}
                    </div>
                  ))}
                  {dayApts.length === 0 && (
                    <div
                      className={cn(
                        "text-[10.5px]",
                        isSelected ? "text-teal-100" : "text-slate-400"
                      )}
                    >
                      Müsait
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ZAMAN ÇİZELGESİ KARTLARI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredAppointments.map((apt) => (
          <div
            key={apt.id}
            className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-[0_8px_30px_rgb(15,23,42,0.03)] flex flex-col justify-between gap-4 transition hover:border-cyan-400"
          >
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-bold text-cyan-300">
                    <Clock className="h-3.5 w-3.5" />
                    {formatDateTR(apt.date)} • {apt.time} ({apt.durationMinutes} dk)
                  </span>
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold border",
                      statusColor(apt.status)
                    )}
                  >
                    {apt.status}
                  </span>
                </div>

                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700">
                  {apt.createdBy === "AI Asistan" && (
                    <Bot className="w-3.5 h-3.5 text-cyan-600" />
                  )}
                  {apt.createdBy}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                <div>
                  <div className="text-[11px] font-medium text-slate-400">
                    Hasta & İletişim
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {apt.patientName}
                  </div>
                  <div className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3 text-slate-400" />
                    {apt.patientPhone}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-medium text-slate-400">
                    Ünit & FDI Diş No
                  </div>
                  <div className="text-xs font-bold text-slate-900 mt-0.5 truncate">
                    {apt.chairUnit}
                  </div>
                  <div className="text-xs text-cyan-800 font-bold flex items-center gap-1 mt-0.5">
                    <Activity className="w-3.5 h-3.5 text-cyan-600" />
                    Diş: {apt.toothNumbers} ({apt.treatmentCode})
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-900">
                  {apt.treatmentTitle}
                </div>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  {apt.notes}
                </p>
              </div>
            </div>

            <div className="pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-xl border",
                    apt.patientConfirmed
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : "bg-amber-50 text-amber-800 border-amber-200"
                  )}
                >
                  {apt.patientConfirmed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Bell className="w-3.5 h-3.5 text-amber-600" />
                  )}
                  {apt.patientConfirmed
                    ? "WhatsApp Onayı Alındı ✓"
                    : "Otomatik Onay Bekleniyor"}
                </span>
                <span className="text-slate-600 font-semibold">
                  {apt.dentistName}
                </span>
              </div>

              <select
                value={apt.status}
                onChange={(e) =>
                  updateAppointmentStatus(
                    apt.id,
                    e.target.value as AppointmentStatus
                  )
                }
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800"
              >
                <option value="Onaylandı">Onaylandı</option>
                <option value="Beklemede">Beklemede</option>
                <option value="Koltukta / İşlemde">Koltukta / İşlemde</option>
                <option value="Tamamlandı">Tamamlandı</option>
                <option value="İptal / Erteleme">İptal / Erteleme</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* Yeni Randevu Oluşturma Modalı */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Yeni Ünit & Hekim Randevusu Planla
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Hastaya otomatik WhatsApp konum ve onay mesajı gönderilir.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="space-y-3.5 mt-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Hasta Seçin
                </label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} ({p.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Uygulanacak Tedavi Planı
                </label>
                <select
                  value={selectedPlanId}
                  onChange={(e) => setSelectedPlanId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                >
                  {treatmentPlans.map((tp) => (
                    <option key={tp.id} value={tp.id}>
                      {tp.code} — {tp.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Tarih
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Saat
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    FDI Diş No
                  </label>
                  <input
                    type="text"
                    value={toothNumbers}
                    onChange={(e) => setToothNumbers(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Ünit Seçimi
                  </label>
                  <select
                    value={chairUnit}
                    onChange={(e) => setChairUnit(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                  >
                    {CLINIC_CHAIRS.map((ch) => (
                      <option key={ch} value={ch}>
                        {ch}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Sorumlu Hekim
                  </label>
                  <select
                    value={dentistName}
                    onChange={(e) => setDentistName(e.target.value)}
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

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-xs font-bold text-white cursor-pointer"
                >
                  Randevuyu Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
