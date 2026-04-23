"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Spinner from "../ui/Spinner";

// ─── Ícones SVG inline ────────────────────────────────────────────────────────
function Icon({ name, className = "w-5 h-5" }) {
  const icons = {
    dashboard: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="2"/>
        <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="2"/>
        <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="2"/>
        <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="2"/>
      </svg>
    ),
    tickets: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
      </svg>
    ),
    equipment: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="2" y="3" width="20" height="14" rx="2" strokeWidth="2"/>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 21h8M12 17v4"/>
      </svg>
    ),
    maintenance: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
        <circle cx="12" cy="12" r="3" strokeWidth="2"/>
      </svg>
    ),
    users: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
      </svg>
    ),
    settings: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
        <circle cx="12" cy="12" r="3" strokeWidth="2"/>
      </svg>
    ),
    menu: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
      </svg>
    ),
    close: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
      </svg>
    ),
    chevron: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
      </svg>
    ),
    logout: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
      </svg>
    ),
    profile: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
      </svg>
    ),
    bell: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
      </svg>
    ),
  };
  return icons[name] || null;
}

// ─── Sidebar Admin ─────────────────────────────────────────────────────────────
const adminNavItems = [
  { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { label: "Chamados", href: "/chamados", icon: "tickets" },
  { label: "Equipamentos", href: "/equipamentos", icon: "equipment" },
  { label: "Manutenção", href: "/manutencao", icon: "maintenance" },
  { label: "Usuários", href: "/admin/users", icon: "users" },
  { label: "Configurações", href: "/settings", icon: "settings" },
];

function AdminSidebar({ compact, onToggleCompact, mobileOpen, onCloseMobile }) {
  const pathname = usePathname();

  return (
    <>
      {/* Sidebar */}
      <aside
        style={{
          width: compact ? "72px" : "260px",
          minWidth: compact ? "72px" : "260px",
          background: "rgba(8,14,28,0.95)",
          borderRight: "1px solid rgba(99,130,200,0.1)",
          backdropFilter: "blur(20px)",
          transition: "width 0.3s ease, min-width 0.3s ease",
          position: "sticky",
          top: "64px",
          height: "calc(100vh - 64px)",
          overflowY: "auto",
          overflowX: "hidden",
          flexShrink: 0,
          zIndex: 30,
        }}
        className={`hidden md:flex flex-col`}
      >
        <SidebarContent
          items={adminNavItems}
          pathname={pathname}
          compact={compact}
          onToggleCompact={onToggleCompact}
        />
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onCloseMobile}
          />
          <aside
            style={{
              width: "260px",
              background: "rgba(8,14,28,0.98)",
              borderRight: "1px solid rgba(99,130,200,0.15)",
              backdropFilter: "blur(20px)",
              position: "fixed",
              top: "64px",
              left: 0,
              height: "calc(100vh - 64px)",
              overflowY: "auto",
              zIndex: 50,
            }}
            className="md:hidden flex flex-col animate-slide-in-from-left"
          >
            <SidebarContent
              items={adminNavItems}
              pathname={pathname}
              compact={false}
              onToggleCompact={() => {}}
              onItemClick={onCloseMobile}
            />
          </aside>
        </>
      )}
    </>
  );
}

