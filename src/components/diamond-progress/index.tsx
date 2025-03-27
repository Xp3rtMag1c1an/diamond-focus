
import { useEffect, useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import DiamondProgressContainer from './DiamondProgressContainer';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// This is the main component that will be imported by other components
const DiamondProgress = () => {
  const { tasks } = useTasks();
  const { toast } = useToast();
  const [showEisenhowerMatrix, setShowEisenhowerMatrix] = useState(false);

  // Calculate completion percentage
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  // Toggle Eisenhower Matrix overlay
  const toggleEisenhowerMatrix = () => {
    setShowEisenhowerMatrix(prev => !prev);
    toast({
      title: showEisenhowerMatrix ? "Eisenhower Matrix hidden" : "Eisenhower Matrix visible",
      description: showEisenhowerMatrix ? 
        "Switched to standard diamond view" : 
        "Now viewing tasks by urgency and importance",
      duration: 3000,
    });
  };
  
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
    <DiamondProgressContainer 
      showEisenhowerMatrix={showEisenhowerMatrix}
      toggleEisenhowerMatrix={toggleEisenhowerMatrix}
    />
  );
};

export default DiamondProgress;
