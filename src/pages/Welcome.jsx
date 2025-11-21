import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "../lib/utils";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

export default function Welcome() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(createPageUrl("Home"));
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="text-center"
      >
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1.5, repeat: Infinity }
          }}
          className="mb-8"
        >
          <Clock className="w-32 h-32 text-white mx-auto drop-shadow-2xl" />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-7xl font-black text-white drop-shadow-2xl tracking-tight"
          style={{
            fontFamily: "'Inter', sans-serif",
            letterSpacing: "-0.05em"
          }}
        >
          Time<span className="text-yellow-300">X</span>
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-xl text-white/90 mt-4 font-medium"
        >
          Seu Gerenciador de Tarefas Inteligente
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-8"
        >
          <div className="flex gap-2 justify-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0 }}
              className="w-3 h-3 bg-white rounded-full"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
              className="w-3 h-3 bg-white rounded-full"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
              className="w-3 h-3 bg-white rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}