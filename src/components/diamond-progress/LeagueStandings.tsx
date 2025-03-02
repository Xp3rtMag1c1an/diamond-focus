
import { motion } from 'framer-motion';

const LeagueStandings = () => {
  // Mock leaderboard data
  const leaderboardData = [
    { name: "You", ops: 1.045, position: 3 },
    { name: "Alex", ops: 1.245, position: 1 },
    { name: "Jordan", ops: 1.102, position: 2 },
    { name: "Taylor", ops: 0.875, position: 4 },
    { name: "Casey", ops: 0.764, position: 5 }
  ];
  
  // Sort leaderboard data by OPS
  leaderboardData.sort((a, b) => b.ops - a.ops);
  
  return (
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
  );
};

export default LeagueStandings;
