
import { Task, TaskCategory, TaskPriority } from '../types';
import { playSound } from '../utils/helpers';
import { TaskService } from '../services/taskService';
import { toast } from 'sonner';

interface UseTaskActionsProps {
  userId: string | null;
  isOffenseEnabled: boolean;
  setLoading: (loading: boolean) => void;
}

export const useTaskActions = ({ userId, isOffenseEnabled, setLoading }: UseTaskActionsProps) => {
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
  const completeTask = async (id: string, tasks: Task[]) => {
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
      
      // Check if it's an offense task and if there are enough completed defense tasks
      if (taskToComplete.category === 'offense' && !isOffenseEnabled) {
        toast.error("You need to complete at least 3 DEFENSE tasks first!");
        setLoading(false);
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
  
  return {
    addTask,
    completeTask,
    deleteTask
  };
};
