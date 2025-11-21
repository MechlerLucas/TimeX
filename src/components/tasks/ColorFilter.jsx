import { motion } from "framer-motion";

const colors = [
  { id: "all", color: "bg-gray-900", label: "Todas" },
  { id: "red", color: "bg-red-500", label: "Vermelhas" },
  { id: "yellow", color: "bg-yellow-500", label: "Amarelas" },
  { id: "blue", color: "bg-blue-500", label: "Azuis" },
  { id: "green", color: "bg-green-500", label: "Verdes" }
];

export default function ColorFilter({ activeFilter, onFilterChange }) {
  return (
    <div className="flex gap-3 items-center justify-center py-4 px-4 bg-white shadow-md rounded-2xl">
      {colors.map((colorItem) => (
        <motion.button
          key={colorItem.id}
          whileTap={{ scale: 0.9 }}
          onClick={() => onFilterChange(colorItem.id)}
          className={`${colorItem.color} w-14 h-14 rounded-xl transition-all duration-300 ${
            activeFilter === colorItem.id 
              ? "ring-4 ring-offset-2 ring-gray-800 shadow-lg" 
              : "hover:shadow-lg"
          }`}
          aria-label={colorItem.label}
        />
      ))}
    </div>
  );
}