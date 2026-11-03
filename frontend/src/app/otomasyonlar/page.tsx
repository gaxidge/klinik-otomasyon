"use client";

import React, { useState } from "react";
import {
  BellRing,
  FileText,
  Play,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  Sparkles,
  Edit3,
  X,
  Moon,
  CalendarCheck,
  RefreshCw,
  HeartPulse,
  Layers,
  Stethoscope,
} from "lucide-react";
import { useDentalStore } from "@/context/dental-store";
import { AutomationJob } from "@/lib/types";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS: Record<AutomationJob["category"], React.ElementType> = {
  "Gece & Acil Triyaj": Moon,
  "Randevu & Ünit Koruma": BellRing,
  "Cerrahi Sonrası Bakım": HeartPulse,
  "Tedavi Teklif Takibi": Stethoscope,
  "6 Aylık Rutin Kontrol": RefreshCw,
  "Protez & Laboratuvar": Layers,
  "Gün Sonu Klinik Raporu": FileText,
};

const FILTER_TABS = [
  { id: "Tümü", label: "Tüm Klinik Görevleri" },
  { id: "randevu", label: "Ünit Koruma & Gece Triyajı" },
  { id: "bakim", label: "Cerrahi Sonrası Bakım & 6 Aylık Recall" },
  { id: "teklif", label: "Tedavi Teklifi & Protez Laboratuvar" },
] as const;

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer",
        checked ? "bg-cyan-500" : "bg-slate-300"
      )}
    >
      <span
        className={cn(
          "inline-block h-5 w-5 rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-[22px]" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

export default function AutomationsPage() {
  const {
    automations,
    automationLogs,
    toggleAutomation,
    triggerAutomationNow,
    updateAutomationSettings,
  } = useDentalStore();

  const [selectedFilter, setSelectedFilter] = useState<string>("Tümü");
  const [editingJob, setEditingJob] = useState<AutomationJob | null>(null);
  const [templateDraft, setTemplateDraft] = useState("");
  const [previewDraft, setPreviewDraft] = useState("");
  const [testedJobId, setTestedJobId] = useState<string | null>(null);

  const filteredAutomations = automations.filter((job) => {
    if (selectedFilter === "Tümü") return true;
    if (selectedFilter === "randevu")
      return (
        job.category === "Randevu & Ünit Koruma" ||
        job.category === "Gece & Acil Triyaj"
      );
    if (selectedFilter === "bakim")
      return (
        job.category === "Cerrahi Sonrası Bakım" ||
        job.category === "6 Aylık Rutin Kontrol"
      );
    if (selectedFilter === "teklif")
      return (
        job.category === "Tedavi Teklif Takibi" ||
        job.category === "Protez & Laboratuvar" ||
        job.category === "Gün Sonu Klinik Raporu"
      );
    return true;
  });

  const openEditModal = (job: AutomationJob) => {
    setEditingJob(job);
    setTemplateDraft(job.whatsappTemplate);
    setPreviewDraft(job.whatsappPreview);
  };

  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob) return;
    updateAutomationSettings(editingJob.id, {
      whatsappTemplate: templateDraft,
      whatsappPreview: previewDraft,
    });
    setEditingJob(null);
  };

  const handleTestRun = (id: string) => {
    triggerAutomationNow(id);
    setTestedJobId(id);
    setTimeout(() => setTestedJobId(null), 2500);
  };

  return (
    <div className="space-y-7">
      {/* SADE & FERAH OTOMASYON MOTORU ÖZETİ */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Otomatik Klinik İşlemleri ve WhatsApp Hasta Şablonları
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Boş koltukları önleyen, cerrahi sonrası bakım yapan ve 6 aylık diş taşı temizliği (Recall) çağrısı yapan akıllı iş akışları.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-xl bg-teal-50 px-3.5 py-2 text-xs font-semibold text-teal-800 border border-teal-200 self-start sm:self-auto">
            <Sparkles className="h-4 w-4 text-teal-600" />
            <span>
              {automations.filter((a) => a.isActive).length} /{" "}
              {automations.length} Görev Aktif
            </span>
          </div>
        </div>

        {/* 3 Somut Klinik ROI Kartı */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600">
                Mesai Dışı Yakalanan Hasta
              </span>
              <Moon className="h-4 w-4 text-teal-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">
                48 Hasta
              </span>
              <span className="text-xs font-semibold text-emerald-600">
                Son 30 gün
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Gece diş ağrısıyla veya yurt dışından yazıp randevuya dönüştürülen hastalar.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600">
                Kurtarılan Ünit Seansı (No-Show)
              </span>
              <CalendarCheck className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">
                62 Seans
              </span>
              <span className="text-xs font-semibold text-emerald-600">
                %2.1 Unutulma
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              24 saat ve 2 saat kala giden onay mesajıyla kurtarılan koltuk saatleri.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600">
                Teklif Takibi & 6 Aylık Recall
              </span>
              <RefreshCw className="h-4 w-4 text-amber-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">
                ₺485 Bin
              </span>
              <span className="text-xs font-semibold text-teal-700">
                29 Geri Dönüş
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Muayene olup düşünen hastaların 3. gün takibi ve 6 aylık temizlik çağrısı.
            </p>
          </div>
        </div>
      </div>

      {/* Kategori Filtre Sekmeleri */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedFilter(tab.id)}
            className={cn(
              "px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap border transition cursor-pointer",
              selectedFilter === tab.id
                ? "bg-slate-900 text-cyan-300 border-slate-900 shadow-xs"
                : "bg-white text-slate-600 border-slate-200/80 hover:bg-slate-50"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Görev Kartları */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {filteredAutomations.map((job) => {
          const Icon = CATEGORY_ICONS[job.category] || Sparkles;
          return (
            <div
              key={job.id}
              className={cn(
                "flex flex-col justify-between rounded-3xl border bg-white p-6 transition",
                job.isActive
                  ? "border-slate-200/90 shadow-[0_8px_30px_rgb(15,23,42,0.03)]"
                  : "border-slate-200/60 opacity-75"
              )}
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-cyan-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-lg bg-cyan-50 px-2.5 py-0.5 text-[11px] font-bold text-cyan-900 ring-1 ring-inset ring-cyan-200">
                          {job.category}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Alıcı: {job.recipientLabel}
                        </span>
                      </div>
                      <h2 className="mt-1.5 text-base font-bold text-slate-900">
                        {job.name}
                      </h2>
                    </div>
                  </div>
                  <Toggle
                    checked={job.isActive}
                    onChange={() => toggleAutomation(job.id)}
                  />
                </div>

                <p className="mt-3 text-xs leading-relaxed text-slate-600">
                  {job.description}
                </p>

                <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-2xl bg-slate-50 px-4 py-2.5 border border-slate-200/70">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                    <Clock className="h-3.5 w-3.5 text-cyan-600" />
                    Çalışma Zamanlaması
                  </span>
                  <select
                    value={job.selectedTiming}
                    onChange={(e) =>
                      updateAutomationSettings(job.id, {
                        selectedTiming: e.target.value,
                      })
                    }
                    className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 focus:border-cyan-500 focus:outline-none"
                  >
                    {job.timingOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-4 rounded-2xl border border-emerald-200/90 bg-[#F2FBF6] p-4">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-900">
                      <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
                      Canlı WhatsApp Şablon Önizlemesi
                    </span>
                    <button
                      type="button"
                      onClick={() => openEditModal(job)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 hover:text-emerald-950 underline underline-offset-2 cursor-pointer"
                    >
                      <Edit3 className="h-3 w-3" />
                      Şablonu Düzenle
                    </button>
                  </div>
                  <div className="rounded-xl bg-white p-3.5 text-xs leading-relaxed text-slate-700 shadow-2xs border border-emerald-100">
                    {job.whatsappPreview}
                  </div>
                </div>

                <div className="mt-3.5 flex items-center gap-2 text-xs text-cyan-800 font-bold">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-cyan-600" />
                  <span>{job.impactBadge}</span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs text-slate-500">
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  <span>
                    Son çalışma:{" "}
                    <strong className="text-slate-800">{job.lastRunAt}</strong>
                  </span>
                  <span>
                    Bu ay:{" "}
                    <strong className="text-slate-800">
                      {job.totalRuns30d.toLocaleString("tr-TR")} kez
                    </strong>
                  </span>
                </div>

                <button
                  onClick={() => handleTestRun(job.id)}
                  disabled={!job.isActive}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 font-bold transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
                    testedJobId === job.id
                      ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                      : "border-slate-200 bg-slate-900 text-white hover:bg-slate-800"
                  )}
                >
                  <Play className="h-3.5 w-3.5" />
                  {testedJobId === job.id
                    ? "Test Mesajı Gönderildi ✓"
                    : "Şimdi Test Et"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* WhatsApp Mesaj Şablonu Düzenleme Modalı */}
      {editingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Klinik WhatsApp Şablonunu Özelleştir
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {editingJob.name}
                </p>
              </div>
              <button
                onClick={() => setEditingJob(null)}
                className="p-1.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTemplate} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Mesaj Şablonu
                </label>
                <textarea
                  rows={3}
                  value={templateDraft}
                  onChange={(e) => setTemplateDraft(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 p-3 text-xs leading-relaxed focus:border-cyan-500 focus:outline-none"
                />
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  {[
                    "{Hasta_Adı}",
                    "{Hekim_Adı}",
                    "{Tedavi_Adı}",
                    "{Saat}",
                    "{Ünit_No}",
                    "{Tutar}",
                  ].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() =>
                        setTemplateDraft((prev) => `${prev} ${tag}`)
                      }
                      className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-200 cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Hastada Görünecek Önizleme
                </label>
                <textarea
                  rows={3}
                  value={previewDraft}
                  onChange={(e) => setPreviewDraft(e.target.value)}
                  className="w-full rounded-2xl border border-emerald-200 bg-[#F2FBF6] p-3 text-xs leading-relaxed text-slate-800 focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingJob(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-xs font-bold text-white cursor-pointer"
                >
                  Şablonu Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
