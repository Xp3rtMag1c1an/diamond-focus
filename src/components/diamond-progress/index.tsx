import React, { useState, useEffect } from 'react';
import { useTasks } from '../../context/TaskContext';
import DiamondProgressContainer from './DiamondProgressContainer';
import { Task, InningInfo } from '../../types';
import { getInnings, getCurrentInning } from '../../utils/helpers';

const DiamondProgress = () => {
  const { tasks } = useTasks();
  const [showEisenhowerMatrix, setShowEisenhowerMatrix] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [showAdrenalineRush, setShowAdrenalineRush] = useState(false);
  const [selectedInning, setSelectedInning] = useState(1);
  const [basePosition, setBasePosition] = useState(0);
  const [runnerPositions, setRunnerPositions] = useState<number[]>([]);
  const [showRunnerGlow, setShowRunnerGlow] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [showMidInningReview, setShowMidInningReview] = useState(false);

  // Single source of truth for innings from helpers.ts
  const innings: InningInfo[] = getInnings();

  // Use the canonical inning calculation
  const currentInning = getCurrentInning();
  
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const isBehindOnTasks = totalTasks > 0 && completedTasks / totalTasks < 0.3;
  
  const completedOffense = tasks.filter(task => task.category === 'offense' && task.completed).length;
  const offenseTasks = tasks.filter(task => task.category === 'offense').length;

  const completedDefense = tasks.filter(task => task.category === 'defense' && task.completed).length;
  const defenseTasks = tasks.filter(task => task.category === 'defense').length;
  
  const energyLevel = 
    completedTasks >= 5 ? 'high' :
    completedTasks >= 2 ? 'medium' : 'low';

  // Handlers and effects
  const handleInningSelect = (inning: number) => {
    setSelectedInning(inning);
  };

  const toggleEisenhowerMatrix = () => {
    setShowEisenhowerMatrix(!showEisenhowerMatrix);
  };

  // Update some states for demo purposes
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly show broadcast messages
      if (Math.random() > 0.7 && !broadcastMessage) {
        const messages = [
          "Home run! You completed a high-priority task!",
          "Double play! You're making great progress!",
          "Strike out! Don't forget to take breaks!",
          "Perfect game in progress! Keep up the momentum!",
          "Seventh inning stretch! Time to refresh your energy!"
        ];
        setBroadcastMessage(messages[Math.floor(Math.random() * messages.length)]);
        setTimeout(() => setBroadcastMessage(''), 5000);
      }
      
      // Randomly trigger adrenaline rush
      if (Math.random() > 0.9 && !showAdrenalineRush) {
        setShowAdrenalineRush(true);
        setTimeout(() => setShowAdrenalineRush(false), 8000);
      }
      
      // Update base position based on completed tasks
      const newPosition = Math.min(4, Math.floor(completedTasks / 3));
      if (newPosition !== basePosition) {
        setBasePosition(newPosition);
        setShowRunnerGlow(true);
        setTimeout(() => setShowRunnerGlow(false), 2000);
      }
      
      // Show fireworks on home run
      if (newPosition === 4 && basePosition !== 4) {
        setShowFireworks(true);
        setTimeout(() => setShowFireworks(false), 3000);
      }
      
      // Update runner positions
      const newRunners = [];
      if (completedOffense > 0) newRunners.push(1);
      if (completedOffense > 2) newRunners.push(2);
      if (completedOffense > 4) newRunners.push(3);
      setRunnerPositions(newRunners);
      
      // Show mid-inning review
      const currentHour = new Date().getHours();
      const isReviewTime = currentHour === 12 || currentHour === 17 || currentHour === 22;
      setShowMidInningReview(isReviewTime);
      
    }, 5000);
    
    return () => clearInterval(interval);
  }, [basePosition, completedTasks, completedOffense, broadcastMessage, showAdrenalineRush]);

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
      defenseTasks={defenseTasks}
      completedOffense={completedOffense}
      offenseTasks={offenseTasks}
      completedTasks={completedTasks}
      totalTasks={totalTasks}
      isBehindOnTasks={isBehindOnTasks}
      tasks={tasks}
      showMidInningReview={showMidInningReview}
      currentInning={currentInning}
    />
  );
};

export default DiamondProgress;
