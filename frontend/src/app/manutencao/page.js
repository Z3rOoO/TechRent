"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API = "http://localhost:3001";

export default function ManutencaoPage() {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const raw = localStorage.getItem("techrent_user");
    if (!raw) { router.push("/login"); return; }
    const u = JSON.parse(raw);
    setUser(u);
    if (u.nivel_acesso === "cliente") { router.push("/chamados"); return; }
    fetchRegistros();
  }, []);

  const fetchRegistros = async () => {
    try {
      const token = localStorage.getItem("techrent_token");
      const res = await fetch(`${API}/manutencao`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.sucesso) setRegistros(data.dados);
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

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Histórico de Manutenção</h1>
          <p className="text-slate-400 text-sm mt-1">
            {user?.nivel_acesso === "admin" ? "Todos os registros de manutenção do sistema" : "Seus registros de manutenção"}
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/chamados"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white transition-colors"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(99,130,200,0.15)" }}>
            Ver Chamados
          </Link>
          <Link href="/manutencao/novo"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, #059669, #10b981)" }}>
            + Novo Registro
          </Link>
        </div>
      </div>

      {registros.length === 0 ? (
        <div className="rounded-2xl p-12 text-center" style={{ background: "rgba(13,21,38,0.6)", border: "1px solid rgba(99,130,200,0.1)" }}>
          <p className="text-slate-500 text-sm">Nenhum registro de manutenção encontrado.</p>
          <p className="text-slate-600 text-xs mt-2">Os registros aparecem quando um técnico documenta uma ação em um chamado.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {registros.map(r => (
            <div key={r.id} className="rounded-2xl p-5" style={{ background: "rgba(13,21,38,0.7)", border: "1px solid rgba(99,130,200,0.1)" }}>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono text-slate-600">#{r.id}</span>
                    <span className="text-sm font-semibold text-slate-200">{r.equipamento_nome}</span>
                    {r.equipamento_patrimonio && (
                      <span className="text-xs font-mono text-slate-600">{r.equipamento_patrimonio}</span>
                    )}
                    {r.equipamento_categoria && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium text-slate-400 bg-slate-700/50">{r.equipamento_categoria}</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{r.descricao}</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs text-blue-400 font-medium">Técnico: {r.tecnico_nome}</span>
                    {r.chamado_titulo && (
                      <Link href={`/chamados/${r.chamado_id}`}
                        className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                        Chamado: {r.chamado_titulo}
                        {r.chamado_status && (
                          <span className={`ml-1 ${r.chamado_status === "resolvido" ? "text-emerald-400" : "text-amber-400"}`}>
                            ({r.chamado_status?.replace("_", " ")})
                          </span>
                        )}
                      </Link>
                    )}
                  </div>
                </div>
                <div className="shrink-0">
                  <p className="text-xs text-slate-500 text-right">
                    {new Date(r.registrado_em).toLocaleString("pt-BR", {
                      day: "2-digit", month: "2-digit", year: "numeric",
                      hour: "2-digit", minute: "2-digit"
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
