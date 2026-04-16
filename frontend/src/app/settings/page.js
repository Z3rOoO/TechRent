"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Container from "../../components/ui/Container";
import Card, { CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("techrent_user");
    const token = localStorage.getItem("techrent_token");

    if (!raw || !token) {
      router.push("/login");
      return;
    }

    setUser(JSON.parse(raw));
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("techrent_token");
    localStorage.removeItem("techrent_user");
    router.push("/login");
  };

  const handleClearCache = () => {
    localStorage.clear();
    setAlertMessage("Cache limpo com sucesso!");
    setTimeout(() => setAlertMessage(null), 3000);
  };

  if (loading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-slate-400">Carregando...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="max-w-3xl mx-auto space-y-8 py-8 animate-fade-in">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-slate-100">Configurações</h1>
          <p className="text-slate-400">Gerenciar suas preferências e conta</p>
        </div>

        {alertMessage && (
          <Alert variant="success">
            <p className="flex items-center gap-2">
              <span>✓</span> {alertMessage}
            </p>
          </Alert>
        )}

        {/* Perfil */}
        <Card className="border-slate-700/50 glass-dark animate-slide-in-from-bottom" style={{ animationDelay: "0.1s" }}>
          <CardHeader>
            <CardTitle>Informações da Conta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-400">Nome</p>
                <p className="text-lg font-semibold text-slate-100">{user?.nome || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Email</p>
                <p className="text-lg font-semibold text-slate-100">{user?.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Função</p>
                <p className="text-lg font-semibold text-slate-100">
                  {user?.nivel_acesso?.charAt(0).toUpperCase() + user?.nivel_acesso?.slice(1) || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-400">ID</p>
                <p className="text-lg font-semibold text-slate-100">{user?.id || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferências */}
        <Card className="border-slate-700/50 glass-dark animate-slide-in-from-bottom" style={{ animationDelay: "0.2s" }}>
          <CardHeader>
            <CardTitle>Preferências</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-100">Notificações por Email</p>
                <p className="text-sm text-slate-400">Receber atualizações dos chamados</p>
              </div>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
                Configurar
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Segurança */}
        <Card className="border-slate-700/50 glass-dark animate-slide-in-from-bottom" style={{ animationDelay: "0.3s" }}>
          <CardHeader>
            <CardTitle>Segurança</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <button className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-md transition-colors">
                Alterar Senha
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Dados */}
        <Card className="border-slate-700/50 glass-dark animate-slide-in-from-bottom" style={{ animationDelay: "0.4s" }}>
          <CardHeader>
            <CardTitle>Dados e Privacidade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button
              onClick={handleClearCache}
              className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-md transition-colors text-sm"
            >
              Limpar Cache Local
            </button>
            <p className="text-xs text-slate-400 mt-2">
              Isso limpará dados armazenados localmente no seu navegador.
            </p>
          </CardContent>
        </Card>

        {/* Sair */}
        <Card className="border-red-700/30 bg-red-950/20 animate-slide-in-from-bottom" style={{ animationDelay: "0.5s" }}>
          <CardHeader>
            <CardTitle className="text-red-400">Sair da Conta</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-300 mb-4">
              Você será redirecionado para a página de login.
            </p>
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="w-full"
            >
              Sair
            </Button>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
