
import React, { createContext, useContext } from 'react';
import { Task, TaskCategory, TaskPriority, UserStats } from '../types';
import { canSwitchToOffense } from '../utils/helpers';
import { useTaskEffects } from '../hooks/useTaskEffects';
import { useTaskActions } from '../hooks/useTaskActions';
import { useBreak } from '../hooks/useBreak';

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
  const { tasks, setTasks, userStats, energyForecast, loading, userId } = useTaskEffects();

  const isOffenseEnabled = canSwitchToOffense(tasks);

  const { addTask, completeTask, deleteTask } = useTaskActions({
    userId,
    isOffenseEnabled,
    setTasks
  });

  const { requestBreak } = useBreak();

  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  const value = {
    tasks,
    activeTasks,
    completedTasks,
    userStats,
    addTask,
    completeTask: (id: string) => completeTask(id, tasks),
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
