import { useState } from "react";
import { Pencil, Check, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { motion } from "framer-motion";

const colorLabels = {
  all: { name: "Geral", editable: false, textColor: "text-gray-900" },
  red: { name: "Trabalho", editable: true, textColor: "text-red-600" },
  yellow: { name: "Estudos", editable: true, textColor: "text-yellow-600" },
  blue: { name: "Pessoal", editable: true, textColor: "text-blue-600" },
  green: { name: "Saúde", editable: true, textColor: "text-green-600" }
};

export default function CategoryNameEditor({ selectedFilter, categoryNames, onUpdateName }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");

  const currentCategory = colorLabels[selectedFilter];
  const displayName = categoryNames[selectedFilter] || currentCategory.name;

  const handleStartEdit = () => {
    if (!currentCategory.editable) return;
    setEditValue(displayName);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editValue.trim()) {
      onUpdateName(selectedFilter, editValue.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue("");
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4">
      <div className="flex items-center justify-center gap-3">
        {isEditing ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="h-10 text-lg font-bold text-center"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") handleCancel();
              }}
            />
            <Button
              size="icon"
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-600 h-10 w-10"
            >
              <Check className="w-5 h-5" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={handleCancel}
              className="h-10 w-10"
            >
              <X className="w-5 h-5" />
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3"
          >
            <h2 className={`text-2xl font-black ${currentCategory.textColor}`}>
              {displayName}
            </h2>
            {currentCategory.editable ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleStartEdit}
                className="h-8 w-8"
              >
                <Pencil className="w-4 h-4 text-gray-600" />
              </Button>
            ) : (
              <div className="w-8" /> 
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}