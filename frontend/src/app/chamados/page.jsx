"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API = "http://localhost:3001";

function StatusBadge({ status }) {
  const map = {
    aberto: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    em_atendimento: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    resolvido: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    cancelado: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${map[status] || map.cancelado}`}>
      {status?.replace("_", " ")}
    </span>
  );
}

function PrioridadeBadge({ prioridade }) {
  const map = { alta: "text-red-400 bg-red-500/10 border-red-500/20", media: "text-amber-400 bg-amber-500/10 border-amber-500/20", baixa: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${map[prioridade] || ""}`}>{prioridade}</span>;
}

export default function ChamadosPage() {
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const router = useRouter();

  useEffect(() => {
    const raw = localStorage.getItem("techrent_user");
    if (!raw) { router.push("/login"); return; }
    const u = JSON.parse(raw);
    setUser(u);
    fetchChamados();
  }, []);

  const fetchChamados = async () => {
    try {
      const token = localStorage.getItem("techrent_token");
      const res = await fetch(`${API}/chamados`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.sucesso) setChamados(data.dados);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const chamadosFiltrados = filtroStatus === "todos"
    ? chamados
    : chamados.filter(c => c.status === filtroStatus);

  const isCliente = user?.nivel_acesso === "cliente";
  const isTecnico = user?.nivel_acesso === "tecnico";
  const isAdmin = user?.nivel_acesso === "admin";

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            {isCliente ? "Meus Chamados" : isTecnico ? "Painel do Técnico" : "Todos os Chamados"}
          </h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1">
            {isCliente ? "Acompanhe o status dos seus chamados" :
             isTecnico ? "Chamados abertos e em andamento" :
             "Gerencie todos os chamados do sistema"}
          </p>
        </div>
        {(isCliente || isAdmin) && (
          <Link href="/chamados/novo"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, #2563eb, #3b82f6)" }}>
            + Abrir Chamado
          </Link>
        )}
      </div>

      {/* Filtros */}
      <div className="flex gap-1 md:gap-2 flex-wrap">
        {["todos", "aberto", "em_atendimento", "resolvido", "cancelado"].map(s => (
          <button key={s} onClick={() => setFiltroStatus(s)}
            className={`px-2 md:px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filtroStatus === s
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
            style={filtroStatus !== s ? { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(99,130,200,0.1)" } : {}}>
            <span className="hidden sm:inline">{s === "todos" ? "Todos" : s.replace("_", " ")}</span>
            <span className="sm:hidden">{s === "todos" ? "T" : s.charAt(0).toUpperCase()}</span>
            <span className="ml-1 md:ml-1.5 text-[10px] opacity-70">
              ({s === "todos" ? chamados.length : chamados.filter(c => c.status === s).length})
            </span>
          </button>
        ))}
      </div>

      {/* Lista de Chamados */}
      {chamadosFiltrados.length === 0 ? (
        <div className="rounded-2xl p-8 md:p-12 text-center" style={{ background: "rgba(13,21,38,0.6)", border: "1px solid rgba(99,130,200,0.1)" }}>
          <p className="text-slate-500 text-sm">
            {filtroStatus === "todos" ? "Nenhum chamado encontrado." : `Nenhum chamado com status "${filtroStatus.replace("_", " ")}"`.}
          </p>
          {isCliente && (
            <Link href="/chamados/novo" className="mt-4 inline-block px-4 py-2 rounded-xl text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
              Abrir primeiro chamado →
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-2 md:space-y-3">
          {chamadosFiltrados.map(c => (
            <Link key={c.id} href={`/chamados/${c.id}`}
              className="block rounded-2xl p-4 md:p-5 transition-all hover:-translate-y-0.5 group"
              style={{ background: "rgba(13,21,38,0.7)", border: "1px solid rgba(99,130,200,0.1)" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(99,130,200,0.25)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(99,130,200,0.1)"}>
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-2 md:gap-3 min-w-0">
                  <span className="text-xs font-mono text-slate-600 mt-0.5 shrink-0">#{c.id}</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-200 group-hover:text-white transition-colors truncate text-sm md:text-base">{c.titulo}</p>
                    <div className="flex flex-wrap items-center gap-1 md:gap-2 mt-1">
                      <span className="text-xs text-slate-500 truncate">{c.equipamento_nome}</span>
                      {c.equipamento_patrimonio && (
                        <span className="text-xs text-slate-600 font-mono hidden sm:inline">{c.equipamento_patrimonio}</span>
                      )}
                      {!isCliente && c.cliente_nome && (
                        <span className="text-xs text-slate-500 hidden md:inline">· {c.cliente_nome}</span>
                      )}
                      {c.tecnico_nome && (
                        <span className="text-xs text-slate-500 hidden lg:inline">· Técnico: {c.tecnico_nome}</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      {new Date(c.aberto_em).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-auto">
                  <PrioridadeBadge prioridade={c.prioridade} />
                  <StatusBadge status={c.status} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
