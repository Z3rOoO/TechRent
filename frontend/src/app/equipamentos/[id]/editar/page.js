"use client";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";

const API = "http://localhost:3001";

export default function EditarEquipamentoPage({ params }) {
  const { id } = use(params);
  const [form, setForm] = useState({ nome: "", categoria: "", patrimonio: "", descricao: "", status: "operacional" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const raw = localStorage.getItem("techrent_user");
    if (!raw) { router.push("/login"); return; }
    const user = JSON.parse(raw);
    if (user.nivel_acesso !== "admin") { router.push("/equipamentos"); return; }
    fetchEquipamento();
  }, [id]);

  const fetchEquipamento = async () => {
    try {
      const token = localStorage.getItem("techrent_token");
      const res = await fetch(`${API}/equipamentos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.sucesso) {
        const e = data.dados;
        setForm({
          nome: e.nome || "",
          categoria: e.categoria || "",
          patrimonio: e.patrimonio || "",
          descricao: e.descricao || "",
          status: e.status || "operacional",
        });
      } else {
        router.push("/equipamentos");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const token = localStorage.getItem("techrent_token");
      const res = await fetch(`${API}/equipamentos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.sucesso) {
        setMsg({ type: "success", text: "Equipamento atualizado com sucesso!" });
        setTimeout(() => router.push("/equipamentos"), 1500);
      } else {
        setMsg({ type: "error", text: data.mensagem });
      }
    } catch (err) {
      setMsg({ type: "error", text: "Erro ao atualizar equipamento" });
    } finally {
      setSaving(false);
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
    <div className="p-6 md:p-8 max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()}
          className="p-2 rounded-xl hover:bg-slate-800 transition-colors text-slate-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Editar Equipamento</h1>
          <p className="text-slate-500 text-xs mt-0.5">ID #{id}</p>
        </div>
      </div>

      {msg && (
        <div className={`px-4 py-3 rounded-xl text-sm ${msg.type === "success" ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border border-red-500/20 text-red-400"}`}>
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-2xl p-6 space-y-5" style={{ background: "rgba(13,21,38,0.8)", border: "1px solid rgba(99,130,200,0.15)" }}>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nome *</label>
          <input type="text" required value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(99,130,200,0.2)" }}
            placeholder="Ex: Notebook Dell Latitude 5420" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Categoria</label>
            <input type="text" value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(99,130,200,0.2)" }}
              placeholder="Ex: Notebook" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Patrimônio</label>
            <input type="text" value={form.patrimonio} onChange={e => setForm(f => ({ ...f, patrimonio: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(99,130,200,0.2)" }}
              placeholder="Ex: PAT-001" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Status</label>
          <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
            style={{ background: "rgba(13,21,38,0.9)", border: "1px solid rgba(99,130,200,0.2)" }}>
            <option value="operacional">Operacional</option>
            <option value="em_manutencao">Em Manutenção</option>
            <option value="desativado">Desativado</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Descrição</label>
          <textarea value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))}
            rows={3} placeholder="Descrição opcional do equipamento..."
            className="w-full px-4 py-3 rounded-xl text-sm text-slate-200 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(99,130,200,0.2)" }} />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => router.back()}
            className="flex-1 py-3 rounded-xl text-sm font-medium text-slate-300 hover:text-white transition-colors"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(99,130,200,0.15)" }}>
            Cancelar
          </button>
          <button type="submit" disabled={saving}
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #2563eb, #3b82f6)" }}>
            {saving ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </form>
    </div>
  );
}
