"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const STATUS_VARIANTS = {
  aberto: { color:"#93c5fd", bg:"rgba(59,130,246,0.1)", border:"rgba(59,130,246,0.2)" },
  em_atendimento: { color:"#fbbf24", bg:"rgba(245,158,11,0.1)", border:"rgba(245,158,11,0.2)" },
  resolvido: { color:"#4ade80", bg:"rgba(34,197,94,0.1)", border:"rgba(34,197,94,0.2)" },
  cancelado: { color:"#f87171", bg:"rgba(239,68,68,0.1)", border:"rgba(239,68,68,0.2)" },
};
const PRIORITY_COLORS = { alta:"#f87171", media:"#fbbf24", baixa:"#4ade80" };

function StatusBadge({ status }) {
  const s = STATUS_VARIANTS[status] || { color:"#94a3b8", bg:"rgba(100,116,139,0.1)", border:"rgba(100,116,139,0.2)" };
  return (
    <span className="px-2.5 py-1 rounded-full text-xs font-medium capitalize"
      style={{background:s.bg, color:s.color, border:`1px solid ${s.border}`}}>
      {(status||"").replace("_"," ")}
    </span>
  );
}

export default function ChamadosPage() {
  const [chamados, setChamados] = useState([]);
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("todos");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("techrent_user");
    const token = localStorage.getItem("techrent_token");
    if (raw) { try { setUser(JSON.parse(raw)); } catch {} }
    fetch("http://localhost:3001/chamados", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.sucesso === false) setErro(data.mensagem || "Erro ao buscar");
        else {
          const list = Array.isArray(data) ? data : (Array.isArray(data?.dados) ? data.dados : []);
          setChamados(list);
        }
      })
      .catch((e) => setErro(e.message))
      .finally(() => setLoading(false));
  }, []);

  const statuses = ["aberto","em_atendimento","resolvido","cancelado"];
  const filteredChamados = filter === "todos" ? chamados : chamados.filter((c) => c.status === filter);

  const counts = statuses.reduce((acc, s) => {
    acc[s] = chamados.filter((c) => c.status === s).length;
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-start justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Chamados</h1>
          <p className="text-sm text-slate-500 mt-1">Gerencie todos os chamados de suporte</p>
        </div>
        {(user?.nivel_acesso === "cliente" || user?.nivel_acesso === "admin") && (
          <Link href="/chamados/novo"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
            style={{background:"linear-gradient(135deg, #2563eb, #3b82f6)"}}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
            </svg>
            Novo Chamado
          </Link>
        )}
      </div>

      {/* Filtros */}
      {!loading && chamados.length > 0 && (
        <div className="flex gap-1 p-1 rounded-xl animate-slide-in-from-bottom" style={{animationDelay:"0.05s",
          background:"rgba(13,21,38,0.6)",border:"1px solid rgba(99,130,200,0.1)"}}>
          <button onClick={() => setFilter("todos")}
            className="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200"
            style={{background:filter==="todos"?"rgba(59,130,246,0.15)":"transparent",color:filter==="todos"?"#93c5fd":"#64748b"}}>
            Todos ({chamados.length})
          </button>
          {statuses.map((s) => counts[s] > 0 && (
            <button key={s} onClick={() => setFilter(s)}
              className="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 capitalize"
              style={{background:filter===s?"rgba(59,130,246,0.15)":"transparent",color:filter===s?"#93c5fd":"#64748b"}}>
              {s.replace("_"," ")} ({counts[s]})
            </button>
          ))}
        </div>
      )}

      {erro && (
        <div className="p-4 rounded-xl text-sm text-red-400" style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.2)"}}>
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
      ) : filteredChamados.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{background:"rgba(59,130,246,0.08)",border:"1px solid rgba(59,130,246,0.15)"}}>
            <svg className="w-8 h-8 text-blue-400/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          </div>
          <p className="text-slate-400 font-medium">Nenhum chamado encontrado</p>
          <p className="text-slate-600 text-sm">{filter === "todos" ? "Nenhum chamado cadastrado ainda" : "Sem chamados com este status"}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredChamados.map((c, index) => (
            <Link key={c.id} href={`/chamados/${c.id}`}
              className="block rounded-xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl animate-slide-in-from-bottom group"
              style={{animationDelay:`${index*0.04}s`,background:"rgba(13,21,38,0.7)",border:"1px solid rgba(99,130,200,0.1)"}}
              onMouseEnter={(e) => e.currentTarget.style.borderColor="rgba(59,130,246,0.25)"}
              onMouseLeave={(e) => e.currentTarget.style.borderColor="rgba(99,130,200,0.1)"}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-slate-600 font-mono">#{c.id}</span>
                    {c.prioridade && (
                      <span className="inline-flex items-center gap-1 text-xs" style={{color:PRIORITY_COLORS[c.prioridade]||"#94a3b8"}}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{background:PRIORITY_COLORS[c.prioridade]||"#94a3b8"}} />
                        {c.prioridade}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-slate-200 group-hover:text-blue-400 transition-colors truncate">
                    {c.titulo}
                  </h3>
                </div>
                <StatusBadge status={c.status} />
              </div>
              {c.descricao && <p className="text-sm text-slate-500 line-clamp-2 mb-3">{c.descricao}</p>}
              <div className="flex items-center gap-4 text-xs text-slate-600">
                <span>{new Date(c.data_criacao||c.criado_em||Date.now()).toLocaleDateString("pt-BR")}</span>
                {c.cliente && <span>• {c.cliente}</span>}
                {c.equipamento && <span>• {c.equipamento}</span>}
                {c.tecnico && <span>• Técnico: {c.tecnico}</span>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
