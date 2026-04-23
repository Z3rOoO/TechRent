"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API = "http://localhost:3001";

export default function NovaManutencaoPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [chamados, setChamados] = useState([]);
  const [loadingChamados, setLoadingChamados] = useState(true);
  const [chamadoSelecionado, setChamadoSelecionado] = useState(null);

  const [formData, setFormData] = useState({
    chamado_id: "",
    equipamento_id: "",
    descricao: "",
  });

  useEffect(() => {
    const raw = localStorage.getItem("techrent_user");
    const token = localStorage.getItem("techrent_token");
    if (!raw || !token) { router.push("/login"); return; }
    const userData = JSON.parse(raw);
    setUser(userData);
    if (userData.nivel_acesso !== "tecnico" && userData.nivel_acesso !== "admin") {
      router.push("/chamados");
      return;
    }
    fetch(`${API}/chamados`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        const list = data.dados || [];
        // Filtra apenas chamados em atendimento
        // Para técnico: o backend já retorna apenas chamados abertos ou atribuídos a ele,
        // então filtramos em_atendimento (que serão apenas os dele)
        // Para admin: filtra todos em atendimento
        const emAtendimento = list.filter(c => c.status === "em_atendimento");

        if (userData.nivel_acesso === "tecnico") {
          // Garante que o técnico veja apenas seus próprios chamados em atendimento
          setChamados(emAtendimento.filter(c => c.tecnico_id === userData.id));
        } else {
          setChamados(emAtendimento);
        }
      })
      .catch(e => console.error(e))
      .finally(() => setLoadingChamados(false));
  }, [router]);

  const handleChamadoChange = (e) => {
    const chamadoId = e.target.value;
    const chamado = chamados.find(c => String(c.id) === String(chamadoId));
    setChamadoSelecionado(chamado || null);
    setFormData(prev => ({
      ...prev,
      chamado_id: chamadoId,
      equipamento_id: chamado ? String(chamado.equipamento_id) : "",
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("techrent_token");
    try {
      const response = await fetch(`${API}/manutencao`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          chamado_id: Number(formData.chamado_id),
          equipamento_id: Number(formData.equipamento_id),
          descricao: formData.descricao,
        }),
      });
      const data = await response.json();
      if (!data.sucesso) {
        setError(data.mensagem || "Erro ao registrar manutenção");
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/manutencao"), 2000);
      }
    } catch (err) {
      setError("Erro de conexão: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  const isTecnico = user.nivel_acesso === "tecnico";

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()}
          className="p-2 rounded-xl hover:bg-slate-800 transition-colors text-slate-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Registrar Manutenção</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {isTecnico
              ? "Documente o serviço realizado nos seus chamados"
              : "Documente o serviço realizado em um chamado"}
          </p>
        </div>
      </div>

      {/* Alertas */}
      {error && (
        <div className="px-4 py-3 rounded-xl text-sm text-red-400"
          style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
          {error}
        </div>
      )}
      {success && (
        <div className="px-4 py-3 rounded-xl text-sm text-emerald-400"
          style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
          ✓ Manutenção registrada com sucesso! Redirecionando...
        </div>
      )}

      {/* Formulário */}
      <div className="rounded-2xl p-6 space-y-5"
        style={{ background: "rgba(13,21,38,0.8)", border: "1px solid rgba(99,130,200,0.15)" }}>
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Chamado */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">
              {isTecnico ? "Meu Chamado em Atendimento *" : "Chamado em Atendimento *"}
            </label>
            <select
              name="chamado_id"
              value={formData.chamado_id}
              onChange={handleChamadoChange}
              required
              disabled={loadingChamados}
              className="w-full px-4 py-2.5 rounded-xl text-sm text-slate-200 focus:outline-none"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(99,130,200,0.2)" }}>
              <option value="">
                {loadingChamados
                  ? "Carregando chamados..."
                  : chamados.length === 0
                    ? isTecnico
                      ? "Nenhum dos seus chamados está em atendimento"
                      : "Nenhum chamado em atendimento"
                    : "Selecione um chamado"}
              </option>
              {chamados.map(c => (
                <option key={c.id} value={c.id} style={{ background: "#0d1526" }}>
                  #{c.id} — {c.titulo} {c.equipamento_nome ? `(${c.equipamento_nome})` : ""}
                </option>
              ))}
            </select>
            {chamados.length === 0 && !loadingChamados && (
              <p className="text-xs text-slate-600">
                {isTecnico
                  ? "Você precisa aceitar um chamado antes de registrar manutenção."
                  : "Não há chamados em atendimento no momento."}{" "}
                <Link href="/chamados" className="text-blue-400 hover:underline">Ver chamados →</Link>
              </p>
            )}
          </div>

          {/* Info do chamado selecionado */}
          {chamadoSelecionado && (
            <div className="p-3 rounded-xl text-sm space-y-1"
              style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.15)" }}>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Chamado Selecionado</p>
              <p className="text-slate-300"><span className="text-slate-500">Título:</span> {chamadoSelecionado.titulo}</p>
              {chamadoSelecionado.equipamento_nome && (
                <p className="text-slate-300"><span className="text-slate-500">Equipamento:</span> {chamadoSelecionado.equipamento_nome}</p>
              )}
              {chamadoSelecionado.cliente_nome && (
                <p className="text-slate-300"><span className="text-slate-500">Cliente:</span> {chamadoSelecionado.cliente_nome}</p>
              )}
            </div>
          )}

          {/* Equipamento ID (auto-preenchido, oculto visualmente mas mantido no form) */}
          <input
            type="hidden"
            name="equipamento_id"
            value={formData.equipamento_id}
          />

          {/* Descrição */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">
              Descrição da Manutenção <span className="text-red-400">*</span>
            </label>
            <textarea
              name="descricao"
              placeholder="Descreva detalhadamente os serviços realizados, peças substituídas, diagnóstico..."
              value={formData.descricao}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-2.5 rounded-xl text-sm text-slate-200 placeholder-slate-600 resize-none focus:outline-none"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(99,130,200,0.2)" }}
            />
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading || success || chamados.length === 0}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-all"
              style={{ background: "linear-gradient(135deg, #059669, #10b981)" }}>
              {loading ? "Registrando..." : "Registrar Manutenção"}
            </button>
            <button type="button" onClick={() => router.back()}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(99,130,200,0.1)" }}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
