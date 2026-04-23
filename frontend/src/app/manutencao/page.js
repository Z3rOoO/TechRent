"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ManutencaoPage() {
  const [registros, setRegistros] = useState([]);
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("techrent_user");
    if (raw) { try { setUser(JSON.parse(raw)); } catch {} }
    const token = localStorage.getItem("techrent_token");
    fetch("http://localhost:3001/manutencao", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.sucesso === false) setErro(data.mensagem || "Erro ao buscar");
        else {
          const list = Array.isArray(data) ? data : (Array.isArray(data?.dados) ? data.dados : []);
          setRegistros(list);
        }
      })
      .catch((e) => setErro(e.message))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (d) => {
    if (!d) return "—";
    try { return new Date(d).toLocaleDateString("pt-BR"); } catch { return d; }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-start justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Historico de Manutencao</h1>
          <p className="text-sm text-slate-500 mt-1">Registro detalhado de todos os reparos realizados</p>
        </div>
        {user?.nivel_acesso === "tecnico" && (
          <Link href="/manutencao/novo"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
            style={{background:"linear-gradient(135deg, #2563eb, #3b82f6)"}}>
            + Registrar
          </Link>
        )}
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
          <p className="text-slate-500 text-sm">Carregando registros...</p>
        </div>
      ) : registros.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{background:"rgba(59,130,246,0.08)",border:"1px solid rgba(59,130,246,0.15)"}}>
            <svg className="w-8 h-8 text-blue-400/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <circle cx="12" cy="12" r="3" strokeWidth="1.5"/>
            </svg>
          </div>
          <p className="text-slate-400 font-medium">Nenhum registro encontrado</p>
          <p className="text-slate-600 text-sm">Nenhuma manutencao foi registrada ainda</p>
        </div>
      ) : (
        <div className="space-y-3">
          {registros.map((r, index) => {
            const dataManutencao = formatDate(r.data_manutencao || r.data);
            return (
              <Link key={r.id || index} href={`/manutencao/${r.id}`}
                className="block rounded-xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl animate-slide-in-from-bottom group"
                style={{animationDelay:`${index*0.04}s`,background:"rgba(13,21,38,0.7)",border:"1px solid rgba(99,130,200,0.1)"}}
                onMouseEnter={(e) => e.currentTarget.style.borderColor="rgba(59,130,246,0.25)"}
                onMouseLeave={(e) => e.currentTarget.style.borderColor="rgba(99,130,200,0.1)"}>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-semibold text-slate-200 group-hover:text-blue-400 transition-colors">Reparo #{r.id}</h3>
                    {dataManutencao !== "—" && <p className="text-xs text-slate-600 mt-0.5">Realizado em {dataManutencao}</p>}
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{background:"rgba(34,197,94,0.12)",color:"#4ade80",border:"1px solid rgba(34,197,94,0.25)"}}>
                    Concluido
                  </span>
                </div>
                {r.descricao && <p className="text-sm text-slate-500 line-clamp-2 mb-3">{r.descricao}</p>}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  {r.equipamento && (
                    <div>
                      <p className="text-slate-600 uppercase tracking-wide mb-1">Equipamento</p>
                      <p className="font-medium text-slate-300">{r.equipamento}</p>
                    </div>
                  )}
                  {dataManutencao !== "—" && (
                    <div>
                      <p className="text-slate-600 uppercase tracking-wide mb-1">Data</p>
                      <p className="font-medium text-slate-300">{dataManutencao}</p>
                    </div>
                  )}
                  {r.tecnico && (
                    <div>
                      <p className="text-slate-600 uppercase tracking-wide mb-1">Tecnico</p>
                      <p className="font-medium text-slate-300">{r.tecnico}</p>
                    </div>
                  )}
                  {r.custo && (
                    <div>
                      <p className="text-slate-600 uppercase tracking-wide mb-1">Custo</p>
                      <p className="font-medium text-green-400">R$ {(parseFloat(r.custo)||0).toFixed(2)}</p>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
