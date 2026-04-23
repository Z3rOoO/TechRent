"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ChamadosTecnico() {
  const [data, setData] = useState({ disponiveis: [], em_andamento: [] });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchPainel = async () => {
    try {
      const token = localStorage.getItem("techrent_token");
      if (!token) {
        router.push("/login");
        return;
      }
      const res = await fetch("http://localhost:3001/dashboard/tecnico", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (result.sucesso) setData(result.dados);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPainel();
  }, [router]);

  const handleAceitar = async (id) => {
    try {
      const token = localStorage.getItem("techrent_token");
      const res = await fetch(`http://localhost:3001/chamados/${id}/aceitar`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (result.sucesso) {
        alert("Chamado aceito com sucesso!");
        fetchPainel();
      }
    } catch (e) {
      alert("Erro ao aceitar chamado");
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-12 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Painel do Técnico</h1>
        <p className="text-slate-400 text-sm mt-1">Gerencie seus atendimentos e aceite novas solicitações</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          Meus Atendimentos
        </h2>
        {data.em_andamento.length === 0 ? (
          <div className="card p-8 text-center bg-slate-900/30 border-slate-800">
            <p className="text-slate-500 text-sm">Você não tem chamados em andamento no momento.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {data.em_andamento.map(c => (
              <div key={c.id} className="card p-5 bg-slate-900/40 border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-100">{c.titulo}</h3>
                  <p className="text-sm text-slate-400 line-clamp-1">{c.descricao}</p>
                  <p className="text-[10px] text-slate-600 font-mono">ID: #{c.id} • Prioridade: <span className="text-amber-400 uppercase">{c.prioridade}</span></p>
                </div>
                <Link href={`/chamados/${c.id}`} className="btn-primary py-2 text-xs">
                  Atualizar Status
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          Novos Chamados Disponíveis
        </h2>
        {data.disponiveis.length === 0 ? (
          <div className="card p-8 text-center bg-slate-900/30 border-slate-800">
            <p className="text-slate-500 text-sm">Não há novos chamados abertos no momento.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {data.disponiveis.map(c => (
              <div key={c.id} className="card p-5 bg-slate-950/50 border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-100">{c.titulo}</h3>
                  <p className="text-sm text-slate-400 line-clamp-1">{c.descricao}</p>
                  <p className="text-[10px] text-slate-600 font-mono">ID: #{c.id} • Prioridade: <span className="text-red-400 uppercase">{c.prioridade}</span></p>
                </div>
                <button 
                  onClick={() => handleAceitar(c.id)}
                  className="btn-secondary py-2 text-xs border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                >
                  Aceitar Chamado
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
