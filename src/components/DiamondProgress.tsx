
import { useState, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import { getCurrentInning, getInnings, getInningStatus, calculateBattingAverage, calculateOPS, isOnHotStreak } from '../utils/helpers';
import { BaseballBase, BaseballBall } from './BaseballIcons';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ArrowRight, Activity, TrendingUp, Award } from 'lucide-react';

const DiamondProgress = () => {
  const { tasks } = useTasks();
  const currentInning = getCurrentInning();
  const innings = getInnings();
  
  // State for animations and broadcast elements
  const [showMidInningReview, setShowMidInningReview] = useState(false);
  const [showAdrenalineRush, setShowAdrenalineRush] = useState(false);
  const [runnerPositions, setRunnerPositions] = useState<number[]>([]);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  
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
  }, [completedTasks]);
  
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
        
        {/* MLB-Style Scoreboard */}
        <div className="mb-6 overflow-hidden rounded-xl border-2 border-baseball-navy dark:border-baseball-cream">
          <div className="bg-baseball-navy text-white p-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="font-jersey text-lg mr-2">DIAMOND FOCUS</span>
                <div className="bg-black/30 px-2 py-1 rounded text-xs">LIVE</div>
              </div>
              <div className="flex items-center">
                <Clock size={16} className="mr-1" />
                <span className="text-sm">INNING {currentInning}</span>
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
            
            {/* Base Diagram */}
            <div className="relative w-full aspect-square max-w-[240px] mx-auto mb-4">
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
                  initial={{ opacity: basePosition >= 1 ? 1 : 0 }}
                  animate={{ opacity: basePosition >= 1 ? 1 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <BaseballBase className={`w-6 h-6 ${basePosition >= 1 ? 'active' : ''}`} />
                </motion.div>
              </div>
              
              {/* Second Base */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2">
                <motion.div
                  initial={{ opacity: basePosition >= 2 ? 1 : 0 }}
                  animate={{ opacity: basePosition >= 2 ? 1 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <BaseballBase className={`w-6 h-6 ${basePosition >= 2 ? 'active' : ''}`} />
                </motion.div>
              </div>
              
              {/* Third Base */}
              <div className="absolute top-1/2 left-0 -translate-y-1/2">
                <motion.div
                  initial={{ opacity: basePosition >= 3 ? 1 : 0 }}
                  animate={{ opacity: basePosition >= 3 ? 1 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <BaseballBase className={`w-6 h-6 ${basePosition >= 3 ? 'active' : ''}`} />
                </motion.div>
              </div>
              
              {/* Runners */}
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
                    <BaseballBall className="w-5 h-5 text-baseball-cream" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            {/* Stats Display */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <motion.div 
                className="bg-black/40 p-3 rounded-lg text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
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
              >
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Award size={14} className="text-baseball-red" />
                  <span className="text-xs text-gray-400 uppercase">Streak</span>
                </div>
                <div className="text-xl font-bold text-white flex items-center justify-center">
                  {streak}
                  {isHotStreak && <span className="ml-2 text-baseball-red animate-pulse">🔥</span>}
                </div>
              </motion.div>
            </div>
            
            {/* Outs, Count Display */}
            <div className="flex justify-between items-center bg-black/40 p-3 rounded-lg mb-4">
              <div>
                <span className="text-xs text-gray-400 uppercase">Outs</span>
                <div className="flex mt-1 gap-2">
                  {[...Array(2)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-4 h-4 rounded-full ${
                        i < (isBehindOnTasks ? 2 : 0) ? 'bg-baseball-red' : 'bg-gray-700'
                      }`}
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
                  <span className="font-bold">{completedTasks}</span>
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
                  {index === 0 && <span className="text-yellow-400">🏆</span>}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Quick Stats Summary */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="neumorph-inset p-4 text-center">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1 font-jersey">Defense</h3>
            <p className="text-xl font-semibold">
              <span className="scoreboard-digit mr-1">{completedDefense}</span> / {defenseTasks.length}
            </p>
          </div>
          <div className="neumorph-inset p-4 text-center">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1 font-jersey">Offense</h3>
            <p className="text-xl font-semibold">
              <span className="scoreboard-digit mr-1">{completedOffense}</span> / {offenseTasks.length}
            </p>
          </div>
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
