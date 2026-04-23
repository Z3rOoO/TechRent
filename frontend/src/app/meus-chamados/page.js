"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MeusChamados() {
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("todos");
  const router = useRouter();

  useEffect(() => {
    const fetchChamados = async () => {
      try {
        const token = localStorage.getItem("techrent_token");
        if (!token) {
          router.push("/login");
          return;
        }
        const res = await fetch("http://localhost:3001/chamados", {
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
    fetchChamados();
  }, [router]);

  const filtered = chamados.filter(c => {
    if (activeTab === "todos") return true;
    if (activeTab === "abertos") return c.status === "aberto" || c.status === "em_atendimento";
    if (activeTab === "concluidos") return c.status === "resolvido";
    return true;
  });

  const getStatusBadge = (status) => {
    const s = status.toLowerCase();
    if (s === "aberto") return <span className="px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-wider border border-blue-500/20">Aberto</span>;
    if (s === "em_atendimento") return <span className="px-2 py-1 rounded-md bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase tracking-wider border border-amber-500/20">Em Atendimento</span>;
    if (s === "resolvido") return <span className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">Concluído</span>;
    return <span className="px-2 py-1 rounded-md bg-slate-500/10 text-slate-400 text-[10px] font-bold uppercase tracking-wider border border-slate-500/20">{status}</span>;
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Meus Chamados</h1>
          <p className="text-slate-400 text-sm mt-1">Acompanhe o status das suas solicitações de suporte</p>
        </div>
        <Link href="/chamados/novo" className="btn-primary">
          Abrir Novo Chamado
        </Link>
      </div>

      <div className="flex border-b border-slate-800 gap-6">
        {["todos", "abertos", "concluidos"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-medium transition-colors relative capitalize ${activeTab === tab ? "text-blue-400" : "text-slate-500 hover:text-slate-300"}`}
          >
            {tab}
            {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center bg-slate-900/30 border-dashed border-slate-800">
          <p className="text-slate-500 text-sm">Nenhum chamado encontrado nesta categoria.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map(chamado => (
            <div key={chamado.id} className="card p-5 bg-slate-900/40 border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-slate-100">{chamado.titulo}</h3>
                  {getStatusBadge(chamado.status)}
                </div>
                <p className="text-sm text-slate-400 line-clamp-1">{chamado.descricao}</p>
                <p className="text-[10px] text-slate-600 font-mono">ID: #{chamado.id} • Criado em {new Date(chamado.data_criacao || Date.now()).toLocaleDateString()}</p>
              </div>
              <Link href={`/chamados/${chamado.id}`} className="btn-secondary py-2 text-xs">
                Ver Detalhes
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
