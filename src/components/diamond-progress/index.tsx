
import { useEffect, useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import DiamondProgressContainer from './DiamondProgressContainer';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { InningInfo } from '../../types';

// This is the main component that will be imported by other components
const DiamondProgress = () => {
  const { tasks } = useTasks();
  const { toast } = useToast();
  const [showEisenhowerMatrix, setShowEisenhowerMatrix] = useState(false);
  const [showAdrenalineRush, setShowAdrenalineRush] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [basePosition, setBasePosition] = useState(0);
  const [runnerPositions, setRunnerPositions] = useState<number[]>([]);
  const [showRunnerGlow, setShowRunnerGlow] = useState(false);
  const [energyLevel, setEnergyLevel] = useState<'high' | 'medium' | 'low'>('medium');
  const [showFireworks, setShowFireworks] = useState(false);
  const [showMidInningReview, setShowMidInningReview] = useState(false);
  const [selectedInning, setSelectedInning] = useState(1);
  
  // Mock innings data
  const innings: InningInfo[] = [
    { number: 1, label: "1st" },
    { number: 2, label: "2nd" },
    { number: 3, label: "3rd" },
    { number: 4, label: "4th" },
    { number: 5, label: "5th" },
    { number: 6, label: "6th" },
    { number: 7, label: "7th" },
    { number: 8, label: "8th" },
    { number: 9, label: "9th" }
  ];

  // Calculate completion percentage
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  // Calculate offense/defense tasks
  const offenseTasks = tasks.filter(task => task.type === 'offense' || task.priority === 'urgent_important' || task.priority === 'not_urgent_important');
  const defenseTasks = tasks.filter(task => task.type === 'defense' || task.priority === 'urgent_not_important' || task.priority === 'not_urgent_not_important');
  const completedOffense = offenseTasks.filter(task => task.completed).length;
  const completedDefense = defenseTasks.filter(task => task.completed).length;
  
  // Determine if user is behind on tasks
  const isBehindOnTasks = totalTasks > 0 && completionPercentage < 30;
  
  // Set base position based on completion percentage
  useEffect(() => {
    if (completionPercentage >= 75) {
      setBasePosition(3);
      setRunnerPositions([1, 2, 3]);
    } else if (completionPercentage >= 50) {
      setBasePosition(2);
      setRunnerPositions([1, 2]);
    } else if (completionPercentage >= 25) {
      setBasePosition(1);
      setRunnerPositions([1]);
    } else {
      setBasePosition(0);
      setRunnerPositions([]);
    }
    
    // Set energy level based on completion
    if (completionPercentage >= 60) {
      setEnergyLevel('high');
    } else if (completionPercentage >= 30) {
      setEnergyLevel('medium');
    } else {
      setEnergyLevel('low');
    }
    
    // Show fireworks at 100%
    if (completionPercentage >= 100) {
      setShowFireworks(true);
      setBroadcastMessage('HOME RUN! All tasks completed!');
      setShowRunnerGlow(true);
    } else {
      setShowFireworks(false);
    }
    
    // Show adrenaline rush if behind
    setShowAdrenalineRush(isBehindOnTasks);
    
    // Show mid-inning review at 50%
    setShowMidInningReview(completionPercentage >= 50 && completionPercentage < 100);
    
  }, [completionPercentage, isBehindOnTasks]);
  
  // Handle inning selection
  const handleInningSelect = (inning: number) => {
    setSelectedInning(inning);
    toast({
      title: `Inning ${inning} selected`,
      description: `Viewing tasks for inning ${inning}`,
      duration: 3000,
    });
  };
  
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
      broadcastMessage={broadcastMessage}
      showAdrenalineRush={showAdrenalineRush}
      innings={innings}
      selectedInning={selectedInning}
      handleInningSelect={handleInningSelect}
      basePosition={basePosition}
      runnerPositions={runnerPositions}
      showRunnerGlow={showRunnerGlow}
      energyLevel={energyLevel}
      showFireworks={showFireworks}
      completedDefense={completedDefense}
      defenseTasks={defenseTasks.length}
      completedOffense={completedOffense}
      offenseTasks={offenseTasks.length}
      completedTasks={completedTasks}
      totalTasks={totalTasks}
      isBehindOnTasks={isBehindOnTasks}
      tasks={tasks}
      showMidInningReview={showMidInningReview}
      currentInning={selectedInning}
    />
  );
};

export default DiamondProgress;
