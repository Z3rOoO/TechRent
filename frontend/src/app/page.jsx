"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const raw = localStorage.getItem("techrent_user");
    if (raw) {
      try {
        const u = JSON.parse(raw);
        setUser(u);
        const role = u.nivel_acesso;
        if (role === "admin") router.push("/dashboard");
        else if (role === "tecnico") router.push("/chamados-tecnico");
        else if (role === "cliente") router.push("/meus-chamados");
      } catch {}
    }
    setChecked(true);
  }, [router]);

  if (!checked || user) return null;

  return (
    <div className="overflow-hidden">
      <section className="relative min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-24">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div style={{position:"absolute",top:"30%",left:"50%",transform:"translate(-50%,-50%)",width:"800px",height:"800px",background:"radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 65%)",borderRadius:"50%"}} />
          <div style={{position:"absolute",bottom:"10%",right:"10%",width:"400px",height:"400px",background:"radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 65%)",borderRadius:"50%"}} />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium text-blue-400 mb-4"
            style={{background:"rgba(59,130,246,0.08)",border:"1px solid rgba(59,130,246,0.2)"}}>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse-subtle" />
            Plataforma de Gestao de TI
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
            <span className="text-slate-100">Gestao de TI</span>
            <br />
            <span className="gradient-text">Simples e Poderosa</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Centralize chamados, gerencie equipamentos e registre manutencoes com TechRent.
            A plataforma completa para sua equipe de TI operar com eficiencia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-slide-in-from-bottom" style={{animationDelay:"0.2s"}}>
            <Link href="/login"
              className="px-8 py-3.5 rounded-xl text-base font-semibold text-white transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
              style={{background:"linear-gradient(135deg, #2563eb, #3b82f6)"}}>
              Comecar Agora
            </Link>
            <a href="#features"
              className="px-8 py-3.5 rounded-xl text-base font-medium text-slate-400 hover:text-slate-200 transition-all duration-200 hover:-translate-y-0.5"
              style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(99,130,200,0.15)"}}>
              Ver Funcionalidades
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-6">
            {[{value:"100+",label:"Equipamentos Gerenciados"},{value:"500+",label:"Chamados Resolvidos"},{value:"15+",label:"Equipes Ativas"}].map((s,i) => (
              <div key={s.label} className="text-center animate-slide-in-from-bottom" style={{animationDelay:`${i*0.1}s`}}>
                <p className="text-4xl md:text-5xl font-bold text-slate-100">{s.value}</p>
                <p className="text-sm text-slate-600 mt-2">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-24 px-4">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-4 animate-fade-in">
            <h2 className="text-4xl font-bold text-slate-100">Funcionalidades Completas</h2>
            <p className="text-slate-500 text-lg">Tudo que voce precisa integrado em uma plataforma</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {title:"Gestao de Chamados",desc:"Abra, acompanhe e resolva chamados de suporte com total visibilidade do status em tempo real.",color:"#93c5fd",href:"/chamados"},
              {title:"Inventario de Equipamentos",desc:"Controle completo do parque tecnologico com status, localizacao e historico de cada ativo.",color:"#c4b5fd",href:"/equipamentos"},
              {title:"Historico de Manutencao",desc:"Registro detalhado de todos os reparos, custos e tecnicos responsaveis por cada intervencao.",color:"#6ee7b7",href:"/manutencao"},
              {title:"Dashboard Executivo",desc:"Visao panoramica com metricas, indicadores e relatorios para tomada de decisao estrategica.",color:"#fbbf24",href:"/dashboard"},
            ].map((f,i) => (
              <Link key={f.href} href={f.href}
                className="group p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 animate-slide-in-from-bottom"
                style={{animationDelay:`${i*0.08}s`,background:"rgba(13,21,38,0.7)",border:"1px solid rgba(99,130,200,0.1)"}}
                onMouseEnter={(e) => e.currentTarget.style.borderColor="rgba(99,130,200,0.25)"}
                onMouseLeave={(e) => e.currentTarget.style.borderColor="rgba(99,130,200,0.1)"}>
                <div className="w-10 h-10 rounded-xl mb-4 flex items-center justify-center"
                  style={{background:`${f.color}15`,border:`1px solid ${f.color}25`}}>
                  <span className="text-lg font-bold" style={{color:f.color}}>{f.title[0]}</span>
                </div>
                <h3 className="font-semibold text-slate-200 group-hover:text-white transition-colors mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed group-hover:text-slate-400 transition-colors">{f.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          <div className="p-12 rounded-3xl" style={{background:"rgba(13,21,38,0.8)",border:"1px solid rgba(99,130,200,0.15)"}}>
            <h2 className="text-3xl font-bold text-slate-100 mb-4">Pronto para comecar?</h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
              Faca login com sua conta para acessar todos os recursos e gerenciar sua infraestrutura de TI com seguranca e eficiencia.
            </p>
            <Link href="/login"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold text-white transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
              style={{background:"linear-gradient(135deg, #2563eb, #3b82f6)"}}>
              Fazer Login Agora
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
