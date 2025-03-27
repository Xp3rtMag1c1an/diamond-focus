import { useState, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import { getCurrentInning, getInnings } from '../utils/helpers';
import { Clock, Award } from 'lucide-react';
import { TaskCategory } from '../types';
import { BaseballBat, BaseballGlove } from './BaseballIcons';
import { toast } from 'sonner';

const TaskForm = () => {
  const { addTask, tasks } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>('defense');
  const [inning, setInning] = useState<number>(getCurrentInning());
  
  useEffect(() => {
    const completedTaskCount = tasks.filter(task => task.completed).length;
    
    if (completedTaskCount === 10) {
      toast.success(
        <div className="flex items-center gap-2">
          <Award className="text-yellow-400" />
          <span>Rookie Card Unlocked! New card style available.</span>
        </div>,
        { duration: 6000 }
      );
    } else if (completedTaskCount === 25) {
      toast.success(
        <div className="flex items-center gap-2">
          <Award className="text-yellow-400" />
          <span>All-Star Status Achieved! You're on the leaderboard now.</span>
        </div>,
        { duration: 6000 }
      );
    } else if (completedTaskCount === 50) {
      toast.success(
        <div className="flex items-center gap-2">
          <Award className="text-yellow-400" />
          <span>MVP Trophy Earned! Special theme unlocked.</span>
        </div>,
        { duration: 6000 }
      );
    } else if (completedTaskCount === 100) {
      toast.success(
        <div className="flex items-center gap-2">
          <Award className="text-yellow-400" />
          <span>Hall of Fame Induction! Vintage Baseball Cards Theme unlocked.</span>
        </div>,
        { duration: 8000 }
      );
    }
  }, [tasks]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    addTask(title, description, category, inning);
    
    setTitle('');
    setDescription('');
    setCategory('defense');
  };
  
  return (
    <div className="glass-panel rounded-2xl animate-fade-in">
      <div className="p-6">
        <h2 className="text-lg font-jersey mb-6">Add New Task</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Task Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-baseball-green focus:border-transparent"
              placeholder="What do you need to accomplish?"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-baseball-green focus:border-transparent"
              placeholder="Add some details..."
              rows={3}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Category
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setCategory('defense')}
                className={`flex-1 py-3 flex items-center justify-center gap-2 rounded-lg border transition-all ${
                  category === 'defense'
                    ? 'bg-baseball-green text-white border-baseball-green'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <BaseballGlove size={18} />
                <span className="font-jersey">Defense</span>
              </button>
              
              <button
                type="button"
                onClick={() => setCategory('offense')}
                className={`flex-1 py-3 flex items-center justify-center gap-2 rounded-lg border transition-all ${
                  category === 'offense'
                    ? 'bg-baseball-navy text-white border-baseball-navy'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <BaseballBat size={18} />
                <span className="font-jersey">Offense</span>
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="inning" className="block text-sm font-medium text-gray-700 mb-1">
              Assign to Inning
            </label>
            <div className="relative">
              <select
                id="inning"
                value={inning}
                onChange={(e) => setInning(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-baseball-green focus:border-transparent appearance-none"
              >
                {getInnings().map(inning => (
                  <option key={inning.number} value={inning.number}>
                    Inning {inning.number}: {inning.label} ({inning.time})
                  </option>
                ))}
              </select>
              <Clock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>
          
          <button
            type="submit"
            className={`w-full py-3 rounded-lg transition-all font-jersey ${
              category === 'offense'
                ? 'bg-baseball-navy text-white hover:bg-opacity-90'
                : 'bg-baseball-green text-white hover:bg-baseball-darkGreen'
            }`}
          >
            Add Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
