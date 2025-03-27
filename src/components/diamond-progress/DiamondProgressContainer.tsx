
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
import { Task, InningInfo } from '../../types';

interface DiamondProgressContainerProps {
  showEisenhowerMatrix: boolean;
  toggleEisenhowerMatrix: () => void;
  broadcastMessage: string;
  showAdrenalineRush: boolean;
  innings: InningInfo[];
  selectedInning: number;
  handleInningSelect: (inning: number) => void;
  basePosition: number;
  runnerPositions: number[];
  showRunnerGlow: boolean;
  energyLevel: 'high' | 'medium' | 'low';
  showFireworks: boolean;
  completedDefense: number;
  defenseTasks: number;
  completedOffense: number;
  offenseTasks: number;
  completedTasks: number;
  totalTasks: number;
  isBehindOnTasks: boolean;
  tasks: Task[];
  showMidInningReview: boolean;
  currentInning: number;
}

const DiamondProgressContainer: React.FC<DiamondProgressContainerProps> = ({
  showEisenhowerMatrix,
  toggleEisenhowerMatrix,
  broadcastMessage,
  showAdrenalineRush,
  innings,
  selectedInning,
  handleInningSelect,
  basePosition,
  runnerPositions,
  showRunnerGlow,
  energyLevel,
  showFireworks,
  completedDefense,
  defenseTasks,
  completedOffense,
  offenseTasks,
  completedTasks,
  totalTasks,
  isBehindOnTasks,
  tasks,
  showMidInningReview,
  currentInning
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      <div className="mb-8">
        <ScoreboardHeader 
          broadcastMessage={broadcastMessage}
          showAdrenalineRush={showAdrenalineRush}
        />
      </div>
      
      <div className="mb-6 flex items-center justify-between">
        <InningTimeline 
          innings={innings} 
          selectedInning={selectedInning} 
          handleInningSelect={handleInningSelect} 
        />
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
        <BaseballDiamond 
          basePosition={basePosition}
          runnerPositions={runnerPositions}
          showRunnerGlow={showRunnerGlow}
          energyLevel={energyLevel}
          showFireworks={showFireworks}
        />
        
        {/* Eisenhower Matrix Overlay */}
        <EisenhowerMatrixOverlay showOverlay={showEisenhowerMatrix} tasks={tasks} />
        
        <div className="mt-2 flex justify-between items-center">
          <QuickStatsSummary 
            completedDefense={completedDefense}
            defenseTasks={defenseTasks}
            completedOffense={completedOffense}
            offenseTasks={offenseTasks}
          />
          <OutsCountDisplay 
            completedTasks={completedTasks}
            totalTasks={totalTasks}
            isBehindOnTasks={isBehindOnTasks}
          />
        </div>
      </div>
      
      <div className="space-y-8">
        <StatsDisplay tasks={tasks} />
        <MidInningReview 
          showMidInningReview={showMidInningReview}
          completedTasks={completedTasks}
          totalTasks={totalTasks}
          completedOffense={completedOffense}
          offenseTasks={tasks.filter(t => t.type === 'offense' || t.priority === 'urgent_important' || t.priority === 'not_urgent_important')}
          completedDefense={completedDefense}
          defenseTasks={tasks.filter(t => t.type === 'defense' || t.priority === 'urgent_not_important' || t.priority === 'not_urgent_not_important')}
          currentInning={currentInning}
        />
        <AdrenalineRush showAdrenalineRush={showAdrenalineRush} />
        <LeagueStandings />
      </div>
    </div>
  );
};

export default DiamondProgressContainer;
