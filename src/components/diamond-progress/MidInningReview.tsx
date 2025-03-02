
import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '../../types';

interface MidInningReviewProps {
  showMidInningReview: boolean;
  completedTasks: number;
  totalTasks: number;
  completedOffense: number;
  offenseTasks: Task[];
  completedDefense: number;
  defenseTasks: Task[];
  currentInning: number;
}

const MidInningReview = ({ 
  showMidInningReview,
  completedTasks,
  totalTasks,
  completedOffense,
  offenseTasks,
  completedDefense,
  defenseTasks,
  currentInning
}: MidInningReviewProps) => {
  return (
    <AnimatePresence>
      {showMidInningReview && (
        <motion.div 
          className="mb-6 bg-baseball-navy text-white p-4 rounded-xl"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="font-jersey text-lg mb-2">Mid-Inning Review</h3>
          <p className="text-sm mb-3">You've completed {completedTasks} out of {totalTasks} tasks today.</p>
          
          <div className="flex justify-between text-sm">
            <div>
              <div className="text-gray-300">Offense</div>
              <div className="font-bold">{completedOffense} / {offenseTasks.length}</div>
            </div>
            <div>
              <div className="text-gray-300">Defense</div>
              <div className="font-bold">{completedDefense} / {defenseTasks.length}</div>
            </div>
            <div>
              <div className="text-gray-300">Next Up</div>
              <div className="font-bold">{currentInning < 9 ? `Inning ${currentInning + 1}` : 'Extra Innings'}</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MidInningReview;
