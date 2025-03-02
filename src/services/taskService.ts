
import { supabase, parseDate } from './supabase';
import { Task, TaskCategory, TaskPriority, UserStats } from '../types';
import { calculateBattingAverage, calculateOPS, isOnHotStreak } from '../utils/helpers';

// Task CRUD operations
export const TaskService = {
  // Get all tasks for a user
  getTasks: async (userId: string): Promise<Task[]> => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId);
      
    if (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
    
    // Convert string dates to Date objects
    return (data || []).map(task => ({
      ...task,
      createdAt: parseDate(task.created_at),
    }));
  },
  
  // Add a new task
  addTask: async (
    userId: string,
    title: string,
    description: string,
    category: TaskCategory,
    inning?: number,
    priority: TaskPriority = 'not_urgent_important'
  ): Promise<Task | null> => {
    const newTask = {
      user_id: userId,
      title,
      description,
      category,
      inning,
      priority,
      completed: false,
      completion_percentage: 0,
      created_at: new Date().toISOString(),
    };
    
    const { data, error } = await supabase
      .from('tasks')
      .insert(newTask)
      .select()
      .single();
      
    if (error) {
      console.error('Error adding task:', error);
      return null;
    }
    
    return {
      ...data,
      createdAt: parseDate(data.created_at),
    };
  },
  
  // Update a task
  updateTask: async (taskId: string, updates: Partial<Task>): Promise<Task | null> => {
    // Remove createdAt if present and convert to created_at for Supabase
    const { createdAt, ...taskUpdates } = updates;
    const supabaseUpdates = {
      ...taskUpdates,
      updated_at: new Date().toISOString(),
    };
    
    const { data, error } = await supabase
      .from('tasks')
      .update(supabaseUpdates)
      .eq('id', taskId)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating task:', error);
      return null;
    }
    
    return {
      ...data,
      createdAt: parseDate(data.created_at),
    };
  },
  
  // Delete a task
  deleteTask: async (taskId: string): Promise<boolean> => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);
      
    if (error) {
      console.error('Error deleting task:', error);
      return false;
    }
    
    return true;
  },
  
  // Get user stats or create if not exists
  getUserStats: async (userId: string): Promise<UserStats | null> => {
    const today = new Date().toISOString().split('T')[0];
    
    // Try to get today's stats
    const { data, error } = await supabase
      .from('stats')
      .select('*')
      .eq('user_id', userId)
      .eq('stats_date', today)
      .single();
      
    if (!error && data) {
      return data;
    }
    
    // Get all tasks to calculate initial stats
    const tasks = await TaskService.getTasks(userId);
    
    const newStats = {
      user_id: userId,
      ops: calculateOPS(tasks),
      streak: isOnHotStreak(tasks) ? 5 : 0, // simplified for now
      completed_tasks: tasks.filter(t => t.completed).length,
      daily_inning_performance: {},
      stats_date: today,
    };
    
    // Create new stats record
    const { data: newData, error: createError } = await supabase
      .from('stats')
      .insert(newStats)
      .select()
      .single();
      
    if (createError) {
      console.error('Error creating stats:', createError);
      return null;
    }
    
    return newData;
  },
  
  // Update user stats
  updateUserStats: async (userId: string, tasks: Task[]): Promise<UserStats | null> => {
    const today = new Date().toISOString().split('T')[0];
    
    // Calculate updated stats
    const updatedStats = {
      ops: calculateOPS(tasks),
      streak: isOnHotStreak(tasks) ? 5 : 0,  // simplified
      completed_tasks: tasks.filter(t => t.completed).length,
      // We would calculate daily_inning_performance here in a real implementation
    };
    
    // Update the stats record
    const { data, error } = await supabase
      .from('stats')
      .update(updatedStats)
      .eq('user_id', userId)
      .eq('stats_date', today)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating stats:', error);
      return null;
    }
    
    return data;
  },
  
  // Set up real-time subscription for tasks
  subscribeToTasks: (userId: string, callback: (tasks: Task[]) => void) => {
    return supabase
      .channel('tasks-channel')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'tasks',
          filter: `user_id=eq.${userId}`
        },
        async () => {
          // When any task changes, fetch all tasks
          const tasks = await TaskService.getTasks(userId);
          callback(tasks);
        }
      )
      .subscribe();
  }
};
