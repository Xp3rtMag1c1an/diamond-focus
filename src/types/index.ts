
export type TaskCategory = 'offense' | 'defense';

export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  completed: boolean;
  inning?: number; // 1-9 representing morning (1-3), afternoon (4-6), evening (7-9)
  createdAt: Date;
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
