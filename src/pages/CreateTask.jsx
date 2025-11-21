import { createPageUrl } from "../lib/utils";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Card } from "../components/ui/card";

import { useState, useEffect } from "react";
import api from "../api/apiClient";
import { ArrowLeft, Save, Clock, Palette, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useQueryClient, useMutation } from "@tanstack/react-query";

import TimePickerIOS from "../components/time/TimePickerIOS";

// -------------------------
// CONFIGURAÇÕES E DADOS
// -------------------------
const colorOptions = [
  { id: "red", defaultName: "Trabalho", bgClass: "bg-red-500 hover:bg-red-600", textClass: "text-white" },
  { id: "yellow", defaultName: "Estudos", bgClass: "bg-yellow-500 hover:bg-yellow-600", textClass: "text-white" },
  { id: "blue", defaultName: "Pessoal", bgClass: "bg-blue-500 hover:bg-blue-600", textClass: "text-white" },
  { id: "green", defaultName: "Saúde", bgClass: "bg-green-500 hover:bg-green-600", textClass: "text-white" }
];

const weekDayOptions = [
  { id: "everyday", shortName: "Todos", fullName: "Todos os dias" },
  { id: "monday", shortName: "Seg", fullName: "Segunda" },
  { id: "tuesday", shortName: "Ter", fullName: "Terça" },
  { id: "wednesday", shortName: "Qua", fullName: "Quarta" },
  { id: "thursday", shortName: "Qui", fullName: "Quinta" },
  { id: "friday", shortName: "Sex", fullName: "Sexta" },
  { id: "saturday", shortName: "Sáb", fullName: "Sábado" },
  { id: "sunday", shortName: "Dom", fullName: "Domingo" }
];

export default function CreateTask() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // -------------------------
  // ESTADOS
  // -------------------------
  const [categoryNames, setCategoryNames] = useState({});
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Define horário inicial igual ao horário atual
  const now = new Date();
  const initialHour = String(now.getHours()).padStart(2, "0");
  const initialMinute = String(now.getMinutes()).padStart(2, "0");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    time: `${initialHour}:${initialMinute}`,
    color: "blue",
    recurrence: [],
    active: true,
    alarm_enabled: true
  });

  // -------------------------
  // CARREGAR CATEGORIAS
  // -------------------------
  useEffect(() => {
    loadCategoryNames();
  }, []);

  const loadCategoryNames = async () => {
    try {
      const categories = await api.Category.list();
      const names = {};
      categories.forEach(cat => {
        names[cat.color] = cat.name;
      });
      setCategoryNames(names);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  // -------------------------
  // MUTATION: CRIAR TAREFA
  // -------------------------
  const createTaskMutation = useMutation({
    mutationFn: (taskData) => api.Task.create(taskData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      navigate(createPageUrl("Home"));
    },
  });

  // -------------------------
  // MANIPULADORES
  // -------------------------
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleWeekDay = (dayId) => {
    if (dayId === "everyday") {
      setFormData(prev => ({
        ...prev,
        recurrence: prev.recurrence.includes("everyday") ? [] : ["everyday"]
      }));
      return;
    }

    if (formData.recurrence.includes("everyday")) return;

    setFormData(prev => ({
      ...prev,
      recurrence: prev.recurrence.includes(dayId)
        ? prev.recurrence.filter(d => d !== dayId)
        : [...prev.recurrence, dayId]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createTaskMutation.mutate(formData);
  };

  const getColorDisplayName = (colorId) => {
    const color = colorOptions.find(c => c.id === colorId);
    return categoryNames[colorId] || color?.defaultName || colorId;
  };

  // -------------------------
  // RENDER
  // -------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      
      {/* HEADER */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(createPageUrl("Home"))}
              className="rounded-full"
            >
              <ArrowLeft className="w-6 h-6 text-gray-900" />
            </Button>
            <h1 className="text-2xl font-black text-gray-900">Nova Tarefa</h1>
          </div>
        </div>
      </div>

      {/* CONTEÚDO */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <Card className="shadow-2xl border-0 bg-white p-6">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* NOME */}
            <div className="space-y-3">
              <Label className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Nome *
              </Label>
              <Input
                required
                placeholder="Ex: Reunião importante"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="text-lg h-14 rounded-xl border-2 bg-white"
              />
            </div>

            {/* DESCRIÇÃO */}
            <div className="space-y-3">
              <Label className="text-lg font-bold text-gray-900">
                Descrição (opcional)
              </Label>
              <Textarea
                placeholder="Adicione mais detalhes sobre a tarefa..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="h-28 rounded-xl border-2 resize-none bg-white"
              />
            </div>

            {/* HORÁRIO */}
            <div className="space-y-3">
              <Label className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-600" />
                Horário *
              </Label>

              <div
                className="text-3xl h-16 rounded-xl border-2 flex items-center justify-center bg-white cursor-pointer font-bold"
                onClick={() => setShowTimePicker(true)}
              >
                {formData.time}
              </div>
            </div>

            {/* CLASSIFICAÇÃO POR COR */}
            <div className="space-y-3">
              <Label className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Palette className="w-5 h-5 text-purple-600" />
                Classificação *
              </Label>

              <div className="grid grid-cols-4 gap-3">
                {colorOptions.map((color) => (
                  <motion.button
                    key={color.id}
                    type="button"
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleInputChange("color", color.id)}
                    className={`${color.bgClass} h-20 rounded-2xl transition-all duration-300 ${
                      formData.color === color.id
                        ? "ring-4 ring-offset-4 ring-gray-900 scale-105 shadow-xl"
                        : "shadow-lg hover:shadow-xl"
                    } ${color.textClass} font-bold text-sm flex items-center justify-center`}
                  >
                    {getColorDisplayName(color.id)}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* RECORRÊNCIA */}
            <div className="space-y-3">
              <Label className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-600" />
                Repetir nos dias (opcional)
              </Label>

              <div className="grid grid-cols-4 gap-2">
                {weekDayOptions.map((day) => (
                  <motion.button
                    key={day.id}
                    type="button"
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleWeekDay(day.id)}
                    className={`h-14 rounded-xl font-bold transition-all duration-300 ${
                      formData.recurrence.includes(day.id)
                        ? "bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg scale-105"
                        : "bg-white text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {day.shortName}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* BOTÃO CRIAR */}
            <Button
              type="submit"
              disabled={createTaskMutation.isPending}
              className="w-full h-16 text-xl font-black bg-gradient-to-r from-green-500 to-green-700 rounded-2xl shadow-2xl"
            >
              {createTaskMutation.isPending ? "Criando..." : "Criar Tarefa"}
            </Button>
          </form>
        </Card>
      </div>

      {/* MODAL DO TIME PICKER IOS */}
      {showTimePicker && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end"
          onClick={() => setShowTimePicker(false)}
        >
          <div
            className="bg-white w-full rounded-t-3xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-center mb-4">
              Selecionar Horário
            </h2>

            <TimePickerIOS
              value={formData.time}
              onChange={(v) =>
                setFormData((prev) => ({ ...prev, time: v }))
              }
            />

            <button
              onClick={() => setShowTimePicker(false)}
              className="w-full bg-blue-600 text-white font-bold mt-4 p-4 rounded-xl"
            >
              Confirmar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
