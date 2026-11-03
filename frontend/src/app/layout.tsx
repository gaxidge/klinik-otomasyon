import type { Metadata } from "next";
import "./globals.css";
import { DentalStoreProvider } from "@/context/dental-store";
import { AppShell } from "@/components/layout/app-shell";

export const metadata: Metadata = {
  title: "DentAI — Yapay Zekâ Destekli Diş Kliniği & Poliklinik Yönetim Platformu",
  description:
    "Ağız ve diş sağlığı poliklinikleri için interaktif FDI diş şeması (Odontogram), tedavi planlama, hasta CRM, ünit takvimi ve 7/24 WhatsApp AI hasta triyaj platformu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="font-sans">
        <DentalStoreProvider>
          <AppShell>{children}</AppShell>
        </DentalStoreProvider>
      </body>
    </html>
  );
}
