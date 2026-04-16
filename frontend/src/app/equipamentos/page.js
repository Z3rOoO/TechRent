"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Card, { CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import Container from "../../components/ui/Container";
import Alert from "../../components/ui/Alert";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";

export default function EquipamentosPage() {
  const [equipamentos, setEquipamentos] = useState(null);
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

    fetch("http://localhost:3001/equipamentos", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.sucesso === false) {
          setErro(data.mensagem || "Erro ao buscar");
        } else {
          setEquipamentos(data.dados || data);
        }
      })
      .catch((e) => setErro(e.message))
      .finally(() => setLoading(false));
  }, []);

  const getStatusVariant = (status) => {
    switch (status) {
      case "disponivel":
        return "success";
      case "manutencao":
        return "warning";
      case "alugado":
        return "destructive";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "disponivel":
        return "●";
      case "manutencao":
        return "◐";
      case "alugado":
        return "◉";
      default:
        return "○";
    }
  };

  const filteredEquipamentos = !equipamentos
    ? []
    : filter === "todos"
    ? equipamentos
    : equipamentos.filter((eq) => eq.status === filter);

  const statuses = ["disponivel", "manutencao", "alugado"];

  return (
    <Container>
      <div className="space-y-8 py-8 animate-fade-in">
        {/* Header com CTA */}
        <div className="flex items-start justify-between gap-4 animate-slide-in-from-bottom" style={{ animationDelay: "0.05s" }}>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-slate-100">
              Equipamentos
            </h1>
            <p className="text-slate-400">Gerencie e acompanhe todo o seu inventário de TI</p>
          </div>
          {user?.nivel_acesso === "admin" && (
            <Button asChild className="mt-2">
              <Link href="/equipamentos/novo">
                + Novo Equipamento
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
        {!loading && equipamentos && equipamentos.length > 0 && (
          <div className="flex flex-wrap gap-2 animate-slide-in-from-bottom" style={{ animationDelay: "0.1s" }}>
            <button
              onClick={() => setFilter("todos")}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                filter === "todos"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600"
              }`}
            >
              Todos ({equipamentos.length})
            </button>
            {statuses.map((status) => {
              const count = equipamentos.filter((eq) => eq.status === status).length;
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
                  {status} ({count})
                </button>
              );
            })}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Spinner className="h-12 w-12 mb-4" />
            <p className="text-slate-400">Carregando equipamentos...</p>
          </div>
        ) : !equipamentos || equipamentos.length === 0 ? (
          <Alert>
            <p className="flex items-center gap-2">
              <span>-</span> Nenhum equipamento encontrado
            </p>
          </Alert>
        ) : filteredEquipamentos.length === 0 ? (
          <Alert>
            <p className="flex items-center gap-2">
              <span>*</span> Nenhum equipamento encontrado com o filtro selecionado
            </p>
          </Alert>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEquipamentos.map((eq, index) => (
              <Link
                key={eq.id}
                href={`/equipamentos/${eq.id}`}
              >
                <Card
                  className="hover:scale-105 hover:shadow-2xl hover:border-blue-600/50 hover:bg-slate-800/60 group overflow-hidden cursor-pointer transition-all duration-300 animate-slide-in-from-bottom border-slate-700"
                  style={{ animationDelay: `${0.15 + index * 0.05}s` }}
                >
                  {/* Status Badge Top */}
                  <div className="absolute top-4 right-4 z-10">
                    <Badge variant={getStatusVariant(eq.status)} className="text-sm">
                      {getStatusIcon(eq.status)} {(eq.status || "").toUpperCase()}
                    </Badge>
                  </div>

                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl group-hover:text-blue-400 transition-colors">
                      {eq.nome}
                    </CardTitle>
                    <p className="text-xs text-slate-500 mt-1">ID: {eq.id}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Categoria */}
                    <div className="bg-slate-700/30 rounded-lg p-3">
                      <p className="text-xs text-slate-400 uppercase tracking-wide">Categoria</p>
                      <p className="font-medium text-slate-200">{eq.categoria || eq.tipo || "—"}</p>
                    </div>

                    {/* Preço */}
                    <div className="bg-slate-700/30 rounded-lg p-3">
                      <p className="text-xs text-slate-400 uppercase tracking-wide">Diária</p>
                      <p className="font-bold text-lg text-green-400">R$ {eq.preco_diaria || "—"}</p>
                    </div>

                    {/* Descrição */}
                    {eq.descricao && (
                      <div className="border-t border-slate-700 pt-3">
                        <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Descrição</p>
                        <p className="text-sm text-slate-300 line-clamp-2">{eq.descricao}</p>
                      </div>
                    )}
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
