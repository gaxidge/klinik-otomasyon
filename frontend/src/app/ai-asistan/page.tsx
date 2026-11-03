"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Bot,
  Send,
  UserCheck,
  ShieldCheck,
  Search,
  UserPlus,
  CalendarCheck,
  FileText,
  CheckCircle2,
  MessageCircle,
  Globe,
  Sparkles,
  Info,
  Activity,
  ShieldAlert,
} from "lucide-react";
import { useDentalStore } from "@/context/dental-store";
import { AIConversation, ToolCallName } from "@/lib/types";
import { cn, formatTRY } from "@/lib/utils";

const ACTION_LABELS: Record<
  ToolCallName,
  { label: string; icon: React.ElementType }
> = {
  AnalyzeSymptomsTriage: {
    label: "Acil ağrı & klinik triyaj analizi yapıldı",
    icon: Activity,
  },
  SearchTreatmentPlans: {
    label: "Klinik tedavi protokolleri tarandı",
    icon: Search,
  },
  CheckPatientAnamnesis: {
    label: "Tıbbi anamnez & alerji kaydı işlendi",
    icon: ShieldAlert,
  },
  CreatePatientRecord: {
    label: "Yeni hasta kartı açıldı",
    icon: UserPlus,
  },
  ScheduleChairAppointment: {
    label: "Ünit & hekim randevusu oluşturuldu",
    icon: CalendarCheck,
  },
  SendTreatmentQuoteCard: {
    label: "Tedavi paketi ve garanti bilgisi iletildi",
    icon: FileText,
  },
  TransferToCoordinator: {
    label: "Görüşme Hekim / Koordinatöre aktarıldı",
    icon: UserCheck,
  },
};

const ASSISTANT_CAPABILITIES = [
  "7/24 WhatsApp ve Instagram'dan yazan hastaları 2 saniyede karşılar",
  "Gece başlayan şiddetli diş ağrısı ve apse durumlarında acil triyaj yapar",
  "Penisilin alerjisi, kan sulandırıcı ve diyabet gibi anamnez uyarılarını alır",
  "Yalnızca kliniğinizin onaylı tedavi paketlerini ve garanti bilgisini paylaşır",
  "Uygun ünit ve hekim takvimine doğrudan muayene randevusu açar",
  "Panoramik röntgen veya özel fiyat talebinde görüşmeyi size devreder",
];

const STATUS_STYLES: Record<AIConversation["status"], string> = {
  "AI Triyaj Aktif": "bg-cyan-50 text-cyan-800 ring-cyan-200",
  "Hekim / Koordinatör Bekliyor": "bg-amber-50 text-amber-800 ring-amber-200",
  "Randevu Planlandı": "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Tamamlandı: "bg-slate-100 text-slate-700 ring-slate-200",
};

const STATUS_LABELS: Record<AIConversation["status"], string> = {
  "AI Triyaj Aktif": "AI Triyajda",
  "Hekim / Koordinatör Bekliyor": "Onayınızı Bekliyor",
  "Randevu Planlandı": "Randevu Alındı",
  Tamamlandı: "Tamamlandı",
};

const channelLabel = (c: AIConversation["channel"]) =>
  c === "WhatsApp Cloud API" ? "WhatsApp Hattı" : "Instagram & Web";

const initials = (name: string) =>
  name
    .replace(/\(.*?\)/g, "")
    .trim()
    .split(/\s+/)
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("**") && p.endsWith("**") ? (
          <strong key={i} className="font-semibold">
            {p.slice(2, -2)}
          </strong>
        ) : (
          <React.Fragment key={i}>{p}</React.Fragment>
        )
      )}
    </>
  );
}

