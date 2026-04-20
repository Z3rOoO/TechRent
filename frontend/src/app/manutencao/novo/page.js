"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Container from "../../../components/ui/Container";
import Card, { CardHeader, CardTitle, CardContent } from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Alert from "../../../components/ui/Alert";
import Spinner from "../../../components/ui/Spinner";

export default function NovaManutencaoPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [chamados, setChamados] = useState([]);
  const [loadingChamados, setLoadingChamados] = useState(true);

  const [formData, setFormData] = useState({
    chamado_id: "",
    equipamento_id: "",
    descricao: "",
  });

  useEffect(() => {
    const raw = localStorage.getItem("techrent_user");
    const token = localStorage.getItem("techrent_token");

    if (!raw || !token) {
      router.push("/login");
      return;
    }

    const userData = JSON.parse(raw);
    setUser(userData);

    // Verificar se é técnico ou admin
    if (userData.nivel_acesso !== "tecnico" && userData.nivel_acesso !== "admin") {
      router.push("/dashboard");
      return;
    }

    // Buscar chamados em atendimento
    fetch("http://localhost:3001/chamados", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        const chamadosList = data.dados || data || [];
        // Filtrar apenas chamados em atendimento
        setChamados(chamadosList.filter((c) => c.status === "em_atendimento"));
      })
      .catch((e) => console.error(e))
      .finally(() => setLoadingChamados(false));
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("techrent_token");

    try {
      const response = await fetch("http://localhost:3001/manutencao", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.sucesso === false) {
        setError(data.mensagem || "Erro ao registrar manutenção");
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/manutencao");
        }, 2000);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-screen">
          <Spinner />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="max-w-2xl mx-auto space-y-8 py-8 animate-fade-in">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-slate-100">Registrar Manutenção</h1>
          <p className="text-slate-400">Finalize um chamado registrando a manutenção realizada</p>
        </div>

        {error && (
          <Alert variant="destructive">
            <p className="flex items-center gap-2">
              <span>!</span> {error}
            </p>
          </Alert>
        )}

        {success && (
          <Alert variant="success">
            <p className="flex items-center gap-2">
              <span>✓</span> Manutenção registrada com sucesso! Redirecionando...
            </p>
          </Alert>
        )}

        <Card className="border-slate-700/50 glass-dark">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Chamado */}
              <div className="space-y-2 animate-slide-in-from-bottom" style={{ animationDelay: "0.1s" }}>
                <label className="block text-sm font-medium text-slate-300">
                  Chamado Resolvido *
                </label>
                <select
                  name="chamado_id"
                  value={formData.chamado_id}
                  onChange={handleChange}
                  required
                  disabled={loadingChamados}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                >
                  <option value="">
                    {loadingChamados ? "Carregando chamados..." : "Selecione um chamado"}
                  </option>
                  {chamados.map((c) => (
                    <option key={c.id} value={c.id}>
                      #{c.id} - {c.titulo}
                    </option>
                  ))}
                </select>
              </div>

              {/* Equipamento ID */}
              <div className="space-y-2 animate-slide-in-from-bottom" style={{ animationDelay: "0.2s" }}>
                <label className="block text-sm font-medium text-slate-300">
                  ID do Equipamento *
                </label>
                <Input
                  type="number"
                  name="equipamento_id"
                  placeholder="Ex: 1"
                  value={formData.equipamento_id}
                  onChange={handleChange}
                  required
                  className="bg-slate-800 border-slate-600 text-slate-100 placeholder-slate-500"
                />
              </div>

              {/* Descrição da Manutenção */}
              <div className="space-y-2 animate-slide-in-from-bottom" style={{ animationDelay: "0.3s" }}>
                <label className="block text-sm font-medium text-slate-300">
                  Descrição da Manutenção *
                </label>
                <textarea
                  name="descricao"
                  placeholder="Descreva os serviços realizados..."
                  value={formData.descricao}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              {/* Botões */}
              <div className="flex gap-4 pt-4 animate-slide-in-from-bottom" style={{ animationDelay: "0.4s" }}>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {loading ? "Registrando..." : "Registrar Manutenção"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
