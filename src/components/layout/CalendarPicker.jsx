import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Card } from "../ui/card";

import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CalendarPicker({ isOpen, onClose, selectedDate, onDateSelect }) {
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed top-24 left-4 right-4 z-50 flex justify-center"
          >
            <Card className="w-full max-w-md bg-white shadow-2xl">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Selecionar Data</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="rounded-full"
                  >
                    <X className="w-5 h-5 text-gray-900" />
                  </Button>
                </div>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) {
                      onDateSelect(date);
                      onClose();
                    }
                  }}
                  className="rounded-md border"
                />
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}