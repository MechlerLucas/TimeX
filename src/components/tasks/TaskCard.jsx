import React from "react";
import { motion } from "framer-motion";
import { Square, CheckSquare } from "lucide-react";

const colorStyles = {
  red: {
    bg: "bg-gradient-to-r from-red-400 to-red-500",
    border: "border-red-500",
  },
  yellow: {
    bg: "bg-gradient-to-r from-yellow-400 to-yellow-500",
    border: "border-yellow-500",
  },
  blue: {
    bg: "bg-gradient-to-r from-blue-400 to-blue-500",
    border: "border-blue-500",
  },
  green: {
    bg: "bg-gradient-to-r from-green-400 to-green-500",
    border: "border-green-500",
  },
};

const TaskCard = React.forwardRef(function TaskCard(
  { task, onClick, onToggleCompletion },
  ref
) {
  const style = colorStyles[task.color] || colorStyles.blue;
  const isCompleted = task.completed_today;

  const handleCheckboxClick = (e) => {
    e.stopPropagation();
    onToggleCompletion(task);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <div
        className={`${style.bg} ${style.border} border-l-8 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 ${
          isCompleted ? "opacity-50" : ""
        }`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={handleCheckboxClick}
            className="flex-shrink-0 text-white hover:scale-110 transition-transform"
          >
            {isCompleted ? (
              <CheckSquare className="w-6 h-6" />
            ) : (
              <Square className="w-6 h-6" />
            )}
          </button>

          <div className="flex-1 pr-4">
            <h3
              className={`text-lg font-bold text-white truncate ${
                isCompleted ? "line-through" : ""
              }`}
            >
              {task.name}
            </h3>
          </div>

          <span
            className={`text-2xl font-bold text-white ${
              isCompleted ? "line-through" : ""
            }`}
          >
            {task.time}
          </span>
        </div>
      </div>
    </motion.div>
  );
});

export default TaskCard;
