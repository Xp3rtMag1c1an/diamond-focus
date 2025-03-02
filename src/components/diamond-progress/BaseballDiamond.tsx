
import { motion, AnimatePresence } from 'framer-motion';
import { BaseballBase, BaseballBall } from '../BaseballIcons';

interface BaseballDiamondProps {
  basePosition: number;
  runnerPositions: number[];
  showRunnerGlow: boolean;
  energyLevel: 'high' | 'medium' | 'low';
  showFireworks: boolean;
}

const BaseballDiamond = ({ 
  basePosition, 
  runnerPositions, 
  showRunnerGlow, 
  energyLevel, 
  showFireworks 
}: BaseballDiamondProps) => {
  
  // Get glow color based on energy level
  const getGlowColor = () => {
    switch (energyLevel) {
      case 'high': return 'shadow-[0_0_15px_rgba(39,174,96,0.8)]';
      case 'medium': return 'shadow-[0_0_12px_rgba(243,156,18,0.7)]';
      case 'low': return 'shadow-[0_0_10px_rgba(231,76,60,0.6)]';
    }
  };
  
  return (
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
  );
};

export default BaseballDiamond;
