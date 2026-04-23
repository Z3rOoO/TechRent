"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Container from "../../../components/ui/Container";
import Card, { CardHeader, CardTitle, CardContent } from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Alert from "../../../components/ui/Alert";
import Spinner from "../../../components/ui/Spinner";

export default function NovoEquipamentoPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    categoria: "",
    patrimonio: "",
    descricao: "",
    status: "operacional",
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

    // Verificar se é admin
    if (userData.nivel_acesso !== "admin") {
      router.push("/dashboard");
      return;
    }
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
      const response = await fetch("http://localhost:3001/equipamentos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.sucesso === false) {
        setError(data.mensagem || "Erro ao criar equipamento");
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/equipamentos");
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
          <h1 className="text-4xl font-bold text-slate-100">Novo Equipamento</h1>
          <p className="text-slate-400">Adicione um novo equipamento ao inventário</p>
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
              <span>✓</span> Equipamento criado com sucesso! Redirecionando...
            </p>
          </Alert>
        )}

        <Card className="border-slate-700/50 glass-dark">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nome */}
              <div className="space-y-2 animate-slide-in-from-bottom" style={{ animationDelay: "0.1s" }}>
                <label className="block text-sm font-medium text-slate-300">
                  Nome do Equipamento *
                </label>
                <Input
                  type="text"
                  name="nome"
                  placeholder="Ex: Computador Dell OptiPlex"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  className="bg-slate-800 border-slate-600 text-slate-100 placeholder-slate-500"
                />
              </div>

              {/* Categoria e Patrimônio */}
              <div className="grid grid-cols-2 gap-4 animate-slide-in-from-bottom" style={{ animationDelay: "0.15s" }}>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-300">Categoria</label>
                  <Input type="text" name="categoria" placeholder="Ex: Notebook" value={formData.categoria} onChange={handleChange}
                    className="bg-slate-800 border-slate-600 text-slate-100 placeholder-slate-500" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-300">Patrimônio</label>
                  <Input type="text" name="patrimonio" placeholder="Ex: PAT-001" value={formData.patrimonio} onChange={handleChange}
                    className="bg-slate-800 border-slate-600 text-slate-100 placeholder-slate-500 font-mono" />
                </div>
              </div>
              {/* Descrição */}
              <div className="space-y-2 animate-slide-in-from-bottom" style={{ animationDelay: "0.2s" }}>
                <label className="block text-sm font-medium text-slate-300">
                  Descrição
                </label>
                <textarea
                  name="descricao"
                  placeholder="Descrição detalhada do equipamento..."
                  value={formData.descricao}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              {/* Status */}
              <div className="space-y-2 animate-slide-in-from-bottom" style={{ animationDelay: "0.3s" }}>
                <label className="block text-sm font-medium text-slate-300">
                  Status Inicial *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded text-slate-100 focus:outline-none focus:border-blue-500"
                >
                  <option value="operacional">Operacional</option>
                  <option value="em_manutencao">Em Manutenção</option>
                  <option value="desativado">Desativado</option>
                </select>
              </div>

              {/* Botões */}
              <div className="flex gap-4 pt-4 animate-slide-in-from-bottom" style={{ animationDelay: "0.4s" }}>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? "Criando..." : "Criar Equipamento"}
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
