
import React from 'react';
import { WorkflowState } from '../types';
import { PlayIcon } from './icons/PlayIcon';
import { RankIcon } from './icons/RankIcon';
import { ExecuteIcon } from './icons/ExecuteIcon';
import { AnalyzeIcon } from './icons/AnalyzeIcon';
import { RestartIcon } from './icons/RestartIcon';
import { PlanIcon } from './icons/PlanIcon';


interface ControlPanelProps {
  gameUrl: string;
  setGameUrl: (url: string) => void;
  workflowState: WorkflowState;
  isLoading: boolean;
  onStartPlanning: () => void;
  onStartRanking: () => void;
  onStartExecution: () => void;
  onStartAnalysis: () => void;
  onReset: () => void;
}

const Spinner: React.FC = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


export const ControlPanel: React.FC<ControlPanelProps> = ({
  gameUrl,
  setGameUrl,
  workflowState,
  isLoading,
  onStartPlanning,
  onStartRanking,
  onStartExecution,
  onStartAnalysis,
  onReset
}) => {
  const isIdle = workflowState === WorkflowState.IDLE;
  const isInputDisabled = isLoading || workflowState !== WorkflowState.IDLE;

  const renderButton = () => {
    const buttonBaseClasses = "w-full flex items-center justify-center font-bold py-3 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100";
    
    if (isLoading) {
      return (
        <button className={`${buttonBaseClasses} bg-gray-600`} disabled>
          <Spinner />
          Processing...
        </button>
      );
    }
    
    switch (workflowState) {
      case WorkflowState.IDLE:
        return <button onClick={onStartPlanning} className={`${buttonBaseClasses} bg-sky-600 hover:bg-sky-500`}><PlanIcon className="w-5 h-5 mr-2"/> Generate Test Plan</button>;
      case WorkflowState.PLANNED:
        return <button onClick={onStartRanking} className={`${buttonBaseClasses} bg-indigo-600 hover:bg-indigo-500`}><RankIcon className="w-5 h-5 mr-2"/> Rank Test Cases</button>;
      case WorkflowState.RANKED:
        return <button onClick={onStartExecution} className={`${buttonBaseClasses} bg-green-600 hover:bg-green-500`}><ExecuteIcon className="w-5 h-5 mr-2"/> Execute Top 10 Tests</button>;
      case WorkflowState.EXECUTED:
        return <button onClick={onStartAnalysis} className={`${buttonBaseClasses} bg-purple-600 hover:bg-purple-500`}><AnalyzeIcon className="w-5 h-5 mr-2"/> Analyze Results</button>;
      case WorkflowState.COMPLETE:
        return <button onClick={onReset} className={`${buttonBaseClasses} bg-yellow-600 hover:bg-yellow-500`}><RestartIcon className="w-5 h-5 mr-2"/> Start New Session</button>;
      default:
        return null;
    }
  }

  return (
    <div className="bg-gray-800/50 rounded-lg p-6 shadow-2xl border border-gray-700">
      <h2 className="text-xl font-bold text-sky-400 mb-4">Controls</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="gameUrl" className="block text-sm font-medium text-gray-300 mb-1">
            Game URL
          </label>
          <input
            type="text"
            id="gameUrl"
            value={gameUrl}
            onChange={(e) => setGameUrl(e.target.value)}
            disabled={isInputDisabled}
            className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 disabled:opacity-50"
            placeholder="https://example.com/game"
          />
        </div>
        {renderButton()}
      </div>
    </div>
  );
};
