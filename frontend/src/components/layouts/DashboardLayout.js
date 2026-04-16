"use client";
import { useEffect, useState } from "react";
import Sidebar from "../ui/Sidebar";

export default function DashboardLayout({ children }) {
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [sidebarCompact, setSidebarCompact] = useState(false);

  useEffect(() => {
    setMounted(true);
    const raw = localStorage.getItem("techrent_user");
    if (raw) {
      setUser(JSON.parse(raw));
    }
  }, []);

  if (!mounted) {
    return <main className="flex-1 w-full">{children}</main>;
  }

  // Se está logado, mostra sidebar + main
  if (user) {
    return (
      <div className="flex flex-1 w-full">
        <SidebarWrapper role={user.nivel_acesso} onCompactChange={setSidebarCompact} />
        <main className={`flex-1 w-full transition-all duration-300 ease-out ${sidebarCompact ? "md:ml-20" : "md:ml-64"}`}>
          {children}
        </main>
      </div>
    );
  }

  return <main className="flex-1 w-full">{children}</main>;
}

// Wrapper para capturar estado compact do Sidebar
function SidebarWrapper({ role, onCompactChange }) {
  return (
    <Sidebar role={role} onCompactChange={onCompactChange} />
  );
}
