import { Home, Info, Calendar } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "../../lib/utils";
import { motion } from "framer-motion";

export default function BottomNav({ onCalendarClick }) {
  const location = useLocation();
  
  const isActive = (pageName) => {
    return location.pathname === createPageUrl(pageName);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-30">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-around py-3">
          <Link to={createPageUrl("Home")}>
            <motion.div
              whileTap={{ scale: 0.95 }}
              className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-colors ${
                isActive("Home") ? "bg-blue-50" : ""
              }`}
            >
              <Home className={`w-6 h-6 ${isActive("Home") ? "text-blue-600" : "text-gray-600"}`} />
              <span className={`text-xs font-bold ${isActive("Home") ? "text-blue-600" : "text-gray-600"}`}>
                Início
              </span>
            </motion.div>
          </Link>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onCalendarClick}
            className="flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-colors hover:bg-gray-50"
          >
            <Calendar className="w-6 h-6 text-gray-600" />
            <span className="text-xs font-bold text-gray-600">
              Calendário
            </span>
          </motion.button>

          <Link to={createPageUrl("About")}>
            <motion.div
              whileTap={{ scale: 0.95 }}
              className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-colors ${
                isActive("About") ? "bg-green-50" : ""
              }`}
            >
              <Info className={`w-6 h-6 ${isActive("About") ? "text-green-600" : "text-gray-600"}`} />
              <span className={`text-xs font-bold ${isActive("About") ? "text-green-600" : "text-gray-600"}`}>
                Sobre
              </span>
            </motion.div>
          </Link>
        </div>
      </div>
    </div>
  );
}