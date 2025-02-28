
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
  
  return (
    <div className="glass-panel rounded-2xl overflow-hidden animate-fade-in">
      <div className="p-6">
        <h2 className="text-lg font-medium mb-6">Game Progress</h2>
        
        <div className="flex justify-center mb-8">
          <div className="relative diamond-progress w-24 h-24 bg-gray-100 overflow-hidden">
            <div 
              className="absolute bottom-0 left-0 right-0 bg-baseball-green transition-all duration-700 ease-out"
              style={{ height: `${completionPercentage}%` }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold">{Math.round(completionPercentage)}%</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-opacity-10 bg-baseball-green rounded-lg p-4 text-center">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-1">Defense</h3>
            <p className="text-xl font-semibold">{completedDefense} / {defenseTasks.length}</p>
          </div>
          <div className="bg-opacity-10 bg-baseball-navy rounded-lg p-4 text-center">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-1">Offense</h3>
            <p className="text-xl font-semibold">{completedOffense} / {offenseTasks.length}</p>
          </div>
        </div>
        
        <h3 className="text-sm font-medium mb-4">Today's Innings</h3>
        
        <div className="flex flex-wrap gap-2 mb-2">
          {innings.slice(0, 5).map(inning => (
            <div key={inning.number} className="flex flex-col items-center">
              <div 
                className={`inning-marker ${getInningStatus(inning.number)}`}
                title={`${inning.label}: ${inning.time}`}
              ></div>
              <span className="text-xs mt-1">{inning.number}</span>
            </div>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {innings.slice(5).map(inning => (
            <div key={inning.number} className="flex flex-col items-center">
              <div 
                className={`inning-marker ${getInningStatus(inning.number)}`}
                title={`${inning.label}: ${inning.time}`}
              ></div>
              <span className="text-xs mt-1">{inning.number}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-baseball-green px-6 py-4 text-white text-sm font-medium">
        Currently: Inning {currentInning}
      </div>
    </div>
  );
};

export default DiamondProgress;
