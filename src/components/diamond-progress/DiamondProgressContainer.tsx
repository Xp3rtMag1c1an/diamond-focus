
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Layers } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { getCurrentInning, getInnings, getInningStatus } from '../../utils/helpers';
import ScoreboardHeader from './ScoreboardHeader';
import InningTimeline from './InningTimeline';
import BaseballDiamond from './BaseballDiamond';
import StatsDisplay from './StatsDisplay';
import OutsCountDisplay from './OutsCountDisplay';
import MidInningReview from './MidInningReview';
import AdrenalineRush from './AdrenalineRush';
import QuickStatsSummary from './QuickStatsSummary';
import EisenhowerMatrixOverlay from './EisenhowerMatrixOverlay';

const DiamondProgressContainer = () => {
  const { tasks } = useTasks();
  const currentInning = getCurrentInning();
  const innings = getInnings();
  
  // State for animations and broadcast elements
  const [showMidInningReview, setShowMidInningReview] = useState(false);
  const [showAdrenalineRush, setShowAdrenalineRush] = useState(false);
  const [runnerPositions, setRunnerPositions] = useState<number[]>([]);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [selectedInning, setSelectedInning] = useState(currentInning);
  const [showRunnerGlow, setShowRunnerGlow] = useState(false);
  const [energyLevel, setEnergyLevel] = useState<'high' | 'medium' | 'low'>('medium');
  const [showFireworks, setShowFireworks] = useState(false);
  const [showEisenhowerMatrix, setShowEisenhowerMatrix] = useState(false);
  
  // Calculate completion percentage
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  // Calculate offense and defense stats
  const offenseTasks = tasks.filter(task => task.category === 'offense');
  const defenseTasks = tasks.filter(task => task.category === 'defense');
  const completedOffense = offenseTasks.filter(task => task.completed).length;
  const completedDefense = defenseTasks.filter(task => task.completed).length;
  
  // Determine base positions (0 = no base, 1 = first base, 2 = second base, 3 = third base, 4 = home)
  const basePosition = Math.min(4, Math.floor(completionPercentage / 25));
  
  // Handle inning selection
  const handleInningSelect = (inning: number) => {
    setSelectedInning(inning);
    // Add logic here to filter tasks for the selected inning
  };

  // Initialize runner positions based on completed tasks
  useEffect(() => {
    // Set initial runner positions based on completed tasks
    const newPositions = [];
    for (let i = 0; i < Math.min(3, completedTasks); i++) {
      newPositions.push(i + 1); // 1 = first base, 2 = second base, 3 = third base
    }
    setRunnerPositions(newPositions);
    
    // Determine energy level based on completion percentage
    if (completionPercentage < 40) {
      setEnergyLevel('low');
    } else if (completionPercentage < 70) {
      setEnergyLevel('medium');
    } else {
      setEnergyLevel('high');
    }
    
    // Show runner glow after positions are set
    setShowRunnerGlow(true);
  }, [completedTasks, completionPercentage]);
  
  // Trigger mid-inning review at intervals
  useEffect(() => {
    // Show mid-inning review every hour
    const interval = setInterval(() => {
      setShowMidInningReview(true);
      setTimeout(() => setShowMidInningReview(false), 10000); // Hide after 10 seconds
    }, 60 * 60 * 1000); // Every hour
    
    return () => clearInterval(interval);
  }, []);
  
  // Check if user needs adrenaline rush (comeback mechanic)
  useEffect(() => {
    const isBehindOnTasks = totalTasks > 0 && (completedTasks / totalTasks) < 0.4;
    
    if (isBehindOnTasks && !showAdrenalineRush) {
      setShowAdrenalineRush(true);
      setBroadcastMessage("ADRENALINE RUSH ACTIVATED! Complete tasks in the next 10 minutes for bonus points!");
      
      // Disable adrenaline rush after 10 minutes
      setTimeout(() => {
        setShowAdrenalineRush(false);
        setBroadcastMessage("");
      }, 10 * 60 * 1000);
    }
  }, [completedTasks, totalTasks, showAdrenalineRush]);
  
  // Random baseball broadcast messages
  useEffect(() => {
    const messages = [
      "And the count is full...",
      "Runner in scoring position!",
      "Looking to advance the runner...",
      "Trying to get on base with two outs...",
      "Solid contact on that one!",
      "That's a quality at-bat!",
      "The pitcher looks dialed in today",
      "Beautiful day for baseball at the ballpark",
      "Manager checking the bullpen options",
      "Line drive up the middle!",
    ];
    
    // Update broadcast message every 30 seconds
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * messages.length);
      setBroadcastMessage(messages[randomIndex]);
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setBroadcastMessage("");
      }, 5000);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Check if we've reached a home run (100% completion)
  useEffect(() => {
    if (completionPercentage >= 100 && !showFireworks) {
      setShowFireworks(true);
      setTimeout(() => setShowFireworks(false), 5000);
    }
  }, [completionPercentage, showFireworks]);
  
  // Toggle Eisenhower Matrix overlay
  const handleToggleEisenhowerMatrix = () => {
    setShowEisenhowerMatrix(!showEisenhowerMatrix);
  };
  
  return (
    <div className="glass-panel rounded-3xl overflow-hidden animate-fade-in">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-jersey">Game Progress</h2>
          <button 
            onClick={handleToggleEisenhowerMatrix}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors ${
              showEisenhowerMatrix 
                ? 'bg-baseball-navy text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
            }`}
            title="Toggle Eisenhower Matrix View"
          >
            <Layers size={16} />
            <span className="font-jersey">Eisenhower View</span>
          </button>
        </div>
        
        {/* Broadcast Message Banner - pass as props */}
        <ScoreboardHeader 
          broadcastMessage={broadcastMessage} 
          showAdrenalineRush={showAdrenalineRush} 
        />
        
        {/* Inning Timeline */}
        <InningTimeline 
          innings={innings} 
          selectedInning={selectedInning} 
          handleInningSelect={handleInningSelect} 
        />
        
        {/* MLB-Style Scoreboard */}
        <div className="mb-6 overflow-hidden rounded-xl border-2 border-baseball-navy dark:border-baseball-cream">
          <div className="bg-baseball-navy text-white p-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="font-jersey text-lg mr-2">DIAMOND FOCUS</span>
                <motion.div 
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="bg-baseball-red px-2 py-1 rounded text-xs"
                >
                  LIVE
                </motion.div>
              </div>
              <div className="flex items-center">
                <Clock size={16} className="mr-1" />
                <span className="text-sm">INNING {selectedInning}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-black p-4">
            <div className="grid grid-cols-9 gap-1 mb-4">
              {innings.map(inning => (
                <div key={inning.number} className="text-center">
                  <div className="text-xs text-gray-400 font-jersey">{inning.number}</div>
                  <motion.div 
                    className={`w-full h-3 mt-1 rounded-full overflow-hidden`}
                    initial={{ backgroundColor: "#333" }}
                    animate={{ 
                      backgroundColor: getInningStatus(inning.number) === 'active' 
                        ? "#27ae60" 
                        : getInningStatus(inning.number) === 'completed' 
                          ? "#1e8449" 
                          : "#333"
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    {getInningStatus(inning.number) === 'active' && (
                      <motion.div 
                        className="h-full bg-white/30"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
                      />
                    )}
                  </motion.div>
                </div>
              ))}
            </div>
            
            {/* Baseball Diamond Component with Eisenhower Matrix Overlay */}
            <div className="relative">
              <AnimatePresence>
                <EisenhowerMatrixOverlay 
                  showOverlay={showEisenhowerMatrix} 
                  tasks={tasks} 
                />
              </AnimatePresence>
              
              <BaseballDiamond
                basePosition={basePosition}
                runnerPositions={runnerPositions}
                showRunnerGlow={showRunnerGlow}
                energyLevel={energyLevel}
                showFireworks={showFireworks}
              />
            </div>
            
            {/* Stats Display */}
            <StatsDisplay tasks={tasks} />
            
            {/* Outs, Count Display */}
            <OutsCountDisplay
              completedTasks={completedTasks}
              totalTasks={totalTasks}
              isBehindOnTasks={totalTasks > 0 && (completedTasks / totalTasks) < 0.4}
            />
          </div>
        </div>
        
        {/* Mid-Inning Review */}
        <MidInningReview
          showMidInningReview={showMidInningReview}
          completedTasks={completedTasks}
          totalTasks={totalTasks}
          completedOffense={completedOffense}
          offenseTasks={offenseTasks}
          completedDefense={completedDefense}
          defenseTasks={defenseTasks}
          currentInning={currentInning}
        />
        
        {/* Adrenaline Rush - Comeback Mechanics */}
        <AdrenalineRush showAdrenalineRush={showAdrenalineRush} />
        
        {/* Quick Stats Summary */}
        <QuickStatsSummary
          completedDefense={completedDefense}
          defenseTasks={defenseTasks.length}
          completedOffense={completedOffense}
          offenseTasks={offenseTasks.length}
        />
      </div>
      
      <div className="bg-baseball-green px-6 py-4 text-white text-sm font-medium flex justify-between items-center">
        <span className="font-jersey">Currently: Inning {currentInning}</span>
        <div className="bg-black/30 px-3 py-1 rounded-lg text-xs uppercase tracking-wider font-jersey">
          {currentInning <= 3 ? 'Morning' : currentInning <= 6 ? 'Afternoon' : 'Evening'}
        </div>
      </div>
    </div>
  );
};

export default DiamondProgressContainer;
