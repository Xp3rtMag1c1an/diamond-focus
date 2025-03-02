
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, TaskCategory, TaskPriority, UserStats } from '../types';
import { generateId, canSwitchToOffense, generateEnergyForecast, playSound } from '../utils/helpers';
import { toast } from "sonner";
import { TaskService } from '../services/taskService';
import { supabase } from '../services/supabase';

interface TaskContextType {
  tasks: Task[];
  activeTasks: Task[];
  completedTasks: Task[];
  userStats: UserStats | null;
  addTask: (title: string, description: string, category: TaskCategory, inning?: number, priority?: TaskPriority) => void;
  completeTask: (id: string) => void;
  deleteTask: (id: string) => void;
  isOffenseEnabled: boolean;
  energyForecast: { level: 'high' | 'medium' | 'low', message: string };
  requestBreak: () => void;
  loading: boolean;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [energyForecast, setEnergyForecast] = useState(generateEnergyForecast());
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  
  // Check for authenticated user
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUserId(session.user.id);
      } else {
        // For demo purposes, create a temporary user ID
        // In a real app, you'd redirect to login
        const tempId = localStorage.getItem('tempUserId') || generateId();
        localStorage.setItem('tempUserId', tempId);
        setUserId(tempId);
      }
    };
    
    checkUser();
  }, []);
  
  // Load tasks from Supabase when user is available
  useEffect(() => {
    const loadTasks = async () => {
      if (!userId) return;
      
      setLoading(true);
      try {
        // Fetch tasks
        const fetchedTasks = await TaskService.getTasks(userId);
        setTasks(fetchedTasks);
        
        // Fetch or create user stats
        const stats = await TaskService.getUserStats(userId);
        setUserStats(stats);
        
        // Set up real-time subscription
        const subscription = TaskService.subscribeToTasks(userId, (updatedTasks) => {
          setTasks(updatedTasks);
          // Update stats when tasks change
          TaskService.updateUserStats(userId, updatedTasks).then(updatedStats => {
            if (updatedStats) setUserStats(updatedStats);
          });
        });
        
        // Generate energy forecast
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
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load your tasks. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    if (userId) {
      loadTasks();
    }
  }, [userId]);
  
  // Calculate if offense is enabled (requires 3 completed defense tasks)
  const isOffenseEnabled = canSwitchToOffense(tasks);
  
  // Filter active and completed tasks
  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);
  
  // Add a new task
  const addTask = async (
    title: string, 
    description: string, 
    category: TaskCategory, 
    inning?: number,
    priority: TaskPriority = 'not_urgent_important'
  ) => {
    if (!userId) {
      toast.error("You need to be logged in to add tasks");
      return;
    }
    
    if (category === 'offense' && !isOffenseEnabled) {
      toast.error("Complete 3 defense tasks to unlock offense mode");
      return;
    }
    
    setLoading(true);
    try {
      const newTask = await TaskService.addTask(
        userId,
        title,
        description,
        category,
        inning,
        priority
      );
      
      if (newTask) {
        toast.success(`New ${category} task added`);
        playSound('add');
      } else {
        toast.error('Failed to add task');
      }
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to add task. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Mark a task as complete
  const completeTask = async (id: string) => {
    if (!userId) {
      toast.error("You need to be logged in to complete tasks");
      return;
    }
    
    setLoading(true);
    try {
      const taskToComplete = tasks.find(task => task.id === id);
      if (!taskToComplete) {
        toast.error("Task not found");
        return;
      }
      
      const updatedTask = await TaskService.updateTask(id, { 
        completed: true,
        completion_percentage: 100
      });
      
      if (updatedTask) {
        toast.success(`${taskToComplete.category === 'offense' ? 'Offense' : 'Defense'} task completed!`);
        playSound('complete');
        
        // Check if this completion enables offense mode
        const completedDefenseTasks = tasks.filter(
          task => task.category === 'defense' && task.completed
        ).length;
        
        if (taskToComplete.category === 'defense' && completedDefenseTasks === 2) {
          // This will be the 3rd defense task (adding 1 for the current task)
          toast.success("Offense mode unlocked! You can now add offense tasks.", {
            duration: 5000
          });
          playSound('switch');
        }
      } else {
        toast.error('Failed to complete task');
      }
    } catch (error) {
      console.error('Error completing task:', error);
      toast.error('Failed to complete task. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Delete a task
  const deleteTask = async (id: string) => {
    if (!userId) {
      toast.error("You need to be logged in to delete tasks");
      return;
    }
    
    setLoading(true);
    try {
      const success = await TaskService.deleteTask(id);
      
      if (success) {
        toast.info("Task removed");
      } else {
        toast.error('Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task. Please try again.');
    } finally {
      setLoading(false);
    }
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
    userStats,
    addTask,
    completeTask,
    deleteTask,
    isOffenseEnabled,
    energyForecast,
    requestBreak,
    loading
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
