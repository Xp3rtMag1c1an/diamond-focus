
import { motion } from 'framer-motion';
import { getInningStatus } from '../../utils/helpers';
import { InningInfo } from '../../types';

interface InningTimelineProps {
  innings: InningInfo[];
  selectedInning: number;
  handleInningSelect: (inning: number) => void;
}

const InningTimeline = ({ innings, selectedInning, handleInningSelect }: InningTimelineProps) => {
  return (
    <div className="mb-6 overflow-x-auto hide-scrollbar">
      <div className="flex space-x-2 py-2 min-w-max">
        {innings.map(inning => (
          <motion.button
            key={inning.number}
            onClick={() => handleInningSelect(inning.number)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={`relative px-4 py-2 rounded-lg font-jersey text-xs flex flex-col items-center ${
              selectedInning === inning.number 
                ? 'bg-baseball-green text-white' 
                : getInningStatus(inning.number) === 'completed'
                  ? 'bg-baseball-navy/20 text-baseball-navy dark:bg-baseball-navy/40 dark:text-baseball-cream'
                  : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
            }`}
          >
            <span>{inning.number}</span>
            <span className="text-[10px] opacity-80">{inning.label}</span>
            {getInningStatus(inning.number) === 'active' && (
              <motion.div 
                className="absolute -top-1 -right-1 w-3 h-3 bg-baseball-green rounded-full"
                animate={{ 
                  boxShadow: ['0 0 0 rgba(39, 174, 96, 0)', '0 0 8px rgba(39, 174, 96, 0.8)', '0 0 0 rgba(39, 174, 96, 0)'] 
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default InningTimeline;
