"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("techrent_user");
    const token = localStorage.getItem("techrent_token");
    if (!raw || !token) { router.push("/login"); return; }
    try { setUser(JSON.parse(raw)); } catch {}
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("techrent_token");
    localStorage.removeItem("techrent_user");
    router.push("/login");
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) { setErro("As senhas não coincidem"); return; }
    if (newPassword.length < 6) { setErro("A nova senha deve ter pelo menos 6 caracteres"); return; }
    setSaving(true);
    setErro(null);
    const token = localStorage.getItem("techrent_token");
    try {
      const res = await fetch(`http://localhost:3001/usuarios/${user.id}/senha`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ senha_atual: currentPassword, nova_senha: newPassword }),
      });
      if (res.ok) {
        setSuccess("Senha alterada com sucesso!");
        setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        const data = await res.json();
        setErro(data.mensagem || "Erro ao alterar senha");
      }
    } catch { setErro("Erro de conexão"); }
    finally { setSaving(false); }
  };

  const backHref = user?.nivel_acesso === "admin" ? "/dashboard" : "/chamados";

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <svg className="w-8 h-8 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      </svg>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center gap-2 text-sm text-slate-600 animate-fade-in">
        <Link href={backHref} className="hover:text-slate-400 transition-colors">Início</Link>
        <span>/</span>
        <span className="text-slate-400">Configurações</span>
      </div>

      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-slate-100">Configurações</h1>
        <p className="text-sm text-slate-500 mt-1">Gerencie suas preferências e segurança da conta</p>
      </div>

      {success && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-green-400 animate-slide-in-from-bottom"
          style={{background:"rgba(34,197,94,0.08)",border:"1px solid rgba(34,197,94,0.2)"}}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
          </svg>
          {success}
        </div>
      )}

      {/* Conta */}
      <div className="rounded-2xl overflow-hidden animate-slide-in-from-bottom" style={{animationDelay:"0.05s",
        background:"rgba(13,21,38,0.7)",border:"1px solid rgba(99,130,200,0.12)"}}>
        <div className="px-6 py-4 border-b" style={{borderColor:"rgba(99,130,200,0.1)"}}>
          <h2 className="font-semibold text-slate-200">Informações da Conta</h2>
        </div>
        <div className="p-6 space-y-4">
          {[
            {label:"Nome",value:user?.nome||"—"},
            {label:"Email",value:user?.email||"—"},
            {label:"Função",value:user?.nivel_acesso||"—"},
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-3 border-b last:border-0"
              style={{borderColor:"rgba(99,130,200,0.07)"}}>
              <span className="text-sm text-slate-500">{item.label}</span>
              <span className="text-sm font-medium text-slate-300 capitalize">{item.value}</span>
            </div>
          ))}
          <div className="pt-2">
            <Link href="/profile"
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
              Editar informações do perfil →
            </Link>
          </div>
        </div>
      </div>

      {/* Alterar senha */}
      <div className="rounded-2xl overflow-hidden animate-slide-in-from-bottom" style={{animationDelay:"0.1s",
        background:"rgba(13,21,38,0.7)",border:"1px solid rgba(99,130,200,0.12)"}}>
        <div className="px-6 py-4 border-b" style={{borderColor:"rgba(99,130,200,0.1)"}}>
          <h2 className="font-semibold text-slate-200">Alterar Senha</h2>
        </div>
        <form onSubmit={handleChangePassword} className="p-6 space-y-4">
          {[
            {label:"Senha atual",value:currentPassword,setter:setCurrentPassword},
            {label:"Nova senha",value:newPassword,setter:setNewPassword},
            {label:"Confirmar nova senha",value:confirmPassword,setter:setConfirmPassword},
          ].map((f) => (
            <div key={f.label} className="space-y-1.5">
              <label className="text-sm font-medium text-slate-400">{f.label}</label>
              <input type="password" value={f.value} onChange={(e) => f.setter(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm text-slate-200"
                style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(99,130,200,0.15)",outline:"none"}}
                onFocus={(e) => e.target.style.borderColor="rgba(59,130,246,0.5)"}
                onBlur={(e) => e.target.style.borderColor="rgba(99,130,200,0.15)"} />
            </div>
          ))}
          {erro && (
            <div className="text-sm text-red-400 px-4 py-3 rounded-xl"
              style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.2)"}}>
              {erro}
            </div>
          )}
          <button type="submit" disabled={saving}
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
            style={{background:"linear-gradient(135deg, #2563eb, #3b82f6)"}}>
            {saving ? "Salvando..." : "Alterar Senha"}
          </button>
        </form>
      </div>

      {/* Zona de perigo */}
      <div className="rounded-2xl overflow-hidden animate-slide-in-from-bottom" style={{animationDelay:"0.15s",
        background:"rgba(13,21,38,0.7)",border:"1px solid rgba(239,68,68,0.15)"}}>
        <div className="px-6 py-4 border-b" style={{borderColor:"rgba(239,68,68,0.1)"}}>
          <h2 className="font-semibold text-red-400">Zona de Perigo</h2>
        </div>
        <div className="p-6">
          <p className="text-sm text-slate-500 mb-4">Ao sair, você precisará fazer login novamente para acessar o sistema.</p>
          <button onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-400 transition-all duration-200 hover:-translate-y-0.5"
            style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.2)"}}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            Sair da Conta
          </button>
        </div>
      </div>
    </div>
  );
}
