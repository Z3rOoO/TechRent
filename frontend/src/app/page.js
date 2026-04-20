import Link from "next/link";
import Button from "../components/ui/Button";
import Container from "../components/ui/Container";
import Card, { CardHeader, CardTitle, CardContent } from "../components/ui/Card";

export default function Home() {
  const features = [
    {
      title: "⚙️ Equipamentos",
      description: "Gerencie todo o seu inventário de TI com rastreamento completo",
      href: "/equipamentos",
    },
    {
      title: "📋 Chamados",
      description: "Abra e acompanhe solicitações de suporte em tempo real",
      href: "/chamados",
    },
    {
      title: "🔧 Manutenção",
      description: "Registre e consulte histórico detalhado de reparos",
      href: "/manutencao",
    },
    {
      title: "📊 Dashboard",
      description: "Visualize métricas, relatórios e análises avançadas",
      href: "/dashboard",
    },
  ];

  return (
    <Container>
      <div className="space-y-24">
        {/* Hero Section */}
        <section className="py-24 text-center space-y-8 animate-fade-in">
          <div className="space-y-6">
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-gray-50 leading-tight">
              Gestão de TI
              <span className="block text-gray-400">Simples e Poderosa</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-light">
              Centralize chamados, gerencie equipamentos e registre manutenções com TechRent. 
              A plataforma completa para sua equipe de TI operar com eficiência.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 animate-slide-in-from-bottom" style={{ animationDelay: "0.2s" }}>
            <Button asChild size="lg" className="text-base font-semibold h-14">
              <Link href="/login">Começar Agora →</Link>
            </Button>
            <Button variant="outline" asChild size="lg" className="text-base h-14">
              <Link href="#features">Ver Funcionalidades</Link>
            </Button>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="space-y-16">
          <div className="text-center space-y-4 animate-fade-in">
            <h2 className="text-5xl font-bold tracking-tight text-gray-100">Funcionalidades Completas</h2>
            <p className="text-gray-500 text-lg font-light">Tudo que você precisa integrado em uma plataforma</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Link 
                key={feature.href} 
                href={feature.href} 
                className="group animate-slide-in-from-bottom"
                style={{ animationDelay: `${0.1 + index * 0.1}s` }}
              >
                <Card className="h-full hover:border-gray-600/50 hover:bg-gray-800/60 hover:shadow-lg hover:-translate-y-1 group-hover:scale-105 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-100 group-hover:text-white transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 text-sm leading-relaxed group-hover:text-gray-400 transition-colors">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 space-y-12 animate-fade-in">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-gray-100">Confiança de Empresas</h2>
            <p className="text-gray-500 font-light">Números que falam por si</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Equipamentos Gerenciados", value: "100+" },
              { label: "Chamados Resolvidos", value: "500+" },
              { label: "Equipes Ativas", value: "15+" },
            ].map((stat, index) => (
              <Card 
                key={stat.label} 
                className="text-center border-gray-700/30 hover:border-gray-600/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-slide-in-from-bottom"
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              >
                <CardContent className="pt-12 pb-12">
                  <div className="text-5xl font-bold text-gray-50 mb-3">{stat.value}</div>
                  <div className="text-sm text-gray-500 font-light">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="border border-gray-700/40 rounded-xl p-16 text-center space-y-8 bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm hover:border-gray-600/50 transition-all duration-300 animate-slide-in-from-bottom">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-gray-100">Pronto para começar?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed font-light text-lg">
              Faça login com sua conta para acessar todos os recursos e gerenciar sua infraestrutura de TI 
              com segurança, eficiência e elegância.
            </p>
          </div>
          <Button asChild size="lg" className="text-base font-semibold h-14">
            <Link href="/login">Fazer Login Agora →</Link>
          </Button>
        </section>
      </div>
    </Container>
  );
}
