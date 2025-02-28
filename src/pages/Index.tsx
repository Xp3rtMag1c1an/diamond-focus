
import { useTasks } from '../context/TaskContext';
import Navbar from '../components/Navbar';
import DiamondProgress from '../components/DiamondProgress';
import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';
import { BarChart3 } from 'lucide-react';

const Index = () => {
  const { activeTasks, completedTasks, energyForecast } = useTasks();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-baseball-cream/20">
      <Navbar />
      
      <main className="container mx-auto pt-28 pb-20 px-4">
        {/* Energy Forecast (Scouting Report) */}
        <div className="glass-panel mb-8 p-6 rounded-2xl animate-fade-in">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-baseball-green/10">
              <BarChart3 className="text-baseball-green" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-medium mb-1">Today's Scouting Report</h2>
              <p className="text-gray-600">{energyForecast.message}</p>
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
            <div className="glass-panel rounded-2xl overflow-hidden animate-fade-in">
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
                    <p className="text-gray-500">No active tasks. Add a new task to get started!</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <div className="glass-panel rounded-2xl overflow-hidden animate-fade-in">
                <div className="p-6">
                  <h2 className="text-lg font-medium mb-6">Completed Tasks</h2>
                  
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
      
      <footer className="py-6 text-center text-sm text-gray-500">
        <p>Diamond Focus &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Index;
