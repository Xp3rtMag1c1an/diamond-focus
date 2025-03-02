
import { useEffect } from 'react';
import { useTasks } from '../../context/TaskContext';
import DiamondProgressContainer from './DiamondProgressContainer';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';

// This is the main component that will be imported by other components
const DiamondProgress = () => {
  const { tasks } = useTasks();
  
  // Calculate completion percentage
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  // Side effects from the original component
  useEffect(() => {
    // This effect or other critical effects from the original component can be kept here
    // For example, checking if we've reached a home run (100% completion)
    if (completionPercentage >= 100) {
      // Trigger home run celebrations or other effects
      console.log("Home run achieved!");
    }
  }, [completionPercentage]);
  
  return (
    <DiamondProgressContainer />
  );
};

export default DiamondProgress;
