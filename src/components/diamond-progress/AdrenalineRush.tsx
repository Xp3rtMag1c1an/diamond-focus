
import { motion, AnimatePresence } from 'framer-motion';

interface AdrenalineRushProps {
  showAdrenalineRush: boolean;
}

const AdrenalineRush = ({ showAdrenalineRush }: AdrenalineRushProps) => {
  return (
    <AnimatePresence>
      {showAdrenalineRush && (
        <motion.div 
          className="mb-6 bg-baseball-red text-white p-4 rounded-xl"
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '-100%', opacity: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <h3 className="font-jersey text-lg mb-2">ADRENALINE RUSH</h3>
          <p className="text-sm mb-3">
            You're behind on tasks! Complete tasks in the next 10 minutes for bonus points!
          </p>
          <div className="flex justify-between items-center">
            <span className="text-sm">Time Remaining</span>
            <div className="bg-white/20 px-3 py-1 rounded font-bold">10:00</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdrenalineRush;
