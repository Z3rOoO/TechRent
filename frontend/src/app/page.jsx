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
        else if (role === "tecnico") router.push("/chamados");
        else if (role === "cliente") router.push("/chamados");
      } catch {}
    }
    setChecked(true);
  }, [router]);

  if (!checked || user) return null;

  return (
    <div className="overflow-hidden bg-slate-950 text-slate-200">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 md:py-24">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[300px] h-[300px] md:w-[800px] md:h-[800px] bg-blue-600/10 rounded-full blur-[80px] md:blur-[120px]" />
          <div className="absolute bottom-[10%] right-[5%] w-[200px] h-[200px] md:w-[400px] md:h-[400px] bg-indigo-600/5 rounded-full blur-[60px] md:blur-[100px]" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6 md:space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-[10px] md:text-xs font-medium text-blue-400 mb-2 md:mb-4 bg-blue-400/10 border border-blue-400/20">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Plataforma de Gestão de TI
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
            <span className="text-slate-100">Gestão de TI</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
              Simples e Poderosa
            </span>
          </h1>
          
          <p className="text-base md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed px-4">
            Centralize chamados, gerencie equipamentos e registre manutenções com TechRent.
            A plataforma completa para sua equipe de TI operar com eficiência.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 px-4">
            <Link href="/login"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-base font-semibold text-white transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 bg-gradient-to-r from-blue-600 to-blue-500 text-center">
              Começar Agora
            </Link>
            <a href="#features"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-base font-medium text-slate-400 hover:text-slate-200 transition-all duration-200 hover:-translate-y-0.5 bg-white/5 border border-slate-800 text-center">
              Ver Funcionalidades
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16 px-4 border-y border-slate-900 bg-slate-900/20">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12">
            {[
              {value:"100+",label:"Equipamentos Gerenciados"},
              {value:"500+",label:"Chamados Resolvidos"},
              {value:"15+",label:"Equipes Ativas"}
            ].map((s,i) => (
              <div key={s.label} className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-slate-100">{s.value}</p>
                <p className="text-xs md:text-sm text-slate-600 mt-2 uppercase tracking-widest font-bold">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 px-4">
        <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-100">Funcionalidades Completas</h2>
            <p className="text-slate-500 text-base md:text-lg">Tudo que você precisa integrado em uma plataforma</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {[
              {title:"Gestão de Chamados",desc:"Abra, acompanhe e resolva chamados de suporte com total visibilidade do status em tempo real.",color:"#93c5fd",href:"/chamados"},
              {title:"Inventário de Equipamentos",desc:"Controle completo do parque tecnológico com status, localização e histórico de cada ativo.",color:"#c4b5fd",href:"/equipamentos"},
              {title:"Histórico de Manutenção",desc:"Registro detalhado de todos os reparos, custos e técnicos responsáveis por cada intervenção.",color:"#6ee7b7",href:"/manutencao"},
              {title:"Dashboard Executivo",desc:"Visão panorâmica com métricas, indicadores e relatórios para tomada de decisão estratégica.",color:"#fbbf24",href:"/dashboard"},
            ].map((f,i) => (
              <Link key={f.href} href={f.href}
                className="group p-6 md:p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1 bg-slate-900/50 border border-slate-800 hover:border-blue-500/30">
                <div className="w-10 h-10 rounded-xl mb-4 flex items-center justify-center bg-white/5 border border-white/10">
                  <span className="text-lg font-bold" style={{color:f.color}}>{f.title[0]}</span>
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-slate-200 group-hover:text-white transition-colors mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed group-hover:text-slate-400 transition-colors">{f.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="p-8 md:p-16 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl">
            <h2 className="text-2xl md:text-4xl font-bold text-slate-100 mb-4">Pronto para começar?</h2>
            <p className="text-sm md:text-lg text-slate-500 mb-8 leading-relaxed">
              Faça login com sua conta para acessar todos os recursos e gerenciar sua infraestrutura de TI com segurança e eficiência.
            </p>
            <Link href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-white transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 bg-blue-600 hover:bg-blue-500">
              Fazer Login Agora
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
