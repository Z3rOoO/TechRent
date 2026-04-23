"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("techrent_token");
        const userRaw = localStorage.getItem("techrent_user");
        
        if (!token || !userRaw) {
          router.push("/login");
          return;
        }

        const user = JSON.parse(userRaw);
        if (user.nivel_acesso !== "admin") {
          router.push(user.nivel_acesso === "tecnico" ? "/chamados-tecnico" : "/meus-chamados");
          return;
        }

        const res = await fetch("http://localhost:3001/dashboard/admin", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();
        if (result.sucesso) setData(result.dados);
        else setError(result.mensagem);
      } catch (e) {
        setError("Erro ao carregar dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Chamados Abertos", value: data?.chamados?.abertos || 0, color: "text-blue-400" },
    { label: "Em Atendimento", value: data?.chamados?.em_atendimento || 0, color: "text-amber-400" },
    { label: "Equipamentos em Manutenção", value: data?.equipamentos?.manutencao || 0, color: "text-red-400" },
    { label: "Usuários Ativos", value: data?.usuarios || 0, color: "text-emerald-400" },
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard Admin</h1>
          <p className="text-slate-400 text-sm mt-1">Visão geral do sistema e indicadores de desempenho</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/chamados/novo" className="btn-primary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"/>
            </svg>
            Novo Chamado
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="card p-6 bg-slate-900/40 border-slate-800">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6 bg-slate-900/40 border-slate-800">
          <h2 className="text-lg font-bold text-white mb-4">Equipamentos</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Disponíveis</span>
              <span className="text-emerald-400 font-bold">{data?.equipamentos?.disponiveis}</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full" 
                style={{ width: `${data?.equipamentos?.total > 0 ? (data?.equipamentos?.disponiveis / data?.equipamentos?.total) * 100 : 0}%` }} 
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Em Uso/Alugados</span>
              <span className="text-blue-400 font-bold">{data?.equipamentos?.alugados}</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-blue-500 h-full" 
                style={{ width: `${data?.equipamentos?.total > 0 ? (data?.equipamentos?.alugados / data?.equipamentos?.total) * 100 : 0}%` }} 
              />
            </div>
          </div>
        </div>

        <div className="card p-6 bg-slate-900/40 border-slate-800">
          <h2 className="text-lg font-bold text-white mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/equipamentos" className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-blue-500/50 transition-colors text-center">
              <p className="text-sm font-semibold text-slate-200">Inventário</p>
            </Link>
            <Link href="/manutencao" className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-blue-500/50 transition-colors text-center">
              <p className="text-sm font-semibold text-slate-200">Manutenções</p>
            </Link>
            <Link href="/admin/users" className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-blue-500/50 transition-colors text-center">
              <p className="text-sm font-semibold text-slate-200">Usuários</p>
            </Link>
            <Link href="/settings" className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-blue-500/50 transition-colors text-center">
              <p className="text-sm font-semibold text-slate-200">Configurações</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
