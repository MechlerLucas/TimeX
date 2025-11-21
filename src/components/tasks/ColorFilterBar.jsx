import React from "react";
import { motion } from "framer-motion";
import { 
  LayoutGrid, Briefcase, BookOpen, User, Heart, Home, ShoppingCart, Coffee, 
  Dumbbell, Plane, Car, Music, Camera, Palette, Sparkles,
  Star, Sun, Moon, Clock, Calendar, Bell, Mail, Phone,
  Laptop, Tv, Gamepad2, Book, Pen, Calculator, Package,
  Gift, Trophy, Target, Flag, Zap, Award, Crown, Circle
} from "lucide-react";

const iconMap = {
  LayoutGrid, Briefcase, BookOpen, User, Heart, Home, ShoppingCart, Coffee, 
  Dumbbell, Plane, Car, Music, Camera, Palette, Sparkles,
  Star, Sun, Moon, Clock, Calendar, Bell, Mail, Phone,
  Laptop, Tv, Gamepad2, Book, Pen, Calculator, Package,
  Gift, Trophy, Target, Flag, Zap, Award, Crown, Circle
};

const filterColors = [
  { id: "all", bgClass: "bg-gradient-to-br from-gray-400 to-gray-500", label: "Todas", defaultIcon: "LayoutGrid" },
  { id: "red", bgClass: "bg-gradient-to-br from-red-400 to-red-500", label: "Trabalho", defaultIcon: "Briefcase" },
  { id: "yellow", bgClass: "bg-gradient-to-br from-yellow-400 to-yellow-500", label: "Estudos", defaultIcon: "BookOpen" },
  { id: "blue", bgClass: "bg-gradient-to-br from-blue-400 to-blue-500", label: "Pessoal", defaultIcon: "User" },
  { id: "green", bgClass: "bg-gradient-to-br from-green-400 to-green-500", label: "Saúde", defaultIcon: "Heart" }
];

export default function ColorFilterBar({ selectedFilter, onFilterChange, categoryIcons = {} }) {
  const getIconComponent = (filterId) => {
    const filter = filterColors.find(f => f.id === filterId);
    const iconName = categoryIcons[filterId] || filter?.defaultIcon || "Circle";
    return iconMap[iconName] || iconMap.Circle;
  };

  return (
    <div className="flex gap-2 justify-center items-center">
      {filterColors.map((filter) => {
        const IconComponent = getIconComponent(filter.id);
        const isActive = selectedFilter === filter.id;
        
        return (
          <motion.button
            key={filter.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => onFilterChange(filter.id)}
            className={`${filter.bgClass} rounded-full p-3 w-14 h-14 flex items-center justify-center shadow-lg transition-all duration-300 ${
              isActive ? "ring-4 ring-offset-2 ring-gray-900 scale-110" : "hover:scale-105"
            }`}
          >
            <IconComponent className="w-6 h-6 text-white" strokeWidth={2.5} />
          </motion.button>
        );
      })}
    </div>
  );
}