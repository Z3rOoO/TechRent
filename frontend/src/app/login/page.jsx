"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await res.json();

      if (data.sucesso) {
        // Persistência robusta
        localStorage.setItem("techrent_token", data.token);
        localStorage.setItem("techrent_user", JSON.stringify(data.dados));

        // Redirecionamento por tipo de usuário
        const nivel = data.dados.nivel_acesso;
        if (nivel === "admin") router.push("/dashboard");
        else router.push("/chamados");
        
        // Pequeno delay para garantir que o router inicie a transição antes do reload
        setTimeout(() => {
          window.location.reload();
        }, 100);
      } else {
        setError(data.mensagem || "Erro ao realizar login");
      }
    } catch (err) {
      setError("Não foi possível conectar ao servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md animate-scale-in">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-xl shadow-blue-600/20 group-hover:scale-110 transition-transform">T</div>
            <span className="text-2xl font-bold text-white tracking-tight">TechRent</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Bem-vindo de volta</h1>
          <p className="text-slate-400 mt-2">Entre com suas credenciais para acessar o painel</p>
        </div>

        <div className="card p-8 bg-slate-900/50 border-slate-800">
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center animate-fade-in">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
              <input
                type="email"
                required
                className="input-base w-full bg-slate-950 border-slate-800"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-slate-300">Senha</label>
                <a href="#" className="text-xs text-blue-400 hover:text-blue-300">Esqueceu a senha?</a>
              </div>
              <input
                type="password"
                required
                className="input-base w-full bg-slate-950 border-slate-800"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Entrar na conta"
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <p className="text-sm text-slate-400">
              Acesso restrito. Problemas no acesso? <br/>
              <span className="text-slate-500">Contate o suporte técnico</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
