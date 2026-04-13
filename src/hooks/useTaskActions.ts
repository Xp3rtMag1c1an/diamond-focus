
import { Task, TaskCategory, TaskPriority } from '../types';
import { generateId, playSound } from '../utils/helpers';
import { toast } from 'sonner';

interface UseTaskActionsProps {
  userId: string | null;
  isOffenseEnabled: boolean;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export const useTaskActions = ({ userId, isOffenseEnabled, setTasks }: UseTaskActionsProps) => {
  // Add a new task
  const addTask = (
    title: string,
    description: string,
    category: TaskCategory,
    inning?: number,
    priority: TaskPriority = 'not_urgent_important'
  ) => {
    if (!userId) {
      toast.error("Unable to add task — no user ID");
      return;
    }

    const newTask: Task = {
      id: generateId(),
      user_id: userId,
      title,
      description,
      category,
      priority,
      inning,
      completed: false,
      completion_percentage: 0,
      createdAt: new Date(),
    };

    setTasks(prev => [...prev, newTask]);
    toast.success(`New ${category} task added`);
    playSound('add');
  };

  // Mark a task as complete
  const completeTask = (id: string, tasks: Task[]) => {
    const taskToComplete = tasks.find(task => task.id === id);
    if (!taskToComplete) {
      toast.error("Task not found");
      return;
    }

    // Enforce the 3-defense-task gate for offense tasks
    if (taskToComplete.category === 'offense' && !isOffenseEnabled) {
      toast.error("You need to complete at least 3 DEFENSE tasks first!");
      return;
    }

    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { ...task, completed: true, completion_percentage: 100, updated_at: new Date() }
          : task
      )
    );

    toast.success(`${taskToComplete.category === 'offense' ? 'Offense' : 'Defense'} task completed!`);
    playSound('complete');

    // Check if this completion unlocks offense mode
    const completedDefenseTasks = tasks.filter(
      task => task.category === 'defense' && task.completed
    ).length;

    if (taskToComplete.category === 'defense' && completedDefenseTasks === 2) {
      toast.success("Offense mode unlocked! You can now complete offense tasks.", {
        duration: 5000
      });
      playSound('switch');
    }
  };

  // Delete a task
  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    toast.info("Task removed");
  };

  return {
    addTask,
    completeTask,
    deleteTask
  };
};
