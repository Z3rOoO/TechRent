"use client";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API = "http://localhost:3001";

const STATUS_STYLES = {
  operacional: { label: "Operacional", color: "#4ade80", bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.2)" },
  em_manutencao: { label: "Em Manutenção", color: "#fbbf24", bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.2)" },
  desativado: { label: "Desativado", color: "#94a3b8", bg: "rgba(100,116,139,0.1)", border: "rgba(100,116,139,0.2)" },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || { label: status || "—", color: "#94a3b8", bg: "rgba(100,116,139,0.1)", border: "rgba(100,116,139,0.2)" };
  return (
    <span className="px-3 py-1.5 rounded-full text-sm font-medium"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
      {s.label}
    </span>
  );
}

export default function EquipamentoDetailPage({ params }) {
  const { id } = use(params);
  const [equipamento, setEquipamento] = useState(null);
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const raw = localStorage.getItem("techrent_user");
    if (!raw) { router.push("/login"); return; }
    setUser(JSON.parse(raw));
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("techrent_token");
      const headers = { Authorization: `Bearer ${token}` };

      const [eqRes, chRes] = await Promise.all([
        fetch(`${API}/equipamentos/${id}`, { headers }),
        fetch(`${API}/chamados`, { headers }),
      ]);

      const eqData = await eqRes.json();
      if (eqData.sucesso) setEquipamento(eqData.dados);

      const chData = await chRes.json();
      if (chData.sucesso) {
        const relacionados = chData.dados.filter(c => String(c.equipamento_id) === String(id));
        setChamados(relacionados);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!equipamento) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500">Equipamento não encontrado.</p>
        <Link href="/equipamentos" className="text-blue-400 hover:underline text-sm mt-2 inline-block">Voltar</Link>
      </div>
    );
  }

  const isAdmin = user?.nivel_acesso === "admin";

  const STATUS_CHAMADO = {
    aberto: { label: "Aberto", color: "#60a5fa" },
    em_atendimento: { label: "Em Atendimento", color: "#fbbf24" },
    resolvido: { label: "Resolvido", color: "#4ade80" },
    cancelado: { label: "Cancelado", color: "#94a3b8" },
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()}
          className="p-2 rounded-xl hover:bg-slate-800 transition-colors text-slate-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">{equipamento.nome}</h1>
          {equipamento.patrimonio && <p className="text-slate-500 text-xs font-mono mt-0.5">{equipamento.patrimonio}</p>}
        </div>
        <StatusBadge status={equipamento.status} />
      </div>

      {/* Info card */}
      <div className="rounded-2xl p-6 space-y-4" style={{ background: "rgba(13,21,38,0.8)", border: "1px solid rgba(99,130,200,0.15)" }}>
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Informações</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          {equipamento.categoria && (
            <div>
              <p className="text-slate-600 text-xs uppercase tracking-wide mb-1">Categoria</p>
              <p className="text-slate-200 font-medium">{equipamento.categoria}</p>
            </div>
          )}
          {equipamento.patrimonio && (
            <div>
              <p className="text-slate-600 text-xs uppercase tracking-wide mb-1">Patrimônio</p>
              <p className="text-slate-200 font-medium font-mono">{equipamento.patrimonio}</p>
            </div>
          )}
          <div>
            <p className="text-slate-600 text-xs uppercase tracking-wide mb-1">Status</p>
            <StatusBadge status={equipamento.status} />
          </div>
        </div>
        {equipamento.descricao && (
          <div>
            <p className="text-slate-600 text-xs uppercase tracking-wide mb-1">Descrição</p>
            <p className="text-slate-400 text-sm leading-relaxed">{equipamento.descricao}</p>
          </div>
        )}
        {isAdmin && (
          <div className="flex gap-3 pt-2 border-t border-slate-800">
            <Link href={`/equipamentos/${id}/editar`}
              className="px-4 py-2 rounded-xl text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
              style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.15)" }}>
              Editar Equipamento
            </Link>
          </div>
        )}
      </div>

      {/* Chamados relacionados */}
      <div className="rounded-2xl p-6 space-y-4" style={{ background: "rgba(13,21,38,0.8)", border: "1px solid rgba(99,130,200,0.15)" }}>
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
          Histórico de Chamados ({chamados.length})
        </h2>
        {chamados.length === 0 ? (
          <p className="text-slate-600 text-sm">Nenhum chamado registrado para este equipamento.</p>
        ) : (
          <div className="space-y-3">
            {chamados.map(c => {
              const st = STATUS_CHAMADO[c.status] || { label: c.status, color: "#94a3b8" };
              return (
                <Link key={c.id} href={`/chamados/${c.id}`}
                  className="flex items-center justify-between p-4 rounded-xl hover:opacity-80 transition-opacity"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(99,130,200,0.1)" }}>
                  <div>
                    <p className="text-slate-200 text-sm font-medium">{c.titulo}</p>
                    <p className="text-slate-600 text-xs mt-0.5">
                      {c.cliente_nome && `Cliente: ${c.cliente_nome} · `}
                      {new Date(c.aberto_em).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full"
                    style={{ color: st.color, background: `${st.color}15`, border: `1px solid ${st.color}30` }}>
                    {st.label}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
