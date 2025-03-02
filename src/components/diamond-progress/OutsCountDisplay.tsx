
import { motion } from 'framer-motion';

interface OutsCountDisplayProps {
  completedTasks: number;
  totalTasks: number;
  isBehindOnTasks: boolean;
}

const OutsCountDisplay = ({ completedTasks, totalTasks, isBehindOnTasks }: OutsCountDisplayProps) => {
  // Calculate on-base percentage (task efficiency)
  const onBasePercentage = totalTasks > 0 ? (completedTasks / totalTasks).toFixed(3) : '.000';
  
  return (
    <div className="flex justify-between items-center bg-black/40 p-3 rounded-lg mb-4">
      <div>
        <span className="text-xs text-gray-400 uppercase">Outs</span>
        <div className="flex mt-1 gap-2">
          {[...Array(2)].map((_, i) => (
            <motion.div 
              key={i} 
              className={`w-4 h-4 rounded-full ${
                i < (isBehindOnTasks ? 2 : 0) ? 'bg-baseball-red' : 'bg-gray-700'
              }`}
              animate={i < (isBehindOnTasks ? 2 : 0) ? {
                boxShadow: ['0 0 0 rgba(231, 76, 60, 0)', '0 0 5px rgba(231, 76, 60, 0.8)', '0 0 0 rgba(231, 76, 60, 0)']
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            />
          ))}
        </div>
      </div>
      
      <div>
        <span className="text-xs text-gray-400 uppercase">On Base</span>
        <div className="text-baseball-cream font-bold">
          {onBasePercentage}
        </div>
      </div>
      
      <div>
        <span className="text-xs text-gray-400 uppercase">Count</span>
        <div className="flex gap-1 text-white">
          <motion.span 
            className="font-bold"
            key={completedTasks}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 0.5 }}
          >
            {completedTasks}
          </motion.span>
          <span>-</span>
          <span className="font-bold">{totalTasks - completedTasks}</span>
        </div>
      </div>
    </div>
  );
};

export default OutsCountDisplay;
