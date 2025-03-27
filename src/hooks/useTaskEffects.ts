
import { useState, useEffect } from 'react';
import { Task, UserStats } from '../types';
import { supabase } from '../services/supabase';
import { TaskService } from '../services/taskService';
import { generateEnergyForecast } from '../utils/helpers';
import { toast } from 'sonner';

interface UseTaskEffectsResult {
  tasks: Task[];
  userStats: UserStats | null;
  energyForecast: { level: 'high' | 'medium' | 'low', message: string };
  loading: boolean;
  userId: string | null;
}

export const useTaskEffects = (): UseTaskEffectsResult => {
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
        const tempId = localStorage.getItem('tempUserId') || Math.random().toString(36).substring(2, 15);
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
  
  return {
    tasks,
    userStats,
    energyForecast,
    loading,
    userId
  };
};
