"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const STATUS_STYLES = {
  operacional: { label: "Operacional", color:"#4ade80", bg:"rgba(34,197,94,0.1)", border:"rgba(34,197,94,0.2)" },
  em_manutencao: { label: "Em Manutenção", color:"#fbbf24", bg:"rgba(251,191,36,0.1)", border:"rgba(251,191,36,0.2)" },
  desativado: { label: "Desativado", color:"#94a3b8", bg:"rgba(100,116,139,0.1)", border:"rgba(100,116,139,0.2)" },
};
function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || { label: status || "—", color:"#94a3b8", bg:"rgba(100,116,139,0.1)", border:"rgba(100,116,139,0.2)" };
  return (
    <span className="px-2.5 py-1 rounded-full text-xs font-medium"
      style={{background:s.bg,color:s.color,border:`1px solid ${s.border}`}}>
      {s.label}
    </span>
  );
}

export default function EquipamentosPage() {
  const [equipamentos, setEquipamentos] = useState([]);
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("todos");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("techrent_user");
    const token = localStorage.getItem("techrent_token");
    if (raw) { try { setUser(JSON.parse(raw)); } catch {} }
    fetch("http://localhost:3001/equipamentos", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.sucesso === false) setErro(data.mensagem || "Erro ao buscar");
        else {
          const listE = Array.isArray(data) ? data : (Array.isArray(data?.dados) ? data.dados : []);
          setEquipamentos(listE);
        }
      })
      .catch((e) => setErro(e.message))
      .finally(() => setLoading(false));
  }, []);

  const statuses = ["operacional","em_manutencao","desativado"];
  const filteredEquipamentos = filter === "todos" ? equipamentos : equipamentos.filter((e) => e.status === filter);
  const counts = statuses.reduce((acc, s) => {
    acc[s] = equipamentos.filter((e) => e.status === s).length;
    return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-start justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Equipamentos</h1>
          <p className="text-sm text-slate-500 mt-1">Inventário completo do parque tecnológico</p>
        </div>
        {user?.nivel_acesso === "admin" && (
          <Link href="/equipamentos/novo"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
            style={{background:"linear-gradient(135deg, #2563eb, #3b82f6)"}}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
            </svg>
            Novo Equipamento
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-slide-in-from-bottom" style={{animationDelay:"0.05s"}}>
        {[
          {key:"todos",label:"Total",value:equipamentos.length,color:"#94a3b8"},
          {key:"operacional",label:"Operacionais",value:counts.operacional||0,color:"#4ade80"},
          {key:"em_manutencao",label:"Em Manutenção",value:counts.em_manutencao||0,color:"#fbbf24"},
          {key:"desativado",label:"Desativados",value:counts.desativado||0,color:"#94a3b8"},
        ].map((s) => (
          <button key={s.key} onClick={() => setFilter(s.key)}
            className="rounded-xl p-4 text-left transition-all duration-200 hover:-translate-y-0.5"
            style={{background:filter===s.key?"rgba(59,130,246,0.08)":"rgba(13,21,38,0.6)",border:filter===s.key?"1px solid rgba(59,130,246,0.25)":"1px solid rgba(99,130,200,0.1)"}}>
            <p className="text-2xl font-bold" style={{color:s.color}}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </button>
        ))}
      </div>

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
          <p className="text-slate-500 text-sm">Carregando equipamentos...</p>
        </div>
      ) : filteredEquipamentos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{background:"rgba(59,130,246,0.08)",border:"1px solid rgba(59,130,246,0.15)"}}>
            <svg className="w-8 h-8 text-blue-400/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="2" y="3" width="20" height="14" rx="2" strokeWidth="1.5"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 21h8M12 17v4"/>
            </svg>
          </div>
          <p className="text-slate-400 font-medium">Nenhum equipamento encontrado</p>
          <p className="text-slate-600 text-sm">{filter === "todos" ? "Nenhum equipamento cadastrado" : "Sem equipamentos com este status"}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEquipamentos.map((e, index) => (
            <Link key={e.id} href={`/equipamentos/${e.id}`}
              className="block rounded-xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl animate-slide-in-from-bottom group"
              style={{animationDelay:`${index*0.04}s`,background:"rgba(13,21,38,0.7)",border:"1px solid rgba(99,130,200,0.1)"}}
              onMouseEnter={(e2) => e2.currentTarget.style.borderColor="rgba(59,130,246,0.25)"}
              onMouseLeave={(e2) => e2.currentTarget.style.borderColor="rgba(99,130,200,0.1)"}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="font-semibold text-slate-200 group-hover:text-blue-400 transition-colors">{e.nome||"Equipamento"}</h3>
                  {e.categoria && <p className="text-xs text-slate-500 mt-0.5">{e.categoria}</p>}
                </div>
                <StatusBadge status={e.status} />
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {e.patrimonio && (
                  <div>
                    <p className="text-slate-600 uppercase tracking-wide mb-0.5">Patrimônio</p>
                    <p className="text-slate-300 font-medium font-mono">{e.patrimonio}</p>
                  </div>
                )}
                {e.descricao && (
                  <div className="col-span-2">
                    <p className="text-slate-600 uppercase tracking-wide mb-0.5">Descrição</p>
                    <p className="text-slate-400 line-clamp-2">{e.descricao}</p>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