function SidebarContent({ items, pathname, compact, onToggleCompact, onItemClick }) {
  return (
    <nav className="flex flex-col h-full p-3 gap-1">
      {/* Brand */}
      <div className={`mb-4 flex items-center ${compact ? "justify-center px-1 py-3" : "justify-between px-3 py-3"}`}>
        {!compact && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">T</div>
            <span className="font-bold text-slate-100 text-sm tracking-tight">TechRent</span>
          </div>
        )}
        <button
          onClick={onToggleCompact}
          className="p-1.5 rounded-md text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 transition-colors"
          title={compact ? "Expandir" : "Compactar"}
        >
          <Icon name="chevron" className={`w-4 h-4 transition-transform duration-300 ${compact ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Nav Items */}
      <div className="flex flex-col gap-0.5 flex-1">
        {items.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onItemClick}
              title={compact ? item.label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative group ${
                isActive
                  ? "bg-blue-600/15 text-blue-400"
                  : "text-slate-500 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-500 rounded-r-full" />
              )}
              <Icon name={item.icon} className="w-4.5 h-4.5 shrink-0" />
              {!compact && <span className="truncate">{item.label}</span>}
              {compact && (
                <span className="absolute left-full ml-3 px-2 py-1 bg-slate-800 text-slate-200 text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 border border-slate-700 shadow-xl transition-opacity">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

// ─── Navbar ────────────────────────────────────────────────────────────────────
function Navbar({ user, onLogout, isAdmin, onToggleMobileSidebar }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const roleLabel = { cliente: "Cliente", tecnico: "Técnico", admin: "Administrador" };
  const roleColors = {
    cliente: { bg: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.25)", text: "#93c5fd", letter: "C" },
    tecnico: { bg: "rgba(139,92,246,0.12)", border: "rgba(139,92,246,0.25)", text: "#c4b5fd", letter: "T" },
    admin: { bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)", text: "#fbbf24", letter: "A" },
  };
  const rc = roleColors[user?.nivel_acesso] || roleColors.cliente;

  const handleLogout = () => {
    localStorage.removeItem("techrent_token");
    localStorage.removeItem("techrent_user");
    onLogout();
    router.push("/");
  };

  return (
    <header
      style={{
        height: "64px",
        background: "rgba(6,11,23,0.9)",
        borderBottom: "1px solid rgba(99,130,200,0.1)",
        backdropFilter: "blur(20px)",
        position: "sticky",
        top: 0,
        zIndex: 40,
      }}
      className="w-full flex items-center px-4 md:px-6 gap-4"
    >
      {/* Mobile sidebar toggle (admin only) */}
      {isAdmin && (
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors"
        >
          <Icon name="menu" className="w-5 h-5" />
        </button>
      )}

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 font-bold text-slate-100 hover:text-white transition-colors">
        <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">T</div>
        <span className="hidden sm:block text-sm tracking-tight">TechRent</span>
      </Link>

      <div className="flex-1" />

      {/* User Menu */}
      {user ? (
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-200 hover:bg-slate-800/50"
            style={{ border: `1px solid ${rc.border}`, background: rc.bg }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: rc.bg, color: rc.text, border: `1px solid ${rc.border}` }}
            >
              {rc.letter}
            </div>
            <div className="hidden md:flex flex-col items-start leading-tight">
              <span className="text-sm font-medium text-slate-200">{user.nome || user.email}</span>
              <span className="text-xs text-slate-500">{roleLabel[user.nivel_acesso]}</span>
            </div>
            <svg className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              <div
                className="absolute right-0 mt-2 w-52 rounded-xl overflow-hidden animate-scale-in z-50"
                style={{
                  background: "rgba(10,17,35,0.98)",
                  border: "1px solid rgba(99,130,200,0.15)",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <div className="p-3 border-b" style={{ borderColor: "rgba(99,130,200,0.1)" }}>
                  <p className="text-sm font-semibold text-slate-200">{user.nome || user.email}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{roleLabel[user.nivel_acesso]}</p>
                </div>
                <div className="p-2 space-y-0.5">
                  <DropdownLink href="/profile" icon="profile" label="Meu Perfil" onClick={() => setMenuOpen(false)} />
                  <DropdownLink href="/settings" icon="settings" label="Configurações" onClick={() => setMenuOpen(false)} />
                  {user.nivel_acesso === "admin" && (
                    <DropdownLink href="/admin/users" icon="users" label="Gerenciar Usuários" onClick={() => setMenuOpen(false)} />
                  )}
                </div>
                <div className="p-2 border-t" style={{ borderColor: "rgba(99,130,200,0.1)" }}>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Icon name="logout" className="w-4 h-4" />
                    <span>Sair</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <Link
          href="/login"
          className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-all duration-200 hover:shadow-lg"
          style={{ background: "linear-gradient(135deg, #2563eb, #3b82f6)" }}
        >
          Entrar
        </Link>
      )}
    </header>
  );
}

function DropdownLink({ href, icon, label, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors"
    >
      <Icon name={icon} className="w-4 h-4" />
      <span>{label}</span>
    </Link>
  );
}

// ─── AppShell ──────────────────────────────────────────────────────────────────
export default function AppShell({ children }) {
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [sidebarCompact, setSidebarCompact] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const raw = localStorage.getItem("techrent_user");
    if (raw) {
      try { setUser(JSON.parse(raw)); } catch {}
    }
  }, []);

  // Escuta mudanças de rota para fechar sidebar mobile
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  const isAdmin = user?.nivel_acesso === "admin";
  const isDashboardRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

  const handleLogout = () => setUser(null);

  if (!mounted) {
    return (
      <div className="flex flex-col min-h-screen">
        <div style={{ height: "64px", background: "rgba(6,11,23,0.9)", borderBottom: "1px solid rgba(99,130,200,0.1)" }} />
        <main className="flex-1 flex items-center justify-center">
          <Spinner />
        </main>
      </div>
    );
  }

  // Layout admin: navbar + sidebar + main (sem footer)
  if (isAdmin && isDashboardRoute) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar
          user={user}
          onLogout={handleLogout}
          isAdmin={true}
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />
        <div className="flex flex-1 overflow-hidden">
          <AdminSidebar
            compact={sidebarCompact}
            onToggleCompact={() => setSidebarCompact(!sidebarCompact)}
            mobileOpen={mobileSidebarOpen}
            onCloseMobile={() => setMobileSidebarOpen(false)}
          />
          <main
            className="flex-1 overflow-y-auto"
            style={{ background: "var(--color-bg)" }}
          >
            {children}
          </main>
        </div>
      </div>
    );
  }

  // Layout padrão: navbar + main + footer
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar user={user} onLogout={handleLogout} isAdmin={false} onToggleMobileSidebar={() => {}} />
      <main className="flex-1">
        {children}
      </main>
      <footer
        className="w-full py-6 mt-auto"
        style={{ borderTop: "1px solid rgba(99,130,200,0.1)", background: "rgba(8,14,28,0.8)" }}
      >
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-600">
          &copy; 2026 TechRent. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}
