
import { useState } from 'react';
import { Clock, Trash2, Fire } from 'lucide-react';
import { Task } from '../types';
import { useTasks } from '../context/TaskContext';
import { formatDate } from '../utils/helpers';
import { BaseballBat, BaseballGlove, BaseballCheckmark, BaseballBall } from './BaseballIcons';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { completeTask, deleteTask } = useTasks();
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationType, setAnimationType] = useState<'homerun' | 'basehit'>(task.category === 'offense' ? 'homerun' : 'basehit');
  
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  
  const handleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Determine animation type based on task category
    const animType = task.category === 'offense' ? 'homerun' : 'basehit';
    setAnimationType(animType);
    setShowAnimation(true);
    
    // Hide animation after delay
    setTimeout(() => {
      setShowAnimation(false);
      completeTask(task.id);
    }, 2000);
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteTask(task.id);
  };
  
  return (
    <>
      {/* Home Run or Base Hit Animation */}
      {showAnimation && (
        animationType === 'homerun' ? (
          <div className="homerun-animation">
            <div className="homerun-text">HOME RUN!</div>
          </div>
        ) : (
          <div className="basehit-animation">
            <div className="flex items-center gap-2">
              <BaseballBall size={24} className="text-baseball-cream" />
              <span>Base Hit!</span>
            </div>
          </div>
        )
      )}
    
      <div 
        className={`card-container ${task.completed ? 'opacity-80' : ''} mb-5`}
        onClick={handleFlip}
      >
        <div className={`card-inner ${isFlipped ? 'rotate-y-180' : ''}`}>
          {/* Card Front - Main Task Info */}
          <div className="card-front">
            <div className={`baseball-card ${
              task.category === 'offense' 
                ? 'border-l-4 border-baseball-navy' 
                : 'border-l-4 border-baseball-green'
            }`}>
              <div className="card-texture"></div>
              
              {/* Card Header with Category Badge */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <div className={`p-2 rounded-xl mr-3 ${
                    task.category === 'offense' 
                      ? 'bg-baseball-navy/10 text-baseball-navy dark:bg-baseball-navy/30 dark:text-baseball-cream' 
                      : 'bg-baseball-green/10 text-baseball-green dark:bg-baseball-green/30 dark:text-baseball-lightGreen'
                  }`}>
                    {task.category === 'offense' ? <BaseballBat size={18} /> : <BaseballGlove size={18} />}
                  </div>
                  <h3 className={`font-jersey text-lg ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
                    {task.title}
                  </h3>
                </div>
                
                {task.inning && (
                  <div className="flex items-center text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                    <Clock size={12} className="mr-1" />
                    <span>Inning {task.inning}</span>
                  </div>
                )}
              </div>
              
              {/* Task Description */}
              <p className={`text-sm mb-4 ${task.completed ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'}`}>
                {task.description}
              </p>
              
              {/* Task Metadata and Actions */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center">
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    {formatDate(task.createdAt)}
                  </span>
                </div>
                
                <div className="flex space-x-1">
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    Flip Card
                  </button>
                </div>
              </div>
              
              {/* Card footer decoration - baseball stitch pattern */}
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-baseball-cream dark:bg-baseball-navy">
                <div className="flex justify-between px-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="w-1 h-1.5 bg-baseball-red rounded-full"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Card Back - Actions and Stats */}
          <div className="card-back">
            <div className={`baseball-card ${
              task.category === 'offense' 
                ? 'bg-baseball-navy/5 dark:bg-baseball-lightNavy/20' 
                : 'bg-baseball-green/5 dark:bg-baseball-darkGreen/20'
            }`}>
              <div className="card-texture"></div>
              
              <div className="h-full flex flex-col justify-between">
                {/* Task "Stats" */}
                <div className="mb-6">
                  <h4 className="text-sm font-jersey uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                    Task Details
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-white/50 dark:bg-white/5">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Category</p>
                      <p className="font-medium capitalize">
                        {task.category}
                      </p>
                    </div>
                    
                    <div className="p-3 rounded-xl bg-white/50 dark:bg-white/5">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
                      <p className="font-medium">
                        {task.completed ? 'Completed' : 'Active'}
                      </p>
                    </div>
                    
                    <div className="p-3 rounded-xl bg-white/50 dark:bg-white/5">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Inning</p>
                      <p className="font-medium">
                        {task.inning || 'Not assigned'}
                      </p>
                    </div>
                    
                    <div className="p-3 rounded-xl bg-white/50 dark:bg-white/5">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Created</p>
                      <p className="font-medium text-sm">
                        {formatDate(task.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Task Actions */}
                <div className="flex flex-col space-y-2">
                  {!task.completed && (
                    <button
                      onClick={handleComplete}
                      className={`w-full btn-baseball btn-3d ${
                        task.category === 'offense' ? 'btn-offense' : 'btn-defense'
                      }`}
                    >
                      <span className="flex items-center justify-center">
                        <BaseballCheckmark size={16} className="mr-2" />
                        Complete Task
                      </span>
                    </button>
                  )}
                  
                  <button
                    onClick={handleDelete}
                    className="w-full rounded-xl px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium"
                  >
                    <span className="flex items-center justify-center">
                      <Trash2 size={16} className="mr-2" />
                      Remove Task
                    </span>
                  </button>
                </div>
              </div>
              
              {/* Card footer decoration - baseball stitch pattern */}
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-baseball-cream dark:bg-baseball-navy">
                <div className="flex justify-between px-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="w-1 h-1.5 bg-baseball-red rounded-full"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskCard;
