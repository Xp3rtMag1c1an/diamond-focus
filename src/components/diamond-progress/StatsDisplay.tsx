
import { motion } from 'framer-motion';
import { Activity, TrendingUp, Award, Star } from 'lucide-react';
import { calculateBattingAverage, calculateOPS, isOnHotStreak } from '../../utils/helpers';
import { Task } from '../../types';

interface StatsDisplayProps {
  tasks: Task[];
}

const StatsDisplay = ({ tasks }: StatsDisplayProps) => {
  // Calculate MLB-style stats
  const battingAverage = calculateBattingAverage(tasks);
  const ops = calculateOPS(tasks);
  const isHotStreak = isOnHotStreak(tasks);
  
  // Calculate streaks (completed tasks in a row)
  const streak = tasks.filter(t => t.completed).length > 0 ? 
    tasks.filter(t => t.completed).slice(0, tasks.findIndex(t => !t.completed)).length : 
    0;
    
  return (
    <div className="grid grid-cols-3 gap-3 mb-4">
      <motion.div 
        className="bg-black/40 p-3 rounded-lg text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        whileHover={{ y: -3, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      >
        <div className="flex items-center justify-center gap-1 mb-1">
          <TrendingUp size={14} className="text-baseball-green" />
          <span className="text-xs text-gray-400 uppercase">AVG</span>
        </div>
        <div className="text-xl font-bold text-white">{battingAverage}</div>
      </motion.div>
      
      <motion.div 
        className="bg-black/40 p-3 rounded-lg text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        whileHover={{ y: -3, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      >
        <div className="flex items-center justify-center gap-1 mb-1">
          <Activity size={14} className="text-baseball-navy" />
          <span className="text-xs text-gray-400 uppercase">OPS</span>
        </div>
        <div className="text-xl font-bold text-white">{ops}</div>
      </motion.div>
      
      <motion.div 
        className="bg-black/40 p-3 rounded-lg text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        whileHover={{ y: -3, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      >
        <div className="flex items-center justify-center gap-1 mb-1">
          <Award size={14} className="text-baseball-red" />
          <span className="text-xs text-gray-400 uppercase">Streak</span>
        </div>
        <div className="text-xl font-bold text-white flex items-center justify-center">
          {streak}
          {isHotStreak && (
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="ml-1 text-baseball-red"
            >
              <Star size={16} className="fill-baseball-red" />
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default StatsDisplay;
