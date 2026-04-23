"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
        const role = data.dados?.nivel_acesso;
        if (role === "admin") router.push("/dashboard");
        else if (role === "tecnico") router.push("/chamados-tecnico");
        else router.push("/meus-chamados");
      } else {
        setErro(data.mensagem || "Email ou senha incorretos");
      }
    } catch {
      setErro("Nao foi possivel conectar ao servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div style={{
          position:"absolute",top:"20%",left:"50%",transform:"translateX(-50%)",
          width:"600px",height:"600px",
          background:"radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)",
          borderRadius:"50%"
        }} />
      </div>
      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <div className="text-center mb-8 space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl text-white font-bold text-xl"
            style={{background:"linear-gradient(135deg, #2563eb, #4f46e5)"}}>T</div>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">TechRent</h1>
            <p className="text-sm text-slate-500 mt-1">Sistema de Gerenciamento de TI</p>
          </div>
        </div>
        <div className="rounded-2xl p-8 space-y-6 animate-slide-in-from-bottom"
          style={{background:"rgba(13,21,38,0.8)",border:"1px solid rgba(99,130,200,0.15)",backdropFilter:"blur(20px)",boxShadow:"0 24px 64px rgba(0,0,0,0.4)"}}>
          <div>
            <h2 className="text-xl font-semibold text-slate-100">Bem-vindo de volta</h2>
            <p className="text-sm text-slate-500 mt-1">Entre com suas credenciais para continuar</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Email</label>
              <input type="email" placeholder="seu@email.com" value={email}
                onChange={(e) => setEmail(e.target.value)} disabled={loading} required
                className="w-full px-4 py-2.5 rounded-xl text-sm text-slate-200 placeholder-slate-600 transition-all duration-200"
                style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(99,130,200,0.15)",outline:"none"}}
                onFocus={(e) => e.target.style.borderColor="rgba(59,130,246,0.5)"}
                onBlur={(e) => e.target.style.borderColor="rgba(99,130,200,0.15)"} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Senha</label>
              <input type="password" placeholder="••••••••" value={senha}
                onChange={(e) => setSenha(e.target.value)} disabled={loading} required
                className="w-full px-4 py-2.5 rounded-xl text-sm text-slate-200 placeholder-slate-600 transition-all duration-200"
                style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(99,130,200,0.15)",outline:"none"}}
                onFocus={(e) => e.target.style.borderColor="rgba(59,130,246,0.5)"}
                onBlur={(e) => e.target.style.borderColor="rgba(99,130,200,0.15)"} />
            </div>
            {erro && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-red-400"
                style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.2)"}}>
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                {erro}
              </div>
            )}
            <button type="submit" disabled={loading}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 mt-2 disabled:opacity-50"
              style={{background:"linear-gradient(135deg, #2563eb, #3b82f6)"}}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Entrando...
                </span>
              ) : "Entrar"}
            </button>
          </form>
          <div className="pt-2 border-t text-center" style={{borderColor:"rgba(99,130,200,0.1)"}}>
            <p className="text-sm text-slate-500">Nao tem uma conta? <span className="text-blue-400">Contate o administrador</span></p>
          </div>
        </div>
        <div className="mt-4 rounded-xl p-4 animate-slide-in-from-bottom" style={{animationDelay:"0.1s",background:"rgba(13,21,38,0.5)",border:"1px solid rgba(99,130,200,0.1)"}}>
          <p className="text-xs text-slate-500 text-center mb-3 font-medium uppercase tracking-wide">Credenciais de Teste</p>
          <div className="grid grid-cols-3 gap-3 text-xs">
            {[
              {role:"Cliente",email:"cliente@example.com",color:"#93c5fd"},
              {role:"Tecnico",email:"tecnico@example.com",color:"#c4b5fd"},
              {role:"Admin",email:"admin@example.com",color:"#fbbf24"},
            ].map((c) => (
              <div key={c.role} className="text-center space-y-1">
                <p className="font-medium" style={{color:c.color}}>{c.role}</p>
                <p className="text-slate-500 font-mono text-xs break-all">{c.email}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
