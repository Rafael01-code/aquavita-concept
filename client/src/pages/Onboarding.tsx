import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Droplet } from "lucide-react";
import { toast } from "sonner";

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [planType, setPlanType] = useState<"free" | "premium" | "premium_annual">("free");
  const [formData, setFormData] = useState({
    age: "",
    height: "",
    weight: "",
    exercisesRegularly: false,
    exerciseFrequency: "rarely",
    exerciseDuration: "",
  });

  const saveProfile = trpc.profile.saveProfile.useMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNext = () => {
    if (step === 1) {
      if (!planType) {
        toast.error("Selecione um plano");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.age || !formData.height || !formData.weight) {
        toast.error("Preencha todos os campos obrigatórios");
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (formData.exercisesRegularly && !formData.exerciseDuration) {
        toast.error("Informe a duração do exercício");
        return;
      }
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    try {
      await saveProfile.mutateAsync({
        planType,
        age: parseInt(formData.age),
        height: parseInt(formData.height),
        weight: parseInt(formData.weight),
        exercisesRegularly: formData.exercisesRegularly,
        exerciseFrequency: formData.exerciseFrequency,
        exerciseDuration: formData.exercisesRegularly ? parseInt(formData.exerciseDuration) : 0,
      });
      toast.success("Perfil criado com sucesso!");
      setLocation("/dashboard");
    } catch (error) {
      toast.error("Erro ao salvar perfil");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-500 rounded-lg flex items-center justify-center">
              <Droplet className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-blue-900">AquaVita</h1>
          </div>
          <p className="text-gray-600">Bem-vindo! Vamos personalizar sua experiência</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 flex gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full transition-colors ${
                s <= step ? "bg-blue-600" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        <Card className="p-8 border-blue-100">
          {/* Step 1: Plan Selection */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Escolha seu Plano</h2>
                <p className="text-gray-600">Selecione o plano que melhor se adequa às suas necessidades</p>
              </div>

              <RadioGroup value={planType} onValueChange={(value: any) => setPlanType(value)}>
                {/* Free Plan */}
                <div className="border-2 border-gray-200 rounded-lg p-6 cursor-pointer hover:border-blue-300 transition-colors">
                  <div className="flex items-center gap-4">
                    <RadioGroupItem value="free" id="free" />
                    <div className="flex-1">
                      <Label htmlFor="free" className="text-lg font-bold cursor-pointer">
                        Plano Gratuito
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">
                        Monitoramento básico de hidratação e nutrição
                      </p>
                      <div className="mt-3 space-y-1 text-sm text-gray-700">
                        <p>✓ Monitoramento de hidratação</p>
                        <p>✓ Lembretes inteligentes</p>
                        <p>✓ Registro manual de refeições</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">R$ 0</p>
                      <p className="text-sm text-gray-600">Sempre grátis</p>
                    </div>
                  </div>
                </div>

                {/* Premium Plan */}
                <div className="border-2 border-blue-600 rounded-lg p-6 cursor-pointer hover:border-blue-700 transition-colors bg-blue-50">
                  <div className="flex items-center gap-4">
                    <RadioGroupItem value="premium" id="premium" />
                    <div className="flex-1">
                      <Label htmlFor="premium" className="text-lg font-bold cursor-pointer">
                        Plano Premium
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">
                        Análise completa com IA e recursos avançados
                      </p>
                      <div className="mt-3 space-y-1 text-sm text-gray-700">
                        <p>✓ Tudo do plano gratuito</p>
                        <p>✓ Reconhecimento de alimentos por foto</p>
                        <p>✓ Coach virtual com IA</p>
                        <p>✓ Análise completa de macronutrientes</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">R$ 19,90</p>
                      <p className="text-sm text-gray-600">/mês</p>
                    </div>
                  </div>
                </div>

                {/* Premium Annual Plan */}
                <div className="border-2 border-teal-600 rounded-lg p-6 cursor-pointer hover:border-teal-700 transition-colors bg-teal-50">
                  <div className="flex items-center gap-4">
                    <RadioGroupItem value="premium_annual" id="premium_annual" />
                    <div className="flex-1">
                      <Label htmlFor="premium_annual" className="text-lg font-bold cursor-pointer">
                        Plano Premium Anual
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">
                        Melhor valor com economia de 38%
                      </p>
                      <div className="mt-3 space-y-1 text-sm text-gray-700">
                        <p>✓ Tudo do plano Premium</p>
                        <p>✓ Suporte prioritário</p>
                        <p>✓ Acesso antecipado a novos recursos</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-teal-600">R$ 149,00</p>
                      <p className="text-sm text-gray-600">/ano</p>
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Step 2: Personal Info */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Informações Pessoais</h2>
                <p className="text-gray-600">Estes dados ajudam a personalizar suas metas de hidratação</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Idade *</Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    placeholder="Ex: 25"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="height">Altura (cm) *</Label>
                  <Input
                    id="height"
                    name="height"
                    type="number"
                    placeholder="Ex: 175"
                    value={formData.height}
                    onChange={handleInputChange}
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="weight">Peso (kg) *</Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  placeholder="Ex: 70"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className="mt-2"
                />
              </div>
            </div>
          )}

          {/* Step 3: Exercise Info */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Atividade Física</h2>
                <p className="text-gray-600">Informações sobre sua rotina de exercícios</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="exercises"
                    name="exercisesRegularly"
                    checked={formData.exercisesRegularly}
                    onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="exercises" className="cursor-pointer">
                    Faço exercícios regularmente
                  </Label>
                </div>

                {formData.exercisesRegularly && (
                  <>
                    <div>
                      <Label>Frequência de exercícios</Label>
                      <RadioGroup value={formData.exerciseFrequency} onValueChange={(value) => setFormData((prev) => ({ ...prev, exerciseFrequency: value }))}>
                        <div className="flex items-center gap-2 mt-2">
                          <RadioGroupItem value="daily" id="daily" />
                          <Label htmlFor="daily" className="cursor-pointer">Diariamente</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="3-4_times_week" id="3-4" />
                          <Label htmlFor="3-4" className="cursor-pointer">3-4 vezes por semana</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="1-2_times_week" id="1-2" />
                          <Label htmlFor="1-2" className="cursor-pointer">1-2 vezes por semana</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label htmlFor="duration">Duração do exercício (minutos) *</Label>
                      <Input
                        id="duration"
                        name="exerciseDuration"
                        type="number"
                        placeholder="Ex: 60"
                        value={formData.exerciseDuration}
                        onChange={handleInputChange}
                        className="mt-2"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            {step > 1 && (
              <Button
                onClick={() => setStep(step - 1)}
                variant="outline"
                className="flex-1"
              >
                Voltar
              </Button>
            )}
            <Button
              onClick={handleNext}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={saveProfile.isPending}
            >
              {step === 3 ? "Concluir" : "Próximo"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
