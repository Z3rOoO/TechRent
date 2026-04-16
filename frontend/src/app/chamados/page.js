"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Card, { CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import Container from "../../components/ui/Container";
import Alert from "../../components/ui/Alert";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";

export default function ChamadosPage() {
  const [chamados, setChamados] = useState(null);
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("todos");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("techrent_user");
    const token = localStorage.getItem("techrent_token");
    if (raw) {
      setUser(JSON.parse(raw));
    }

    fetch("http://localhost:3001/chamados", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.sucesso === false) {
          setErro(data.mensagem || "Erro ao buscar");
        } else {
          setChamados(data.dados || data);
        }
      })
      .catch((e) => setErro(e.message))
      .finally(() => setLoading(false));
  }, []);

  const getStatusVariant = (status) => {
    switch (status) {
      case "aberto":
        return "default";
      case "em_atendimento":
        return "warning";
      case "resolvido":
        return "success";
      case "cancelado":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "aberto":
        return "●";
      case "em_atendimento":
        return "◐";
      case "resolvido":
        return "◉";
      case "cancelado":
        return "◎";
      default:
        return "○";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "alta":
        return "text-red-400";
      case "média":
        return "text-yellow-400";
      case "baixa":
        return "text-green-400";
      default:
        return "text-slate-400";
    }
  };

  const filteredChamados = !chamados
    ? []
    : filter === "todos"
    ? chamados
    : chamados.filter((c) => c.status === filter);

  const statuses = ["aberto", "em_atendimento", "resolvido", "cancelado"];

  return (
    <Container>
      <div className="space-y-8 py-8 animate-fade-in">
        {/* Header com CTA */}
        <div className="flex items-start justify-between gap-4 animate-slide-in-from-bottom" style={{ animationDelay: "0.05s" }}>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-slate-100">
              Chamados
            </h1>
            <p className="text-slate-400">Acompanhe e gerencie solicitações de suporte</p>
          </div>
          {user?.nivel_acesso === "cliente" && (
            <Button asChild className="mt-2">
              <Link href="/chamados/novo">
                + Novo Chamado
              </Link>
            </Button>
          )}
        </div>

        {erro && (
          <Alert variant="destructive">
            <p className="flex items-center gap-2">
              <span>!</span> {erro}
            </p>
          </Alert>
        )}

        {/* Filtros */}
        {!loading && chamados && chamados.length > 0 && (
          <div className="flex flex-wrap gap-2 animate-slide-in-from-bottom" style={{ animationDelay: "0.1s" }}>
            <button
              onClick={() => setFilter("todos")}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                filter === "todos"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600"
              }`}
            >
              Todos ({chamados.length})
            </button>
            {statuses.map((status) => {
              const count = chamados.filter((c) => c.status === status).length;
              if (count === 0) return null;
              return (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 capitalize ${
                    filter === status
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600"
                  }`}
                >
                  {(status || "").replace("_", " ")} ({count})
                </button>
              );
            })}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Spinner className="h-12 w-12 mb-4" />
            <p className="text-slate-400">Carregando chamados...</p>
          </div>
        ) : !chamados || chamados.length === 0 ? (
          <Alert>
            <p className="flex items-center gap-2">
              <span>-</span> Nenhum chamado encontrado
            </p>
          </Alert>
        ) : filteredChamados.length === 0 ? (
          <Alert>
            <p className="flex items-center gap-2">
              <span>*</span> Nenhum chamado encontrado com o filtro selecionado
            </p>
          </Alert>
        ) : (
          <div className="space-y-4">
            {filteredChamados.map((c, index) => (
              <Link
                key={c.id}
                href={`/chamados/${c.id}`}
              >
                <Card
                  className="hover:shadow-lg hover:border-blue-600/50 hover:bg-slate-800/60 group cursor-pointer transition-all duration-200 border-slate-700 animate-slide-in-from-bottom"
                  style={{ animationDelay: `${0.15 + index * 0.05}s` }}
                >
                  <CardHeader className="pb-4 flex flex-row items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg group-hover:text-blue-400 transition-colors">
                        #{c.id} - {c.titulo}
                      </CardTitle>
                      <p className="text-xs text-slate-500 mt-1">
                        Criado em {new Date(c.data_criacao || c.criado_em || Date.now()).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <Badge variant={getStatusVariant(c.status)} className="ml-4 shrink-0">
                      {getStatusIcon(c.status)} {(c.status || "").replace("_", " ").toUpperCase()}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Descrição */}
                    {c.descricao && (
                      <div className="bg-slate-700/20 rounded-lg p-3 border border-slate-700">
                        <p className="text-slate-200 text-sm line-clamp-3">{c.descricao}</p>
                      </div>
                    )}

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {c.cliente && (
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wide">Cliente</p>
                          <p className="font-medium text-slate-200 text-sm">{c.cliente}</p>
                        </div>
                      )}
                      {c.equipamento && (
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wide">Equipamento</p>
                          <p className="font-medium text-slate-200 text-sm">{c.equipamento}</p>
                        </div>
                      )}
                      {c.prioridade && (
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wide">Prioridade</p>
                          <p className={`font-bold text-sm ${getPriorityColor(c.prioridade)}`}>
                            {(c.prioridade || "").toUpperCase()}
                          </p>
                        </div>
                      )}
                      {c.tecnico && (
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wide">Técnico</p>
                          <p className="font-medium text-slate-200 text-sm">{c.tecnico}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
