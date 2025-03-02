
import { motion } from 'framer-motion';
import { Task } from '../../types';

interface EisenhowerMatrixOverlayProps {
  showOverlay: boolean;
  tasks: Task[];
}

const EisenhowerMatrixOverlay = ({ showOverlay, tasks }: EisenhowerMatrixOverlayProps) => {
  if (!showOverlay) return null;
  
  // Count tasks by Eisenhower category
  const urgentImportantTasks = tasks.filter(task => task.priority === 'urgent_important').length;
  const notUrgentImportantTasks = tasks.filter(task => task.priority === 'not_urgent_important').length;
  const urgentNotImportantTasks = tasks.filter(task => task.priority === 'urgent_not_important').length;
  const notUrgentNotImportantTasks = tasks.filter(task => task.priority === 'not_urgent_not_important').length;
  
  return (
    <motion.div 
      className="absolute inset-0 pointer-events-none z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Grid with the 4 quadrants */}
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
        {/* Urgent & Important (Home Plate) - Red */}
        <div className="border-r border-b border-white/20 relative overflow-hidden">
          <motion.div 
            className="absolute inset-0 bg-red-500/20"
            animate={{ boxShadow: ['0 0 0px rgba(239, 68, 68, 0.2)', '0 0 15px rgba(239, 68, 68, 0.4)', '0 0 0px rgba(239, 68, 68, 0.2)'] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <div className="absolute bottom-2 right-2 text-xs font-jersey bg-black/30 text-white px-2 py-1 rounded">
            Urgent & Important: {urgentImportantTasks}
          </div>
        </div>
        
        {/* Not Urgent & Important (1st Base) - Blue */}
        <div className="border-l border-b border-white/20 relative overflow-hidden">
          <motion.div 
            className="absolute inset-0 bg-blue-500/20"
            animate={{ boxShadow: ['0 0 0px rgba(59, 130, 246, 0.2)', '0 0 15px rgba(59, 130, 246, 0.4)', '0 0 0px rgba(59, 130, 246, 0.2)'] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <div className="absolute bottom-2 left-2 text-xs font-jersey bg-black/30 text-white px-2 py-1 rounded">
            Not Urgent & Important: {notUrgentImportantTasks}
          </div>
        </div>
        
        {/* Urgent & Not Important (2nd Base) - Yellow */}
        <div className="border-r border-t border-white/20 relative overflow-hidden">
          <motion.div 
            className="absolute inset-0 bg-yellow-500/20"
            animate={{ boxShadow: ['0 0 0px rgba(234, 179, 8, 0.2)', '0 0 15px rgba(234, 179, 8, 0.4)', '0 0 0px rgba(234, 179, 8, 0.2)'] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <div className="absolute top-2 right-2 text-xs font-jersey bg-black/30 text-white px-2 py-1 rounded">
            Urgent & Not Important: {urgentNotImportantTasks}
          </div>
        </div>
        
        {/* Not Urgent & Not Important (3rd Base) - Gray */}
        <div className="border-l border-t border-white/20 relative overflow-hidden">
          <motion.div 
            className="absolute inset-0 bg-gray-500/20"
            animate={{ boxShadow: ['0 0 0px rgba(107, 114, 128, 0.2)', '0 0 15px rgba(107, 114, 128, 0.4)', '0 0 0px rgba(107, 114, 128, 0.2)'] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <div className="absolute top-2 left-2 text-xs font-jersey bg-black/30 text-white px-2 py-1 rounded">
            Not Urgent & Not Important: {notUrgentNotImportantTasks}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EisenhowerMatrixOverlay;
