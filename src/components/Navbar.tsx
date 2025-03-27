
import { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { Coffee, Menu, X, ClipboardList } from 'lucide-react';
import { getCurrentInning, getInnings } from '../utils/helpers';
import { Scoreboard, Stadium } from './BaseballIcons';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

const Navbar = () => {
  const { energyForecast, requestBreak } = useTasks();
  const [isOpen, setIsOpen] = useState(false);
  const [scoutingModalOpen, setScoutingModalOpen] = useState(false);
  const [scoutingNotes, setScoutingNotes] = useState('');
  
  const currentInning = getCurrentInning();
  const innings = getInnings();
  const currentInningInfo = innings.find(inning => inning.number === currentInning);
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="glass-panel px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 diamond-progress bg-baseball-green animate-pulse-soft"></div>
          <h1 className="text-xl font-jersey tracking-tight">Diamond Focus</h1>
        </div>
        
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm">
            <div className={`w-3 h-3 rounded-full ${energyForecast.level === 'high' ? 'bg-green-500' : energyForecast.level === 'medium' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
            <span className="font-medium">Energy: {energyForecast.level.charAt(0).toUpperCase() + energyForecast.level.slice(1)}</span>
          </div>
          
          <div className="text-sm font-medium">
            <span className="mr-2">Inning {currentInning}:</span>
            <span className="text-baseball-navy font-jersey">{currentInningInfo?.label}</span>
          </div>
          
          <button
            onClick={requestBreak}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-baseball-navy bg-baseball-cream rounded-md transition-all hover:bg-opacity-90"
          >
            <Coffee size={16} />
            <span>Relief Pitcher</span>
          </button>
          
          <button
            onClick={() => setScoutingModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-baseball-green rounded-md transition-all hover:bg-baseball-darkGreen"
          >
            <Scoreboard size={16} />
            <span>Scouting Report</span>
          </button>
        </div>
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-md hover:bg-gray-100"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      
      {isOpen && (
        <div className="md:hidden glass-panel border-t-0 px-4 py-4 flex flex-col gap-4 animate-slide-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <div className={`w-3 h-3 rounded-full ${energyForecast.level === 'high' ? 'bg-green-500' : energyForecast.level === 'medium' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
              <span className="font-medium">Energy: {energyForecast.level.charAt(0).toUpperCase() + energyForecast.level.slice(1)}</span>
            </div>
            
            <div className="text-sm font-medium">
              <span className="mr-1">Inning {currentInning}:</span>
              <span className="text-baseball-navy font-jersey">{currentInningInfo?.label}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={requestBreak}
              className="flex items-center justify-center gap-1.5 px-4 py-3 text-sm font-medium text-baseball-navy bg-baseball-cream rounded-md transition-all hover:bg-opacity-90"
            >
              <Coffee size={16} />
              <span>Relief Pitcher</span>
            </button>
            
            <button
              onClick={() => setScoutingModalOpen(true)}
              className="flex items-center justify-center gap-1.5 px-4 py-3 text-sm font-medium text-white bg-baseball-green rounded-md transition-all hover:bg-baseball-darkGreen"
            >
              <Stadium size={16} />
              <span>Scouting Report</span>
            </button>
          </div>
        </div>
      )}

      {/* Scouting Report Modal */}
      <Dialog open={scoutingModalOpen} onOpenChange={setScoutingModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Scouting Report
            </DialogTitle>
            <DialogDescription>
              Take notes on your tasks, priorities, or any game-changing ideas.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Textarea
              className="min-h-[200px] font-medium"
              placeholder="Add your scouting notes here..."
              value={scoutingNotes}
              onChange={(e) => setScoutingNotes(e.target.value)}
            />
          </div>
          
          <DialogFooter>
            <Button
              variant="outline" 
              onClick={() => setScoutingModalOpen(false)}
            >
              Close
            </Button>
            <Button 
              onClick={() => {
                // In a real app, you might save these notes to state or local storage
                console.log('Saving scouting notes:', scoutingNotes);
                setScoutingModalOpen(false);
              }}
            >
              Save Notes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Navbar;
