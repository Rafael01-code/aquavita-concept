import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ArrowLeft, TrendingUp, Droplet, Utensils, Activity, Award } from "lucide-react";
import { useLocation } from "wouter";
import { useMemo } from "react";

export default function Reports() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const { data: hydrationLogs } = trpc.hydration.getLogs.useQuery({ limit: 100 });
  const { data: meals } = trpc.meals.list.useQuery();

  // Processar dados de hidratação por dia
  const hydrationByDay = useMemo(() => {
    if (!hydrationLogs) return [];

    const grouped: Record<string, number> = {};
    hydrationLogs.forEach((log) => {
      const date = new Date(log.createdAt).toLocaleDateString("pt-BR");
      grouped[date] = (grouped[date] || 0) + log.amountMl;
    });

    return Object.entries(grouped)
      .map(([date, amount]) => ({
        date,
        amount,
      }))
      .slice(-7); // Últimos 7 dias
  }, [hydrationLogs]);

  // Processar dados de calorias por refeição
  const caloriesByMeal = useMemo(() => {
    if (!meals) return [];

    return meals
      .filter((meal) => meal.calories)
      .slice(-10)
      .map((meal) => ({
        name: meal.title,
        calorias: meal.calories || 0,
      }));
  }, [meals]);

  // Processar macronutrientes
  const macronutrients = useMemo(() => {
    if (!meals) return [];

    const totals = meals.reduce(
      (acc, meal) => ({
        protein: acc.protein + (meal.protein || 0),
        carbs: acc.carbs + (meal.carbs || 0),
        fat: acc.fat + (meal.fat || 0),
      }),
      { protein: 0, carbs: 0, fat: 0 }
    );

    return [
      { name: "Proteína", value: Math.round(totals.protein), color: "#3b82f6" },
      { name: "Carboidratos", value: Math.round(totals.carbs), color: "#10b981" },
      { name: "Gorduras", value: Math.round(totals.fat), color: "#f59e0b" },
    ];
  }, [meals]);

  // Calcular estatísticas
  const stats = useMemo(() => {
    const totalWater = hydrationLogs?.reduce((sum, log) => sum + log.amountMl, 0) || 0;
    const totalCalories = meals?.reduce((sum, meal) => sum + (meal.calories || 0), 0) || 0;
    const avgWaterPerDay = hydrationByDay.length > 0
      ? Math.round(hydrationByDay.reduce((sum, day) => sum + day.amount, 0) / hydrationByDay.length)
      : 0;
    const mealCount = meals?.length || 0;

    return { totalWater, totalCalories, avgWaterPerDay, mealCount };
  }, [hydrationLogs, meals, hydrationByDay]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-teal-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-blue-100 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => setLocation("/dashboard")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-blue-900">Meus Relatórios</h1>
              <p className="text-sm text-gray-600">Acompanhe seu progresso</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Água Total</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalWater}</p>
                <p className="text-xs text-gray-500">ml</p>
              </div>
              <Droplet className="w-12 h-12 text-blue-300 opacity-50" />
            </div>
          </Card>

          <Card className="p-6 border-teal-200 bg-gradient-to-br from-teal-50 to-teal-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Média Diária</p>
                <p className="text-3xl font-bold text-teal-600">{stats.avgWaterPerDay}</p>
                <p className="text-xs text-gray-500">ml/dia</p>
              </div>
              <Activity className="w-12 h-12 text-teal-300 opacity-50" />
            </div>
          </Card>

          <Card className="p-6 border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Calorias Total</p>
                <p className="text-3xl font-bold text-orange-600">{stats.totalCalories}</p>
                <p className="text-xs text-gray-500">kcal</p>
              </div>
              <Utensils className="w-12 h-12 text-orange-300 opacity-50" />
            </div>
          </Card>

          <Card className="p-6 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Refeições</p>
                <p className="text-3xl font-bold text-purple-600">{stats.mealCount}</p>
                <p className="text-xs text-gray-500">registradas</p>
              </div>
              <Award className="w-12 h-12 text-purple-300 opacity-50" />
            </div>
          </Card>
        </div>

        {/* Gráficos */}
        <Tabs defaultValue="hydration" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200 rounded-lg p-1">
            <TabsTrigger value="hydration" className="data-[state=active]:bg-blue-100">
              <Droplet className="w-4 h-4 mr-2" />
              Hidratação
            </TabsTrigger>
            <TabsTrigger value="nutrition" className="data-[state=active]:bg-orange-100">
              <Utensils className="w-4 h-4 mr-2" />
              Nutrição
            </TabsTrigger>
            <TabsTrigger value="macros" className="data-[state=active]:bg-green-100">
              <TrendingUp className="w-4 h-4 mr-2" />
              Macronutrientes
            </TabsTrigger>
          </TabsList>

          {/* Hidratação */}
          <TabsContent value="hydration" className="mt-6">
            <Card className="p-8 border-blue-200">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Hidratação - Últimos 7 Dias</h3>
              {hydrationByDay.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={hydrationByDay}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                    <XAxis dataKey="date" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                      formatter={(value) => [`${value} ml`, "Água"]}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ fill: "#3b82f6", r: 5 }}
                      name="Água (ml)"
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Droplet className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>Nenhum dado de hidratação disponível</p>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Nutrição */}
          <TabsContent value="nutrition" className="mt-6">
            <Card className="p-8 border-orange-200">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Calorias por Refeição</h3>
              {caloriesByMeal.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={caloriesByMeal}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#fed7aa" />
                    <XAxis dataKey="name" stroke="#6b7280" angle={-45} textAnchor="end" height={80} />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                      formatter={(value) => [`${value} kcal`, "Calorias"]}
                    />
                    <Legend />
                    <Bar dataKey="calorias" fill="#f59e0b" name="Calorias (kcal)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Utensils className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>Nenhum dado de nutrição disponível</p>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Macronutrientes */}
          <TabsContent value="macros" className="mt-6">
            <Card className="p-8 border-green-200">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Distribuição de Macronutrientes</h3>
              {macronutrients.length > 0 && macronutrients.some((m) => m.value > 0) ? (
                <div className="flex flex-col md:flex-row items-center justify-center gap-12">
                  <ResponsiveContainer width={300} height={300}>
                    <PieChart>
                      <Pie
                        data={macronutrients}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}g`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {macronutrients.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}g`} />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="space-y-4">
                    {macronutrients.map((macro, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: macro.color }} />
                        <div>
                          <p className="font-semibold text-gray-900">{macro.name}</p>
                          <p className="text-sm text-gray-600">{macro.value}g</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>Nenhum dado de macronutrientes disponível</p>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dicas */}
        <Card className="mt-8 p-8 bg-gradient-to-r from-blue-50 to-teal-50 border-blue-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">💡 Dicas para Melhorar</h3>
          <ul className="space-y-2 text-gray-700">
            <li>✓ Beba água regularmente ao longo do dia, não apenas quando tiver sede</li>
            <li>✓ Registre suas refeições com fotos para análise mais precisa</li>
            <li>✓ Mantenha um equilíbrio entre proteínas, carboidratos e gorduras</li>
            <li>✓ Aumente sua ingestão de água em dias de atividade física intensa</li>
          </ul>
        </Card>
      </main>
    </div>
  );
}
