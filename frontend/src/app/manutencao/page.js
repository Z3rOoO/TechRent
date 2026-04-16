"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Card, { CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import Container from "../../components/ui/Container";
import Alert from "../../components/ui/Alert";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";

export default function ManutencaoPage() {
  const [registros, setRegistros] = useState(null);
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("techrent_user");
    if (raw) {
      setUser(JSON.parse(raw));
    }

    const token = localStorage.getItem("techrent_token");
    fetch("http://localhost:3001/manutencao", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.sucesso === false) {
          setErro(data.mensagem || "Erro ao buscar");
        } else {
          setRegistros(data.dados || data);
        }
      })
      .catch((e) => setErro(e.message))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    try {
      return new Date(dateString).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Container>
      <div className="space-y-8 py-8 animate-fade-in">
        {/* Header com CTA */}
        <div className="flex items-start justify-between gap-4 animate-slide-in-from-bottom" style={{ animationDelay: "0.05s" }}>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-slate-100">
              Histórico de Manutenção
            </h1>
            <p className="text-slate-400">Registro detalhado de todos os reparos realizados</p>
          </div>
          {user?.nivel_acesso === "tecnico" && (
            <Button asChild className="mt-2">
              <Link href="/manutencao/novo">
                + Registrar Manutenção
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

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Spinner className="h-12 w-12 mb-4" />
            <p className="text-slate-400">Carregando registros...</p>
          </div>
        ) : !registros || registros.length === 0 ? (
          <Alert>
            <p className="flex items-center gap-2">
              <span>-</span> Nenhum registro de manutenção encontrado
            </p>
          </Alert>
        ) : (
          <div className="space-y-4">
            {registros.map((r, index) => {
              const dataManutencao = formatDate(r.data_manutencao || r.data);
              return (
                <Link
                  key={r.id}
                  href={`/manutencao/${r.id}`}
                >
                  <Card
                    className="hover:shadow-lg hover:border-blue-600/50 hover:bg-slate-800/60 group cursor-pointer transition-all duration-200 border-slate-700 animate-slide-in-from-bottom"
                    style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                  >
                    <CardHeader className="pb-4 flex flex-row items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg group-hover:text-blue-400 transition-colors">
                          Reparo #{r.id}
                        </CardTitle>
                        <p className="text-xs text-slate-500 mt-1">
                          {dataManutencao !== "—" && `Realizado em ${dataManutencao}`}
                        </p>
                      </div>
                      <Badge variant="success" className="ml-4 shrink-0">
                        ✓ Concluído
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Descrição */}
                      {r.descricao && (
                        <div className="bg-slate-700/20 rounded-lg p-3 border border-slate-700">
                          <p className="text-slate-200 text-sm">{r.descricao}</p>
                        </div>
                      )}

                      {/* Info Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {r.equipamento && (
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide">Equipamento</p>
                            <p className="font-medium text-slate-200 text-sm">{r.equipamento}</p>
                          </div>
                        )}
                        {dataManutencao !== "—" && (
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide">Data</p>
                            <p className="font-medium text-slate-200 text-sm">{dataManutencao}</p>
                          </div>
                        )}
                        {r.tecnico && (
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide">Técnico</p>
                            <p className="font-medium text-slate-200 text-sm">{r.tecnico}</p>
                          </div>
                        )}
                        {r.custo && (
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide">Custo</p>
                            <p className="font-medium text-green-400 text-sm">R$ {(parseFloat(r.custo) || 0).toFixed(2)}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </Container>
  );
}
