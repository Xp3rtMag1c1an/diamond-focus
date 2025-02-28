
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, TaskCategory } from '../types';
import { generateId, canSwitchToOffense, generateEnergyForecast, playSound } from '../utils/helpers';
import { toast } from "sonner";

interface TaskContextType {
  tasks: Task[];
  activeTasks: Task[];
  completedTasks: Task[];
  addTask: (title: string, description: string, category: TaskCategory, inning?: number) => void;
  completeTask: (id: string) => void;
  deleteTask: (id: string) => void;
  isOffenseEnabled: boolean;
  energyForecast: { level: 'high' | 'medium' | 'low', message: string };
  requestBreak: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [energyForecast, setEnergyForecast] = useState(generateEnergyForecast());
  
  // Load tasks from localStorage on initial load
  useEffect(() => {
    const savedTasks = localStorage.getItem('diamondFocusTasks');
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        // Convert string dates back to Date objects
        const formattedTasks = parsedTasks.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt)
        }));
        setTasks(formattedTasks);
      } catch (error) {
        console.error('Error parsing tasks from localStorage:', error);
      }
    }
    
    // Generate a new energy forecast each day
    const today = new Date().toDateString();
    const lastForecastDate = localStorage.getItem('lastForecastDate');
    
    if (lastForecastDate !== today) {
      const newForecast = generateEnergyForecast();
      setEnergyForecast(newForecast);
      localStorage.setItem('lastForecastDate', today);
      localStorage.setItem('energyForecast', JSON.stringify(newForecast));
    } else {
      const savedForecast = localStorage.getItem('energyForecast');
      if (savedForecast) {
        setEnergyForecast(JSON.parse(savedForecast));
      }
    }
  }, []);
  
  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('diamondFocusTasks', JSON.stringify(tasks));
  }, [tasks]);
  
  // Save energy forecast to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('energyForecast', JSON.stringify(energyForecast));
  }, [energyForecast]);
  
  // Calculate if offense is enabled (requires 3 completed defense tasks)
  const isOffenseEnabled = canSwitchToOffense(tasks);
  
  // Filter active and completed tasks
  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);
  
  // Add a new task
  const addTask = (title: string, description: string, category: TaskCategory, inning?: number) => {
    if (category === 'offense' && !isOffenseEnabled) {
      toast.error("Complete 3 defense tasks to unlock offense mode");
      return;
    }
    
    const newTask: Task = {
      id: generateId(),
      title,
      description,
      category,
      completed: false,
      inning,
      createdAt: new Date()
    };
    
    setTasks([...tasks, newTask]);
    toast.success(`New ${category} task added`);
    playSound('add');
  };
  
  // Mark a task as complete
  const completeTask = (id: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, completed: true } : task
    );
    
    setTasks(updatedTasks);
    
    // Get the category of the completed task for the toast message
    const completedTask = tasks.find(task => task.id === id);
    if (completedTask) {
      toast.success(`${completedTask.category === 'offense' ? 'Offense' : 'Defense'} task completed!`);
      playSound('complete');
      
      // Check if this completion enables offense mode
      if (completedTask.category === 'defense') {
        const defenseTasks = updatedTasks.filter(
          task => task.category === 'defense' && task.completed
        );
        
        if (defenseTasks.length === 3) {
          toast.success("Offense mode unlocked! You can now add offense tasks.", {
            duration: 5000
          });
          playSound('switch');
        }
      }
    }
  };
  
  // Delete a task
  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast.info("Task removed");
  };
  
  // Request a break (Relief Pitcher feature)
  const requestBreak = () => {
    toast.success("Take a 5-minute break. Your Relief Pitcher is warming up!", {
      duration: 7000
    });
    
    // In a real implementation, this would schedule a notification
    setTimeout(() => {
      toast.info("Break time is over. Back to the game!", {
        duration: 7000
      });
    }, 5000); // Shortened for demo purposes (5 seconds instead of 5 minutes)
  };
  
  const value = {
    tasks,
    activeTasks,
    completedTasks,
    addTask,
    completeTask,
    deleteTask,
    isOffenseEnabled,
    energyForecast,
    requestBreak
  };
  
  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
