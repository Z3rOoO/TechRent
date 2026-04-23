"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const IconComponent = ({ name, className = "w-5 h-5" }) => {
  const icons = {
    dashboard: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    tickets: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    equipment: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20m0 0l-.75 3M9 20H5m4 0h10m0-4h3.75M15 20l.75 3M15 20H11m4-4V5a1 1 0 00-1-1H6a1 1 0 00-1 1v11m0 0H3m2 0h10m-9 3h8" />
      </svg>
    ),
    maintenance: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
    settings: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    menu: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    ),
    chevron: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    ),
  };
  return icons[name] || null;
};

export default function Sidebar({ role = "cliente", onCompactChange }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [isCompact, setIsCompact] = useState(false);

  // Notificar parent quando compact mudar
  useEffect(() => {
    if (onCompactChange) {
      onCompactChange(isCompact);
    }
  }, [isCompact, onCompactChange]);

  const navigationItems = {
    cliente: [
      { label: "Meus Chamados", href: "/chamados", icon: "tickets" },
      { label: "Equipamentos", href: "/equipamentos", icon: "equipment" },
    ],
    tecnico: [
      { label: "Chamados", href: "/chamados", icon: "tickets" },
      { label: "Equipamentos", href: "/equipamentos", icon: "equipment" },
      { label: "Manutenção", href: "/manutencao", icon: "maintenance" },
    ],
    admin: [
      { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
      { label: "Chamados", href: "/chamados", icon: "tickets" },
      { label: "Equipamentos", href: "/equipamentos", icon: "equipment" },
      { label: "Manutenção", href: "/manutencao", icon: "maintenance" },
      { label: "Usuários", href: "/admin/users", icon: "settings" },
    ],
  };

  const items = navigationItems[role] || navigationItems.cliente;

  return (
    <>
      {/* Toggle Button Mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed bottom-6 right-6 z-40 w-12 h-12 rounded-lg bg-slate-950 border border-slate-700 text-slate-300 hover:text-slate-100 hover:bg-slate-800 shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 flex items-center justify-center"
      >
        <IconComponent name="menu" className="w-5 h-5" />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-16 left-0 h-[calc(100vh-4rem)] bg-slate-900/80 backdrop-blur-sm border-r border-slate-700/50 transition-all duration-300 ease-out z-30 ${
          isCompact ? "w-20 md:w-20" : "w-64 md:w-64"
        } ${!isOpen && "md:flex hidden"} overflow-hidden flex flex-col`}
      >
        <nav className="flex flex-col gap-1 p-3 h-full overflow-y-auto scroll-smooth">
          {/* Logo/Branding or Toggle */}
          <div className={`mb-6 rounded-lg transition-all duration-300 ${isCompact ? "p-2" : "px-3 py-2"}`}>
            {isCompact ? (
              <button
                onClick={() => setIsCompact(false)}
                className="w-full py-2 text-slate-300 hover:text-slate-100 hover:bg-slate-700/50 rounded-md transition-colors text-center text-xs font-medium"
                title="Expandir sidebar"
              >
                ➜
              </button>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-slate-100">TechRent</h2>
                  <button
                    onClick={() => setIsCompact(true)}
                    className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 rounded transition-colors"
                    title="Modo compacto"
                  >
                    <IconComponent name="chevron" className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Navigation Items */}
          {items.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => !isOpen && setIsOpen(false)}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 relative overflow-hidden ${
                  isActive
                    ? "bg-slate-700/60 text-slate-100 border-l-2 border-blue-500"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/30"
                }`}
              >
                <div className="shrink-0">
                  <IconComponent name={item.icon} className="w-5 h-5" />
                </div>
                {!isCompact && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                    )}
                  </>
                )}
              </Link>
            );
          })}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Settings */}
          <Link
            href="/settings"
            className="group flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-700/30 transition-all duration-200 border-t border-slate-700/50 pt-3 mt-3"
          >
            <div className="shrink-0">
              <IconComponent name="settings" className="w-5 h-5" />
            </div>
            {!isCompact && <span>Configurações</span>}
          </Link>
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-20 top-16 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
