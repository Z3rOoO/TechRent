"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const statusColors = {
  aberto: { color:"#93c5fd", bg:"rgba(59,130,246,0.1)", border:"rgba(59,130,246,0.2)" },
  em_atendimento: { color:"#fbbf24", bg:"rgba(245,158,11,0.1)", border:"rgba(245,158,11,0.2)" },
  resolvido: { color:"#4ade80", bg:"rgba(34,197,94,0.1)", border:"rgba(34,197,94,0.2)" },
  cancelado: { color:"#f87171", bg:"rgba(239,68,68,0.1)", border:"rgba(239,68,68,0.2)" },
  disponivel: { color:"#4ade80", bg:"rgba(34,197,94,0.1)", border:"rgba(34,197,94,0.2)" },
  alugado: { color:"#93c5fd", bg:"rgba(59,130,246,0.1)", border:"rgba(59,130,246,0.2)" },
  manutencao: { color:"#c4b5fd", bg:"rgba(139,92,246,0.1)", border:"rgba(139,92,246,0.2)" },
};
function getS(status) {
  return statusColors[status?.toLowerCase()] || { color:"#94a3b8", bg:"rgba(100,116,139,0.1)", border:"rgba(100,116,139,0.2)" };
}

export default function DashboardPage() {
  const [resumo, setResumo] = useState(null);
  const [user, setUser] = useState(null);
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const raw = localStorage.getItem("techrent_user");
    const token = localStorage.getItem("techrent_token");
    if (!raw || !token) { router.push("/login"); return; }
    const u = JSON.parse(raw);
    setUser(u);
    if (u.nivel_acesso !== "admin") {
      if (u.nivel_acesso === "tecnico") router.push("/chamados-tecnico");
      else router.push("/meus-chamados");
      return;
    }
    fetch("http://localhost:3001/dashboard/admin", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.sucesso === false) setErro(data.mensagem || "Erro ao buscar dados");
        else setResumo(data.dados || data);
      })
      .catch((e) => setErro(e.message))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <svg className="w-8 h-8 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="p-8">
        <div className="p-4 rounded-xl text-sm text-red-400" style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.2)"}}>
          Erro: {erro}
        </div>
      </div>
    );
  }

  const chamados = Array.isArray(resumo?.chamados) ? resumo.chamados : [];
  const equipamentos = Array.isArray(resumo?.equipamentos) ? resumo.equipamentos : [];
  const totalChamados = chamados.reduce((s, c) => s + (parseInt(c.total) || parseInt(c.count) || 0), 0);
  const totalEquipamentos = equipamentos.reduce((s, e) => s + (parseInt(e.total_itens) || parseInt(e.count) || 0), 0);

  return (
    <div className="p-6 md:p-8 space-y-8 animate-fade-in">
      <div className="animate-slide-in-from-bottom">
        <h1 className="text-2xl font-bold text-slate-100">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Bem-vindo, {user?.nome || "Administrador"}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {label:"Total de Chamados",value:totalChamados,color:"#93c5fd",delay:"0.05s"},
          {label:"Equipamentos",value:totalEquipamentos,color:"#c4b5fd",delay:"0.1s"},
          {label:"Chamados Abertos",value:chamados.find(c=>c.status==="aberto")?.total||chamados.find(c=>c.status==="aberto")?.count||0,color:"#fbbf24",delay:"0.15s"},
          {label:"Resolvidos",value:chamados.find(c=>c.status==="resolvido")?.total||chamados.find(c=>c.status==="resolvido")?.count||0,color:"#4ade80",delay:"0.2s"},
        ].map((k) => (
          <div key={k.label} className="rounded-2xl p-6 animate-slide-in-from-bottom"
            style={{animationDelay:k.delay,background:"rgba(13,21,38,0.7)",border:`1px solid ${k.color}25`}}>
            <p className="text-sm text-slate-500 mb-2">{k.label}</p>
            <p className="text-3xl font-bold" style={{color:k.color}}>{k.value}</p>
          </div>
        ))}
      </div>

      <div className="animate-slide-in-from-bottom" style={{animationDelay:"0.25s"}}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-200">Chamados por Status</h2>
            <p className="text-sm text-slate-500 mt-0.5">Distribuicao atual</p>
          </div>
          <Link href="/chamados" className="text-xs font-medium text-blue-400 hover:text-blue-300 px-3 py-1.5 rounded-lg"
            style={{background:"rgba(59,130,246,0.08)",border:"1px solid rgba(59,130,246,0.15)"}}>
            Gerenciar
          </Link>
        </div>
        {chamados.length === 0 ? (
          <div className="flex items-center justify-center py-10 rounded-xl text-sm text-slate-600"
            style={{background:"rgba(13,21,38,0.4)",border:"1px solid rgba(99,130,200,0.08)"}}>
            Sem dados de chamados
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {chamados.map((c) => {
              const s = getS(c.status);
              return (
                <div key={c.status} className="rounded-xl p-4" style={{background:s.bg,border:`1px solid ${s.border}`}}>
                  <p className="text-2xl font-bold" style={{color:s.color}}>{c.total||c.count||0}</p>
                  <p className="text-xs mt-1 capitalize" style={{color:s.color+"cc"}}>{(c.status||"").replace("_"," ")}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="animate-slide-in-from-bottom" style={{animationDelay:"0.3s"}}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-200">Equipamentos</h2>
            <p className="text-sm text-slate-500 mt-0.5">Inventario e receita potencial</p>
          </div>
          <Link href="/equipamentos" className="text-xs font-medium text-blue-400 hover:text-blue-300 px-3 py-1.5 rounded-lg"
            style={{background:"rgba(59,130,246,0.08)",border:"1px solid rgba(59,130,246,0.15)"}}>
            Ver todos
          </Link>
        </div>
        {equipamentos.length === 0 ? (
          <div className="flex items-center justify-center py-10 rounded-xl text-sm text-slate-600"
            style={{background:"rgba(13,21,38,0.4)",border:"1px solid rgba(99,130,200,0.08)"}}>
            Sem dados de equipamentos
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {equipamentos.map((e) => {
              const s = getS(e.status);
              return (
                <div key={e.status} className="rounded-xl p-5" style={{background:s.bg,border:`1px solid ${s.border}`}}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium capitalize" style={{color:s.color}}>{(e.status||"").replace("_"," ")}</p>
                    <p className="text-2xl font-bold" style={{color:s.color}}>{e.total_itens||e.count||0}</p>
                  </div>
                  {e.potencial_receita_diaria != null && (
                    <div className="pt-3 border-t" style={{borderColor:s.border}}>
                      <p className="text-xs text-slate-500">Receita potencial/dia</p>
                      <p className="text-lg font-bold text-green-400 mt-0.5">R$ {(parseFloat(e.potencial_receita_diaria)||0).toLocaleString("pt-BR")}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="animate-slide-in-from-bottom" style={{animationDelay:"0.35s"}}>
        <h2 className="text-lg font-semibold text-slate-200 mb-4">Acoes Rapidas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {href:"/chamados",label:"Chamados",icon:"📋"},
            {href:"/equipamentos",label:"Equipamentos",icon:"🖥️"},
            {href:"/manutencao",label:"Manutencao",icon:"🔧"},
            {href:"/admin/users",label:"Usuarios",icon:"👥"},
          ].map((a) => (
            <Link key={a.href} href={a.href}
              className="flex flex-col items-center gap-3 p-5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 text-center group"
              style={{background:"rgba(13,21,38,0.7)",border:"1px solid rgba(99,130,200,0.1)"}}
              onMouseEnter={(e) => e.currentTarget.style.borderColor="rgba(99,130,200,0.25)"}
              onMouseLeave={(e) => e.currentTarget.style.borderColor="rgba(99,130,200,0.1)"}>
              <span className="text-2xl">{a.icon}</span>
              <span className="text-sm font-medium text-slate-400 group-hover:text-slate-200 transition-colors">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
