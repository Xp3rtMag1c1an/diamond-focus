
import { useTasks } from '../context/TaskContext';
import { getCurrentInning, getInnings, getInningStatus } from '../utils/helpers';

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
  
  return (
    <div className="glass-panel rounded-3xl overflow-hidden animate-fade-in">
      <div className="p-6">
        <h2 className="text-lg font-medium mb-6">Game Progress</h2>
        
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
              <div className={`base ${basePosition === 0 ? 'active animate-pulse-soft' : ''}`}></div>
            </div>
            
            {/* First Base */}
            <div className="absolute top-1/2 right-[15%] -translate-y-1/2 w-6 h-6">
              <div className={`base ${basePosition >= 1 ? 'active' : ''}`}></div>
            </div>
            
            {/* Second Base */}
            <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-6 h-6">
              <div className={`base ${basePosition >= 2 ? 'active' : ''}`}></div>
            </div>
            
            {/* Third Base */}
            <div className="absolute top-1/2 left-[15%] -translate-y-1/2 w-6 h-6">
              <div className={`base ${basePosition >= 3 ? 'active' : ''}`}></div>
            </div>
            
            {/* Runner Animation */}
            {basePosition > 0 && (
              <div className="absolute w-4 h-4 rounded-full bg-baseball-navy shadow-md z-10 
                            animate-base-run" 
                  style={{
                    animationDelay: '0.3s',
                    animationDuration: '2s',
                    animationIterationCount: 'infinite',
                    bottom: '15%',
                    left: 'calc(50% - 8px)'
                  }}>
              </div>
            )}
          </div>
          
          {/* Scoreboard-style Completion Percentage */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-baseball-navy text-white px-4 py-2 rounded-t-xl shadow-md">
            <div className="flex items-center justify-center">
              <div className="scoreboard-label mr-2">PROGRESS</div>
              <div className="scoreboard-digit">{Math.round(completionPercentage)}%</div>
            </div>
          </div>
        </div>
        
        {/* OPS-Style Productivity Stats */}
        <div className="scoreboard mb-8 overflow-hidden rounded-xl">
          <div className="bg-baseball-navy/90 px-3 py-2 text-xs uppercase tracking-wider text-white/70 flex justify-between">
            <span>Productivity Stats</span>
            <span>Today</span>
          </div>
          
          <div className="bg-black/80 p-4 grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="scoreboard-label">OPS</div>
              <div className="scoreboard-digit text-lg">{ops}</div>
            </div>
            <div>
              <div className="scoreboard-label">STREAK</div>
              <div className="scoreboard-digit text-lg">{streak}</div>
            </div>
            <div>
              <div className="scoreboard-label">DONE</div>
              <div className="scoreboard-digit text-lg">{completedTasks}</div>
            </div>
          </div>
        </div>
        
        {/* Offense/Defense Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="neumorph-inset p-4 text-center">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Defense</h3>
            <p className="text-xl font-semibold">
              <span className="scoreboard-digit mr-1">{completedDefense}</span> / {defenseTasks.length}
            </p>
          </div>
          <div className="neumorph-inset p-4 text-center">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Offense</h3>
            <p className="text-xl font-semibold">
              <span className="scoreboard-digit mr-1">{completedOffense}</span> / {offenseTasks.length}
            </p>
          </div>
        </div>
        
        <h3 className="text-sm font-medium mb-4">Today's Innings</h3>
        
        <div className="scoreboard overflow-hidden rounded-xl mb-4">
          <div className="bg-black/80 py-2 px-4 grid grid-cols-9 gap-1">
            {innings.map(inning => (
              <div key={inning.number} className="text-center">
                <div className="text-xs text-gray-400">{inning.number}</div>
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
        <span>Currently: Inning {currentInning}</span>
        <div className="bg-black/30 px-3 py-1 rounded-lg text-xs uppercase tracking-wider">
          {currentInning <= 3 ? 'Morning' : currentInning <= 6 ? 'Afternoon' : 'Evening'}
        </div>
      </div>
    </div>
  );
};

export default DiamondProgress;
