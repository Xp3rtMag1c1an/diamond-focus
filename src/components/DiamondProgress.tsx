
import { useState, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import { getCurrentInning, getInnings, getInningStatus, calculateBattingAverage, calculateOPS, isOnHotStreak } from '../utils/helpers';
import { BaseballBase, BaseballBall } from './BaseballIcons';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ArrowRight, Activity, TrendingUp, Award, Star, Bell } from 'lucide-react';

const DiamondProgress = () => {
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
  
  // Calculate streaks (completed tasks in a row)
  const streak = tasks.filter(t => t.completed).length > 0 ? 
    tasks.filter(t => t.completed).slice(0, tasks.findIndex(t => !t.completed)).length : 
    0;
  
  // Calculate MLB-style stats
  const battingAverage = calculateBattingAverage(tasks);
  const ops = calculateOPS(tasks);
  const isHotStreak = isOnHotStreak(tasks);
  
  // Calculate on-base percentage (task efficiency)
  const onBasePercentage = totalTasks > 0 ? (completedTasks / totalTasks).toFixed(3) : '.000';
  
  // Determine if user is behind on tasks (for comeback mechanics)
  const isBehindOnTasks = totalTasks > 0 && (completedTasks / totalTasks) < 0.4;
  
  // Mock leaderboard data
  const leaderboardData = [
    { name: "You", ops: parseFloat(ops), position: 3 },
    { name: "Alex", ops: 1.245, position: 1 },
    { name: "Jordan", ops: 1.102, position: 2 },
    { name: "Taylor", ops: 0.875, position: 4 },
    { name: "Casey", ops: 0.764, position: 5 }
  ];
  
  // Sort leaderboard data by OPS
  leaderboardData.sort((a, b) => b.ops - a.ops);
  
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
    if (isBehindOnTasks && !showAdrenalineRush) {
      setShowAdrenalineRush(true);
      setBroadcastMessage("ADRENALINE RUSH ACTIVATED! Complete tasks in the next 10 minutes for bonus points!");
      
      // Disable adrenaline rush after 10 minutes
      setTimeout(() => {
        setShowAdrenalineRush(false);
        setBroadcastMessage("");
      }, 10 * 60 * 1000);
    }
  }, [isBehindOnTasks]);
  
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
  
  // Handle inning selection
  const handleInningSelect = (inning: number) => {
    setSelectedInning(inning);
    // Add logic here to filter tasks for the selected inning
  };
  
  // Check if we've reached a home run (100% completion)
  useEffect(() => {
    if (completionPercentage >= 100 && !showFireworks) {
      setShowFireworks(true);
      setTimeout(() => setShowFireworks(false), 5000);
    }
  }, [completionPercentage]);
  
  // Get glow color based on energy level
  const getGlowColor = () => {
    switch (energyLevel) {
      case 'high': return 'shadow-[0_0_15px_rgba(39,174,96,0.8)]';
      case 'medium': return 'shadow-[0_0_12px_rgba(243,156,18,0.7)]';
      case 'low': return 'shadow-[0_0_10px_rgba(231,76,60,0.6)]';
    }
  };
  
  return (
    <div className="glass-panel rounded-3xl overflow-hidden animate-fade-in">
      <div className="p-6">
        <h2 className="text-lg font-jersey mb-6">Game Progress</h2>
        
        {/* Broadcast Message Banner */}
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
        
        {/* Inning Timeline - Stadium Lights Control Panel */}
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
            
            {/* Enhanced Baseball Diamond */}
            <div className="relative w-full aspect-square max-w-[240px] mx-auto mb-6">
              {/* Diamond Field Background */}
              <motion.div 
                className="absolute inset-5 rotate-45 bg-[#27ae60]/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                {/* Grass Texture */}
                <div className="absolute inset-0 bg-[url('/grass-texture.jpg')] opacity-10 bg-cover mix-blend-overlay" />
                
                {/* Field Lines */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/60" />
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/60" />
                <div className="absolute top-0 bottom-0 left-0 w-0.5 bg-white/60" />
                <div className="absolute top-0 bottom-0 right-0 w-0.5 bg-white/60" />
              </motion.div>
              
              {/* Diamond Shape */}
              <div className="absolute inset-2 rotate-45 border-2 border-baseball-chalk/50" />
              
              {/* Home Plate */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex justify-center items-center">
                <motion.div 
                  initial={{ scale: 1 }}
                  animate={{ scale: basePosition === 0 ? [1, 1.1, 1] : 1 }}
                  transition={{ duration: 1, repeat: basePosition === 0 ? Infinity : 0 }}
                >
                  <BaseballBase className={`w-6 h-6 ${basePosition === 0 ? 'active animate-pulse-soft' : ''}`} />
                </motion.div>
              </div>
              
              {/* First Base */}
              <div className="absolute top-1/2 right-0 -translate-y-1/2">
                <motion.div
                  initial={{ opacity: basePosition >= 1 ? 1 : 0.4 }}
                  animate={{ opacity: basePosition >= 1 ? 1 : 0.4 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.1 }}
                  className="relative group"
                >
                  <BaseballBase className={`w-6 h-6 ${basePosition >= 1 ? 'active' : ''}`} />
                  
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 bg-black/80 text-white text-xs rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    <p className="font-bold mb-1">First Base</p>
                    <p>25% completion</p>
                  </div>
                </motion.div>
              </div>
              
              {/* Second Base */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2">
                <motion.div
                  initial={{ opacity: basePosition >= 2 ? 1 : 0.4 }}
                  animate={{ opacity: basePosition >= 2 ? 1 : 0.4 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.1 }}
                  className="relative group"
                >
                  <BaseballBase className={`w-6 h-6 ${basePosition >= 2 ? 'active' : ''}`} />
                  
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 bg-black/80 text-white text-xs rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    <p className="font-bold mb-1">Second Base</p>
                    <p>50% completion</p>
                  </div>
                </motion.div>
              </div>
              
              {/* Third Base */}
              <div className="absolute top-1/2 left-0 -translate-y-1/2">
                <motion.div
                  initial={{ opacity: basePosition >= 3 ? 1 : 0.4 }}
                  animate={{ opacity: basePosition >= 3 ? 1 : 0.4 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.1 }}
                  className="relative group"
                >
                  <BaseballBase className={`w-6 h-6 ${basePosition >= 3 ? 'active' : ''}`} />
                  
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 bg-black/80 text-white text-xs rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    <p className="font-bold mb-1">Third Base</p>
                    <p>75% completion</p>
                  </div>
                </motion.div>
              </div>
              
              {/* Enhanced Runners with Energy Glow */}
              <AnimatePresence>
                {runnerPositions.map((position, index) => (
                  <motion.div 
                    key={`runner-${index}`}
                    className="absolute z-10"
                    initial={{ 
                      bottom: position === 1 ? "10%" : position === 2 ? "50%" : "70%",
                      left: position === 1 ? "60%" : position === 2 ? "50%" : "30%",
                      opacity: 0
                    }}
                    animate={{ 
                      bottom: position === 1 ? "10%" : position === 2 ? "70%" : "50%",
                      left: position === 1 ? "70%" : position === 2 ? "50%" : "30%",
                      opacity: 1
                    }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.8, type: "spring" }}
                  >
                    <motion.div
                      className={`${showRunnerGlow ? getGlowColor() : ''} rounded-full p-1`}
                      animate={showRunnerGlow ? { scale: [1, 1.08, 1] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <BaseballBall className="w-5 h-5 text-baseball-cream" />
                    </motion.div>
                    
                    {/* Dust Cloud Animation when runner stops */}
                    <motion.div
                      className="absolute inset-0 bg-white/30 rounded-full"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 1.5], opacity: [0, 0.5, 0] }}
                      transition={{ duration: 0.5, delay: 0.7 }}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {/* Home Run Fireworks Animation */}
              <AnimatePresence>
                {showFireworks && (
                  <>
                    {[...Array(12)].map((_, i) => (
                      <motion.div
                        key={`firework-${i}`}
                        className="absolute"
                        style={{
                          top: `${20 + Math.random() * 60}%`,
                          left: `${20 + Math.random() * 60}%`,
                        }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ 
                          scale: [0, 1 + Math.random() * 0.5],
                          opacity: [0, 0.8, 0]
                        }}
                        transition={{ 
                          duration: 0.8 + Math.random() * 0.5,
                          delay: Math.random() * 0.5
                        }}
                        exit={{ opacity: 0 }}
                      >
                        <div className={`w-2 h-2 rounded-full ${
                          ['bg-baseball-red', 'bg-baseball-green', 'bg-baseball-cream', 'bg-baseball-navy'][Math.floor(Math.random() * 4)]
                        }`} />
                      </motion.div>
                    ))}
                    
                    <motion.div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-jersey text-3xl text-baseball-red whitespace-nowrap z-20"
                      initial={{ scale: 0, opacity: 0, rotate: -5 }}
                      animate={{ 
                        scale: [0, 1.2, 1],
                        opacity: [0, 1, 1, 0],
                        rotate: [-10, 5, -5]
                      }}
                      transition={{ duration: 3 }}
                      exit={{ opacity: 0 }}
                    >
                      HOME RUN!
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            
            {/* Enhanced Stats Display */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <motion.div 
                className="bg-black/40 p-3 rounded-lg text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                whileHover={{ y: -3, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
              >
                <div className="flex items-center justify-center gap-1 mb-1">
                  <TrendingUp size={14} className="text-baseball-green" />
                  <span className="text-xs text-gray-400 uppercase">AVG</span>
                </div>
                <div className="text-xl font-bold text-white">{battingAverage}</div>
              </motion.div>
              
              <motion.div 
                className="bg-black/40 p-3 rounded-lg text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ y: -3, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
              >
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Activity size={14} className="text-baseball-navy" />
                  <span className="text-xs text-gray-400 uppercase">OPS</span>
                </div>
                <div className="text-xl font-bold text-white">{ops}</div>
              </motion.div>
              
              <motion.div 
                className="bg-black/40 p-3 rounded-lg text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ y: -3, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
              >
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Award size={14} className="text-baseball-red" />
                  <span className="text-xs text-gray-400 uppercase">Streak</span>
                </div>
                <div className="text-xl font-bold text-white flex items-center justify-center">
                  {streak}
                  {isHotStreak && (
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="ml-1 text-baseball-red"
                    >
                      <Star size={16} className="fill-baseball-red" />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>
            
            {/* Outs, Count Display */}
            <div className="flex justify-between items-center bg-black/40 p-3 rounded-lg mb-4">
              <div>
                <span className="text-xs text-gray-400 uppercase">Outs</span>
                <div className="flex mt-1 gap-2">
                  {[...Array(2)].map((_, i) => (
                    <motion.div 
                      key={i} 
                      className={`w-4 h-4 rounded-full ${
                        i < (isBehindOnTasks ? 2 : 0) ? 'bg-baseball-red' : 'bg-gray-700'
                      }`}
                      animate={i < (isBehindOnTasks ? 2 : 0) ? {
                        boxShadow: ['0 0 0 rgba(231, 76, 60, 0)', '0 0 5px rgba(231, 76, 60, 0.8)', '0 0 0 rgba(231, 76, 60, 0)']
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  ))}
                </div>
              </div>
              
              <div>
                <span className="text-xs text-gray-400 uppercase">On Base</span>
                <div className="text-baseball-cream font-bold">
                  {onBasePercentage}
                </div>
              </div>
              
              <div>
                <span className="text-xs text-gray-400 uppercase">Count</span>
                <div className="flex gap-1 text-white">
                  <motion.span 
                    className="font-bold"
                    key={completedTasks}
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 0.5 }}
                  >
                    {completedTasks}
                  </motion.span>
                  <span>-</span>
                  <span className="font-bold">{totalTasks - completedTasks}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mid-Inning Review */}
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
        
        {/* Adrenaline Rush - Comeback Mechanics */}
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
        
        {/* League Standings / Leaderboard */}
        <div className="mb-8 overflow-hidden rounded-xl">
          <div className="bg-baseball-navy/90 px-3 py-2 text-xs uppercase tracking-wider text-white/70 flex justify-between items-center">
            <span className="font-jersey">League Standings</span>
            <motion.div 
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="bg-baseball-red px-2 py-0.5 rounded-full text-white text-xs"
            >
              LIVE
            </motion.div>
          </div>
          
          <div className="bg-black/80">
            {leaderboardData.map((player, index) => (
              <motion.div 
                key={player.name} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                className={`flex justify-between items-center px-4 py-3 border-b border-gray-800 last:border-0 ${
                  player.name === "You" ? "bg-baseball-green/20" : ""
                }`}
              >
                <div className="flex items-center">
                  <div className="w-6 text-center font-jersey text-gray-400">{index + 1}</div>
                  <div className="font-jersey ml-3">{player.name}</div>
                  {player.name === "You" && <span className="ml-2 text-xs bg-gray-700 px-2 py-0.5 rounded-full">You</span>}
                </div>
                <div className="flex items-center">
                  <div className="scoreboard-digit mr-3">{player.ops.toFixed(3)}</div>
                  {index === 0 && (
                    <motion.span 
                      className="text-yellow-400"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 5, repeat: Infinity }}
                    >
                      🏆
                    </motion.span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Quick Stats Summary */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.div 
            className="neumorph-inset p-4 text-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1 font-jersey">Defense</h3>
            <p className="text-xl font-semibold">
              <span className="scoreboard-digit mr-1">{completedDefense}</span> / {defenseTasks.length}
            </p>
          </motion.div>
          <motion.div 
            className="neumorph-inset p-4 text-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1 font-jersey">Offense</h3>
            <p className="text-xl font-semibold">
              <span className="scoreboard-digit mr-1">{completedOffense}</span> / {offenseTasks.length}
            </p>
          </motion.div>
        </div>
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

export default DiamondProgress;
