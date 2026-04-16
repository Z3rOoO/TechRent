"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Container from "../../../components/ui/Container";
import Card, { CardHeader, CardTitle, CardContent } from "../../../components/ui/Card";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import Alert from "../../../components/ui/Alert";
import Spinner from "../../../components/ui/Spinner";

export default function ChamadoDetalhePage() {
  const router = useRouter();
  const params = useParams();
  const chamadoId = params.id;

  const [chamado, setChamado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("techrent_user");
    const token = localStorage.getItem("techrent_token");

    if (!raw || !token) {
      router.push("/login");
      return;
    }

    setUser(JSON.parse(raw));

    // Buscar chamado específico
    fetch(`http://localhost:3001/chamados/${chamadoId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.sucesso === false) {
          setError(data.mensagem || "Chamado não encontrado");
        } else {
          setChamado(data.dados || data);
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [chamadoId, router]);

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

  if (loading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-screen">
          <Spinner />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="space-y-6 py-8">
          <Button onClick={() => router.back()} variant="outline">
            ← Voltar
          </Button>
          <Alert variant="destructive">
            <p className="flex items-center gap-2">
              <span>!</span> {error}
            </p>
          </Alert>
        </div>
      </Container>
    );
  }

  if (!chamado) {
    return (
      <Container>
        <div className="text-center py-12">
          <p className="text-slate-400">Chamado não encontrado</p>
        </div>
      </Container>
    );
  }

  const dataFormatted = chamado.criado_em
    ? new Date(chamado.criado_em).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Data não disponível";

  return (
    <Container>
      <div className="max-w-3xl mx-auto space-y-8 py-8 animate-fade-in">
        {/* Header com Voltar */}
        <div className="flex items-center justify-between">
          <Button onClick={() => router.back()} variant="outline" size="sm">
            ← Voltar
          </Button>
          <div className="text-sm text-slate-400">
            Chamado #{chamado.id || "N/A"}
          </div>
        </div>

        {/* Título e Status */}
        <div className="space-y-4 animate-slide-in-from-bottom" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-slate-100">{chamado.titulo || "Sem título"}</h1>
              <p className="text-slate-400">Criado em {dataFormatted}</p>
            </div>
            <Badge variant={getStatusVariant(chamado.status)}>
              {getStatusIcon(chamado.status)} {chamado.status?.replace("_", " ").toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Informações Principais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-slate-700/50 glass-dark animate-slide-in-from-bottom" style={{ animationDelay: "0.2s" }}>
            <CardHeader>
              <CardTitle className="text-sm">Prioridade</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-lg font-semibold ${getPriorityColor(chamado.prioridade)}`}>
                {chamado.prioridade?.toUpperCase()}
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-700/50 glass-dark animate-slide-in-from-bottom" style={{ animationDelay: "0.3s" }}>
            <CardHeader>
              <CardTitle className="text-sm">Equipamento</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-200">
                {chamado.equipamento_nome || chamado.equipamento_id || "Não especificado"}
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-700/50 glass-dark animate-slide-in-from-bottom" style={{ animationDelay: "0.4s" }}>
            <CardHeader>
              <CardTitle className="text-sm">Técnico Responsável</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-200">
                {chamado.tecnico_nome || "Não atribuído"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Descrição */}
        <Card className="border-slate-700/50 glass-dark animate-slide-in-from-bottom" style={{ animationDelay: "0.5s" }}>
          <CardHeader>
            <CardTitle>Descrição do Problema</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
              {chamado.descricao || "Sem descrição"}
            </p>
          </CardContent>
        </Card>

        {/* Solução (se existir) */}
        {chamado.solucao && (
          <Card className="border-green-700/30 bg-green-950/20 animate-slide-in-from-bottom" style={{ animationDelay: "0.6s" }}>
            <CardHeader>
              <CardTitle className="text-green-400">Solução Aplicada</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                {chamado.solucao}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Ações */}
        {chamado.status === "aberto" && user?.nivel_acesso === "cliente" && (
          <div className="flex gap-4 pt-4 animate-slide-in-from-bottom" style={{ animationDelay: "0.7s" }}>
            <Button
              onClick={() => router.push(`/chamados/${chamadoId}/editar`)}
              className="flex-1"
            >
              Editar
            </Button>
            <Button variant="outline" className="flex-1">
              Cancelar Chamado
            </Button>
          </div>
        )}
      </div>
    </Container>
  );
}
