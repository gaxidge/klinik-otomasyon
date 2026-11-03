"use client";

import React, { useState } from "react";
import {
  Stethoscope,
  Users,
  Bot,
  MessageCircle,
  Bell,
  CreditCard,
  CheckCircle2,
  Plus,
  ShieldCheck,
} from "lucide-react";
import { useDentalStore } from "@/context/dental-store";
import { cn } from "@/lib/utils";

type SettingsTab =
  | "klinik"
  | "hekimler"
  | "ai"
  | "whatsapp"
  | "bildirim"
  | "abonelik";

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

const inputCls =
  "w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-sm focus:border-cyan-500 focus:bg-white focus:outline-none";

export default function SettingsPage() {
  const { currentTenant, updateTenantInfo } = useDentalStore();

  const [activeTab, setActiveTab] = useState<SettingsTab>("klinik");
  const [saved, setSaved] = useState(false);

  const [clinicName, setClinicName] = useState(currentTenant.name);
  const [city, setCity] = useState(currentTenant.city);
  const [licenseNo, setLicenseNo] = useState(currentTenant.licenseNumber);
  const [phone, setPhone] = useState(currentTenant.phone);
  const [address, setAddress] = useState(
    "Teşvikiye Cad. Valikonağı Konağı No:48 Kat:2 Nişantaşı, Şişli / İstanbul"
  );

  const [assistantName, setAssistantName] = useState("Defne");
  const [greeting, setGreeting] = useState(
    "Merhaba, Nişantaşı Aura Ağız ve Diş Sağlığı Polikliniği'ne hoş geldiniz! Ben dijital klinik asistanınız Defne. Ağrı şikayetiniz, tedavi fiyatlarımız veya randevu talebiniz için size nasıl yardımcı olabilirim?"
  );
  const [aiPrefs, setAiPrefs] = useState({
    appointments: true,
    triageAlerts: true,
    xrayTransfer: true,
  });

  const [notifs, setNotifs] = useState({
    transfer: true,
    emergency: true,
    labReady: true,
    daily: true,
  });

  const save = (e?: React.FormEvent) => {
    e?.preventDefault();
    updateTenantInfo({
      name: clinicName,
      city,
      licenseNumber: licenseNo,
      phone,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const tabs: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
    { id: "klinik", label: "Poliklinik Bilgileri", icon: Stethoscope },
    { id: "hekimler", label: "Hekimler & Ünitler", icon: Users },
    { id: "ai", label: "AI Triyaj Kuralları", icon: Bot },
    { id: "whatsapp", label: "WhatsApp Cloud API", icon: MessageCircle },
    { id: "bildirim", label: "Bildirimler", icon: Bell },
    { id: "abonelik", label: "Paket & Lisans", icon: CreditCard },
  ];

  const dentists = [
    {
      name: "Dt. Kerem Alptekin",
      role: "Başhekim & Kurucu",
      email: "kerem@nisantasiaura.com.tr",
      specialty: "İmplantoloji & Dijital Rehberli Cerrahi · Ünit 1",
    },
    {
      name: "Uzm. Dt. Selin Soylu",
      role: "Protetik Diş Tedavisi Uzmanı",
      email: "selin@nisantasiaura.com.tr",
      specialty: "Gülüş Tasarımı, Ivoclar Zirkonyum & Lamina · Ünit 2",
    },
    {
      name: "Uzm. Dt. Emre Yalçın",
      role: "Ortodonti & Endodonti Uzmanı",
      email: "emre@nisantasiaura.com.tr",
      specialty: "Invisalign Şeffaf Plak & Mikroskop Kanal Tedavisi · Ünit 3",
    },
    {
      name: "Dt. Zeynep Korkmaz",
      role: "Ağız, Diş ve Çene Cerrahisi",
      email: "zeynep@nisantasiaura.com.tr",
      specialty: "Gömülü 20'lik Diş & Sinüs Lifting Cerrahisi · Ünit 1",
    },
  ];

  return (
    <div className="space-y-6">
      {/* SADE AYARLAR BAŞLIĞI & YATAY SEKMELER */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Poliklinik, Hekim Kadrosu & AI Yapılandırması
          </h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Şube bilgilerinizi, hekim ünitlerinizi ve WhatsApp AI asistan kurallarınızı yönetin.
          </p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={cn(
                  "flex items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-semibold border transition cursor-pointer",
                  active
                    ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                    : "bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100"
                )}
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* İÇERİK KARTI */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-[0_8px_30px_rgb(15,23,42,0.03)]">
        {activeTab === "klinik" && (
          <form onSubmit={save} className="space-y-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Poliklinik / Merkez Adı
                </label>
                <input
                  className={inputCls}
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  İl Sağlık Müdürlüğü Ruhsat No
                </label>
                <input
                  className={inputCls}
                  value={licenseNo}
                  onChange={(e) => setLicenseNo(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Şehir
                </label>
                <input
                  className={inputCls}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Poliklinik Sabit Hat
                </label>
                <input
                  className={inputCls}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Açık Adres (WhatsApp konum paylaşımında kullanılır)
                </label>
                <input
                  className={inputCls}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
              {saved && (
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" /> Kaydedildi
                </span>
              )}
              <button
                type="submit"
                className="rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-5 py-2.5 text-xs font-bold text-white cursor-pointer"
              >
                Bilgileri Kaydet
              </button>
            </div>
          </form>
        )}

        {activeTab === "hekimler" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Hekim Kadrosu & Ünit Eşleşmeleri
                </h2>
                <p className="text-xs text-slate-500">
                  {currentTenant.activeDentists} Aktif Hekim ·{" "}
                  {currentTenant.totalChairs} Ünit
                </p>
              </div>
              <button className="inline-flex items-center gap-1.5 rounded-2xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white">
                <Plus className="h-4 w-4 text-cyan-300" /> Hekim Ekle
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dentists.map((m) => (
                <div
                  key={m.email}
                  className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold text-cyan-300">
                    {m.name
                      .replace("Uzm. ", "")
                      .replace("Dt. ", "")
                      .split(" ")
                      .map((s) => s[0])
                      .join("")}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">
                      {m.name}
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5">
                      {m.specialty}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {m.email}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "ai" && (
          <form onSubmit={save} className="space-y-6">
            <div className="flex items-start gap-3 rounded-2xl bg-cyan-50 p-4 text-xs text-cyan-950 ring-1 ring-cyan-200">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-cyan-700" />
              <span>
                <strong>Sıfır Tıbbi Halüsinasyon Kalkanı:</strong> Asistanınız yalnızca kliniğinizin tanımladığı tedavi paketlerini paylaşır, asla yetkisiz teşhis veya antibiyotik önerisinde bulunmaz.
              </span>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Dijital Asistan Adı
                </label>
                <input
                  className={inputCls}
                  value={assistantName}
                  onChange={(e) => setAssistantName(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Karşılama Mesajı
                </label>
                <input
                  className={inputCls}
                  value={greeting}
                  onChange={(e) => setGreeting(e.target.value)}
                />
              </div>
            </div>

            <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 px-5">
              <div className="flex items-center justify-between py-4">
                <div>
                  <div className="text-sm font-bold text-slate-900">
                    Uygun ünite doğrudan muayene randevusu açabilsin
                  </div>
                  <div className="text-xs text-slate-500">
                    Hasta saat onayladığında ilgili hekimin koltuğuna kaydeder.
                  </div>
                </div>
                <Toggle
                  checked={aiPrefs.appointments}
                  onChange={() =>
                    setAiPrefs((p) => ({ ...p, appointments: !p.appointments }))
                  }
                />
              </div>
              <div className="flex items-center justify-between py-4">
                <div>
                  <div className="text-sm font-bold text-slate-900">
                    Penisilin alerjisi ve kan sulandırıcı bilgisini zorunlu sorsun
                  </div>
                  <div className="text-xs text-slate-500">
                    Cerrahi ve acil ağrı hastalarında kırmızı anamnez uyarısı oluşturur.
                  </div>
                </div>
                <Toggle
                  checked={aiPrefs.triageAlerts}
                  onChange={() =>
                    setAiPrefs((p) => ({ ...p, triageAlerts: !p.triageAlerts }))
                  }
                />
              </div>
            </div>
          </form>
        )}

        {activeTab === "whatsapp" && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div>
                <div className="text-base font-bold text-slate-900">
                  {currentTenant.whatsappNumber}
                </div>
                <div className="text-xs text-slate-500">
                  WhatsApp Cloud API Bağlı · 7/24 Triyaj Aktif
                </div>
              </div>
            </div>
            <span className="rounded-xl bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-800">
              Doğrulanmış Klinik Hattı ✓
            </span>
          </div>
        )}

        {activeTab === "bildirim" && (
          <div className="divide-y divide-slate-100">
            <div className="flex items-center justify-between py-4">
              <div>
                <div className="text-sm font-bold text-slate-900">
                  Panoramik röntgen veya fiyat onayı için hasta devredildiğinde
                </div>
                <div className="text-xs text-slate-500">
                  Anında masaüstü ve mobil bildirim gönderir.
                </div>
              </div>
              <Toggle
                checked={notifs.transfer}
                onChange={() =>
                  setNotifs((n) => ({ ...n, transfer: !n.transfer }))
                }
              />
            </div>
            <div className="flex items-center justify-between py-4">
              <div>
                <div className="text-sm font-bold text-slate-900">
                  Akşam 20:00 Başhekim Ciro & Ünit Doluluk Özeti
                </div>
                <div className="text-xs text-slate-500">
                  Günlük tahsilat ve yarınki koltuk doluluğunu WhatsApp'a iletir.
                </div>
              </div>
              <Toggle
                checked={notifs.daily}
                onChange={() => setNotifs((n) => ({ ...n, daily: !n.daily }))}
              />
            </div>
          </div>
        )}

        {activeTab === "abonelik" && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {[
              {
                name: "Muayenehane",
                price: "₺2.990",
                desc: "1-2 ünitli butik diş muayenehaneleri için",
                features: [
                  "2 Hekim / 2 Ünit Takvimi",
                  "3D İnteraktif FDI Odontogram",
                  "Otomatik Randevu Onay & No-Show Önleme",
                ],
                current: false,
              },
              {
                name: "Poliklinik Pro",
                price: "₺7.900",
                desc: "Büyüyen ağız ve diş sağlığı poliklinikleri için",
                features: [
                  "10 Hekim / 6 Ünite Kadar",
                  "7/24 AI Hasta Triyajı & Fiyat Asistanı",
                  "Cerrahi Sonrası Bakım & 6 Aylık Recall",
                  "Protez Laboratuvar & Taksit Takibi",
                ],
                current: true,
              },
              {
                name: "ADSM & Sağlık Turizmi",
                price: "₺16.500",
                desc: "Çok şubeli merkezler ve uluslararası klinikler için",
                features: [
                  "Sınırsız Hekim, Ünit ve Şube",
                  "Çok Dilli AI Asistan (EN, DE, FR, AR, TR)",
                  "Sağlık Turizmi Uçuş & Otel Planlama",
                ],
                current: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  "flex flex-col rounded-3xl border p-6",
                  plan.current
                    ? "border-cyan-500 bg-slate-900 text-white shadow-xl"
                    : "border-slate-200 bg-slate-50/50"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold">{plan.name}</span>
                  {plan.current && (
                    <span className="rounded-full bg-cyan-400 px-2.5 py-0.5 text-[10px] font-extrabold text-slate-950">
                      AKTİF LİSANS
                    </span>
                  )}
                </div>
                <div className="mt-3">
                  <span className="text-3xl font-extrabold">{plan.price}</span>
                  <span className="text-xs opacity-70"> / ay</span>
                </div>
                <p className="mt-1 text-xs opacity-75">{plan.desc}</p>
                <ul className="mt-5 flex-1 space-y-2.5 border-t border-current/10 pt-4">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-cyan-400" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
