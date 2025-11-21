import { motion, AnimatePresence } from "framer-motion";
import { X, Home, Settings, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../lib/utils";
import { Button } from "../components/ui/button";

export default function Sidebar({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
          
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed left-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-50"
          >
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-gray-900">Menu</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="rounded-full"
                >
                  <X className="w-6 h-6 text-gray-900" />
                </Button>
              </div>

              <nav className="space-y-2">
                <Link to={createPageUrl("Home")} onClick={onClose}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-blue-50 transition-colors"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Home className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="text-lg font-bold text-gray-900">Início</span>
                  </motion.div>
                </Link>

                <Link to={createPageUrl("Settings")} onClick={onClose}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-purple-50 transition-colors"
                  >
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Settings className="w-6 h-6 text-purple-600" />
                    </div>
                    <span className="text-lg font-bold text-gray-900">Configurações</span>
                  </motion.div>
                </Link>

                <Link to={createPageUrl("About")} onClick={onClose}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-green-50 transition-colors"
                  >
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Info className="w-6 h-6 text-green-600" />
                    </div>
                    <span className="text-lg font-bold text-gray-900">Sobre</span>
                  </motion.div>
                </Link>
              </nav>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}