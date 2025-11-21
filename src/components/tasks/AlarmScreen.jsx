import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/button";
import { CheckCircle } from "lucide-react";

const colorClasses = {
  red: "from-red-400 to-red-600",
  yellow: "from-yellow-400 to-yellow-500",
  blue: "from-blue-400 to-blue-600",
  green: "from-green-400 to-green-600",
  white: "from-gray-100 to-gray-300"
};

export default function AlarmScreen({ task, onDismiss }) {
  const [countdown, setCountdown] = useState(5);
  const [canDismiss, setCanDismiss] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanDismiss(true);
    }
  }, [countdown]);

  if (!task) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 z-50 bg-gradient-to-br ${colorClasses[task.color]} flex items-center justify-center p-6`}
      >
        <div className="max-w-md w-full text-center space-y-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="space-y-4"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-8xl font-bold text-white drop-shadow-2xl"
            >
              {task.time}
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold text-white drop-shadow-lg"
            >
              {task.name}
            </motion.h1>

            {task.description && (
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xl text-white/90 drop-shadow"
              >
                {task.description}
              </motion.p>
            )}
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              size="lg"
              onClick={onDismiss}
              disabled={!canDismiss}
              className={`text-xl px-12 py-8 rounded-2xl font-bold shadow-2xl ${
                canDismiss
                  ? "bg-white hover:bg-gray-100 text-gray-900"
                  : "bg-white/50 text-gray-500 cursor-not-allowed"
              }`}
            >
              {canDismiss ? (
                <>
                  <CheckCircle className="w-6 h-6 mr-2" />
                  OK
                </>
              ) : (
                `Aguarde ${countdown}s`
              )}
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}