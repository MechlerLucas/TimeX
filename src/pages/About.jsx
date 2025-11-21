import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

import { ArrowLeft, Github } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "../lib/utils";
import { motion } from "framer-motion";
import BottomNav from "../components/layout/BottomNav";

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 pb-24">
      {/* Fixed Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(createPageUrl("Home"))}
              className="rounded-full"
            >
              <ArrowLeft className="w-6 h-6 text-gray-900" />
            </Button>
            <div>
              <h1 className="text-2xl font-black text-gray-900">Sobre</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <Card className="shadow-2xl border-0 bg-white p-12">
          <div className="text-center space-y-8">
            {/* GitHub Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="w-32 h-32 bg-gray-900 rounded-full flex items-center justify-center shadow-2xl">
                <Github className="w-20 h-20 text-white" />
              </div>
            </motion.div>

            {/* Developer Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <h2 className="text-3xl font-black text-gray-900">
                Desenvolvido por
              </h2>
              <p className="text-4xl font-black text-blue-600">
                Lucas M. Fernandes
              </p>
            </motion.div>

            {/* GitHub Link */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <a
                href="https://github.com/mechlerlucas"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="w-20 h-20 bg-gray-900 hover:bg-gray-800 rounded-full shadow-xl"
                >
                  <Github className="w-10 h-10" />
                </Button>
              </a>
            </motion.div>

            {/* App Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="pt-8 border-t border-gray-200"
            >
              <p className="text-gray-500">
                TimeX - Aplicativo de Tarefas
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Versão 1.0.0
              </p>
            </motion.div>
          </div>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}
