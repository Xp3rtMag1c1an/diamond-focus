
import { useState, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import Navbar from '../components/Navbar';
import DiamondProgress from '../components/DiamondProgress';
import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';
import { BarChart3, Sun, Moon } from 'lucide-react';

const Index = () => {
  const { activeTasks, completedTasks, energyForecast } = useTasks();
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Check for system dark mode preference
  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeMediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };
    
    darkModeMediaQuery.addEventListener('change', handleChange);
    return () => darkModeMediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  // Apply dark mode class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
  
  return (
    <div className={`min-h-screen theme-transition ${isDarkMode 
      ? 'bg-baseball-navy text-baseball-cream' 
      : 'bg-baseball-cream text-baseball-navy'}`}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-diamond-field opacity-30"></div>
        <div className="absolute inset-0 bg-diamond-pattern opacity-5"></div>
      </div>
      
      <Navbar />
      
      <button 
        onClick={toggleDarkMode}
        className="fixed bottom-5 right-5 z-50 p-3 rounded-full bg-white/80 dark:bg-baseball-navy/80 shadow-md"
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>
      
      <main className="container mx-auto pt-28 pb-20 px-4 relative z-10">
        {/* Energy Forecast (Scouting Report) */}
        <div className="glass-panel mb-8 p-6 rounded-3xl animate-fade-in">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-baseball-green/10 dark:bg-baseball-green/20">
              <BarChart3 className="text-baseball-green dark:text-baseball-lightGreen" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-medium mb-1">Today's Scouting Report</h2>
              <p className="text-gray-600 dark:text-gray-300">{energyForecast.message}</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar with Diamond Progress and Task Form */}
          <div className="lg:col-span-4 space-y-8">
            <DiamondProgress />
            <TaskForm />
          </div>
          
          {/* Tasks Container */}
          <div className="lg:col-span-8 space-y-8">
            {/* Active Tasks */}
            <div className="glass-panel rounded-3xl overflow-hidden animate-fade-in">
              <div className="p-6">
                <h2 className="text-lg font-medium mb-6">Active Tasks</h2>
                
                {activeTasks.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {activeTasks.map(task => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="neumorph-inset py-8 px-4 rounded-2xl">
                      <p className="text-gray-500 dark:text-gray-400">No active tasks. Add a new task to get started!</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <div className="glass-panel rounded-3xl overflow-hidden animate-fade-in">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-medium">Completed Tasks</h2>
                    <div className="scoreboard-digit">{completedTasks.length}</div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {completedTasks.map(task => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <footer className="py-6 text-center text-sm text-gray-500 dark:text-gray-400 relative z-10">
        <p>Diamond Focus &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Index;
