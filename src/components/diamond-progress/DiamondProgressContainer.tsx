
import React from 'react';
import { useTasks } from '../../context/TaskContext';
import EisenhowerMatrixOverlay from './EisenhowerMatrixOverlay';
import ScoreboardHeader from './ScoreboardHeader';
import InningTimeline from './InningTimeline';
import BaseballDiamond from './BaseballDiamond';
import QuickStatsSummary from './QuickStatsSummary';
import OutsCountDisplay from './OutsCountDisplay';
import StatsDisplay from './StatsDisplay';
import MidInningReview from './MidInningReview';
import AdrenalineRush from './AdrenalineRush';
import LeagueStandings from './LeagueStandings';
import { Button } from '../ui/button';
import { Activity, Eye, EyeOff } from 'lucide-react';

interface DiamondProgressContainerProps {
  showEisenhowerMatrix: boolean;
  toggleEisenhowerMatrix: () => void;
}

const DiamondProgressContainer: React.FC<DiamondProgressContainerProps> = ({
  showEisenhowerMatrix,
  toggleEisenhowerMatrix
}) => {
  const { tasks } = useTasks();
  
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      <div className="mb-8">
        <ScoreboardHeader />
      </div>
      
      <div className="mb-6 flex items-center justify-between">
        <InningTimeline />
        <Button 
          onClick={toggleEisenhowerMatrix}
          variant="outline" 
          size="sm"
          className="flex items-center gap-2 ml-4"
        >
          {showEisenhowerMatrix ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {showEisenhowerMatrix ? "Hide Eisenhower Matrix" : "Show Eisenhower Matrix"}
        </Button>
      </div>
      
      <div className="relative mb-10">
        <BaseballDiamond />
        
        {/* Eisenhower Matrix Overlay */}
        <EisenhowerMatrixOverlay showOverlay={showEisenhowerMatrix} tasks={tasks} />
        
        <div className="mt-2 flex justify-between items-center">
          <QuickStatsSummary />
          <OutsCountDisplay />
        </div>
      </div>
      
      <div className="space-y-8">
        <StatsDisplay />
        <MidInningReview />
        <AdrenalineRush />
        <LeagueStandings />
      </div>
    </div>
  );
};

export default DiamondProgressContainer;
