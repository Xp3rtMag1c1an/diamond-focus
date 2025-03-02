
import { motion, AnimatePresence } from 'framer-motion';

interface ScoreboardHeaderProps {
  broadcastMessage: string;
  showAdrenalineRush: boolean;
}

const ScoreboardHeader = ({ broadcastMessage, showAdrenalineRush }: ScoreboardHeaderProps) => {
  return (
    <AnimatePresence>
      {broadcastMessage && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`mb-4 p-3 rounded-lg text-white font-jersey text-center ${
            showAdrenalineRush ? 'bg-baseball-red' : 'bg-baseball-navy'
          }`}
        >
          {broadcastMessage}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScoreboardHeader;