export default function AiAssistantPage() {
  const {
    conversations,
    sendPatientSimulationMessage,
    sendCoordinatorMessage,
    transferConversationToCoordinator,
  } = useDentalStore();

  const [selectedConvId, setSelectedConvId] = useState<string>(
    conversations[0]?.id || ""
  );
  const [inputMessage, setInputMessage] = useState("");
  const [mode, setMode] = useState<"coordinator" | "test">("test");
  const scrollRef = useRef<HTMLDivElement>(null);

  const active =
    conversations.find((c) => c.id === selectedConvId) || conversations[0];

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [active?.messages.length, selectedConvId]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !active) return;
    if (mode === "test")
      sendPatientSimulationMessage(active.id, inputMessage.trim());
    else sendCoordinatorMessage(active.id, inputMessage.trim());
    setInputMessage("");
  };

  const examples = [
    "Straumann implant ve zirkonyum kaplama fiyatlarınız nedir?",
    "Sol alt 20'lik dişim çok şiddetli zonkluyor ve yüzüm şişti",
    "Yarın saat 14:30 için muayene randevusu alabilir miyim?",
    "Röntgenimi göndermek ve hekimle görüşmek istiyorum",
  ];

  if (!active) return null;

  const isTransferred = active.status === "Hekim / Koordinatör Bekliyor";

  return (
    <div className="space-y-6">
      {/* ÜST STÜDYO BANNER */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-[#0B1120] via-[#111E38] to-[#0D283A] p-6 text-white shadow-xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-400/15 px-3 py-0.5 text-[11px] font-semibold text-cyan-300 ring-1 ring-cyan-400/30">
            7/24 Omnichannel Hasta Triyaj Stüdyosu
          </span>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">
            AI Hasta Asistanı & WhatsApp Triyaj Merkezi
          </h1>
          <p className="mt-1 text-xs text-slate-300">
            Gece diş ağrısı çeken hastaları, yurt dışı sağlık turizmi başvurularını ve tedavi fiyat sorularını gerçek zamanlı izleyin.
          </p>
        </div>

        <div className="inline-flex items-center gap-2.5 rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-2.5 text-xs font-medium text-cyan-200">
          <ShieldCheck className="h-4 w-4 text-cyan-400 shrink-0" />
          <span>
            <strong>TDB Uyumlu Klinik Kalkan:</strong> Yetkisiz teşhis koymaz, yalnızca onaylı protokolleri sunar
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
        {/* Sol: Görüşme Listesi */}
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgb(15,23,42,0.03)] lg:col-span-3">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-900 px-5 py-4 text-white">
            <span className="text-sm font-bold">Canlı Triyaj Kuyruğu</span>
            <span className="rounded-full bg-cyan-400 px-2 py-0.5 text-[11px] font-bold text-slate-950">
              {conversations.length}
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            {conversations.map((conv) => {
              const selected = conv.id === active.id;
              const last = conv.messages[conv.messages.length - 1];
              return (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConvId(conv.id)}
                  className={cn(
                    "flex w-full gap-3 px-4 py-4 text-left transition cursor-pointer",
                    selected
                      ? "bg-cyan-50/70 border-l-4 border-l-cyan-500"
                      : "hover:bg-slate-50"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-xs font-bold",
                      selected
                        ? "bg-slate-900 text-cyan-300"
                        : "bg-slate-100 text-slate-600"
                    )}
                  >
                    {initials(conv.patientName)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-[13px] font-bold text-slate-900">
                        {conv.patientName}
                      </span>
                      <span className="shrink-0 text-[11px] text-slate-400">
                        {conv.lastMessageAt}
                      </span>
                    </div>
                    <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">
                      {last?.content.replace(/\*\*/g, "")}
                    </p>
                    <span
                      className={cn(
                        "mt-2 inline-flex rounded-full px-2 py-0.5 text-[10.5px] font-bold ring-1 ring-inset",
                        STATUS_STYLES[conv.status]
                      )}
                    >
                      {STATUS_LABELS[conv.status]}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Orta: Sohbet Konsolu */}
        <div className="flex h-[740px] flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgb(15,23,42,0.03)] lg:col-span-6">
          <div className="flex items-center justify-between gap-3 border-b border-slate-200/80 bg-slate-900 px-5 py-4 text-white">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-600 text-xs font-extrabold text-slate-950">
                {initials(active.patientName)}
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-bold text-white">
                  {active.patientName}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-300">
                  {active.channel === "WhatsApp Cloud API" ? (
                    <MessageCircle className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Globe className="h-3.5 w-3.5 text-cyan-400" />
                  )}
                  {channelLabel(active.channel)} · {active.patientPhone}
                </div>
              </div>
            </div>
            <button
              onClick={() => transferConversationToCoordinator(active.id)}
              disabled={isTransferred}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition cursor-pointer",
                isTransferred
                  ? "cursor-default bg-amber-400 text-slate-950"
                  : "bg-white/10 text-white hover:bg-white/20"
              )}
            >
              <UserCheck className="h-3.5 w-3.5" />
              {isTransferred ? "Kontrol Sizde" : "Görüşmeyi Devral"}
            </button>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 space-y-5 overflow-y-auto bg-[#F2F5F9] px-5 py-5"
          >
            {active.messages.map((msg) => {
              if (msg.sender === "system") {
                return (
                  <div key={msg.id} className="flex justify-center">
                    <div className="rounded-full bg-amber-100 px-3.5 py-1.5 text-[11px] font-bold text-amber-900">
                      {msg.content}
                    </div>
                  </div>
                );
              }

              const isPatient = msg.sender === "patient";
              const senderName = isPatient
                ? active.patientName
                : msg.sender === "coordinator"
                ? "Hasta Koordinatörü"
                : "AURA AI Triyaj";

              return (
                <div
                  key={msg.id}
                  className={cn(
                    "flex flex-col gap-2",
                    isPatient ? "items-start" : "items-end"
                  )}
                >
                  {msg.toolCalls && msg.toolCalls.length > 0 && (
                    <div className="flex max-w-[85%] flex-wrap justify-end gap-1.5">
                      {msg.toolCalls.map((tc) => {
                        const Icon = ACTION_LABELS[tc.toolName].icon;
                        const warn = tc.status === "warning";
                        return (
                          <span
                            key={tc.id}
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-semibold shadow-2xs ring-1 ring-inset",
                              warn
                                ? "text-amber-800 ring-amber-300"
                                : "text-slate-700 ring-slate-200"
                            )}
                          >
                            <Icon
                              className={cn(
                                "h-3 w-3",
                                warn ? "text-amber-600" : "text-cyan-600"
                              )}
                            />
                            {ACTION_LABELS[tc.toolName].label}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  <div
                    className={cn(
                      "max-w-[85%] rounded-3xl px-4 py-3.5 text-[13px] leading-relaxed shadow-xs",
                      isPatient
                        ? "rounded-tl-md bg-white text-slate-800 ring-1 ring-slate-200/80"
                        : msg.sender === "coordinator"
                        ? "rounded-tr-md bg-indigo-950 text-white"
                        : "rounded-tr-md bg-[#0B1120] text-white"
                    )}
                  >
                    <div className="mb-1 flex items-center gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 font-semibold">
                        {msg.sender === "ai" && (
                          <Sparkles className="h-3 w-3 text-cyan-400" />
                        )}
                        {senderName}
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <div className="whitespace-pre-line">
                      <RichText text={msg.content} />
                    </div>
                  </div>

                  {msg.attachedTreatments &&
                    msg.attachedTreatments.length > 0 && (
                      <div className="grid w-full max-w-[85%] gap-2">
                        {msg.attachedTreatments.map((t) => (
                          <div
                            key={t.id}
                            className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-xs ring-1 ring-slate-200"
                          >
                            <img
                              src={t.image}
                              alt={t.title}
                              className="h-14 w-16 shrink-0 rounded-xl object-cover"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-[13px] font-bold text-slate-900">
                                {t.title}
                              </div>
                              <div className="mt-0.5 text-xs text-slate-500">
                                {t.dentistName} · {t.sessions}
                              </div>
                            </div>
                            <div className="shrink-0 text-right">
                              <div className="text-[13px] font-extrabold text-slate-900">
                                {formatTRY(t.price)}
                              </div>
                              <div className="text-[11px] font-mono font-bold text-cyan-700">
                                {t.code}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              );
            })}
          </div>

          <div className="space-y-3 border-t border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setMode("test")}
                  className={cn(
                    "rounded-lg px-3 py-1.5 font-bold transition cursor-pointer",
                    mode === "test"
                      ? "bg-slate-900 text-cyan-300 shadow-xs"
                      : "text-slate-500"
                  )}
                >
                  Simülatör (Hasta Gibi Yaz)
                </button>
                <button
                  type="button"
                  onClick={() => setMode("coordinator")}
                  className={cn(
                    "rounded-lg px-3 py-1.5 font-bold transition cursor-pointer",
                    mode === "coordinator"
                      ? "bg-slate-900 text-cyan-300 shadow-xs"
                      : "text-slate-500"
                  )}
                >
                  Koordinatör Olarak Yaz
                </button>
              </div>
              <span className="hidden items-center gap-1 text-[11px] text-slate-400 sm:flex">
                <Info className="h-3 w-3" />
                {mode === "test"
                  ? "Ağrı veya fiyat sorusu gönderip AI triyajını test edin"
                  : "Mesajınız doğrudan hastaya gider"}
              </span>
            </div>

            {mode === "test" && (
              <div className="flex gap-1.5 overflow-x-auto pb-0.5">
                {examples.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => sendPatientSimulationMessage(active.id, p)}
                    className="whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 transition hover:border-cyan-500 hover:bg-cyan-50 cursor-pointer"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={handleSend} className="flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={
                  mode === "test"
                    ? "Hasta gibi ağrı şikayeti veya tedavi fiyatı sorun…"
                    : "Hastaya mesajınızı yazın…"
                }
                className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-cyan-500 focus:bg-white focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:opacity-95 cursor-pointer"
              >
                <Send className="h-4 w-4" />
                Gönder
              </button>
            </form>
          </div>
        </div>

        {/* Sağ: Klinik Triyaj Kartı */}
        <div className="space-y-4 lg:col-span-3">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgb(15,23,42,0.03)]">
            <h3 className="text-sm font-bold text-slate-900">
              Otomatik Çıkarılan Triyaj Dosyası
            </h3>
            <p className="mt-0.5 text-xs text-slate-500">
              AI tarafından konuşmadan ayrıştırılan veriler
            </p>

            <dl className="mt-4 space-y-3 text-xs">
              {[
                ["İlgili Branş", active.extractedContext.targetCategory],
                ["FDI Bölgesi", active.extractedContext.toothArea],
                ["Aciliyet Düzeyi", active.extractedContext.painLevel],
                ["Tahmini Bütçe", active.extractedContext.estimatedQuoteRange],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="rounded-xl bg-slate-50 p-2.5 border border-slate-100"
                >
                  <dt className="text-[11px] text-slate-400">{k}</dt>
                  <dd className="mt-0.5 font-bold text-slate-900">{v}</dd>
                </div>
              ))}
              <div className="pt-1">
                <dt className="mb-1.5 text-slate-500 font-semibold">
                  Tıbbi Anamnez Uyarısı
                </dt>
                <dd>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold ring-1 ring-inset",
                      active.extractedContext.anamnesisNote.includes("Alerji")
                        ? "bg-rose-50 text-rose-800 ring-rose-200"
                        : "bg-slate-100 text-slate-700 ring-slate-200"
                    )}
                  >
                    <ShieldAlert className="h-3.5 w-3.5" />
                    {active.extractedContext.anamnesisNote}
                  </span>
                </dd>
              </div>
            </dl>

            <div className="mt-4 border-t border-slate-100 pt-4">
              <div className="text-xs font-bold text-slate-900">
                Hekim İçin Vaka Özeti
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                {active.aiSummary}
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgb(15,23,42,0.03)]">
            <h3 className="text-sm font-bold text-slate-900">
              AURA AI Neler Yapar?
            </h3>
            <ul className="mt-3 space-y-2.5">
              {ASSISTANT_CAPABILITIES.map((c) => (
                <li
                  key={c}
                  className="flex items-start gap-2 text-xs text-slate-600"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-600" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
