
import { useTasks } from '../context/TaskContext';
import { getCurrentInning, getInnings, getInningStatus } from '../utils/helpers';
import { BaseballBase, BaseballBall } from './BaseballIcons';

const DiamondProgress = () => {
  const { tasks } = useTasks();
  const currentInning = getCurrentInning();
  const innings = getInnings();
  
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
  
  // Calculate OPS-like productivity metric (simplified)
  // On-base percentage: Completed tasks / Total tasks
  // Slugging: Weighting to offense tasks (1.5x) vs defense tasks (1x)
  const onBasePercentage = totalTasks > 0 ? completedTasks / totalTasks : 0;
  const slugging = totalTasks > 0 ? 
    ((completedDefense * 1) + (completedOffense * 1.5)) / totalTasks : 0;
  
  const ops = (onBasePercentage + slugging).toFixed(3);
  
  // Calculate batting average (completed tasks / total tasks)
  const battingAverage = totalTasks > 0 ? (completedTasks / totalTasks).toFixed(3) : '.000';
  
  // Determine hot streak status
  // For demo purposes, a streak of 5+ tasks is considered "hot"
  const isHotStreak = streak >= 5;
  
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
  
  return (
    <div className="glass-panel rounded-3xl overflow-hidden animate-fade-in">
      <div className="p-6">
        <h2 className="text-lg font-jersey mb-6">Game Progress</h2>
        
        {/* Baseball Diamond Visualization */}
        <div className="relative w-full aspect-square max-w-[280px] mx-auto mb-8">
          {/* Baseball Field Background */}
          <div className="absolute inset-0 rounded-full overflow-hidden bg-baseball-green/20 diamond-field">
            <div className="absolute inset-0 bg-grass-texture opacity-20 mix-blend-overlay"></div>
            
            {/* Infield Diamond */}
            <div className="absolute top-1/2 left-1/2 w-3/5 h-3/5 -translate-x-1/2 -translate-y-1/2 rotate-45 border-4 border-baseball-chalk/70"></div>
            
            {/* Pitcher's Mound */}
            <div className="absolute top-1/2 left-1/2 w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-baseball-dirt/40"></div>
            
            {/* Base Lines */}
            <div className="field-line absolute top-1/2 left-1/2 w-1/2 -translate-y-1/2"></div>
            <div className="field-line absolute top-1/2 left-1/2 h-1/2 -translate-x-1/2"></div>
            <div className="field-line absolute top-1/2 right-1/2 w-1/2 -translate-y-1/2 rotate-180"></div>
            <div className="field-line absolute bottom-1/2 left-1/2 h-1/2 -translate-x-1/2 rotate-180"></div>
            
            {/* Home Plate */}
            <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 w-6 h-6">
              <BaseballBase className={`base ${basePosition === 0 ? 'active animate-pulse-soft' : ''}`} />
            </div>
            
            {/* First Base */}
            <div className="absolute top-1/2 right-[15%] -translate-y-1/2 w-6 h-6">
              <BaseballBase className={`base ${basePosition >= 1 ? 'active' : ''}`} />
            </div>
            
            {/* Second Base */}
            <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-6 h-6">
              <BaseballBase className={`base ${basePosition >= 2 ? 'active' : ''}`} />
            </div>
            
            {/* Third Base */}
            <div className="absolute top-1/2 left-[15%] -translate-y-1/2 w-6 h-6">
              <BaseballBase className={`base ${basePosition >= 3 ? 'active' : ''}`} />
            </div>
            
            {/* Runner Animation */}
            {basePosition > 0 && (
              <div className="absolute w-6 h-6 z-10 animate-base-run" 
                  style={{
                    animationDelay: '0.3s',
                    animationDuration: '2s',
                    animationIterationCount: 'infinite',
                    bottom: '15%',
                    left: 'calc(50% - 12px)'
                  }}>
                <BaseballBall className="text-baseball-navy" />
              </div>
            )}
          </div>
          
          {/* Scoreboard-style Completion Percentage */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-baseball-navy text-white px-4 py-2 rounded-t-xl shadow-md">
            <div className="flex items-center justify-center">
              <div className="scoreboard-label mr-2">PROGRESS</div>
              <div className="scoreboard-digit font-jersey">{Math.round(completionPercentage)}%</div>
            </div>
          </div>
        </div>
        
        {/* OPS-Style Productivity Stats */}
        <div className="scoreboard mb-8 overflow-hidden rounded-xl">
          <div className="bg-baseball-navy/90 px-3 py-2 text-xs uppercase tracking-wider text-white/70 flex justify-between">
            <span className="font-jersey">Productivity Stats</span>
            <span>Today</span>
          </div>
          
          <div className="bg-black/80 p-4 grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="scoreboard-label font-jersey">OPS</div>
              <div className="scoreboard-digit text-lg">{ops}</div>
            </div>
            <div>
              <div className="scoreboard-label font-jersey">STREAK</div>
              <div className="scoreboard-digit text-lg flex items-center justify-center">
                {streak} {isHotStreak && <span className="ml-1 text-baseball-red animate-pulse-soft">🔥</span>}
              </div>
            </div>
            <div>
              <div className="scoreboard-label font-jersey">DONE</div>
              <div className="scoreboard-digit text-lg">{completedTasks}</div>
            </div>
          </div>
        </div>
        
        {/* New Batting Average Display */}
        <div className="mb-8 overflow-hidden rounded-xl">
          <div className="bg-baseball-navy/90 px-3 py-2 text-xs uppercase tracking-wider text-white/70">
            <span className="font-jersey">Player Stats</span>
          </div>
          
          <div className="bg-black/80 p-4 flex justify-between items-center">
            <div className="flex flex-col items-center">
              <div className="scoreboard-label font-jersey">AVG</div>
              <div className="scoreboard-digit text-xl">{battingAverage}</div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="scoreboard-label font-jersey">HRs</div>
              <div className="scoreboard-digit text-xl">{completedOffense}</div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="scoreboard-label font-jersey">RBIs</div>
              <div className="scoreboard-digit text-xl">{completedTasks}</div>
            </div>
            
            <div className="flex items-center">
              <div className="scoreboard-label font-jersey mr-1">STATUS</div>
              <div className="bg-gray-800 rounded-lg px-3 py-1 text-sm font-jersey text-white flex items-center">
                {isHotStreak ? (
                  <>HOT <span className="ml-1 text-baseball-red">🔥</span></>
                ) : (
                  'ACTIVE'
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Leaderboard */}
        <div className="mb-8 overflow-hidden rounded-xl">
          <div className="bg-baseball-navy/90 px-3 py-2 text-xs uppercase tracking-wider text-white/70">
            <span className="font-jersey">League Standings</span>
          </div>
          
          <div className="bg-black/80">
            {leaderboardData.map((player, index) => (
              <div 
                key={player.name} 
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
              </div>
            ))}
          </div>
        </div>
        
        {/* Offense/Defense Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
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
        
        <h3 className="text-sm font-jersey mb-4">Today's Innings</h3>
        
        <div className="scoreboard overflow-hidden rounded-xl mb-4">
          <div className="bg-black/80 py-2 px-4 grid grid-cols-9 gap-1">
            {innings.map(inning => (
              <div key={inning.number} className="text-center">
                <div className="text-xs text-gray-400 font-jersey">{inning.number}</div>
                <div className={`w-full h-1 mt-1 rounded-full ${
                  getInningStatus(inning.number) === 'active' ? 'bg-baseball-green' :
                  getInningStatus(inning.number) === 'completed' ? 'bg-baseball-darkGreen' : 'bg-gray-700'
                }`}></div>
              </div>
            ))}
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
