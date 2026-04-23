"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line
} from "recharts";

const API = "http://localhost:3001";

const STATUS_CHAMADO_COLORS = { aberto: "#3b82f6", em_atendimento: "#f59e0b", resolvido: "#22c55e", cancelado: "#6b7280" };
const STATUS_EQUIP_COLORS = { operacional: "#22c55e", em_manutencao: "#f59e0b", desativado: "#6b7280" };
const PRIORIDADE_COLORS = { alta: "#ef4444", media: "#f59e0b", baixa: "#22c55e" };

function StatCard({ label, value, sub, color }) {
  return (
    <div className="rounded-2xl p-5 flex flex-col gap-1" style={{ background: "rgba(13,21,38,0.8)", border: "1px solid rgba(99,130,200,0.15)" }}>
      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: color || "#3b82f6" }}>{label}</p>
      <p className="text-3xl font-bold text-slate-100">{value}</p>
      {sub && <p className="text-xs text-slate-500">{sub}</p>}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    aberto: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    em_atendimento: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    resolvido: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    cancelado: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${map[status] || map.cancelado}`}>
      {status?.replace("_", " ")}
    </span>
  );
}

function PrioridadeBadge({ prioridade }) {
  const map = { alta: "text-red-400", media: "text-amber-400", baixa: "text-emerald-400" };
  return <span className={`text-xs font-bold uppercase ${map[prioridade] || ""}`}>{prioridade}</span>;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="px-3 py-2 rounded-lg text-sm" style={{ background: "#0d1526", border: "1px solid rgba(99,130,200,0.2)", color: "#e2e8f0" }}>
        {label && <p className="font-bold mb-1">{label}</p>}
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color || p.fill }}>{p.name || p.dataKey}: <strong>{p.value}</strong></p>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const raw = localStorage.getItem("techrent_user");
    if (!raw) { router.push("/login"); return; }
    const user = JSON.parse(raw);
    if (user.nivel_acesso !== "admin") {
      if (user.nivel_acesso === "tecnico") router.push("/chamados-tecnico");
      else router.push("/chamados");
      return;
    }
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("techrent_token");
      const res = await fetch(`${API}/dashboard/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.sucesso) setDados(data.dados);
      else setError(data.mensagem);
    } catch (e) {
      setError("Erro ao carregar dashboard: " + e.message);
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

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-400 mb-4">{error}</p>
        <button onClick={fetchDashboard} className="px-4 py-2 bg-blue-600 rounded-xl text-white text-sm">Tentar novamente</button>
      </div>
    );
  }

  if (!dados) return null;

  const { chamados, equipamentos, usuarios, manutencoes } = dados;

  const chamadosStatusData = (chamados.por_status || []).map(r => ({
    name: (r.status || "desconhecido").replace("_", " "),
    value: Number(r.total || 0),
    fill: STATUS_CHAMADO_COLORS[r.status] || "#6b7280"
  }));

  const chamadosPrioridadeData = (chamados.por_prioridade || []).map(r => ({
    name: r.prioridade || "desconhecida",
    total: Number(r.total || 0),
    fill: PRIORIDADE_COLORS[r.prioridade] || "#6b7280"
  }));

  const equipStatusData = (equipamentos.por_status || []).map(r => ({
    name: (r.status || "desconhecido").replace("_", " "),
    value: Number(r.total || 0),
    fill: STATUS_EQUIP_COLORS[r.status] || "#6b7280"
  }));

  const tecnicoData = (chamados.por_tecnico || []).map(r => ({
    name: (r.tecnico || "desconhecido").split(" ")[0],
    chamados: Number(r.total || 0)
  }));

  const mesesData = (manutencoes.por_mes || []).map(r => ({
    mes: r.mes || "desconhecido",
    total: Number(r.total || 0)
  }));

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard Administrativo</h1>
          <p className="text-slate-400 text-sm mt-1">Visão geral do sistema em tempo real</p>
        </div>
        <button onClick={fetchDashboard}
          className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white transition-colors"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(99,130,200,0.15)" }}>
          ↻ Atualizar
        </button>
      </div>

      {/* KPI Cards - Chamados */}
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Chamados</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total" value={chamados.total} sub="todos os chamados" color="#3b82f6" />
          <StatCard label="Abertos" value={chamados.abertos} sub="aguardando técnico" color="#60a5fa" />
          <StatCard label="Em Atendimento" value={chamados.em_atendimento} sub="sendo resolvidos" color="#f59e0b" />
          <StatCard label="Resolvidos" value={chamados.resolvidos} sub="concluídos" color="#22c55e" />
        </div>
      </div>

      {/* KPI Cards - Equipamentos e Usuários */}
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Infraestrutura</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Equipamentos" value={equipamentos.total} sub="no inventário" color="#a78bfa" />
          <StatCard label="Operacionais" value={equipamentos.operacionais} sub="funcionando" color="#34d399" />
          <StatCard label="Em Manutenção" value={equipamentos.em_manutencao} sub="com chamado ativo" color="#fbbf24" />
          <StatCard label="Usuários" value={usuarios.total} sub={`${usuarios.tecnicos} técnicos`} color="#60a5fa" />
        </div>
      </div>

      {/* Gráficos - Linha 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl p-6" style={{ background: "rgba(13,21,38,0.8)", border: "1px solid rgba(99,130,200,0.15)" }}>
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4">Chamados por Status</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={chamadosStatusData} cx="50%" cy="50%" outerRadius={75} dataKey="value"
                label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                {chamadosStatusData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl p-6" style={{ background: "rgba(13,21,38,0.8)", border: "1px solid rgba(99,130,200,0.15)" }}>
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4">Equipamentos por Status</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={equipStatusData} cx="50%" cy="50%" outerRadius={75} dataKey="value"
                label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                {equipStatusData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráficos - Linha 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl p-6" style={{ background: "rgba(13,21,38,0.8)", border: "1px solid rgba(99,130,200,0.15)" }}>
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4">Chamados por Prioridade</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chamadosPrioridadeData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,130,200,0.1)" />
              <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                {chamadosPrioridadeData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl p-6" style={{ background: "rgba(13,21,38,0.8)", border: "1px solid rgba(99,130,200,0.15)" }}>
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4">Chamados em Atendimento por Técnico</h2>
          {tecnicoData.length === 0 ? (
            <div className="flex items-center justify-center h-[200px]">
              <p className="text-slate-500 text-sm">Nenhum chamado em atendimento</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={tecnicoData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,130,200,0.1)" />
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="chamados" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Gráfico de linha: Manutenções por mês */}
      {mesesData.length > 0 && (
        <div className="rounded-2xl p-6" style={{ background: "rgba(13,21,38,0.8)", border: "1px solid rgba(99,130,200,0.15)" }}>
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4">Registros de Manutenção (Últimos 6 Meses)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={mesesData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,130,200,0.1)" />
              <XAxis dataKey="mes" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Últimos Chamados */}
      <div className="rounded-2xl p-6" style={{ background: "rgba(13,21,38,0.8)", border: "1px solid rgba(99,130,200,0.15)" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest">Últimos Chamados</h2>
          <Link href="/chamados" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">Ver todos →</Link>
        </div>
        <div className="space-y-2">
          {(chamados.ultimos || []).map(c => (
            <Link key={c.id} href={`/chamados/${c.id}`}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/50 transition-colors group"
              style={{ border: "1px solid rgba(99,130,200,0.08)" }}>
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs font-mono text-slate-600 shrink-0">#{c.id}</span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate group-hover:text-white">{c.titulo}</p>
                  <p className="text-xs text-slate-500">{c.cliente_nome} · {c.equipamento_nome}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-4">
                <PrioridadeBadge prioridade={c.prioridade} />
                <StatusBadge status={c.status} />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Links rápidos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Gerenciar Chamados", href: "/chamados", color: "#3b82f6" },
          { label: "Equipamentos", href: "/equipamentos", color: "#a78bfa" },
          { label: "Manutenções", href: "/manutencao", color: "#34d399" },
          { label: "Usuários", href: "/admin/users", color: "#f59e0b" },
        ].map(item => (
          <Link key={item.href} href={item.href}
            className="p-4 rounded-xl text-center text-sm font-semibold transition-all hover:-translate-y-0.5"
            style={{ background: `${item.color}15`, border: `1px solid ${item.color}30`, color: item.color }}>
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
