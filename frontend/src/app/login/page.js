"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Card, { CardHeader, CardTitle, CardContent, CardDescription } from "../../components/ui/Card";
import Alert from "../../components/ui/Alert";
import Spinner from "../../components/ui/Spinner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(null);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("techrent_token", data.token);
        localStorage.setItem("techrent_user", JSON.stringify(data.dados));
        router.push("/");
      } else {
        setErro(data.mensagem || "Erro no login");
      }
    } catch (e) {
      setErro(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-blue-600 to-purple-600 text-3xl">
            🔐
          </div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
            TechRent
          </h1>
          <p className="text-slate-400">Sistema de Gerenciamento de TI</p>
        </div>

        {/* Login Card */}
        <Card className="border-slate-600">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Bem-vindo de volta</CardTitle>
            <CardDescription>Entre com suas credenciais para continuar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-300">
                  Email
                </label>
                <Input
                  id="email"
                  placeholder="seu@email.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="senha" className="text-sm font-medium text-slate-300">
                  Senha
                </label>
                <Input
                  id="senha"
                  placeholder="••••••••"
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              {erro && (
                <Alert variant="destructive">
                  <p className="text-sm flex items-center gap-2">
                    <span>!</span> {erro}
                  </p>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner className="mr-2 w-4 h-4" /> Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-700">
              <p className="text-center text-sm text-slate-400">
                Não tem uma conta?{" "}
                <Link href="/signup" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                  Contate o administrador
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="bg-slate-800/30 border-slate-700 p-4">
          <p className="text-xs text-slate-400 text-center mb-3">🧪 Credenciais de Teste</p>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Cliente:</span>
              <span className="text-slate-300 font-mono">cliente@example.com</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Técnico:</span>
              <span className="text-slate-300 font-mono">tecnico@example.com</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Admin:</span>
              <span className="text-slate-300 font-mono">admin@example.com</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
