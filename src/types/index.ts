
export type TaskCategory = 'offense' | 'defense';

export type TaskPriority = 'urgent_important' | 'not_urgent_important' | 'urgent_not_important' | 'not_urgent_not_important';

export interface Task {
  id: string;
  user_id?: string;
  title: string;
  description: string;
  category: TaskCategory;
  type?: 'offense' | 'defense'; // Adding this property to fix the type errors
  priority?: TaskPriority;
  completed: boolean;
  completion_percentage?: number;
  inning?: number; // 1-9 representing morning (1-3), afternoon (4-6), evening (7-9)
  createdAt: Date;
  updated_at?: Date;
}

export interface InningInfo {
  number: number;
  time: string;
  label: string;
}

export interface EnergyForecast {
  level: 'high' | 'medium' | 'low';
  message: string;
}

export interface UserStats {
  id?: string;
  user_id?: string;
  ops: string;
  streak: number;
  completed_tasks: number;
  daily_inning_performance?: Record<number, number>;
  stats_date?: string;
}

export interface User {
  id: string;
  username?: string;
  email: string;
  energy_level: number;
  current_inning: number;
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'id'> & { id?: string };
        Update: Partial<User>;
      };
      tasks: {
        Row: Omit<Task, 'createdAt'> & { created_at: string };
        Insert: Omit<Task, 'id' | 'createdAt'> & { id?: string; created_at?: string };
        Update: Partial<Omit<Task, 'createdAt'> & { created_at?: string }>;
      };
      stats: {
        Row: UserStats;
        Insert: Omit<UserStats, 'id'> & { id?: string };
        Update: Partial<UserStats>;
      };
    };
  };
}
