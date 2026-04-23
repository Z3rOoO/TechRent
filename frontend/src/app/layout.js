import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppShell from "../components/layouts/AppShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "TechRent",
  description: "Sistema de Gerenciamento de TI",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
