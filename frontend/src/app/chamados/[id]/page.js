"use client";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DetalheChamado({ params }) {
  const { id } = use(params);
  const [chamado, setChamado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const fetchChamado = async () => {
    try {
      const token = localStorage.getItem("techrent_token");
      const res = await fetch(`http://localhost:3001/chamados/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.sucesso) setChamado(data.dados);
      else router.push("/dashboard");
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
    try {
      const token = localStorage.getItem("techrent_token");
      const res = await fetch(`http://localhost:3001/chamados/${id}/status`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.sucesso) {
        alert("Status atualizado!");
        fetchChamado();
      } else {
        alert(data.mensagem);
      }
    } catch (e) {
      alert("Erro ao atualizar status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Carregando...</div>;
  if (!chamado) return <div className="p-8 text-center text-slate-500">Chamado não encontrado.</div>;

  const isTecnicoOrAdmin = user?.nivel_acesso === "tecnico" || user?.nivel_acesso === "admin";
  const canUpdate = isTecnicoOrAdmin && chamado.status !== "resolvido";

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-slate-800 transition-colors text-slate-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-white tracking-tight">Chamado #{chamado.id}</h1>
      </div>

      <div className="card p-8 bg-slate-900/40 border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-100">{chamado.titulo}</h2>
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
            chamado.status === 'aberto' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
            chamado.status === 'em_atendimento' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
            'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          }`}>
            {chamado.status.replace('_', ' ')}
          </span>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Descrição</p>
          <p className="text-slate-300 leading-relaxed">{chamado.descricao}</p>
        </div>

        <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-800">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Prioridade</p>
            <p className="text-sm text-slate-200 capitalize">{chamado.prioridade}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Data de Abertura</p>
            <p className="text-sm text-slate-200">{new Date(chamado.data_criacao).toLocaleString()}</p>
          </div>
        </div>

        {canUpdate && (
          <div className="pt-8 space-y-4">
            <p className="text-sm font-medium text-slate-400">Ações de Status:</p>
            <div className="flex gap-3">
              {chamado.status === "aberto" && (
                <button 
                  disabled={updating}
                  onClick={() => handleStatusUpdate("em_atendimento")}
                  className="btn-primary flex-1"
                >
                  Iniciar Atendimento
                </button>
              )}
              {chamado.status === "em_atendimento" && (
                <button 
                  disabled={updating}
                  onClick={() => handleStatusUpdate("resolvido")}
                  className="btn-primary flex-1 bg-emerald-600 hover:bg-emerald-500"
                >
                  Marcar como Resolvido
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
