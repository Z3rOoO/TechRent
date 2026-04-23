"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function StatusBadge({ status }) {
  const map = {
    aberto: { label: "Aberto", bg: "rgba(59,130,246,0.12)", color: "#93c5fd", border: "rgba(59,130,246,0.25)" },
    em_atendimento: { label: "Em Atendimento", bg: "rgba(245,158,11,0.12)", color: "#fbbf24", border: "rgba(245,158,11,0.25)" },
    resolvido: { label: "Resolvido", bg: "rgba(34,197,94,0.12)", color: "#4ade80", border: "rgba(34,197,94,0.25)" },
    cancelado: { label: "Cancelado", bg: "rgba(239,68,68,0.12)", color: "#f87171", border: "rgba(239,68,68,0.25)" },
  };
  const s = map[status] || { label: status, bg: "rgba(100,116,139,0.12)", color: "#94a3b8", border: "rgba(100,116,139,0.25)" };
  return (
    <span className="px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
      {s.label}
    </span>
  );
}

function PriorityBadge({ prioridade }) {
  const map = {
    alta: { color: "#f87171", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.2)" },
    media: { color: "#fbbf24", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)" },
    baixa: { color: "#4ade80", bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.2)" },
  };
  const p = map[prioridade] || { color: "#94a3b8", bg: "rgba(100,116,139,0.1)", border: "rgba(100,116,139,0.2)" };
  return (
    <span className="px-2 py-0.5 rounded-md text-xs font-medium"
      style={{ background: p.bg, color: p.color, border: `1px solid ${p.border}` }}>
      {prioridade ? prioridade.charAt(0).toUpperCase() + prioridade.slice(1) : "—"}
    </span>
  );
}

function ChamadoCard({ c, index, onAccept, accepting }) {
  return (
    <div className="rounded-xl p-5 transition-all duration-200 hover:-translate-y-0.5 animate-slide-in-from-bottom"
      style={{
        animationDelay: `${index * 0.04}s`,
        background: "rgba(13,21,38,0.7)",
        border: "1px solid rgba(99,130,200,0.1)",
      }}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-slate-600 font-mono">#{c.id}</span>
            <PriorityBadge prioridade={c.prioridade} />
          </div>
          <h3 className="font-semibold text-slate-200 truncate">{c.titulo}</h3>
        </div>
        <StatusBadge status={c.status} />
      </div>
      {c.descricao && (
        <p className="text-sm text-slate-500 line-clamp-2 mb-3">{c.descricao}</p>
      )}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-4 text-xs text-slate-600">
          {c.cliente && <span>Cliente: {c.cliente}</span>}
          {c.equipamento && <span>• {c.equipamento}</span>}
          <span>• {new Date(c.data_criacao || c.criado_em || Date.now()).toLocaleDateString("pt-BR")}</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/chamados/${c.id}`}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(99,130,200,0.1)" }}>
            Ver Detalhes
          </Link>
          {onAccept && (
            <button onClick={() => onAccept(c.id)} disabled={accepting === c.id}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all duration-200 disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #2563eb, #3b82f6)" }}>
              {accepting === c.id ? "Aceitando..." : "Aceitar"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ChamadosTecnicoPage() {
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [accepting, setAccepting] = useState(null);
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState("novos");
  const router = useRouter();

  useEffect(() => {
    const raw = localStorage.getItem("techrent_user");
    const token = localStorage.getItem("techrent_token");
    if (!raw || !token) { router.push("/login"); return; }
    const u = JSON.parse(raw);
    setUser(u);
    if (u.nivel_acesso !== "tecnico") {
      if (u.nivel_acesso === "admin") router.push("/dashboard");
      else router.push("/meus-chamados");
      return;
    }
    fetch("http://localhost:3001/chamados", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : (Array.isArray(data?.dados) ? data.dados : []);
        setChamados(list);
      })
      .catch((e) => setErro(e.message))
      .finally(() => setLoading(false));
  }, [router]);

  const handleAccept = async (id) => {
    setAccepting(id);
    const token = localStorage.getItem("techrent_token");
    try {
      await fetch(`http://localhost:3001/chamados/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: "em_atendimento" }),
      });
      setChamados((prev) => prev.map((c) => c.id === id ? { ...c, status: "em_atendimento" } : c));
    } catch {}
    finally { setAccepting(null); }
  };

  const novos = chamados.filter((c) => c.status === "aberto");
  const aceitos = chamados.filter((c) => c.status === "em_atendimento");
  const concluidos = chamados.filter((c) => c.status === "resolvido");

  const sections = [
    { key: "novos", label: "Novos Chamados", count: novos.length, color: "#93c5fd" },
    { key: "aceitos", label: "Em Atendimento", count: aceitos.length, color: "#fbbf24" },
    { key: "concluidos", label: "Concluídos", count: concluidos.length, color: "#4ade80" },
  ];

  const currentList = activeSection === "novos" ? novos : activeSection === "aceitos" ? aceitos : concluidos;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-slate-100">Painel do Técnico</h1>
        <p className="text-sm text-slate-500 mt-1">
          {user ? `Olá, ${user.nome || user.email} — gerencie seus chamados` : "Gerencie seus chamados de suporte"}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 animate-slide-in-from-bottom" style={{ animationDelay: "0.05s" }}>
        {sections.map((s) => (
          <button key={s.key} onClick={() => setActiveSection(s.key)}
            className="rounded-xl p-4 text-left transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: activeSection === s.key ? "rgba(59,130,246,0.08)" : "rgba(13,21,38,0.6)",
              border: activeSection === s.key ? "1px solid rgba(59,130,246,0.25)" : "1px solid rgba(99,130,200,0.1)",
            }}>
            <p className="text-3xl font-bold" style={{ color: s.color }}>{s.count}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl animate-slide-in-from-bottom" style={{ animationDelay: "0.1s",
        background: "rgba(13,21,38,0.6)", border: "1px solid rgba(99,130,200,0.1)" }}>
        {sections.map((s) => (
          <button key={s.key} onClick={() => setActiveSection(s.key)}
            className="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200"
            style={{
              background: activeSection === s.key ? "rgba(59,130,246,0.15)" : "transparent",
              color: activeSection === s.key ? s.color : "#64748b",
            }}>
            {s.label}
            {s.count > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-xs"
                style={{ background: "rgba(255,255,255,0.06)", color: "#94a3b8" }}>
                {s.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Conteúdo */}
      {erro && (
        <div className="p-4 rounded-xl text-sm text-red-400" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
          Erro: {erro}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <svg className="w-8 h-8 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          <p className="text-slate-500 text-sm">Carregando chamados...</p>
        </div>
      ) : currentList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.15)" }}>
            <svg className="w-8 h-8 text-blue-400/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          </div>
          <p className="text-slate-400 font-medium">Nenhum chamado nesta seção</p>
          <p className="text-slate-600 text-sm">
            {activeSection === "novos" ? "Não há novos chamados disponíveis no momento" : "Nenhum chamado nesta categoria"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {currentList.map((c, i) => (
            <ChamadoCard
              key={c.id}
              c={c}
              index={i}
              onAccept={activeSection === "novos" ? handleAccept : null}
              accepting={accepting}
            />
          ))}
        </div>
      )}

      {/* Link para manutenção */}
      <div className="pt-4 border-t animate-fade-in" style={{ borderColor: "rgba(99,130,200,0.1)" }}>
        <Link href="/manutencao"
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            <circle cx="12" cy="12" r="3" strokeWidth="2"/>
          </svg>
          Ver Histórico de Manutenção
        </Link>
      </div>
    </div>
  );
}
