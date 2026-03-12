import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  Droplet,
  Zap,
  TrendingUp,
  Shield,
  Smartphone,
  Brain,
  Target,
  Users,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleStartFree = () => {
    if (isAuthenticated) {
      setLocation("/onboarding");
    } else {
      window.location.href = getLoginUrl();
    }
  };

  const features = [
    {
      icon: Droplet,
      title: "Monitoramento de Hidratação",
      description:
        "Cálculo personalizado de metas de água com base em peso, idade, clima e atividade física.",
    },
    {
      icon: Brain,
      title: "Inteligência Artificial",
      description:
        "Recomendações adaptativas que aprendem com seus hábitos e comportamento.",
    },
    {
      icon: Smartphone,
      title: "Reconhecimento por Foto",
      description:
        "Tire uma foto da sua refeição e a IA identifica alimentos e nutrientes automaticamente.",
    },
    {
      icon: TrendingUp,
      title: "Relatórios Avançados",
      description:
        "Visualize seu progresso com gráficos detalhados de hidratação e nutrição.",
    },
    {
      icon: Target,
      title: "Metas Personalizadas",
      description:
        "Defina objetivos de saúde e acompanhe seu progresso diário.",
    },
    {
      icon: Zap,
      title: "Lembretes Inteligentes",
      description:
        "Notificações adaptativas que se ajustam ao seu comportamento e rotina.",
    },
  ];

  const plans = [
    {
      name: "Gratuito",
      price: "R$ 0",
      period: "Sempre",
      features: [
        "Monitoramento de hidratação",
        "Lembretes inteligentes",
        "Registro manual de refeições",
        "Análise básica de calorias",
        "Relatórios diários",
        "Gamificação básica",
      ],
      cta: "Começar Agora",
      highlighted: false,
    },
    {
      name: "Premium",
      price: "R$ 19,90",
      period: "/mês",
      features: [
        "Tudo do plano gratuito",
        "Reconhecimento de alimentos por foto",
        "Coach virtual com IA",
        "Análise completa de micronutrientes",
        "Planos de refeições semanais",
        "Relatórios avançados",
        "Sem anúncios",
      ],
      cta: "Assinar Premium",
      highlighted: true,
    },
    {
      name: "Premium Anual",
      price: "R$ 149,00",
      period: "/ano",
      features: [
        "Tudo do plano Premium",
        "Economia de 38%",
        "Suporte prioritário",
        "Acesso antecipado a novos recursos",
      ],
      cta: "Assinar Anualmente",
      highlighted: false,
    },
  ];

  const techStack = [
    { category: "Frontend", tech: "React Native / Flutter" },
    { category: "Backend", tech: "Node.js / Python" },
    { category: "Banco de Dados", tech: "PostgreSQL + Firebase" },
    { category: "IA", tech: "TensorFlow / PyTorch" },
    { category: "Infraestrutura", tech: "AWS / Google Cloud" },
  ];

  const roadmap = [
    {
      phase: "MVP (v1.0)",
      period: "Meses 1–4",
      features: [
        "Monitoramento de hidratação",
        "Lembretes adaptativos",
        "Registro manual de alimentos",
        "Dashboard básico",
      ],
    },
    {
      phase: "v1.5",
      period: "Meses 5–7",
      features: [
        "Integração com Apple Health/Google Fit",
        "Relatórios semanais/mensais",
        "Leitura de código de barras",
        "Plano Premium",
      ],
    },
    {
      phase: "v2.0",
      period: "Meses 8–12",
      features: [
        "Reconhecimento por foto (IA)",
        "Coach virtual (chat)",
        "Planos de refeições",
        "Versão Pro para profissionais",
      ],
    },
    {
      phase: "v2.5+",
      period: "Meses 13+",
      features: [
        "Integração com wearables",
        "Análise preditiva avançada",
        "Desafios com amigos",
        "Expansão internacional",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-teal-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-blue-100">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-500 rounded-lg flex items-center justify-center">
              <Droplet className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-blue-900">AquaVita</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-700 hover:text-blue-600 transition">
              Funcionalidades
            </a>
            <a href="#technology" className="text-gray-700 hover:text-blue-600 transition">
              Tecnologia
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition">
              Preços
            </a>
            <a href="#roadmap" className="text-gray-700 hover:text-blue-600 transition">
              Roadmap
            </a>
            <Button className="bg-blue-600 hover:bg-blue-700">Saiba Mais</Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden bg-white border-t border-blue-100 p-4 space-y-3">
            <a
              href="#features"
              className="block text-gray-700 hover:text-blue-600"
            >
              Funcionalidades
            </a>
            <a
              href="#technology"
              className="block text-gray-700 hover:text-blue-600"
            >
              Tecnologia
            </a>
            <a href="#pricing" className="block text-gray-700 hover:text-blue-600">
              Preços
            </a>
            <a href="#roadmap" className="block text-gray-700 hover:text-blue-600">
              Roadmap
            </a>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Saiba Mais
            </Button>
          </nav>
        )}
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Sua Saúde em{" "}
              <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                Primeiro Lugar
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              AquaVita é um assistente pessoal de saúde inteligente que ajuda você
              a manter hábitos saudáveis de hidratação e nutrição com
              recomendações personalizadas por IA.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg" onClick={handleStartFree}>
                Começar Gratuitamente <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                Assistir Demo
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="w-full h-96 bg-gradient-to-br from-blue-200 via-teal-100 to-blue-100 rounded-3xl shadow-2xl flex items-center justify-center">
              <Smartphone className="w-32 h-32 text-blue-600 opacity-30" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Funcionalidades Principais
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tudo que você precisa para manter uma vida mais saudável, em um único
              aplicativo.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="p-8 hover:shadow-lg transition-shadow border-blue-100"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI & Personalization */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-500 py-20 md:py-32 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Inteligência Artificial Personalizada
              </h2>
              <p className="text-lg mb-6 opacity-90">
                A IA do AquaVita aprende com seus hábitos e oferece recomendações
                cada vez mais precisas. Quanto mais você usa, melhor ela fica.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1" />
                  <span>Metas dinâmicas que se ajustam ao clima e atividade</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1" />
                  <span>Lembretes inteligentes baseados em seu comportamento</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1" />
                  <span>Sugestões de refeições personalizadas</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1" />
                  <span>Coach virtual de saúde 24/7</span>
                </li>
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <div className="space-y-6">
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-sm opacity-75 mb-2">Personalização em Tempo Real</p>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-white rounded-full h-2 w-3/4"></div>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-sm opacity-75 mb-2">Análise Comportamental</p>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-white rounded-full h-2 w-5/6"></div>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-sm opacity-75 mb-2">Visão Computacional</p>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-white rounded-full h-2 w-4/5"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section id="technology" className="bg-white py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Tecnologia de Ponta
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Construído com as melhores tecnologias para garantir performance,
              segurança e escalabilidade.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {techStack.map((item, index) => (
              <Card
                key={index}
                className="p-8 border-blue-100 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {item.category}
                    </h3>
                    <p className="text-gray-600">{item.tech}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card className="mt-12 p-8 bg-gradient-to-r from-blue-50 to-teal-50 border-blue-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Diferenciais Competitivos
            </h3>
            <ul className="grid md:grid-cols-2 gap-4">
              <li className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700">
                  Hiper-personalização em tempo real
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700">
                  Coach virtual proativo com IA
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700">
                  Gamificação integrada ao fluxo
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700">
                  Integração profunda com wearables
                </span>
              </li>
            </ul>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-gradient-to-b from-gray-50 to-white py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Planos e Preços
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Escolha o plano perfeito para suas necessidades. Comece gratuitamente
              e faça upgrade quando quiser.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`p-8 transition-all ${
                  plan.highlighted
                    ? "border-2 border-blue-600 shadow-2xl scale-105"
                    : "border-blue-100"
                }`}
              >
                {plan.highlighted && (
                  <div className="bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full inline-block mb-4">
                    Mais Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-600 ml-2">{plan.period}</span>
                </div>
                <Button
                  className={`w-full mb-8 ${
                    plan.highlighted
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                  }`}
                >
                  {plan.cta}
                </Button>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section id="roadmap" className="bg-white py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Roadmap de Desenvolvimento
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Conheça as fases de desenvolvimento do AquaVita e as funcionalidades
              planejadas.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {roadmap.map((phase, index) => (
              <Card key={index} className="p-8 border-blue-100 hover:border-blue-300 transition-colors">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {phase.phase}
                    </h3>
                    <p className="text-sm text-gray-600">{phase.period}</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {phase.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <ArrowRight className="w-4 h-4 text-teal-500 flex-shrink-0 mt-1" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Market Context */}
      <section className="bg-gradient-to-r from-blue-50 to-teal-50 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Contexto de Mercado
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              O mercado de apps de saúde está em crescimento exponencial.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center border-blue-100">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                US$ 2,14B
              </div>
              <p className="text-gray-600">Tamanho do mercado em 2024</p>
            </Card>
            <Card className="p-8 text-center border-blue-100">
              <div className="text-4xl font-bold text-teal-500 mb-2">
                US$ 4,56B
              </div>
              <p className="text-gray-600">Projeção para 2030</p>
            </Card>
            <Card className="p-8 text-center border-blue-100">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                13,4%
              </div>
              <p className="text-gray-600">CAGR (2025-2030)</p>
            </Card>
          </div>

          <Card className="mt-12 p-8 bg-white border-blue-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Por que AquaVita?
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  Diferenciação Clara
                </h4>
                <p className="text-gray-600">
                  Combinação única de hidratação, nutrição e IA em uma plataforma
                  integrada.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-teal-500" />
                  Público-Alvo Amplo
                </h4>
                <p className="text-gray-600">
                  Desde pessoas comuns até atletas e profissionais de saúde.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-500 py-20 md:py-32 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Pronto para Transformar sua Saúde?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Comece gratuitamente hoje e descubra como AquaVita pode ajudar você a
            manter hábitos saudáveis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg font-bold"
              onClick={handleStartFree}
            >
              Começar Gratuitamente
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 text-lg font-bold"
            >
              Agendar Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-teal-500 rounded-lg flex items-center justify-center">
                  <Droplet className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-white font-bold">AquaVita</h3>
              </div>
              <p className="text-sm">
                Seu assistente pessoal de saúde e bem-estar.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#features" className="hover:text-white transition">
                    Funcionalidades
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-white transition">
                    Preços
                  </a>
                </li>
                <li>
                  <a href="#roadmap" className="hover:text-white transition">
                    Roadmap
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Sobre Nós
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Contato
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Privacidade
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Termos
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>
              &copy; 2026 AquaVita. Todos os direitos reservados. Desenvolvido com
              ❤️ para sua saúde.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
