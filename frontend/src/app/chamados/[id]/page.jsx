"use client";
import { useEffect, useState, use } from "react";
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
    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${map[status] || map.cancelado}`}>
      {status?.replace("_", " ")}
    </span>
  );
}

function EquipStatusBadge({ status }) {
  const map = {
    operacional: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    em_manutencao: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    desativado: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${map[status] || map.desativado}`}>
      {status?.replace("_", " ")}
    </span>
  );
}

export default function ChamadoDetalhePage({ params }) {
  const { id } = use(params);
  const [chamado, setChamado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [user, setUser] = useState(null);
  const [showManutencaoForm, setShowManutencaoForm] = useState(false);
  const [descricaoManutencao, setDescricaoManutencao] = useState("");
  const [savingManutencao, setSavingManutencao] = useState(false);
  const [msg, setMsg] = useState(null);
  const router = useRouter();

  const fetchChamado = async () => {
    try {
      const token = localStorage.getItem("techrent_token");
      const res = await fetch(`${API}/chamados/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.sucesso) setChamado(data.dados);
      else router.push("/chamados");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const raw = localStorage.getItem("techrent_user");
    if (raw) setUser(JSON.parse(raw));
    fetchChamado();
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    setMsg(null);
    try {
      const token = localStorage.getItem("techrent_token");
      const res = await fetch(`${API}/chamados/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.sucesso) {
        setMsg({ type: "success", text: "Status atualizado com sucesso!" });
        fetchChamado();
      } else {
        setMsg({ type: "error", text: data.mensagem });
      }
    } catch (e) {
      setMsg({ type: "error", text: "Erro ao atualizar status" });
    } finally {
      setUpdating(false);
    }
  };

  const handleAceitar = async () => {
    setUpdating(true);
    setMsg(null);
    try {
      const token = localStorage.getItem("techrent_token");
      const res = await fetch(`${API}/chamados/${id}/aceitar`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.sucesso) {
        setMsg({ type: "success", text: "Chamado aceito! Você é o técnico responsável." });
        fetchChamado();
      } else {
        setMsg({ type: "error", text: data.mensagem });
      }
    } catch (e) {
      setMsg({ type: "error", text: "Erro ao aceitar chamado" });
    } finally {
      setUpdating(false);
    }
  };

  const handleRegistrarManutencao = async (e) => {
    e.preventDefault();
    if (!descricaoManutencao.trim()) return;
    setSavingManutencao(true);
    setMsg(null);
    try {
      const token = localStorage.getItem("techrent_token");
      const res = await fetch(`${API}/manutencao`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          chamado_id: chamado.id,
          equipamento_id: chamado.equipamento_id,
          descricao: descricaoManutencao,
        }),
      });
      const data = await res.json();
      if (data.sucesso) {
        setMsg({ type: "success", text: "Registro de manutenção salvo!" });
        setDescricaoManutencao("");
        setShowManutencaoForm(false);
        fetchChamado();
      } else {
        setMsg({ type: "error", text: data.mensagem });
      }
    } catch (e) {
      setMsg({ type: "error", text: "Erro ao registrar manutenção" });
    } finally {
      setSavingManutencao(false);
    }
  };

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-[400px]">
      <div className="w-8 h-8 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );

  if (!chamado) return (
    <div className="p-8 text-center text-slate-500">Chamado não encontrado.</div>
  );

  const isTecnico = user?.nivel_acesso === "tecnico";
  const isAdmin = user?.nivel_acesso === "admin";
  const isCliente = user?.nivel_acesso === "cliente";
  const isMeuChamado = isTecnico && chamado.tecnico_id === user?.id;
  const podeAceitar = isTecnico && chamado.status === "aberto";
  const podeAtualizar = (isTecnico && isMeuChamado) || isAdmin;
  const podeRegistrarManutencao = (isTecnico && isMeuChamado && chamado.status === "em_atendimento") || isAdmin;

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()}
          className="p-2 rounded-xl hover:bg-slate-800 transition-colors text-slate-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Chamado #{chamado.id}</h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Aberto em {new Date(chamado.aberto_em).toLocaleString("pt-BR")}
          </p>
        </div>
      </div>

      {/* Mensagem de feedback */}
      {msg && (
        <div className={`px-4 py-3 rounded-xl text-sm ${
          msg.type === "success"
            ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
            : "bg-red-500/10 border border-red-500/20 text-red-400"
        }`}>
          {msg.text}
        </div>
      )}

      {/* Detalhes do Chamado */}
      <div className="rounded-2xl p-6 space-y-5" style={{ background: "rgba(13,21,38,0.8)", border: "1px solid rgba(99,130,200,0.15)" }}>
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-xl font-bold text-slate-100">{chamado.titulo}</h2>
          <StatusBadge status={chamado.status} />
        </div>

        {chamado.descricao && (
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Descrição</p>
            <p className="text-slate-300 leading-relaxed text-sm">{chamado.descricao}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Prioridade</p>
            <p className={`text-sm font-bold capitalize ${
              chamado.prioridade === "alta" ? "text-red-400" :
              chamado.prioridade === "media" ? "text-amber-400" : "text-emerald-400"
            }`}>{chamado.prioridade}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Solicitante</p>
            <p className="text-sm text-slate-200">{chamado.cliente_nome || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Equipamento</p>
            <div className="flex items-center gap-2">
              <p className="text-sm text-slate-200">{chamado.equipamento_nome}</p>
              <EquipStatusBadge status={chamado.equipamento_status} />
            </div>
            {chamado.equipamento_patrimonio && (
              <p className="text-xs text-slate-600 font-mono mt-0.5">{chamado.equipamento_patrimonio}</p>
            )}
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Técnico Responsável</p>
            <p className="text-sm text-slate-200">{chamado.tecnico_nome || <span className="text-slate-500 italic">Não atribuído</span>}</p>
          </div>
        </div>

        {/* Ações */}
        {podeAceitar && (
          <div className="pt-4 border-t border-slate-800">
            <button disabled={updating} onClick={handleAceitar}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #2563eb, #3b82f6)" }}>
              {updating ? "Aceitando..." : "Aceitar Chamado"}
            </button>
          </div>
        )}

        {podeAtualizar && chamado.status !== "resolvido" && chamado.status !== "cancelado" && (
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Atualizar Status</p>
            <div className="flex gap-2 flex-wrap">
              {chamado.status === "aberto" && isAdmin && (
                <button disabled={updating} onClick={() => handleStatusUpdate("em_atendimento")}
                  className="flex-1 py-2 rounded-xl text-sm font-semibold text-amber-400 border border-amber-500/30 hover:bg-amber-500/10 transition-colors disabled:opacity-50">
                  Iniciar Atendimento
                </button>
              )}
              {chamado.status === "em_atendimento" && (
                <button disabled={updating} onClick={() => handleStatusUpdate("resolvido")}
                  className="flex-1 py-2 rounded-xl text-sm font-semibold text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/10 transition-colors disabled:opacity-50">
                  Marcar como Resolvido
                </button>
              )}
              {isAdmin && (
                <button disabled={updating} onClick={() => handleStatusUpdate("cancelado")}
                  className="flex-1 py-2 rounded-xl text-sm font-semibold text-slate-400 border border-slate-500/30 hover:bg-slate-500/10 transition-colors disabled:opacity-50">
                  Cancelar Chamado
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Histórico de Manutenção */}
      <div className="rounded-2xl p-6 space-y-4" style={{ background: "rgba(13,21,38,0.8)", border: "1px solid rgba(99,130,200,0.15)" }}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest">
            Histórico de Manutenção
            {chamado.historico?.length > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {chamado.historico.length}
              </span>
            )}
          </h3>
          {podeRegistrarManutencao && (
            <button onClick={() => setShowManutencaoForm(!showManutencaoForm)}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
              {showManutencaoForm ? "Cancelar" : "+ Registrar"}
            </button>
          )}
        </div>

        {/* Formulário de registro de manutenção */}
        {showManutencaoForm && (
          <form onSubmit={handleRegistrarManutencao} className="space-y-3 p-4 rounded-xl" style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.15)" }}>
            <label className="block text-xs font-medium text-slate-300">Descreva o que foi feito:</label>
            <textarea
              value={descricaoManutencao}
              onChange={e => setDescricaoManutencao(e.target.value)}
              placeholder="Ex: Realizada limpeza de componentes, substituído o HD..."
              rows={3}
              required
              className="w-full px-3 py-2 rounded-xl text-sm text-slate-200 placeholder-slate-600 resize-none focus:outline-none"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(99,130,200,0.2)" }}
            />
            <button type="submit" disabled={savingManutencao}
              className="w-full py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-all"
              style={{ background: "linear-gradient(135deg, #2563eb, #3b82f6)" }}>
              {savingManutencao ? "Salvando..." : "Salvar Registro"}
            </button>
          </form>
        )}

        {/* Lista de histórico */}
        {(!chamado.historico || chamado.historico.length === 0) ? (
          <p className="text-slate-500 text-sm text-center py-4">Nenhum registro de manutenção ainda.</p>
        ) : (
          <div className="space-y-3">
            {chamado.historico.map((h, i) => (
              <div key={h.id} className="relative pl-6">
                {/* Linha de timeline */}
                {i < chamado.historico.length - 1 && (
                  <div className="absolute left-2 top-6 bottom-0 w-px bg-slate-700" />
                )}
                <div className="absolute left-0 top-2 w-4 h-4 rounded-full border-2 border-blue-500 bg-slate-900" />
                <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(99,130,200,0.1)" }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-blue-400">{h.tecnico_nome}</span>
                    <span className="text-[10px] text-slate-600">
                      {new Date(h.registrado_em).toLocaleString("pt-BR")}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{h.descricao}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
