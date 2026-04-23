"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ nome: "", email: "" });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [erro, setErro] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const raw = localStorage.getItem("techrent_user");
    const token = localStorage.getItem("techrent_token");
    if (!raw || !token) { router.push("/login"); return; }
    const u = JSON.parse(raw);
    setUser(u);
    setFormData({ nome: u.nome || "", email: u.email || "" });
    setLoading(false);
  }, [router]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErro(null);
    const token = localStorage.getItem("techrent_token");
    try {
      const res = await fetch(`http://localhost:3001/usuarios/${user.id}/perfil`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const updated = { ...user, ...formData };
        localStorage.setItem("techrent_user", JSON.stringify(updated));
        setUser(updated);
        setEditing(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const data = await res.json();
        setErro(data.mensagem || "Erro ao salvar");
      }
    } catch {
      setErro("Erro de conexão");
    } finally {
      setSaving(false);
    }
  };

  const roleConfig = {
    cliente: { label: "Cliente", color: "#93c5fd", bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.2)", letter: "C" },
    tecnico: { label: "Técnico", color: "#c4b5fd", bg: "rgba(139,92,246,0.1)", border: "rgba(139,92,246,0.2)", letter: "T" },
    admin: { label: "Administrador", color: "#fbbf24", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)", letter: "A" },
  };

  const backHref = user?.nivel_acesso === "admin" ? "/dashboard" : "/chamados";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <svg className="w-8 h-8 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      </div>
    );
  }

  const rc = roleConfig[user?.nivel_acesso] || roleConfig.cliente;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-600 animate-fade-in">
        <Link href={backHref} className="hover:text-slate-400 transition-colors">Início</Link>
        <span>/</span>
        <span className="text-slate-400">Meu Perfil</span>
      </div>

      {/* Header Card */}
      <div className="rounded-2xl p-8 text-center animate-slide-in-from-bottom"
        style={{ background: "rgba(13,21,38,0.8)", border: "1px solid rgba(99,130,200,0.15)" }}>
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl text-3xl font-bold mb-4"
          style={{ background: rc.bg, color: rc.color, border: `2px solid ${rc.border}` }}>
          {rc.letter}
        </div>
        <h1 className="text-2xl font-bold text-slate-100">{user?.nome || "Usuário"}</h1>
        <p className="text-slate-500 text-sm mt-1">{user?.email}</p>
        <span className="inline-block mt-3 px-3 py-1 rounded-full text-xs font-medium"
          style={{ background: rc.bg, color: rc.color, border: `1px solid ${rc.border}` }}>
          {rc.label}
        </span>
      </div>

      {/* Alerts */}
      {success && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-green-400 animate-slide-in-from-bottom"
          style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
          </svg>
          Perfil atualizado com sucesso!
        </div>
      )}
      {erro && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-red-400"
          style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
          {erro}
        </div>
      )}

      {/* Dados */}
      <div className="rounded-2xl overflow-hidden animate-slide-in-from-bottom" style={{ animationDelay: "0.1s",
        background: "rgba(13,21,38,0.7)", border: "1px solid rgba(99,130,200,0.12)" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "rgba(99,130,200,0.1)" }}>
          <h2 className="font-semibold text-slate-200">Informações Pessoais</h2>
          {!editing && (
            <button onClick={() => setEditing(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
              style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.15)" }}>
              Editar
            </button>
          )}
        </div>

        {editing ? (
          <form onSubmit={handleSave} className="p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-400">Nome</label>
              <input type="text" value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-sm text-slate-200"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(99,130,200,0.15)", outline: "none" }}
                onFocus={(e) => e.target.style.borderColor = "rgba(59,130,246,0.5)"}
                onBlur={(e) => e.target.style.borderColor = "rgba(99,130,200,0.15)"} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-400">Email</label>
              <input type="email" value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-sm text-slate-200"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(99,130,200,0.15)", outline: "none" }}
                onFocus={(e) => e.target.style.borderColor = "rgba(59,130,246,0.5)"}
                onBlur={(e) => e.target.style.borderColor = "rgba(99,130,200,0.15)"} />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #2563eb, #3b82f6)" }}>
                {saving ? "Salvando..." : "Salvar Alterações"}
              </button>
              <button type="button" onClick={() => { setEditing(false); setErro(null); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(99,130,200,0.1)" }}>
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 space-y-4">
            {[
              { label: "Nome completo", value: user?.nome || "—" },
              { label: "Email", value: user?.email || "—" },
              { label: "Função", value: rc.label },
              { label: "ID do usuário", value: `#${user?.id || "—"}` },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-3 border-b last:border-0"
                style={{ borderColor: "rgba(99,130,200,0.07)" }}>
                <span className="text-sm text-slate-500">{item.label}</span>
                <span className="text-sm font-medium text-slate-300">{item.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ações rápidas */}
      <div className="rounded-2xl p-6 space-y-3 animate-slide-in-from-bottom" style={{ animationDelay: "0.15s",
        background: "rgba(13,21,38,0.7)", border: "1px solid rgba(99,130,200,0.12)" }}>
        <h2 className="font-semibold text-slate-200 mb-4">Acesso Rápido</h2>
        {user?.nivel_acesso === "cliente" && (
          <QuickLink href="/chamados" label="Meus Chamados" desc="Ver e gerenciar seus chamados" />
        )}
        {user?.nivel_acesso === "tecnico" && (
          <QuickLink href="/chamados" label="Painel do Técnico" desc="Ver chamados disponíveis e em andamento" />
        )}
        {user?.nivel_acesso === "admin" && (
          <QuickLink href="/dashboard" label="Dashboard Admin" desc="Painel de controle completo" />
        )}
        <QuickLink href="/settings" label="Configurações" desc="Preferências da conta" />
      </div>
    </div>
  );
}

function QuickLink({ href, label, desc }) {
  return (
    <Link href={href}
      className="flex items-center justify-between p-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5 group"
      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(99,130,200,0.08)" }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = "rgba(59,130,246,0.2)"}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(99,130,200,0.08)"}>
      <div>
        <p className="text-sm font-medium text-slate-300 group-hover:text-blue-400 transition-colors">{label}</p>
        <p className="text-xs text-slate-600 mt-0.5">{desc}</p>
      </div>
      <svg className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
      </svg>
    </Link>
  );
}
