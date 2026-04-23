"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NovoChamadoPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [equipamentos, setEquipamentos] = useState([]);
  const [formData, setFormData] = useState({ titulo:"", descricao:"", equipamento_id:"", prioridade:"media" });

  useEffect(() => {
    const raw = localStorage.getItem("techrent_user");
    const token = localStorage.getItem("techrent_token");
    if (!raw || !token) { router.push("/login"); return; }
    try { setUser(JSON.parse(raw)); } catch {}
    fetch("http://localhost:3001/equipamentos", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : (Array.isArray(data?.dados) ? data.dados : []);
        // Mostrar apenas equipamentos operacionais para abertura de chamado
        setEquipamentos(list.filter(e => e.status === 'operacional' || !e.status));
      })
      .catch(() => {});
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("techrent_token");
    try {
      const res = await fetch("http://localhost:3001/chamados", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/chamados");
        }, 1500);
      } else {
        setError(data.mensagem || "Erro ao criar chamado");
      }
    } catch { setError("Erro de conexão"); }
    finally { setLoading(false); }
  };

  const backHref = "/chamados";

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center gap-2 text-sm text-slate-600 animate-fade-in">
        <Link href={backHref} className="hover:text-slate-400 transition-colors">Chamados</Link>
        <span>/</span>
        <span className="text-slate-400">Novo Chamado</span>
      </div>

      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-slate-100">Abrir Novo Chamado</h1>
        <p className="text-sm text-slate-500 mt-1">Descreva o problema para que nossa equipe possa ajudar</p>
      </div>

      {success && (
        <div className="flex items-center gap-3 p-4 rounded-xl text-sm text-green-400 animate-scale-in"
          style={{background:"rgba(34,197,94,0.08)",border:"1px solid rgba(34,197,94,0.2)"}}>
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
          </svg>
          Chamado criado com sucesso! Redirecionando...
        </div>
      )}

      <div className="rounded-2xl p-8 space-y-6 animate-slide-in-from-bottom"
        style={{background:"rgba(13,21,38,0.8)",border:"1px solid rgba(99,130,200,0.15)"}}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">Título do Chamado <span className="text-red-400">*</span></label>
            <input type="text" placeholder="Ex: Computador não liga" value={formData.titulo}
              onChange={(e) => setFormData({...formData, titulo:e.target.value})} required
              className="w-full px-4 py-2.5 rounded-xl text-sm text-slate-200 placeholder-slate-600"
              style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(99,130,200,0.15)",outline:"none"}}
              onFocus={(e) => e.target.style.borderColor="rgba(59,130,246,0.5)"}
              onBlur={(e) => e.target.style.borderColor="rgba(99,130,200,0.15)"} />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">Descrição <span className="text-red-400">*</span></label>
            <textarea placeholder="Descreva o problema detalhadamente..." value={formData.descricao}
              onChange={(e) => setFormData({...formData, descricao:e.target.value})} required rows={4}
              className="w-full px-4 py-2.5 rounded-xl text-sm text-slate-200 placeholder-slate-600 resize-none"
              style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(99,130,200,0.15)",outline:"none"}}
              onFocus={(e) => e.target.style.borderColor="rgba(59,130,246,0.5)"}
              onBlur={(e) => e.target.style.borderColor="rgba(99,130,200,0.15)"} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Prioridade</label>
              <select value={formData.prioridade} onChange={(e) => setFormData({...formData, prioridade:e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl text-sm text-slate-200"
                style={{background:"rgba(13,21,38,0.9)",border:"1px solid rgba(99,130,200,0.15)",outline:"none"}}>
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
              </select>
            </div>

            {equipamentos.length > 0 && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">Equipamento</label>
                <select value={formData.equipamento_id} onChange={(e) => setFormData({...formData, equipamento_id:e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl text-sm text-slate-200"
                  style={{background:"rgba(13,21,38,0.9)",border:"1px solid rgba(99,130,200,0.15)",outline:"none"}}>
                  <option value="">Selecionar...</option>
                  {equipamentos.map((eq) => (
                    <option key={eq.id} value={eq.id}>{eq.nome||`Equip. #${eq.id}`}{eq.patrimonio ? ` (${eq.patrimonio})` : ''}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-red-400"
              style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.2)"}}>
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading || success}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-all duration-200"
              style={{background:"linear-gradient(135deg, #2563eb, #3b82f6)"}}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Criando...
                </span>
              ) : "Abrir Chamado"}
            </button>
            <Link href={backHref}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors text-center"
              style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(99,130,200,0.1)"}}>
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
