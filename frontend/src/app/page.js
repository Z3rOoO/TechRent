import Link from "next/link";
import Button from "../components/ui/Button";
import Container from "../components/ui/Container";
import Card, { CardHeader, CardTitle, CardContent } from "../components/ui/Card";

export default function Home() {
  const features = [
    {
      title: "Equipamentos",
      description: "Gerencie todo o seu inventário de TI com rastreamento completo",
      href: "/equipamentos",
    },
    {
      title: "Chamados",
      description: "Abra e acompanhe solicitações de suporte em tempo real",
      href: "/chamados",
    },
    {
      title: "Manutenção",
      description: "Registre e consulte histórico detalhado de reparos",
      href: "/manutencao",
    },
    {
      title: "Dashboard",
      description: "Visualize métricas, relatórios e análises avançadas",
      href: "/dashboard",
    },
  ];

  return (
    <Container>
      <div className="space-y-20">
        {/* Hero Section */}
        <section className="py-20 text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-100">
            Sistema de Gerenciamento de TI
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Centralize o relato de problemas, gerencie chamados, acompanhe equipamentos e registre manutenções com TechRent. Tudo que sua equipe de TI precisa em um único lugar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild size="lg">
              <Link href="/login">Começar Agora</Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link href="#features">Ver Funcionalidades</Link>
            </Button>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-bold tracking-tight text-slate-100">Funcionalidades Completas</h2>
            <p className="text-slate-400 text-lg">Tudo integrado e pronto para usar</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Link key={feature.href} href={feature.href} className="group">
                <Card className="h-full border-slate-700/50 hover:border-slate-600 hover:bg-slate-800/50 transition-all duration-300 glass-dark">
                  <CardHeader>
                    <CardTitle className="text-lg text-slate-100">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-slate-100">Pela Confiança de Nossros Clientes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Equipamentos Gerenciados", value: "100+" },
              { label: "Chamados Resolvidos", value: "500+" },
              { label: "Equipes Ativas", value: "15+" },
            ].map((stat) => (
              <Card key={stat.label} className="text-center border-slate-700/50 glass-dark hover:bg-slate-800/60 transition-all duration-300">
                <CardContent className="pt-8 pb-8">
                  <div className="text-4xl font-bold text-slate-100 mb-2">{stat.value}</div>
                  <div className="text-sm text-slate-400 font-medium">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-12 text-center space-y-6 backdrop-blur-sm">
          <h2 className="text-3xl font-bold text-slate-100">Pronto para começar?</h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Faça login com sua conta para acessar todos os recursos e gerenciar sua infraestrutura de TI eficientemente.
          </p>
          <Button asChild size="lg">
            <Link href="/login">Fazer Login Agora</Link>
          </Button>
        </section>
      </div>
    </Container>
  );
}
