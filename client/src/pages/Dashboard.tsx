import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Droplet, Camera, Plus, Loader2, LogOut, TrendingUp, Zap, Apple, Flame } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [mealTitle, setMealTitle] = useState("");
  const [waterAmount, setWaterAmount] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Queries
  const { data: meals, isLoading: mealsLoading, refetch: refetchMeals } = trpc.meals.list.useQuery();
  const { data: hydrationGoal, refetch: refetchGoal } = trpc.hydration.getGoal.useQuery();
  const { data: hydrationLogs, refetch: refetchLogs } = trpc.hydration.getLogs.useQuery({ limit: 20 });

  // Mutations
  const createMealMutation = trpc.meals.create.useMutation({
    onSuccess: () => {
      setMealTitle("");
      toast.success("✅ Refeição registrada com sucesso!");
      refetchMeals();
    },
    onError: (error) => {
      toast.error(`❌ Erro: ${error.message}`);
    },
  });

  const uploadImageMutation = trpc.meals.uploadImage.useMutation({
    onSuccess: () => {
      setSelectedFile(null);
      setPreviewUrl(null);
      toast.success("✅ Imagem enviada com sucesso!");
      refetchMeals();
    },
    onError: (error) => {
      toast.error(`❌ Erro ao enviar: ${error.message}`);
    },
  });

  const logWaterMutation = trpc.hydration.logWater.useMutation({
    onSuccess: () => {
      setWaterAmount("");
      toast.success("✅ Água registrada com sucesso!");
      refetchLogs();
    },
    onError: (error) => {
      toast.error(`❌ Erro: ${error.message}`);
    },
  });

  const setGoalMutation = trpc.hydration.setGoal.useMutation({
    onSuccess: () => {
      toast.success("✅ Meta de hidratação atualizada!");
      refetchGoal();
    },
    onError: (error) => {
      toast.error(`❌ Erro: ${error.message}`);
    },
  });

  const handleCreateMeal = async () => {
    if (!mealTitle.trim()) {
      toast.error("⚠️ Digite o nome da refeição");
      return;
    }
    createMealMutation.mutate({ title: mealTitle });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("⚠️ Arquivo muito grande (máximo 5MB)");
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadImage = async () => {
    if (!selectedFile || !meals || meals.length === 0) {
      toast.error("⚠️ Selecione uma imagem e uma refeição");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = (e.target?.result as string).split(",")[1];
      uploadImageMutation.mutate({
        mealId: meals[0]?.id || 1,
        imageData: base64,
        mimeType: selectedFile.type,
      });
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleLogWater = () => {
    const amount = parseInt(waterAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("⚠️ Digite uma quantidade válida em ml");
      return;
    }
    logWaterMutation.mutate({ amountMl: amount });
  };

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  // Calcular progresso de hidratação
  const totalWaterToday = hydrationLogs?.reduce((sum, log) => sum + log.amountMl, 0) || 0;
  const goalMl = hydrationGoal?.dailyGoalMl || 2000;
  const progressPercent = Math.min((totalWaterToday / goalMl) * 100, 100);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-teal-50">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Carregando...</h1>
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-teal-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-blue-100 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-500 rounded-lg flex items-center justify-center">
              <Droplet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-blue-900">AquaVita</h1>
              <p className="text-sm text-gray-600">Bem-vindo, {user.name}!</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => setLocation("/reports")}>
              <TrendingUp className="w-4 h-4 mr-2" />
              Relatórios
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-600 hover:text-red-700">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hidratação */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Progresso de Hidratação */}
          <Card className="md:col-span-2 p-8 bg-gradient-to-br from-blue-50 to-teal-50 border-blue-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Droplet className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Hidratação Diária</h2>
                <p className="text-gray-600">{totalWaterToday}ml de {goalMl}ml</p>
              </div>
            </div>

            {/* Barra de Progresso */}
            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-teal-500 h-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">{Math.round(progressPercent)}% da meta atingida</p>
            </div>

            {/* Botões Rápidos de Água */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              {[250, 500, 750, 1000].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  className="h-16 flex flex-col items-center justify-center border-2 border-blue-200 hover:border-blue-500 hover:bg-blue-50"
                  onClick={() => {
                    setWaterAmount(amount.toString());
                    logWaterMutation.mutate({ amountMl: amount });
                  }}
                >
                  <Droplet className="w-5 h-5 text-blue-600 mb-1" />
                  <span className="text-xs font-semibold">{amount}ml</span>
                </Button>
              ))}
            </div>

            {/* Input Customizado */}
            <div className="flex gap-3">
              <Input
                type="number"
                placeholder="Digite a quantidade em ml"
                value={waterAmount}
                onChange={(e) => setWaterAmount(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleLogWater}
                disabled={logWaterMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {logWaterMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Adicionar
              </Button>
            </div>
          </Card>

          {/* Meta de Hidratação */}
          <Card className="p-8 border-blue-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Meta Diária</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meta em ml</label>
                <Input
                  type="number"
                  defaultValue={goalMl}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value)) {
                      setGoalMutation.mutate({ dailyGoalMl: value });
                    }
                  }}
                  className="w-full"
                />
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-600">
                  <strong>Dica:</strong> A meta recomendada é de 2-3 litros por dia. Ajuste conforme sua atividade física.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Refeições */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Registrar Refeição */}
          <Card className="md:col-span-2 p-8 border-teal-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <Apple className="w-6 h-6 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Minhas Refeições</h2>
            </div>

            {/* Formulário de Refeição */}
            <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Refeição</label>
                <Input
                  placeholder="Ex: Almoço, Café da Manhã, Lanche..."
                  value={mealTitle}
                  onChange={(e) => setMealTitle(e.target.value)}
                />
              </div>
              <Button
                onClick={handleCreateMeal}
                disabled={createMealMutation.isPending}
                className="w-full bg-teal-600 hover:bg-teal-700"
              >
                {createMealMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                Registrar Refeição
              </Button>
            </div>

            {/* Upload de Imagem */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Enviar Foto da Refeição</h3>
              <div
                className="border-2 border-dashed border-teal-300 rounded-lg p-6 text-center cursor-pointer hover:bg-teal-50 transition"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Clique para enviar uma foto</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {previewUrl && (
                <div className="space-y-3">
                  <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                  <Button
                    onClick={handleUploadImage}
                    disabled={uploadImageMutation.isPending}
                    className="w-full bg-teal-600 hover:bg-teal-700"
                  >
                    {uploadImageMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Camera className="w-4 h-4 mr-2" />}
                    Enviar Foto
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Histórico de Refeições */}
          <Card className="p-8 border-teal-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              Histórico
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {mealsLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" />
                </div>
              ) : meals && meals.length > 0 ? (
                meals.map((meal, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="font-semibold text-gray-900">{meal.title}</p>
                    {meal.calories && <p className="text-sm text-gray-600">{meal.calories} kcal</p>}
                    <p className="text-xs text-gray-500">{new Date(meal.createdAt).toLocaleString("pt-BR")}</p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">Nenhuma refeição registrada</p>
              )}
            </div>
          </Card>
        </div>

        {/* Histórico de Hidratação */}
        <Card className="mt-8 p-8 border-blue-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Droplet className="w-5 h-5 text-blue-600" />
            Histórico de Hidratação
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {hydrationLogs && hydrationLogs.length > 0 ? (
              hydrationLogs.map((log, idx) => (
                <div key={idx} className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-center">
                  <p className="text-2xl font-bold text-blue-600">{log.amountMl}</p>
                  <p className="text-xs text-gray-600">ml</p>
                  <p className="text-xs text-gray-500">{new Date(log.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</p>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500 py-8">Nenhum registro de água hoje</p>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
}
