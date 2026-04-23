"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const STATUS_TABS = [
  { key: "todos", label: "Todos", color: "#94a3b8" },
  { key: "aberto", label: "Abertos", color: "#93c5fd" },
  { key: "em_atendimento", label: "Em Processo", color: "#fbbf24" },
  { key: "resolvido", label: "Concluídos", color: "#4ade80" },
];

function StatusBadge({ status }) {
  const map = {
    aberto: { label: "Aberto", bg: "rgba(59,130,246,0.12)", color: "#93c5fd", border: "rgba(59,130,246,0.25)" },
    em_atendimento: { label: "Em Processo", bg: "rgba(245,158,11,0.12)", color: "#fbbf24", border: "rgba(245,158,11,0.25)" },
    resolvido: { label: "Concluído", bg: "rgba(34,197,94,0.12)", color: "#4ade80", border: "rgba(34,197,94,0.25)" },
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

function PriorityDot({ prioridade }) {
  const map = { alta: "#f87171", media: "#fbbf24", baixa: "#4ade80" };
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
      <span className="w-2 h-2 rounded-full" style={{ background: map[prioridade] || "#94a3b8" }} />
      {prioridade ? prioridade.charAt(0).toUpperCase() + prioridade.slice(1) : "—"}
    </span>
  );
}

export default function MeusChamadosPage() {
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [activeTab, setActiveTab] = useState("todos");
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const raw = localStorage.getItem("techrent_user");
    const token = localStorage.getItem("techrent_token");
    if (!raw || !token) { router.push("/login"); return; }
    const u = JSON.parse(raw);
    setUser(u);
    if (u.nivel_acesso !== "cliente") {
      if (u.nivel_acesso === "admin") router.push("/dashboard");
      else router.push("/chamados-tecnico");
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

  const filtered = activeTab === "todos" ? chamados : chamados.filter((c) => c.status === activeTab);

  const counts = STATUS_TABS.reduce((acc, t) => {
    acc[t.key] = t.key === "todos" ? chamados.length : chamados.filter((c) => c.status === t.key).length;
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Meus Chamados</h1>
          <p className="text-sm text-slate-500 mt-1">
            {user ? `Olá, ${user.nome || user.email}` : "Acompanhe seus chamados de suporte"}
          </p>
        </div>
        <Link href="/chamados/novo"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5"
          style={{ background: "linear-gradient(135deg, #2563eb, #3b82f6)" }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
          </svg>
          Novo Chamado
        </Link>
      </div>

      {/* Stats rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-slide-in-from-bottom" style={{ animationDelay: "0.05s" }}>
        {STATUS_TABS.map((t) => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className="rounded-xl p-4 text-left transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: activeTab === t.key ? "rgba(59,130,246,0.1)" : "rgba(13,21,38,0.6)",
              border: activeTab === t.key ? "1px solid rgba(59,130,246,0.3)" : "1px solid rgba(99,130,200,0.1)",
            }}>
            <p className="text-2xl font-bold" style={{ color: t.color }}>{counts[t.key]}</p>
            <p className="text-xs text-slate-500 mt-1">{t.label}</p>
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl animate-slide-in-from-bottom" style={{ animationDelay: "0.1s",
        background: "rgba(13,21,38,0.6)", border: "1px solid rgba(99,130,200,0.1)" }}>
        {STATUS_TABS.map((t) => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200"
            style={{
              background: activeTab === t.key ? "rgba(59,130,246,0.15)" : "transparent",
              color: activeTab === t.key ? t.color : "#64748b",
            }}>
            {t.label}
            {counts[t.key] > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-xs"
                style={{ background: "rgba(255,255,255,0.06)", color: "#94a3b8" }}>
                {counts[t.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Conteúdo */}
      {erro && (
        <div className="p-4 rounded-xl text-sm text-red-400" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
          Erro ao carregar chamados: {erro}
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
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.15)" }}>
            <svg className="w-8 h-8 text-blue-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          </div>
          <div className="text-center">
            <p className="text-slate-400 font-medium">Nenhum chamado encontrado</p>
            <p className="text-slate-600 text-sm mt-1">
              {activeTab === "todos" ? "Abra um novo chamado para começar" : "Sem chamados nesta categoria"}
            </p>
          </div>
          {activeTab === "todos" && (
            <Link href="/chamados/novo"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #2563eb, #3b82f6)" }}>
              Criar Primeiro Chamado
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c, i) => (
            <Link key={c.id} href={`/chamados/${c.id}`}
              className="block rounded-xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl animate-slide-in-from-bottom group"
              style={{
                animationDelay: `${i * 0.04}s`,
                background: "rgba(13,21,38,0.7)",
                border: "1px solid rgba(99,130,200,0.1)",
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = "rgba(59,130,246,0.25)"}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(99,130,200,0.1)"}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-slate-600 font-mono">#{c.id}</span>
                    <PriorityDot prioridade={c.prioridade} />
                  </div>
                  <h3 className="font-semibold text-slate-200 group-hover:text-blue-400 transition-colors truncate">
                    {c.titulo}
                  </h3>
                  {c.descricao && (
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">{c.descricao}</p>
                  )}
                  <div className="flex items-center gap-4 mt-3 text-xs text-slate-600">
                    <span>Criado em {new Date(c.data_criacao || c.criado_em || Date.now()).toLocaleDateString("pt-BR")}</span>
                    {c.equipamento && <span>• {c.equipamento}</span>}
                    {c.tecnico && <span>• Técnico: {c.tecnico}</span>}
                  </div>
                </div>
                <StatusBadge status={c.status} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
