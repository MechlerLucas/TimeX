import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import { CheckCircle, Clock } from "lucide-react";

const colorBackgrounds = {
  red: "from-red-500 via-red-600 to-red-700",
  yellow: "from-yellow-400 via-yellow-500 to-amber-600",
  blue: "from-blue-500 via-blue-600 to-blue-700",
  green: "from-green-500 via-green-600 to-green-700",
  white: "from-gray-100 via-gray-200 to-gray-300"
};

export default function AlarmFullScreen({ task, onDismiss }) {
  const [countdown, setCountdown] = useState(5);
  const [canDismiss, setCanDismiss] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanDismiss(true);
    }
  }, [countdown]);

  if (!task) return null;

  const bgGradient = colorBackgrounds[task.color] || colorBackgrounds.blue;
  const isWhiteTheme = task.color === "white";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 z-50 bg-gradient-to-br ${bgGradient} flex items-center justify-center p-6`}
      >
        <div className="max-w-2xl w-full space-y-12 text-center">
          {/* Clock Icon Animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 0.8 }}
          >
            <Clock className={`w-24 h-24 mx-auto ${isWhiteTheme ? 'text-gray-700' : 'text-white'} drop-shadow-2xl`} />
          </motion.div>

          {/* Time Display */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className={`text-9xl font-black ${isWhiteTheme ? 'text-gray-800' : 'text-white'} drop-shadow-2xl mb-4`}
            >
              {task.time}
            </motion.div>
          </motion.div>

          {/* Task Name */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <h1 className={`text-5xl font-black ${isWhiteTheme ? 'text-gray-800' : 'text-white'} drop-shadow-lg`}>
              {task.name}
            </h1>
            
            {task.description && (
              <p className={`text-2xl ${isWhiteTheme ? 'text-gray-700' : 'text-white/90'} drop-shadow max-w-xl mx-auto`}>
                {task.description}
              </p>
            )}
          </motion.div>

          {/* Dismiss Button */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              size="lg"
              onClick={onDismiss}
              disabled={!canDismiss}
              className={`text-2xl px-16 py-10 rounded-3xl font-black shadow-2xl transition-all duration-300 ${
                canDismiss
                  ? isWhiteTheme 
                    ? "bg-gray-800 hover:bg-gray-900 text-white"
                    : "bg-white hover:bg-gray-100 text-gray-900"
                  : "bg-white/30 text-white/50 cursor-not-allowed"
              }`}
            >
              {canDismiss ? (
                <span className="flex items-center gap-3">
                  <CheckCircle className="w-8 h-8" />
                  OK
                </span>
              ) : (
                <span className="flex items-center gap-3">
                  <Clock className="w-8 h-8 animate-pulse" />
                  Aguarde {countdown}s
                </span>
              )}
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}