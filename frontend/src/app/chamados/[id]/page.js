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
  const [success, setSuccess] = useState(null);
  const [user, setUser] = useState(null);
  const [updating, setUpdating] = useState(false);

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
          setChamado(data.dados?.[0] || data.dados);
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

  const handleAceitarChamado = async () => {
    setUpdating(true);
    setError(null);
    const token = localStorage.getItem("techrent_token");

    try {
      const response = await fetch(`http://localhost:3001/chamados/${chamadoId}/aceitar`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (data.sucesso) {
        setSuccess("Chamado aceito com sucesso!");
        setChamado({ ...chamado, status: "em_atendimento", tecnico_id: user.id });
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.mensagem || "Erro ao aceitar chamado");
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleAtualizarStatus = async (novoStatus) => {
    setUpdating(true);
    setError(null);
    const token = localStorage.getItem("techrent_token");

    try {
      const response = await fetch(`http://localhost:3001/chamados/${chamadoId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: novoStatus }),
      });

      const data = await response.json();

      if (data.sucesso) {
        setSuccess(`Chamado marcado como ${novoStatus}!`);
        setChamado({ ...chamado, status: novoStatus });
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.mensagem || "Erro ao atualizar chamado");
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setUpdating(false);
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

  if (error && !chamado) {
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

  const canAccept = user?.nivel_acesso === "tecnico" && chamado.status === "aberto";
  const canUpdateStatus = (user?.nivel_acesso === "tecnico" || user?.nivel_acesso === "admin") && 
                          chamado.status !== "resolvido" && 
                          chamado.status !== "cancelado";

  return (
    <Container>
      <div className="max-w-3xl mx-auto space-y-8 py-8 animate-fade-in">
        {/* Mensagens de feedback */}
        {error && (
          <Alert variant="destructive" className="animate-slide-in-from-bottom">
            <p>⚠ {error}</p>
          </Alert>
        )}

        {success && (
          <Alert variant="success" className="animate-slide-in-from-bottom">
            <p>✓ {success}</p>
          </Alert>
        )}

        {/* Header com Voltar */}
        <div className="flex items-center justify-between animate-slide-in-from-bottom">
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
                {chamado.equipamento_nome || `#${chamado.equipamento_id}`}
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-700/50 glass-dark animate-slide-in-from-bottom" style={{ animationDelay: "0.4s" }}>
            <CardHeader>
              <CardTitle className="text-sm">Técnico Responsável</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-200">
                {chamado.tecnico_nome || chamado.tecnico_id ? `#${chamado.tecnico_id}` : "Não atribuído"}
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

        {/* Ações para Técnico/Admin */}
        {(canAccept || canUpdateStatus) && (
          <Card className="border-blue-700/30 bg-blue-950/20 animate-slide-in-from-bottom" style={{ animationDelay: "0.6s" }}>
            <CardHeader>
              <CardTitle className="text-blue-400">Ações Disponíveis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {canAccept && (
                <Button
                  onClick={handleAceitarChamado}
                  disabled={updating}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  {updating ? "Aceitando..." : "✓ Aceitar Chamado"}
                </Button>
              )}

              {canUpdateStatus && chamado.status === "em_atendimento" && (
                <Button
                  onClick={() => handleAtualizarStatus("resolvido")}
                  disabled={updating}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
                >
                  {updating ? "Atualizando..." : "✓ Marcar como Resolvido"}
                </Button>
              )}

              {canUpdateStatus && chamado.status !== "resolvido" && (
                <Button
                  onClick={() => handleAtualizarStatus("cancelado")}
                  disabled={updating}
                  variant="destructive"
                  className="w-full"
                >
                  {updating ? "Cancelando..." : "✕ Cancelar Chamado"}
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </Container>
  );
}
