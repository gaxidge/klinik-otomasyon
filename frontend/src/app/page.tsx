"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Stethoscope,
  Users,
  CalendarCheck,
  ArrowRight,
  AlertCircle,
  Bot,
  Activity,
  CreditCard,
  ShieldAlert,
} from "lucide-react";
import { useDentalStore } from "@/context/dental-store";
import { AIConversation } from "@/lib/types";
import { cn, formatCompactTRY, formatTRY } from "@/lib/utils";

const MONTHLY_CLINIC = [
  { month: "Haz", revenueK: 680, patients: 62, sessions: 145 },
  { month: "Tem", revenueK: 790, patients: 74, sessions: 168 },
  { month: "Ağu", revenueK: 860, patients: 81, sessions: 184 },
  { month: "Eyl", revenueK: 940, patients: 93, sessions: 210 },
  { month: "Eki", revenueK: 1120, patients: 108, sessions: 242 },
  { month: "Kas", revenueK: 1285, patients: 124, sessions: 276 },
];

const CONV_STATUS: Record<
  AIConversation["status"],
  { label: string; cls: string }
> = {
  "AI Triyaj Aktif": {
    label: "AI Triyajda",
    cls: "bg-teal-50 text-teal-700 border-teal-200",
  },
  "Hekim / Koordinatör Bekliyor": {
    label: "Hekim Onayı Bekliyor",
    cls: "bg-amber-50 text-amber-800 border-amber-200",
  },
  "Randevu Planlandı": {
    label: "Randevu Alındı",
    cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  Tamamlandı: {
    label: "Tamamlandı",
    cls: "bg-slate-100 text-slate-700 border-slate-200",
  },
};

export default function DashboardPage() {
  const {
    currentTenant,
    treatmentPlans,
    patients,
    conversations,
    appointments,
  } = useDentalStore();

  const [metric, setMetric] = useState<"revenue" | "patients">("revenue");

  const activePatients = patients.filter(
    (p) =>
      p.status === "Tedavisi Devam Eden" || p.status === "Muayene & Planlama"
  ).length;
  const upcoming = appointments.filter(
    (a) => a.status === "Onaylandı" || a.status === "Beklemede"
  );
  const totalTreatmentVolume = treatmentPlans.reduce(
    (s, p) => s + p.totalPrice,
    0
  );
  const totalCollected = treatmentPlans.reduce((s, p) => s + p.paidAmount, 0);
  const collectionPct = Math.round(
    (totalCollected / Math.max(1, totalTreatmentVolume)) * 100
  );
  const waiting = conversations.filter(
    (c) => c.status === "Hekim / Koordinatör Bekliyor"
  );

  const chairUnits = [
    {
      unit: "Ünit 1 · Cerrahi",
      dentist: "Dt. Kerem Alptekin",
      procedure: "Straumann SLA İmplant Provada",
      teeth: "#16, #26",
      patient: "Berna Kavaklı",
      status: "Seans Aktif",
      dot: "bg-emerald-500",
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      unit: "Ünit 2 · Estetik",
      dentist: "Uzm. Dt. Selin Soylu",
      procedure: "12 Üye Ivoclar Zirkonyum",
      teeth: "#13–#23",
      patient: "Cemre Soydan",
      status: "Lab Teslim",
      dot: "bg-teal-500",
      badge: "bg-teal-50 text-teal-700 border-teal-200",
    },
    {
      unit: "Ünit 3 · Endodonti",
      dentist: "Uzm. Dt. Emre Yalçın",
      procedure: "Mikroskop Kanal + Onley",
      teeth: "#36 Molar",
      patient: "Aylin Çetinkaya",
      status: "Sıradaki 15:30",
      dot: "bg-blue-500",
      badge: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      unit: "3D Tomografi (CBCT)",
      dentist: "Dt. Zeynep Korkmaz",
      procedure: "Gömülü 20'lik Çekim Planı",
      teeth: "#38, #48",
      patient: "Mertcan Öztürk",
      status: "Acil · 14:30",
      dot: "bg-amber-500",
      badge: "bg-amber-50 text-amber-800 border-amber-200",
    },
  ];

  const maxVal = metric === "revenue" ? 1400 : 300;

  return (
    <div className="space-y-6">
      {/* SADE SAYFA BAŞLIĞI */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Hoş geldiniz, {currentTenant.chiefDentist}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Bugün kliniğinizde{" "}
            <span className="font-semibold text-slate-800">
              {upcoming.length} aktif ünit randevusu
            </span>{" "}
            ve{" "}
            <span className="font-semibold text-slate-800">
              {treatmentPlans.length} devam eden tedavi planı
            </span>{" "}
            bulunuyor.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/tedaviler"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50"
          >
            <Activity className="h-4 w-4 text-teal-600" />
            Diş Şeması (Odontogram)
          </Link>
          <Link
            href="/randevular"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-2xs transition hover:bg-slate-800"
          >
            Ünit Takvimini Aç
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* HEKİM ONAYI BEKLEYEN ACİL BİLDİRİM ŞERİDİ (Varsa) */}
      {waiting.length > 0 && (
        <Link
          href="/ai-asistan"
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-3.5 transition hover:bg-amber-50"
        >
          <div className="flex items-center gap-3 text-sm text-amber-950">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
            <span>
              <strong>{waiting.length} hasta</strong> panoramik röntgen ve
              tedavi fiyatı onayınızı bekliyor (
              {waiting.map((w) => w.patientName).join(", ")}).
            </span>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-900">
            Görüşmeyi İncele <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </Link>
      )}

      {/* 4 SADE KPI ÖZET KARTI */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Aktif Tedavi Planı",
            value: `${treatmentPlans.length} Protokol`,
            sub: `Toplam Hacim: ${formatCompactTRY(totalTreatmentVolume)}`,
            icon: Stethoscope,
            iconCls: "bg-teal-50 text-teal-600",
          },
          {
            label: "Tahsil Edilen Tutar",
            value: formatTRY(totalCollected),
            sub: `%${collectionPct} tahsilat oranı`,
            icon: CreditCard,
            iconCls: "bg-emerald-50 text-emerald-600",
          },
          {
            label: "Tedavisi Süren Hasta",
            value: `${activePatients} Hasta`,
            sub: `Toplam ${patients.length} kayıtlı hasta`,
            icon: Users,
            iconCls: "bg-blue-50 text-blue-600",
          },
          {
            label: "Randevu Katılım Oranı",
            value: "%97.9",
            sub: "WhatsApp onaylı koltuk koruma",
            icon: CalendarCheck,
            iconCls: "bg-indigo-50 text-indigo-600",
          },
        ].map((k) => (
          <div
            key={k.label}
            className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">
                {k.label}
              </span>
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-xl",
                  k.iconCls
                )}
              >
                <k.icon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2.5 text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
              {k.value}
            </div>
            <p className="mt-1 text-xs text-slate-500">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* CANLI ÜNİT (KOLTUK) DURUMU — SADE 4'LÜ KART */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Anlık Ünit (Koltuk) Durumu
            </h2>
            <p className="text-xs text-slate-500">
              Poliklinik koltuklarında devam eden ve sıradaki işlemler
            </p>
          </div>
          <Link
            href="/randevular"
            className="text-xs font-semibold text-teal-600 hover:text-teal-700"
          >
            Tüm Randevular →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {chairUnits.map((c) => (
            <div
              key={c.unit}
              className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-slate-50/50 p-3.5"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <span className={cn("h-2 w-2 rounded-full", c.dot)} />
                    {c.unit}
                  </span>
                  <span
                    className={cn(
                      "rounded-md border px-2 py-0.5 text-[10px] font-semibold",
                      c.badge
                    )}
                  >
                    {c.status}
                  </span>
                </div>
                <p className="mt-2 text-xs font-semibold text-slate-800 line-clamp-1">
                  {c.procedure}
                </p>
                <p className="mt-0.5 text-[11px] text-slate-500">{c.dentist}</p>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-slate-200/70 pt-2 text-[11px] text-slate-600">
                <span>{c.patient}</span>
                <span className="font-mono font-semibold text-teal-700">
                  {c.teeth}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ORTA SATIR: AYLIK GRAFİK & YAKLAŞAN RANDEVULAR */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Sol: 6 Aylık Klinik Gelir & Seans Grafiği */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs lg:col-span-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Aylık Klinik Performansı
              </h2>
              <p className="text-xs text-slate-500">
                Son 6 aylık tedavi hacmi ve tamamlanan seans sayısı
              </p>
            </div>
            <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs">
              {(
                [
                  ["revenue", "Tedavi Cirosu (₺ Bin)"],
                  ["patients", "Tamamlanan Seans"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setMetric(key)}
                  className={cn(
                    "rounded-lg px-2.5 py-1 font-medium transition cursor-pointer",
                    metric === key
                      ? "bg-white text-slate-900 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-5">
            <div className="grid h-48 grid-cols-6 items-end gap-4">
              {MONTHLY_CLINIC.map((m) => {
                const a = metric === "revenue" ? m.revenueK : m.sessions;
                const b =
                  metric === "revenue"
                    ? Math.round(m.revenueK * 0.78)
                    : m.patients;
                return (
                  <div
                    key={m.month}
                    className="flex h-full flex-col items-center justify-end"
                  >
                    <span className="mb-1.5 text-[11px] font-semibold text-slate-700 tabular-nums">
                      {metric === "revenue" ? `₺${a}B` : a}
                    </span>
                    <div className="flex h-36 w-full max-w-[44px] items-end gap-1">
                      <div
                        style={{ height: `${(a / maxVal) * 100}%` }}
                        className="w-1/2 rounded-t-md bg-teal-600 transition-all"
                      />
                      <div
                        style={{ height: `${(b / maxVal) * 100}%` }}
                        className="w-1/2 rounded-t-md bg-teal-200 transition-all"
                      />
                    </div>
                    <span className="mt-2 text-xs font-medium text-slate-500">
                      {m.month}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-xs bg-teal-600" />
                  {metric === "revenue" ? "Planlanan Hacim" : "Ünit Seansı"}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-xs bg-teal-200" />
                  {metric === "revenue" ? "Tahsil Edilen" : "Yeni Hasta"}
                </span>
              </div>
              <span className="font-medium text-slate-700">
                Ünit Başı Günlük Ort: ₺32.100
              </span>
            </div>
          </div>
        </div>

        {/* Sağ: Yaklaşan Randevular */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs lg:col-span-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Yaklaşan Randevular
              </h2>
              <p className="text-xs text-slate-500">
                Sıradaki onaylı ünit seansları
              </p>
            </div>
            <Link
              href="/randevular"
              className="text-xs font-semibold text-teal-600 hover:text-teal-700"
            >
              Takvim →
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {upcoming.slice(0, 4).map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/70 bg-slate-50/50 p-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-slate-900 text-white">
                    <span className="text-xs font-bold text-teal-300">
                      {a.time}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-xs font-bold text-slate-900">
                      {a.patientName}
                    </div>
                    <p className="truncate text-xs text-slate-600">
                      {a.treatmentTitle}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {a.chairUnit.split(" (")[0]} · {a.dentistName}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 rounded-md border border-teal-200 bg-teal-50 px-2 py-0.5 font-mono text-[11px] font-semibold text-teal-800">
                  {a.toothNumbers}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ALT SATIR: AI TRİYAJ ÖZETİ & HASTA DÖNÜŞÜM HUNİSİ */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Sol: Son WhatsApp AI Triyaj Görüşmeleri */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs lg:col-span-7">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-teal-600" />
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Son WhatsApp AI Triyaj Görüşmeleri
                </h2>
                <p className="text-xs text-slate-500">
                  Dijital asistanın karşıladığı hastalar ve ön değerlendirme notları
                </p>
              </div>
            </div>
            <Link
              href="/ai-asistan"
              className="text-xs font-semibold text-teal-600 hover:text-teal-700"
            >
              Tüm Görüşmeler →
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {conversations.map((c) => (
              <Link
                key={c.id}
                href="/ai-asistan"
                className="block rounded-xl border border-slate-200/70 p-3.5 transition hover:border-teal-300 hover:bg-slate-50/60"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-900">
                    {c.patientName}
                  </span>
                  <span
                    className={cn(
                      "rounded-md border px-2 py-0.5 text-[11px] font-medium",
                      CONV_STATUS[c.status].cls
                    )}
                  >
                    {CONV_STATUS[c.status].label}
                  </span>
                </div>
                <p className="mt-1 line-clamp-1 text-xs text-slate-600">
                  {c.aiSummary}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="rounded bg-slate-100 px-2 py-0.5 font-medium text-slate-700">
                    {c.extractedContext.targetCategory}
                  </span>
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-600">
                    {c.extractedContext.toothArea}
                  </span>
                  {c.extractedContext.anamnesisNote.includes("Alerji") && (
                    <span className="inline-flex items-center gap-1 rounded bg-rose-50 px-2 py-0.5 font-semibold text-rose-700">
                      <ShieldAlert className="h-3 w-3" />
                      {c.extractedContext.anamnesisNote}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Sağ: Sade Hasta Dönüşüm Hunisi */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs lg:col-span-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Hasta Dönüşüm Özeti
              </h2>
              <p className="text-xs text-slate-500">
                İlk mesajdan tedavi başlangıcına dönüşüm (Son 30 gün)
              </p>
            </div>
            <Link
              href="/hastalar"
              className="text-xs font-semibold text-teal-600 hover:text-teal-700"
            >
              Hasta CRM →
            </Link>
          </div>

          <div className="mt-4 space-y-3.5">
            {[
              {
                stage: "1. WhatsApp / Instagram Başvurusu",
                count: 186,
                pct: 100,
              },
              {
                stage: "2. İlk Muayene & Panoramik Röntgen",
                count: 124,
                pct: 67,
              },
              {
                stage: "3. Tedavi & Fiyat Planı Sunulan",
                count: 96,
                pct: 52,
              },
              {
                stage: "4. Tedaviye Başlayan Hasta",
                count: 68,
                pct: 37,
              },
            ].map((item) => (
              <div key={item.stage} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700">
                    {item.stage}
                  </span>
                  <span className="font-semibold text-slate-900">
                    {item.count} hasta (%{item.pct})
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-teal-600"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
