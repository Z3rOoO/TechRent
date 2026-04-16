"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";

export default function MainLayout({ children }) {
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const raw = localStorage.getItem("techrent_user");
    if (raw) {
      setUser(JSON.parse(raw));
    }
  }, []);

  if (!mounted) {
    return (
      <main className="flex-1 w-full">
        {children}
      </main>
    );
  }

  // Se não está logado, mostra só o main (para landing page)
  if (!user) {
    return (
      <main className="flex-1 w-full">
        {children}
      </main>
    );
  }

  // Se está logado, usa DashboardLayout que gerencia o sidebar
  return <DashboardLayout>{children}</DashboardLayout>;
}
