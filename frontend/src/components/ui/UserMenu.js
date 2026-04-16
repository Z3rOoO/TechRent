"use client";
import { useState, useRef, useEffect } from "react";
import Button from "./Button";

const UserIcon = ({ role }) => {
  const colors = {
    cliente: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    tecnico: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    admin: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  };

  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center border font-semibold text-sm ${colors[role] || colors.cliente}`}>
      {role === "cliente" ? "C" : role === "tecnico" ? "T" : "A"}
    </div>
  );
};

export default function UserMenu({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  if (!user) return null;

  const roleNames = {
    cliente: "Cliente",
    tecnico: "Técnico",
    admin: "Administrador",
  };

  const roleBg = {
    cliente: "bg-slate-700/40 border-blue-500/30",
    tecnico: "bg-slate-700/40 border-purple-500/30",
    admin: "bg-slate-700/40 border-orange-500/30",
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* User Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg border transition-all duration-200 hover:bg-slate-700/50 ${roleBg[user.nivel_acesso] || roleBg.cliente}`}
      >
        <UserIcon role={user.nivel_acesso} />
        <div className="hidden md:flex flex-col items-start text-sm">
          <span className="font-medium text-slate-200">{user.nome || user.email}</span>
          <span className="text-xs text-slate-400">{roleNames[user.nivel_acesso]}</span>
        </div>
        <svg className={`w-4 h-4 text-slate-400 transition-transform duration-300 ml-1 ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700/50 rounded-lg shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50 backdrop-blur-sm">
          {/* Header */}
          <div className="bg-slate-700/40 border-b border-slate-700/50 p-4">
            <div className="text-sm font-semibold text-slate-100">{user.nome || user.email}</div>
            <div className="text-xs text-slate-400 mt-1">
              {roleNames[user.nivel_acesso]}
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2 space-y-1">
            <MenuLink href="/profile" label="Meu Perfil" />
            <MenuLink href="/settings" label="Configurações" />
            {user.nivel_acesso === "admin" && (
              <MenuLink href="/admin/users" label="Gerenciar Usuários" />
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-slate-700/50" />

          {/* Logout */}
          <div className="p-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={onLogout}
              className="w-full"
            >
              Sair
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuLink({ href, label }) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 rounded-md hover:bg-slate-700/30 hover:text-slate-100 transition-colors duration-200"
    >
      <span>{label}</span>
    </a>
  );
}
