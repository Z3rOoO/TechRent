"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Container from "../../../components/ui/Container";
import Card, { CardHeader, CardTitle, CardContent } from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Alert from "../../../components/ui/Alert";
import Spinner from "../../../components/ui/Spinner";

export default function NovoChamadoPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [equipamentos, setEquipamentos] = useState([]);
  const [loadingEquipamentos, setLoadingEquipamentos] = useState(true);

  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    equipamento_id: "",
    prioridade: "media",
  });

  useEffect(() => {
    // Verificar autenticação
    const raw = localStorage.getItem("techrent_user");
    const token = localStorage.getItem("techrent_token");

    if (!raw || !token) {
      router.push("/login");
      return;
    }

    setUser(JSON.parse(raw));

    // Buscar equipamentos
    fetch("http://localhost:3001/equipamentos", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setEquipamentos(data.dados || data || []);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoadingEquipamentos(false));
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
      const response = await fetch("http://localhost:3001/chamados", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.sucesso === false) {
        setError(data.mensagem || "Erro ao criar chamado");
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/chamados");
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
          <h1 className="text-4xl font-bold text-slate-100">Criar Novo Chamado</h1>
          <p className="text-slate-400">Descreva seu problema para que nossa equipe possa ajudar</p>
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
              <span>✓</span> Chamado criado com sucesso! Redirecionando...
            </p>
          </Alert>
        )}

        <Card className="border-slate-700/50 glass-dark">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Título */}
              <div className="space-y-2 animate-slide-in-from-bottom" style={{ animationDelay: "0.1s" }}>
                <label className="block text-sm font-medium text-slate-300">
                  Título do Chamado
                </label>
                <Input
                  type="text"
                  name="titulo"
                  placeholder="Ex: Computador não liga"
                  value={formData.titulo}
                  onChange={handleChange}
                  required
                  className="bg-slate-800 border-slate-600 text-slate-100 placeholder-slate-500"
                />
              </div>

              {/* Equipamento */}
              <div className="space-y-2 animate-slide-in-from-bottom" style={{ animationDelay: "0.2s" }}>
                <label className="block text-sm font-medium text-slate-300">
                  Equipamento (opcional)
                </label>
                {loadingEquipamentos ? (
                  <div className="flex items-center justify-center py-8">
                    <Spinner size="sm" />
                  </div>
                ) : (
                  <select
                    name="equipamento_id"
                    value={formData.equipamento_id}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    <option value="">Selecione um equipamento</option>
                    {equipamentos.map((eq) => (
                      <option key={eq.id} value={eq.id}>
                        {eq.nome} - {eq.tipo}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Prioridade */}
              <div className="space-y-2 animate-slide-in-from-bottom" style={{ animationDelay: "0.3s" }}>
                <label className="block text-sm font-medium text-slate-300">
                  Prioridade
                </label>
                <select
                  name="prioridade"
                  value={formData.prioridade}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                </select>
              </div>

              {/* Descrição */}
              <div className="space-y-2 animate-slide-in-from-bottom" style={{ animationDelay: "0.4s" }}>
                <label className="block text-sm font-medium text-slate-300">
                  Descrição Detalhada
                </label>
                <textarea
                  name="descricao"
                  placeholder="Descreva seu problema em detalhes..."
                  value={formData.descricao}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4 animate-slide-in-from-bottom" style={{ animationDelay: "0.5s" }}>
                <Button
                  type="submit"
                  disabled={loading}
                  size="lg"
                  className="flex-1"
                >
                  {loading ? "Criando..." : "Criar Chamado"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => router.back()}
                  disabled={loading}
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
