import { createPageUrl } from "../lib/utils";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";


import React, { useState, useEffect, useRef } from "react";
import api from "../api/apiClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, ChevronLeft, ChevronRight, Pencil, Check, X, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import TaskCard from "../components/tasks/TaskCard";
import ColorFilterBar from "../components/tasks/ColorFilterBar";
import TaskDetailsDialog from "../components/tasks/TaskDetailsDialog";
import AlarmFullScreen from "../components/tasks/AlarmFullScreen";
import CalendarPicker from "../components/layout/CalendarPicker";
import BottomNav from "../components/layout/BottomNav";
import IconSelector from "../components/tasks/IconSelector";

const filterBackgrounds = {
  all: "bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50",
  red: "bg-gradient-to-br from-red-50 to-red-100",
  yellow: "bg-gradient-to-br from-yellow-50 to-yellow-100",
  blue: "bg-gradient-to-br from-blue-50 to-blue-100",
  green: "bg-gradient-to-br from-green-50 to-green-100"
};

const categoryDefaults = {
  all: { name: "Geral", editable: false, textColor: "text-gray-900", defaultIcon: "LayoutGrid" },
  red: { name: "Trabalho", editable: true, textColor: "text-red-600", defaultIcon: "Briefcase" },
  yellow: { name: "Estudos", editable: true, textColor: "text-yellow-600", defaultIcon: "BookOpen" },
  blue: { name: "Pessoal", editable: true, textColor: "text-blue-600", defaultIcon: "User" },
  green: { name: "Saúde", editable: true, textColor: "text-green-600", defaultIcon: "Heart" }
};

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedTask, setSelectedTask] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [alarmTask, setAlarmTask] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [categoryNames, setCategoryNames] = useState({});
  const [categoryIcons, setCategoryIcons] = useState({});
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [editCategoryValue, setEditCategoryValue] = useState("");
  const [showIconSelector, setShowIconSelector] = useState(false);
  const editRef = useRef(null);
  
  const queryClient = useQueryClient();

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks', selectedDate.toDateString()],
    queryFn: async () => {
      const allTasks = await api.Task.list();
      const activeTasks = allTasks.filter(t => t.active !== false);
      
      const selectedDayOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"][selectedDate.getDay()];
      
      const tasksForSelectedDay = activeTasks.filter(task => {
        if (!task.recurrence || task.recurrence.length === 0) {
          const taskCreatedDate = new Date(task.created_date);
          const taskDay = taskCreatedDate.toDateString();
          const selectedDay = selectedDate.toDateString();
          return taskDay === selectedDay;
        }
        
        if (task.recurrence.includes("everyday")) {
          return true;
        }
        
        return task.recurrence.includes(selectedDayOfWeek);
      });
      
      const sortedTasks = tasksForSelectedDay.sort((a, b) => {
        const [aHour, aMinute] = a.time.split(':').map(Number);
        const [bHour, bMinute] = b.time.split(':').map(Number);
        const aTotal = aHour * 60 + aMinute;
        const bTotal = bHour * 60 + bMinute;
        return aTotal - bTotal;
      });

      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const completions = await api.TaskCompletion.filter({ date: dateStr });
      
      const completionsMap = {};
      completions.forEach(comp => {
        completionsMap[comp.task_id] = comp.completed;
      });

      const tasksWithCompletions = sortedTasks.map(task => ({
        ...task,
        completed_today: completionsMap[task.id] || false
      }));

      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const selectedDateOnly = new Date(selectedDate);
      selectedDateOnly.setHours(0, 0, 0, 0);
      
      if (selectedDateOnly < now) {
        for (const task of tasksWithCompletions) {
          if (!task.completed_today) {
            const existing = completions.find(c => c.task_id === task.id);
            if (existing) {
              await api.TaskCompletion.update(existing.id, { completed: true });
            } else {
              await api.TaskCompletion.create({
                task_id: task.id,
                date: dateStr,
                completed: true
              });
            }
            task.completed_today = true;
          }
        }
      } else if (selectedDateOnly.getTime() === now.getTime()) {
        const currentHour = new Date().getHours();
        const currentMinute = new Date().getMinutes();
        const currentTotalMinutes = currentHour * 60 + currentMinute;

        for (const task of tasksWithCompletions) {
          const [taskHour, taskMinute] = task.time.split(':').map(Number);
          const taskTotalMinutes = taskHour * 60 + taskMinute;
          
          if (taskTotalMinutes < currentTotalMinutes && !task.completed_today) {
            const existing = completions.find(c => c.task_id === task.id);
            if (existing) {
              await api.TaskCompletion.update(existing.id, { completed: true });
            } else {
              await api.TaskCompletion.create({
                task_id: task.id,
                date: dateStr,
                completed: true
              });
            }
            task.completed_today = true;
          }
        }
      }
      
      return tasksWithCompletions;
    },
    initialData: [],
  });

  useEffect(() => {
    loadCategoryData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isEditingCategory && editRef.current && !editRef.current.contains(event.target)) {
        handleCancelEditCategory();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditingCategory]);

  const loadCategoryData = async () => {
    try {
      const categories = await api.Category.list();
      const names = {};
      const icons = {};
      categories.forEach(cat => {
        names[cat.color] = cat.name;
        icons[cat.color] = cat.icon;
      });
      setCategoryNames(names);
      setCategoryIcons(icons);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  useEffect(() => {
    requestNotificationPermission();

    const alarmChecker = setInterval(() => {
      checkForAlarms();
    }, 60000);

    checkForAlarms();

    return () => {
      clearInterval(alarmChecker);
    };
  }, []);

  useEffect(() => {
    return () => setActiveFilter("all");
  }, []);

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const checkForAlarms = async () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentDayIndex = now.getDay();
    const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const currentDay = daysOfWeek[currentDayIndex];
    const dateStr = format(now, 'yyyy-MM-dd');

    const allTasks = await api.Task.list();
    const activeTasks = allTasks.filter(t => t.active !== false);
    
    const completions = await api.TaskCompletion.filter({ date: dateStr });
    const completedTaskIds = completions.filter(c => c.completed).map(c => c.task_id);

    for (const task of activeTasks) {
      if (completedTaskIds.includes(task.id)) {
        continue;
      }

      if (task.recurrence && task.recurrence.length > 0) {
        if (!task.recurrence.includes("everyday") && !task.recurrence.includes(currentDay)) {
          continue;
        }
      } else {
        const taskCreatedDate = new Date(task.created_date);
        const today = new Date();
        if (taskCreatedDate.toDateString() !== today.toDateString()) {
          continue;
        }
      }

      const [taskHour, taskMinute] = task.time.split(':').map(Number);
      const taskTotalMinutes = taskHour * 60 + taskMinute;
      const currentTotalMinutes = currentHour * 60 + currentMinute;
      const minutesDifference = taskTotalMinutes - currentTotalMinutes;

      if ([30, 20, 10, 5, 0].includes(minutesDifference)) {
        sendNotification(task, minutesDifference);

        if (minutesDifference === 0) {
          setAlarmTask(task);
          playAlarmSound();
        }
      }
    }
  };

  const sendNotification = (task, minutesBefore) => {
    const title = minutesBefore === 0 
      ? `🔔 ${task.name} - AGORA!`
      : `⏰ ${task.name} - em ${minutesBefore} minutos`;
    
    const body = task.description || `Tarefa às ${task.time}`;

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: body,
        icon: '/icon-192.png',
        badge: '/icon-192.png'
      });
    }
  };

  const playAlarmSound = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gainNode.gain.value = 0.3;
    
    oscillator.start();
    setTimeout(() => oscillator.stop(), 200);
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowDetailsDialog(true);
  };

  const toggleCompletionMutation = useMutation({
    mutationFn: async ({ taskId, completed }) => {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const completions = await api.TaskCompletion.filter({ 
        task_id: taskId, 
        date: dateStr 
      });
      
      if (completions.length > 0) {
        await api.TaskCompletion.update(completions[0].id, { completed });
      } else {
        await api.TaskCompletion.create({
          task_id: taskId,
          date: dateStr,
          completed
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const handleToggleCompletion = (task) => {
    const newCompletedState = !task.completed_today;
    toggleCompletionMutation.mutate({ taskId: task.id, completed: newCompletedState });
  };

  const deleteTaskMutation = useMutation({
    mutationFn: (taskId) => api.Task.delete(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setShowDetailsDialog(false);
      setSelectedTask(null);
    },
  });

  const handleDeleteTask = async (taskId) => {
    deleteTaskMutation.mutate(taskId);
  };

  const handleDismissAlarm = () => {
    setAlarmTask(null);
  };

  const handlePreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleStartEditCategory = () => {
    const currentCategory = categoryDefaults[activeFilter];
    if (!currentCategory.editable) return;
    
    const displayName = categoryNames[activeFilter] || currentCategory.name;
    setEditCategoryValue(displayName);
    setIsEditingCategory(true);
  };

  const handleSaveCategory = async () => {
    if (!editCategoryValue.trim()) {
      setIsEditingCategory(false);
      return;
    }

    try {
      const categories = await api.Category.list();
      const existing = categories.find(c => c.color === activeFilter);
      
      const currentIcon = categoryIcons[activeFilter] || categoryDefaults[activeFilter].defaultIcon;

      if (existing) {
        await api.Category.update(existing.id, { name: editCategoryValue.trim(), icon: currentIcon });
      } else {
        await api.Category.create({ color: activeFilter, name: editCategoryValue.trim(), icon: currentIcon });
      }

      await loadCategoryData();
      setIsEditingCategory(false);
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleSelectIcon = async (iconName) => {
    try {
      const categories = await api.Category.list();
      const existing = categories.find(c => c.color === activeFilter);
      
      const currentName = categoryNames[activeFilter] || categoryDefaults[activeFilter].name;

      if (existing) {
        await api.Category.update(existing.id, { icon: iconName });
      } else {
        await api.Category.create({ color: activeFilter, name: currentName, icon: iconName });
      }

      await loadCategoryData();
    } catch (error) {
      console.error("Error saving icon:", error);
    }
  };

  const handleCancelEditCategory = () => {
    setIsEditingCategory(false);
    setEditCategoryValue("");
  };

  const formatDisplayDate = () => {
    const dayName = format(selectedDate, 'EEE', { locale: ptBR });
    const dateStr = format(selectedDate, 'dd/MM/yyyy');
    return `${dayName.charAt(0).toUpperCase() + dayName.slice(1)}, ${dateStr}`;
  };

  const filteredTasks = activeFilter === "all"
    ? tasks
    : tasks.filter(task => task.color === activeFilter);

  const currentBackground = filterBackgrounds[activeFilter] || filterBackgrounds.all;
  const currentCategory = categoryDefaults[activeFilter];
  const displayCategoryName = categoryNames[activeFilter] || currentCategory.name;
  const currentIcon = categoryIcons[activeFilter] || currentCategory.defaultIcon;

  return (
    <div className={`min-h-screen ${currentBackground} transition-colors duration-500 pb-24`}>
      {/* Fixed Header - Data */}
      <div className="fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePreviousDay}
              className="rounded-full"
            >
              <ChevronLeft className="w-5 h-5 text-gray-500" />
            </Button>
            
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <p className="text-xl font-bold text-gray-900">
                {formatDisplayDate()}
              </p>
            </motion.div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextDay}
              className="rounded-full"
            >
              <ChevronRight className="w-5 h-5 text-gray-500" />
            </Button>
          </div>
        </div>
      </div>

      {/* Scrollable Content com padding-top para compensar o header fixo */}
      <div className="max-w-2xl mx-auto px-4 pt-20 py-6 space-y-6 pb-32">
        {/* Color Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ColorFilterBar
            selectedFilter={activeFilter}
            onFilterChange={setActiveFilter}
            categoryIcons={categoryIcons}
          />
        </motion.div>

        {/* Category Name Display/Edit */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center"
        >
          <div ref={editRef} className="bg-white rounded-full shadow-md px-6 py-2 flex items-center gap-2">
            {isEditingCategory ? (
              <>
                <Input
                  value={editCategoryValue}
                  onChange={(e) => setEditCategoryValue(e.target.value)}
                  className="h-8 text-base font-bold text-center border-0 focus-visible:ring-1 w-32"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveCategory();
                    if (e.key === "Escape") handleCancelEditCategory();
                  }}
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setShowIconSelector(true)}
                  className="h-7 w-7"
                >
                  <Sparkles className="w-4 h-4 text-purple-600" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleSaveCategory}
                  className="h-7 w-7"
                >
                  <Check className="w-4 h-4 text-green-600" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleCancelEditCategory}
                  className="h-7 w-7"
                >
                  <X className="w-4 h-4 text-red-600" />
                </Button>
              </>
            ) : (
              <>
                <span className={`text-base font-bold ${currentCategory.textColor}`}>
                  {displayCategoryName}
                </span>
                {currentCategory.editable && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleStartEditCategory}
                    className="h-7 w-7"
                  >
                    <Pencil className="w-3 h-3 text-gray-600" />
                  </Button>
                )}
              </>
            )}
          </div>
        </motion.div>

        {/* Tasks List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredTasks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-20"
              >
                <div className="text-7xl mb-6">📋</div>
                <p className="text-2xl text-gray-600 font-bold mb-2">
                  {activeFilter === "all"
                    ? "Nenhuma tarefa para este dia"
                    : `Nenhuma tarefa em ${displayCategoryName}`}
                </p>
                <p className="text-gray-500 text-lg">
                  Clique no botão + para adicionar
                </p>
              </motion.div>
            ) : (
              filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClick={() => handleTaskClick(task)}
                  onToggleCompletion={handleToggleCompletion}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      <Link to={createPageUrl("CreateTask")}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-24 right-8 z-30"
        >
          <Button
            className="
              w-20 h-20
              rounded-full
              bg-slate-900
              shadow-[0_12px_40px_rgba(15,23,42,0.7)]
              flex items-center justify-center
              text-white text-3xl
            "
          >
            <span className="leading-none">+</span>
          </Button>
        </motion.div>
      </Link>

      <BottomNav onCalendarClick={() => setShowCalendar(true)} />
      <CalendarPicker
        isOpen={showCalendar}
        onClose={() => setShowCalendar(false)}
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
      />
      <TaskDetailsDialog
        task={selectedTask}
        isOpen={showDetailsDialog}
        onClose={() => setShowDetailsDialog(false)}
        onDelete={handleDeleteTask}
      />
      <IconSelector
        isOpen={showIconSelector}
        onClose={() => setShowIconSelector(false)}
        onSelectIcon={handleSelectIcon}
        currentIcon={currentIcon}
      />
      {alarmTask && (
        <AlarmFullScreen
          task={alarmTask}
          onDismiss={handleDismissAlarm}
        />
      )}
    </div>
  );
}