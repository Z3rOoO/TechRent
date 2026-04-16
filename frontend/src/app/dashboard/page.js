"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Card, { CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import Container from "../../components/ui/Container";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";

export default function DashboardPage() {
  const [resumo, setResumo] = useState(null);
  const [user, setUser] = useState(null);
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem("techrent_user");
    if (raw) {
      setUser(JSON.parse(raw));
    }

    const token = localStorage.getItem("techrent_token");
    
    // Se não é admin, redireciona
    if (raw && !JSON.parse(raw).nivel_acesso?.includes("admin")) {
      setErro("Acesso restrito a administradores");
      setLoading(false);
      return;
    }

    fetch("http://localhost:3001/dashboard/admin", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.sucesso === false) {
          setErro(data.mensagem || "Erro ao buscar");
        } else {
          setResumo(data.dados || data);
        }
      })
      .catch((e) => setErro(e.message))
      .finally(() => setLoading(false));
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "aberto":
        return "from-blue-600/20 to-blue-600/10 border-blue-600";
      case "em_atendimento":
      case "em atendimento":
        return "from-yellow-600/20 to-yellow-600/10 border-yellow-600";
      case "resolvido":
        return "from-green-600/20 to-green-600/10 border-green-600";
      case "cancelado":
        return "from-red-600/20 to-red-600/10 border-red-600";
      case "disponivel":
        return "from-green-600/20 to-green-600/10 border-green-600";
      case "alugado":
        return "from-blue-600/20 to-blue-600/10 border-blue-600";
      case "manutencao":
      case "manutenção":
        return "from-purple-600/20 to-purple-600/10 border-purple-600";
      default:
        return "from-slate-600/20 to-slate-600/10 border-slate-600";
    }
  };

  const getStatusTextColor = (status) => {
    switch (status?.toLowerCase()) {
      case "aberto":
        return "text-blue-400";
      case "em_atendimento":
      case "em atendimento":
        return "text-yellow-400";
      case "resolvido":
        return "text-green-400";
      case "cancelado":
        return "text-red-400";
      case "disponivel":
        return "text-green-400";
      case "alugado":
        return "text-blue-400";
      case "manutencao":
      case "manutenção":
        return "text-purple-400";
      default:
        return "text-slate-400";
    }
  };

  if (!user?.nivel_acesso?.includes("admin")) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-slate-100">Acesso Negado</h1>
            <p className="text-slate-400">Apenas administradores podem acessar o dashboard.</p>
            <Button asChild>
              <Link href="/">Voltar ao Início</Link>
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="space-y-10 py-8 animate-fade-in">
        {/* Header */}
        <div className="space-y-2 animate-slide-in-from-bottom" style={{ animationDelay: "0.05s" }}>
          <h1 className="text-4xl font-bold text-slate-100">
            Dashboard Admin
          </h1>
          <p className="text-slate-400">Visão geral completa do sistema e métricas importantes</p>
        </div>

        {erro && (
          <Alert variant="destructive">
            <p className="flex items-center gap-2">
              <span>!</span> {erro}
            </p>
          </Alert>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Spinner className="h-12 w-12 mb-4" />
            <p className="text-slate-400">Carregando dados...</p>
          </div>
        ) : !resumo ? (
          <Alert>
            <p className="text-slate-300">Nenhum dado disponível</p>
          </Alert>
        ) : (
          <div className="space-y-10">
            {/* Chamados Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between animate-slide-in-from-bottom" style={{ animationDelay: "0.1s" }}>
                <div>
                  <h2 className="text-2xl font-bold text-slate-100 mb-1">Chamados</h2>
                  <p className="text-slate-400">Distribuição por status</p>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link href="/chamados">Ver Todos</Link>
                </Button>
              </div>
              {resumo.chamados && resumo.chamados.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {resumo.chamados.map((item, idx) => (
                    <Card
                      key={`chamado-${item.status}`}
                      className={`bg-linear-to-br ${getStatusColor(item.status)} border relative overflow-hidden group hover:scale-105 transition-transform duration-300 animate-slide-in-from-bottom`}
                      style={{ animationDelay: `${0.15 + idx * 0.05}s` }}
                    >
                      <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <CardContent className="pt-6 relative z-10">
                        <div className="space-y-3">
                          <p className={`font-semibold uppercase text-sm tracking-wide ${getStatusTextColor(item.status)}`}>
                            {(item.status || "").replace("_", " ")}
                          </p>
                          <div className="flex items-end justify-between">
                            <div>
                              <p className="text-4xl font-bold text-slate-100">
                                {item.total_itens || item.count || 0}
                              </p>
                              <p className="text-xs text-slate-400 mt-1">chamados</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Alert>
                  <p className="text-slate-300">Sem dados de chamados</p>
                </Alert>
              )}
            </div>

            {/* Equipamentos Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between animate-slide-in-from-bottom" style={{ animationDelay: "0.2s" }}>
                <div>
                  <h2 className="text-2xl font-bold text-slate-100 mb-1">Equipamentos</h2>
                  <p className="text-slate-400">Inventário e potencial de receita</p>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link href="/equipamentos">Ver Todos</Link>
                </Button>
              </div>
              {resumo.equipamentos && resumo.equipamentos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {resumo.equipamentos.map((item, idx) => (
                    <Card
                      key={`equip-${item.status}`}
                      className={`bg-linear-to-br ${getStatusColor(item.status)} border relative overflow-hidden group hover:scale-105 transition-transform duration-300 animate-slide-in-from-bottom`}
                      style={{ animationDelay: `${0.25 + idx * 0.05}s` }}
                    >
                      <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <CardContent className="pt-6 relative z-10">
                        <div className="space-y-4">
                          <p className={`font-semibold uppercase text-sm tracking-wide ${getStatusTextColor(item.status)}`}>
                            {item.status}
                          </p>
                          <div className="space-y-3">
                            <div className="flex items-end justify-between">
                              <div>
                                <p className="text-3xl font-bold text-slate-100">
                                  {item.total_itens || item.count || 0}
                                </p>
                                <p className="text-xs text-slate-400 mt-1">equipamentos</p>
                              </div>
                            </div>
                            <div className="border-t border-slate-600 pt-3">
                              <p className="text-xs text-slate-500 mb-1">Receita Potencial/dia</p>
                              <p className="text-xl font-bold text-green-400">
                                R$ {(item.potencial_receita_diaria || 0).toLocaleString("pt-BR")}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Alert>
                  <p className="text-slate-300">Sem dados de equipamentos</p>
                </Alert>
              )}
            </div>

            {/* Ações Rápidas */}
            <div className="space-y-4 animate-slide-in-from-bottom" style={{ animationDelay: "0.35s" }}>
              <h2 className="text-2xl font-bold text-slate-100">Ações Rápidas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button asChild size="lg" className="h-auto py-6 flex flex-col items-center justify-center">
                  <Link href="/chamados">
                    <div className="text-2xl mb-2">📋</div>
                    <div>Gerenciar Chamados</div>
                  </Link>
                </Button>
                <Button asChild size="lg" className="h-auto py-6 flex flex-col items-center justify-center" variant="outline">
                  <Link href="/equipamentos">
                    <div className="text-2xl mb-2">🖥️</div>
                    <div>Gerenciar Equipamentos</div>
                  </Link>
                </Button>
                <Button asChild size="lg" className="h-auto py-6 flex flex-col items-center justify-center" variant="outline">
                  <Link href="/manutencao">
                    <div className="text-2xl mb-2">🔧</div>
                    <div>Manutenções</div>
                  </Link>
                </Button>
                <Button asChild size="lg" className="h-auto py-6 flex flex-col items-center justify-center" variant="outline">
                  <Link href="/settings">
                    <div className="text-2xl mb-2">⚙️</div>
                    <div>Configurações</div>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}
