import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

import { useState, useEffect } from "react";
import api from "../../api/apiClient";
import { Clock, FileText, Palette, Calendar, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const colorLabels = {
  red: { 
    defaultName: "Trabalho",
    lightBg: "from-red-50 to-red-100", 
    iconColor: "text-red-600", 
    badgeClass: "bg-red-100 text-red-700 border-red-300" 
  },
  yellow: { 
    defaultName: "Estudos",
    lightBg: "from-yellow-50 to-yellow-100", 
    iconColor: "text-yellow-600", 
    badgeClass: "bg-yellow-100 text-yellow-700 border-yellow-300" 
  },
  blue: { 
    defaultName: "Pessoal",
    lightBg: "from-blue-50 to-blue-100", 
    iconColor: "text-blue-600", 
    badgeClass: "bg-blue-100 text-blue-700 border-blue-300" 
  },
  green: { 
    defaultName: "Saúde",
    lightBg: "from-green-50 to-green-100", 
    iconColor: "text-green-600", 
    badgeClass: "bg-green-100 text-green-700 border-green-300" 
  }
};

const dayLabels = {
  monday: "Segunda",
  tuesday: "Terça",
  wednesday: "Quarta",
  thursday: "Quinta",
  friday: "Sexta",
  saturday: "Sábado",
  sunday: "Domingo",
  everyday: "Todos os dias"
};

export default function TaskDetailsDialog({ task, isOpen, onClose, onDelete }) {
  const [categoryNames, setCategoryNames] = useState({});

  useEffect(() => {
    if (isOpen) {
      loadCategoryNames();
    }
  }, [isOpen]);

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

  if (!task) return null;

  const colorInfo = colorLabels[task.color] || colorLabels.blue;
  const displayCategoryName = categoryNames[task.color] || colorInfo.defaultName;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
          
          {/* DIALOG */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed top-24 left-4 right-4 z-50 flex justify-center"
          >
            <Card className="w-full max-w-2xl max-h-[calc(100vh-8rem)] overflow-y-auto bg-white shadow-2xl">
              <div className="p-6 space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${colorInfo.lightBg} rounded-full flex items-center justify-center`}>
                      <Clock className={`w-5 h-5 ${colorInfo.iconColor}`} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Detalhes da Tarefa</h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="rounded-full"
                  >
                    <X className="w-5 h-5 text-gray-900" />
                  </Button>
                </div>

                {/* Name */}
                <div className={`bg-gradient-to-r ${colorInfo.lightBg} p-5 rounded-xl`}>
                  <div className="flex items-start gap-3">
                    <FileText className={`w-5 h-5 mt-1 ${colorInfo.iconColor}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500 mb-1">Nome da Tarefa</p>
                      <p className="text-xl font-bold text-gray-900">{task.name}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {task.description && (
                  <div className={`bg-gradient-to-r ${colorInfo.lightBg} p-5 rounded-xl`}>
                    <div className="flex items-start gap-3">
                      <FileText className={`w-5 h-5 mt-1 ${colorInfo.iconColor}`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500 mb-1">Descrição</p>
                        <p className="text-gray-700 leading-relaxed">{task.description}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Time */}
                <div className={`bg-gradient-to-r ${colorInfo.lightBg} p-5 rounded-xl`}>
                  <div className="flex items-start gap-3">
                    <Clock className={`w-5 h-5 mt-2 ${colorInfo.iconColor}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500 mb-1">Horário</p>
                      <p className="text-4xl font-bold text-gray-900">{task.time}</p>
                    </div>
                  </div>
                </div>

                {/* Color */}
                <div className={`bg-gradient-to-r ${colorInfo.lightBg} p-5 rounded-xl`}>
                  <div className="flex items-start gap-3">
                    <Palette className={`w-5 h-5 mt-1 ${colorInfo.iconColor}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500 mb-2">Classificação</p>
                      <Badge className={`${colorInfo.badgeClass} border text-base px-4 py-1.5`}>
                        {displayCategoryName}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Recurrence */}
                {task.recurrence && task.recurrence.length > 0 && (
                  <div className={`bg-gradient-to-r ${colorInfo.lightBg} p-5 rounded-xl`}>
                    <div className="flex items-start gap-3">
                      <Calendar className={`w-5 h-5 mt-1 ${colorInfo.iconColor}`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500 mb-2">Repetir nos dias</p>
                        <div className="flex flex-wrap gap-2">
                          {task.recurrence.map(day => (
                            <Badge key={day} variant="outline" className="bg-white font-medium">
                              {dayLabels[day]}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Delete Button */}
                <Button
                  variant="destructive"
                  size="lg"
                  className="w-full gap-2 text-base"
                  onClick={() => onDelete(task.id)}
                >
                  <Trash2 className="w-5 h-5" />
                  Excluir Tarefa
                </Button>

              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
