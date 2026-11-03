"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Stethoscope,
  LayoutDashboard,
  Users,
  Bot,
  CalendarDays,
  Zap,
  Settings,
  Bell,
  Plus,
  Menu,
  X,
  MessageCircle,
  Activity,
  ChevronDown,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDentalStore } from "@/context/dental-store";

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  count?: number;
  badgeTone?: "default" | "warning";
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const {
    currentTenant,
    tenants,
    switchTenant,
    treatmentPlans,
    patients,
    conversations,
    appointments,
    automationLogs,
  } = useDentalStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [clinicSwitcherOpen, setClinicSwitcherOpen] = useState(false);

  const upcomingCount = appointments.filter(
    (a) => a.status === "Onaylandı" || a.status === "Beklemede"
  ).length;
  const waitingChats = conversations.filter(
    (c) => c.status === "Hekim / Koordinatör Bekliyor"
  ).length;

  const navItems: NavItem[] = [
    {
      href: "/",
      label: "Genel Bakış",
      icon: LayoutDashboard,
    },
    {
      href: "/tedaviler",
      label: "Odontogram & Tedaviler",
      icon: Activity,
      count: treatmentPlans.length,
    },
    {
      href: "/hastalar",
      label: "Hasta Dosyaları (CRM)",
      icon: Users,
      count: patients.length,
    },
    {
      href: "/randevular",
      label: "Ünit & Randevu Takvimi",
      icon: CalendarDays,
      count: upcomingCount,
    },
    {
      href: "/ai-asistan",
      label: "WhatsApp AI Triyaj",
      icon: Bot,
      count: waitingChats || undefined,
      badgeTone: waitingChats > 0 ? "warning" : "default",
    },
    {
      href: "/otomasyonlar",
      label: "Klinik Otomasyonları",
      icon: Zap,
    },
    {
      href: "/ayarlar",
      label: "Klinik Ayarları",
      icon: Settings,
    },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const activeNav = navItems.find((item) => isActive(item.href)) || navItems[0];

  const renderSidebarContent = (onNavigate?: () => void) => (
    <div className="flex h-full flex-col bg-[#0F172A] text-slate-300 select-none">
      {/* Marka & Klinik Başlığı */}
      <div className="flex h-16 items-center justify-between px-5 border-b border-slate-800/80">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-3"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500 text-slate-950 shadow-sm">
            <Stethoscope className="h-5 w-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold tracking-tight text-white">
                AuraDent
              </span>
              <span className="rounded bg-teal-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-teal-300">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Dijital Poliklinik Sistemi
            </p>
          </div>
        </Link>
      </div>

      {/* Şube / Poliklinik Seçici */}
      <div className="px-3.5 pt-4 pb-2 relative">
        <button
          onClick={() => setClinicSwitcherOpen(!clinicSwitcherOpen)}
          className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-2.5 text-left transition hover:border-slate-700 cursor-pointer"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Building2 className="h-4 w-4 text-teal-400 shrink-0" />
            <div className="min-w-0">
              <div className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                Aktif Şube
              </div>
              <div className="truncate text-xs font-semibold text-white">
                {currentTenant.name}
              </div>
            </div>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
        </button>

        {clinicSwitcherOpen && (
          <div className="mt-1.5 rounded-xl border border-slate-700 bg-slate-900 p-1.5 shadow-xl">
            {tenants.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  switchTenant(t.id);
                  setClinicSwitcherOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition cursor-pointer",
                  t.id === currentTenant.id
                    ? "bg-teal-500/15 text-teal-300 font-semibold"
                    : "text-slate-300 hover:bg-slate-800"
                )}
              >
                <div className="truncate">
                  <div className="truncate">{t.name}</div>
                  <div className="text-[10px] text-slate-400">
                    {t.city} · {t.totalChairs} Ünit
                  </div>
                </div>
                {t.id === currentTenant.id && (
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-400 shrink-0" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Sol Menü Linkleri */}
      <nav className="flex-1 space-y-1 px-3 py-3 overflow-y-auto">
        <div className="px-2.5 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Klinik Yönetimi
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group flex items-center justify-between rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors",
                active
                  ? "bg-teal-500/15 text-white font-semibold border-l-2 border-teal-400"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
              )}
            >
              <span className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    active
                      ? "text-teal-400"
                      : "text-slate-400 group-hover:text-slate-300"
                  )}
                />
                <span>{item.label}</span>
              </span>

              {item.count !== undefined && item.count > 0 && (
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums",
                    item.badgeTone === "warning"
                      ? "bg-amber-400 text-slate-950"
                      : active
                      ? "bg-teal-400/20 text-teal-300"
                      : "bg-slate-800 text-slate-400"
                  )}
                >
                  {item.count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Alt Bilgi: Başhekim Kartı */}
      <div className="border-t border-slate-800/80 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-500/20 text-xs font-bold text-teal-300">
            KA
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-semibold text-white">
              {currentTenant.chiefDentist}
            </div>
            <div className="truncate text-[11px] text-slate-400">
              Başhekim · {currentTenant.totalChairs} Aktif Ünit
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F4F7FA] text-slate-900">
      {/* Masaüstü Sol Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-64 lg:flex-col shadow-xl shadow-slate-950/5">
        {renderSidebarContent()}
      </aside>

      {/* Mobil Çekmece Menü */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 flex h-full w-64 flex-col">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute right-3 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            {renderSidebarContent(() => setMobileMenuOpen(false))}
          </div>
        </div>
      )}

      {/* Sağ İçerik Alanı */}
      <div className="lg:pl-64 flex min-h-screen flex-col">
        {/* Sade ve Ferah Üst Bar */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 sm:px-6 lg:px-8 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {activeNav.label}
              </h2>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                {currentTenant.name} · {currentTenant.city}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* WhatsApp AI Triyaj Durumu */}
            <Link
              href="/ai-asistan"
              className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/80 px-3 py-1.5 text-xs font-medium text-emerald-800 transition hover:bg-emerald-100"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
              <span>AI Triyaj Aktif</span>
            </Link>

            {/* Bildirimler */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-50 cursor-pointer"
                title="Bildirimler"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-teal-500 ring-2 ring-white" />
              </button>

              {notifOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setNotifOpen(false)}
                  />
                  <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl sm:w-96">
                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                      <span className="text-xs font-bold text-slate-900">
                        Son Klinik Bildirimleri
                      </span>
                      <Link
                        href="/otomasyonlar"
                        onClick={() => setNotifOpen(false)}
                        className="text-xs font-medium text-teal-600 hover:text-teal-700"
                      >
                        Tümünü Gör →
                      </Link>
                    </div>
                    <div className="max-h-72 divide-y divide-slate-100 overflow-y-auto">
                      {automationLogs.slice(0, 4).map((log) => (
                        <div key={log.id} className="px-4 py-3 hover:bg-slate-50">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-900">
                              {log.affectedEntity}
                            </span>
                            <span className="text-slate-400">
                              {log.executedAt}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-slate-600">
                            {log.detail}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Yeni Tedavi Planı */}
            <Link
              href="/tedaviler"
              className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-teal-700"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Yeni Tedavi Planı</span>
            </Link>
          </div>
        </header>

        {/* Ana Çalışma Alanı */}
        <main className="mx-auto w-full max-w-[1380px] flex-1 p-5 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
