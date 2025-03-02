
import { motion } from 'framer-motion';

interface QuickStatsSummaryProps {
  completedDefense: number;
  defenseTasks: number;
  completedOffense: number;
  offenseTasks: number;
}

const QuickStatsSummary = ({ 
  completedDefense, 
  defenseTasks, 
  completedOffense, 
  offenseTasks 
}: QuickStatsSummaryProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <motion.div 
        className="neumorph-inset p-4 text-center"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <h3 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1 font-jersey">Defense</h3>
        <p className="text-xl font-semibold">
          <span className="scoreboard-digit mr-1">{completedDefense}</span> / {defenseTasks}
        </p>
      </motion.div>
      <motion.div 
        className="neumorph-inset p-4 text-center"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <h3 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1 font-jersey">Offense</h3>
        <p className="text-xl font-semibold">
          <span className="scoreboard-digit mr-1">{completedOffense}</span> / {offenseTasks}
        </p>
      </motion.div>
    </div>
  );
};

export default QuickStatsSummary;
