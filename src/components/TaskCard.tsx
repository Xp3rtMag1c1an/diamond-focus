
import { CheckCircle, Clock, Target, Shield } from 'lucide-react';
import { Task } from '../types';
import { useTasks } from '../context/TaskContext';
import { formatDate } from '../utils/helpers';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { completeTask, deleteTask } = useTasks();
  
  return (
    <div className={`task-card ${task.completed ? 'bg-gray-50' : ''} rounded-xl border ${task.category === 'offense' ? 'border-baseball-navy/10' : 'border-baseball-green/10'}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center">
          <div className={`p-1.5 rounded-lg mr-3 ${task.category === 'offense' ? 'bg-baseball-navy/10 text-baseball-navy' : 'bg-baseball-green/10 text-baseball-green'}`}>
            {task.category === 'offense' ? <Target size={18} /> : <Shield size={18} />}
          </div>
          <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
            {task.title}
          </h3>
        </div>
        
        {task.inning && (
          <div className="flex items-center text-xs text-gray-500">
            <Clock size={14} className="mr-1" />
            <span>Inning {task.inning}</span>
          </div>
        )}
      </div>
      
      <p className={`text-sm mb-4 ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
        {task.description}
      </p>
      
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">{formatDate(task.createdAt)}</span>
        
        <div className="flex gap-2">
          {!task.completed && (
            <button
              onClick={() => completeTask(task.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded ${task.category === 'offense' ? 'bg-baseball-navy text-white' : 'bg-baseball-green text-white'} transition-all hover:opacity-90`}
            >
              <span className="flex items-center">
                <CheckCircle size={14} className="mr-1.5" />
                Complete
              </span>
            </button>
          )}
          
          <button
            onClick={() => deleteTask(task.id)}
            className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded transition-all hover:bg-gray-200"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
