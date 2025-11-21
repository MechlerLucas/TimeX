import React from "react";
import { 
  Briefcase, BookOpen, User, Heart, Home, ShoppingCart, Coffee, 
  Dumbbell, Plane, Car, Music, Camera, Palette, Sparkles,
  Star, Sun, Moon, Clock, Calendar, Bell, Mail, Phone,
  Laptop, Tv, Gamepad2, Book, Pen, Calculator, Package,
  Gift, Trophy, Target, Flag, Zap, Award, Crown
} from "lucide-react";
import { Button } from "../ui/button";
import { motion, AnimatePresence } from "framer-motion";

const availableIcons = [
  { name: "Briefcase", icon: Briefcase },
  { name: "BookOpen", icon: BookOpen },
  { name: "User", icon: User },
  { name: "Heart", icon: Heart },
  { name: "Home", icon: Home },
  { name: "ShoppingCart", icon: ShoppingCart },
  { name: "Coffee", icon: Coffee },
  { name: "Dumbbell", icon: Dumbbell },
  { name: "Plane", icon: Plane },
  { name: "Car", icon: Car },
  { name: "Music", icon: Music },
  { name: "Camera", icon: Camera },
  { name: "Palette", icon: Palette },
  { name: "Sparkles", icon: Sparkles },
  { name: "Star", icon: Star },
  { name: "Sun", icon: Sun },
  { name: "Moon", icon: Moon },
  { name: "Clock", icon: Clock },
  { name: "Calendar", icon: Calendar },
  { name: "Bell", icon: Bell },
  { name: "Mail", icon: Mail },
  { name: "Phone", icon: Phone },
  { name: "Laptop", icon: Laptop },
  { name: "Tv", icon: Tv },
  { name: "Gamepad2", icon: Gamepad2 },
  { name: "Book", icon: Book },
  { name: "Pen", icon: Pen },
  { name: "Calculator", icon: Calculator },
  { name: "Package", icon: Package },
  { name: "Gift", icon: Gift },
  { name: "Trophy", icon: Trophy },
  { name: "Target", icon: Target },
  { name: "Flag", icon: Flag },
  { name: "Zap", icon: Zap },
  { name: "Award", icon: Award },
  { name: "Crown", icon: Crown },
];

export default function IconSelector({ isOpen, onClose, onSelectIcon, currentIcon }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Escolher Ícone</h2>
          </div>
          
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <div className="grid grid-cols-5 gap-3">
              {availableIcons.map((item) => {
                const IconComponent = item.icon;
                const isSelected = currentIcon === item.name;
                
                return (
                  <motion.button
                    type="button"
                    key={item.name}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      onSelectIcon(item.name);
                      onClose();
                    }}
                    className={`p-3 rounded-xl transition-all ${
                      isSelected
                        ? "bg-blue-500 text-white shadow-lg scale-105"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <IconComponent className="w-6 h-6 mx-auto" />
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="p-4 border-t border-gray-200">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="w-full"
            >
              Cancelar
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export { availableIcons };