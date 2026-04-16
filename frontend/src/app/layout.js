import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/ui/Navbar";
import Sidebar from "../components/ui/Sidebar";
import MainLayout from "../components/layouts/MainLayout";

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
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100">
        <Navbar />
        <MainLayout>{children}</MainLayout>
        <footer className="w-full border-t border-slate-700 bg-linear-to-r from-slate-900 to-slate-800 py-6 mt-12">
          <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-400">
            <p>&copy; 2026 TechRent. Todos os direitos reservados.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
