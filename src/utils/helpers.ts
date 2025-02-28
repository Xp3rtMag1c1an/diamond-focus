
import { InningInfo, Task, TaskCategory } from "../types";

// Generate a unique ID for tasks
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

// Get current inning based on time of day
export const getCurrentInning = (): number => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 10) return 1; // Early morning
  if (hour >= 10 && hour < 12) return 2; // Late morning
  if (hour >= 12 && hour < 14) return 3; // Early afternoon
  if (hour >= 14 && hour < 16) return 4; // Mid afternoon
  if (hour >= 16 && hour < 18) return 5; // Late afternoon
  if (hour >= 18 && hour < 19) return 6; // Early evening
  if (hour >= 19 && hour < 21) return 7; // Evening
  if (hour >= 21 && hour < 23) return 8; // Late evening
  return 9; // Night (11pm-5am)
};

// Format task date
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }).format(date);
};

// Get all innings information
export const getInnings = (): InningInfo[] => {
  return [
    { number: 1, time: '5am-10am', label: 'Early Morning' },
    { number: 2, time: '10am-12pm', label: 'Late Morning' },
    { number: 3, time: '12pm-2pm', label: 'Early Afternoon' },
    { number: 4, time: '2pm-4pm', label: 'Mid Afternoon' },
    { number: 5, time: '4pm-6pm', label: 'Late Afternoon' },
    { number: 6, time: '6pm-7pm', label: 'Early Evening' },
    { number: 7, time: '7pm-9pm', label: 'Evening' },
    { number: 8, time: '9pm-11pm', label: 'Late Evening' },
    { number: 9, time: '11pm-5am', label: 'Night' }
  ];
};

// Check if user can switch to offense mode (requires 3 completed defense tasks)
export const canSwitchToOffense = (tasks: Task[]): boolean => {
  const completedDefenseTasks = tasks.filter(
    task => task.category === 'defense' && task.completed
  ).length;
  
  return completedDefenseTasks >= 3;
};

// Generate energy forecast for the day
export const generateEnergyForecast = (): { level: 'high' | 'medium' | 'low', message: string } => {
  const levels = ['high', 'medium', 'low'] as const;
  const randomIndex = Math.floor(Math.random() * levels.length);
  const level = levels[randomIndex];
  
  const messages = {
    high: "You're at peak energy today. Great time to tackle challenging tasks!",
    medium: "Steady energy levels today. Focus on consistent progress.",
    low: "Energy might be limited today. Prioritize essential tasks and take breaks."
  };
  
  return {
    level,
    message: messages[level]
  };
};

// Get inning status (active, completed, upcoming)
export const getInningStatus = (inningNumber: number): 'active' | 'completed' | 'upcoming' => {
  const currentInning = getCurrentInning();
  
  if (inningNumber === currentInning) return 'active';
  if (inningNumber < currentInning) return 'completed';
  return 'upcoming';
};

// Play sound effect
export const playSound = (soundType: 'complete' | 'switch' | 'add'): void => {
  // Implementation would connect to system sounds
  console.log(`Playing ${soundType} sound`);
};
