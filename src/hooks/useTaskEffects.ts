
import { useState, useEffect, useCallback } from 'react';
import { Task, UserStats } from '../types';
import { generateEnergyForecast, calculateOPS, isOnHotStreak } from '../utils/helpers';

interface UseTaskEffectsResult {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  userStats: UserStats | null;
  energyForecast: { level: 'high' | 'medium' | 'low', message: string };
  loading: boolean;
  userId: string | null;
}

const TASKS_KEY = 'diamond-focus-tasks';
const STATS_KEY = 'diamond-focus-stats';
const USER_KEY = 'diamond-focus-userId';
const FORECAST_KEY = 'diamond-focus-energyForecast';
const FORECAST_DATE_KEY = 'diamond-focus-lastForecastDate';

const loadTasks = (): Task[] => {
  try {
    const raw = localStorage.getItem(TASKS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return parsed.map((t: any) => ({
      ...t,
      createdAt: new Date(t.createdAt),
      updated_at: t.updated_at ? new Date(t.updated_at) : undefined,
    }));
  } catch {
    return [];
  }
};

const saveTasks = (tasks: Task[]) => {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
};

const computeStats = (userId: string, tasks: Task[]): UserStats => {
  return {
    user_id: userId,
    ops: calculateOPS(tasks),
    streak: isOnHotStreak(tasks) ? 5 : 0,
    completed_tasks: tasks.filter(t => t.completed).length,
    daily_inning_performance: {},
    stats_date: new Date().toISOString().split('T')[0],
  };
};

export const useTaskEffects = (): UseTaskEffectsResult => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [energyForecast, setEnergyForecast] = useState(generateEnergyForecast());
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Initialize user ID from localStorage
  useEffect(() => {
    let id = localStorage.getItem(USER_KEY);
    if (!id) {
      id = Math.random().toString(36).substring(2, 15);
      localStorage.setItem(USER_KEY, id);
    }
    setUserId(id);
  }, []);

  // Load tasks from localStorage when user is ready
  useEffect(() => {
    if (!userId) return;

    const storedTasks = loadTasks();
    setTasks(storedTasks);
    setUserStats(computeStats(userId, storedTasks));

    // Energy forecast — generate once per day, persist
    const today = new Date().toDateString();
    const lastDate = localStorage.getItem(FORECAST_DATE_KEY);

    if (lastDate !== today) {
      const newForecast = generateEnergyForecast();
      setEnergyForecast(newForecast);
      localStorage.setItem(FORECAST_DATE_KEY, today);
      localStorage.setItem(FORECAST_KEY, JSON.stringify(newForecast));
    } else {
      const saved = localStorage.getItem(FORECAST_KEY);
      if (saved) {
        try { setEnergyForecast(JSON.parse(saved)); } catch { /* keep default */ }
      }
    }

    setLoading(false);
  }, [userId]);

  // Persist tasks to localStorage whenever they change, and recompute stats
  useEffect(() => {
    if (!userId || loading) return;
    saveTasks(tasks);
    setUserStats(computeStats(userId, tasks));
  }, [tasks, userId, loading]);

  return {
    tasks,
    setTasks,
    userStats,
    energyForecast,
    loading,
    userId
  };
};
