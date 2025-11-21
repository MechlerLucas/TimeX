import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Badge } from "../components/ui/badge";
import { Clock, Calendar, Palette, FileText, Trash2 } from "lucide-react";
import { Button } from "../components/ui/button";

const colorNames = {
  red: "Vermelho",
  yellow: "Amarelo",
  blue: "Azul",
  green: "Verde",
  white: "Branco"
};

const dayNames = {
  monday: "Seg",
  tuesday: "Ter",
  wednesday: "Qua",
  thursday: "Qui",
  friday: "Sex",
  saturday: "Sáb",
  sunday: "Dom"
};

const colorClasses = {
  red: "bg-red-100 text-red-800 border-red-300",
  yellow: "bg-yellow-100 text-yellow-800 border-yellow-300",
  blue: "bg-blue-100 text-blue-800 border-blue-300",
  green: "bg-green-100 text-green-800 border-green-300",
  white: "bg-gray-100 text-gray-800 border-gray-300"
};

export default function TaskDetailsModal({ task, open, onClose, onDelete }) {
  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Clock className="w-6 h-6" />
            Detalhes da Tarefa
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 mt-1 text-gray-600" />
              <div>
                <p className="text-sm text-gray-500 mb-1">Nome</p>
                <p className="text-xl font-bold text-gray-900">{task.name}</p>
              </div>
            </div>
          </div>

          {task.description && (
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 mt-1 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-500 mb-1">Descrição</p>
                  <p className="text-gray-700">{task.description}</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 mt-1 text-gray-600" />
              <div>
                <p className="text-sm text-gray-500 mb-1">Horário</p>
                <p className="text-3xl font-bold text-gray-900">{task.time}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl">
            <div className="flex items-start gap-3">
              <Palette className="w-5 h-5 mt-1 text-gray-600" />
              <div>
                <p className="text-sm text-gray-500 mb-1">Classificação</p>
                <Badge className={`${colorClasses[task.color]} border text-base px-4 py-1`}>
                  {colorNames[task.color]}
                </Badge>
              </div>
            </div>
          </div>

          {task.recurrence && task.recurrence.length > 0 && (
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 mt-1 text-gray-600" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-2">Recorrência</p>
                  <div className="flex flex-wrap gap-2">
                    {task.recurrence.map((day) => (
                      <Badge key={day} variant="outline" className="bg-white">
                        {dayNames[day]}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <Button
            variant="destructive"
            className="w-full gap-2"
            onClick={() => onDelete(task.id)}
          >
            <Trash2 className="w-4 h-4" />
            Excluir Tarefa
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}