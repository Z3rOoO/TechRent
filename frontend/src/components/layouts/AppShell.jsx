"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

// --- Ícones ---
function Icon({ name, className = "w-5 h-5" }) {
  const icons = {
    dashboard: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
      </svg>
    ),
    tickets: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/>
      </svg>
    ),
    equipment: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
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
  };
  return icons[name] || null;
}

// --- Navigation Items ---
const getNavItems = (role) => {
  const base = [
    { label: "Chamados", href: "/chamados", icon: "tickets" },
    { label: "Equipamentos", href: "/equipamentos", icon: "equipment" },
  ];
  
  if (role === "admin") {
    return [
      { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
      ...base,
      { label: "Manutenção", href: "/manutencao", icon: "maintenance" },
      { label: "Usuários", href: "/admin/users", icon: "users" },
      { label: "Configurações", href: "/settings", icon: "settings" },
    ];
  }
  
  if (role === "tecnico") {
    return [
      ...base,
      { label: "Manutenção", href: "/manutencao", icon: "maintenance" },
      { label: "Configurações", href: "/settings", icon: "settings" },
    ];
  }
  
  return [
    ...base,
    { label: "Configurações", href: "/settings", icon: "settings" },
  ];
};

// --- Sidebar ---
function Sidebar({ pathname, user, isOpen, onClose }) {
  const items = getNavItems(user?.nivel_acesso);
  
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar Content */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen md:h-[calc(100vh-64px)] md:top-16 bg-slate-950 border-r border-slate-800 z-[70] transition-all duration-300 ease-in-out overflow-y-auto
          ${isOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0 w-64 md:w-20 lg:w-64"}`}
      >
        <div className="p-4 md:hidden flex items-center justify-between border-b border-slate-800 mb-4">
          <span className="font-bold text-slate-100">Menu</span>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white">
            <Icon name="close" />
          </button>
        </div>
        
        <div className="p-4 space-y-2">
          {items.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onClose()}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                  active 
                    ? "bg-blue-600/10 text-blue-400 border border-blue-600/20" 
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent"
                }`}
              >
                <Icon name={item.icon} className="w-5 h-5 shrink-0" />
                <span className={`text-sm font-medium md:hidden lg:block`}>{item.label}</span>
                {/* Tooltip for md:w-20 mode */}
                <span className="hidden md:group-hover:block lg:hidden absolute left-16 bg-slate-900 border border-slate-800 px-2 py-1 rounded text-xs whitespace-nowrap z-50">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </aside>
    </>
  );
}

// --- Navbar ---
function Navbar({ user, onLogout, onMenuToggle }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("techrent_token");
    localStorage.removeItem("techrent_user");
    onLogout();
    router.push("/login");
  };

  const getRoleLabel = (role) => {
    const labels = { admin: "Administrador", tecnico: "Técnico", cliente: "Cliente" };
    return labels[role] || role;
  };

  const getAvatarInfo = (user) => {
    const name = user?.nome || user?.email || "U";
    const letter = name.charAt(0).toUpperCase();
    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];
    const colorIndex = (name.length) % colors.length;
    return { letter, color: colors[colorIndex] };
  };

  const av = getAvatarInfo(user);

  return (
    <header className="h-16 sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-4 md:px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {user && (
          <button 
            onClick={onMenuToggle}
            className="p-2 -ml-2 text-slate-400 hover:text-white md:hidden"
          >
            <Icon name="menu" />
          </button>
        )}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-600/20 transition-transform group-hover:scale-105">T</div>
          <span className="font-bold text-slate-100 tracking-tight">TechRent</span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-700"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white shadow-inner" style={{ background: av.color }}>
                {av.letter}
              </div>
              <div className="hidden sm:flex flex-col items-start leading-tight">
                <span className="text-sm font-semibold text-slate-200 max-w-[120px] truncate">{user.nome || "Usuário"}</span>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">{getRoleLabel(user.nivel_acesso)}</span>
              </div>
              <svg className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${menuOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl shadow-black/50 p-2 z-50 animate-scale-in">
                  <div className="px-3 py-2 mb-2 border-b border-slate-800/50">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Conta</p>
                    <p className="text-sm font-medium text-slate-200 truncate">{user.email}</p>
                  </div>
                  <Link href="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors">
                    <Icon name="profile" className="w-4 h-4" /> Perfil
                  </Link>
                  <Link href="/settings" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors">
                    <Icon name="settings" className="w-4 h-4" /> Configurações
                  </Link>
                  <div className="my-1 border-t border-slate-800/50" />
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                    <Icon name="logout" className="w-4 h-4" /> Sair
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <Link href="/login" className="px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 active:scale-95">
            Entrar
          </Link>
        )}
      </div>
    </header>
  );
}

// --- AppShell ---
export default function AppShell({ children }) {
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const raw = localStorage.getItem("techrent_user");
    if (raw) {
      try { setUser(JSON.parse(raw)); } catch (e) {}
    }
  }, []);

  const isLoginPage = pathname === "/login";
  const isPublicPage = pathname === "/";

  if (!mounted) return <div className="min-h-screen bg-slate-950" />;

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 selection:bg-blue-500/30">
      {!isLoginPage && (
        <Navbar 
          user={user} 
          onLogout={() => setUser(null)} 
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      )}
      
      <div className="flex flex-1 relative">
        {user && !isLoginPage && (
          <Sidebar 
            pathname={pathname} 
            user={user} 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)} 
          />
        )}
        
        <main className="flex-1 w-full overflow-x-hidden">
          <div className="min-h-full">
            {children}
          </div>
        </main>
      </div>

      {!isLoginPage && (isPublicPage || !user) && (
        <footer className="py-8 border-t border-slate-900 bg-slate-950/50">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-sm text-slate-600">&copy; 2026 TechRent. Gerenciamento Inteligente de TI.</p>
          </div>
        </footer>
      )}
    </div>
  );
}
