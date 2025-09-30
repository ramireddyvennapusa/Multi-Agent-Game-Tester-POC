
import React from 'react';
import { WorkflowState, Agent } from '../types';
import { BotIcon } from './icons/BotIcon';
import { PlanIcon } from './icons/PlanIcon';
import { RankIcon } from './icons/RankIcon';
import { ExecuteIcon } from './icons/ExecuteIcon';
import { AnalyzeIcon } from './icons/AnalyzeIcon';

interface StatusDisplayProps {
  activeAgent: Agent;
  workflowState: WorkflowState;
}

const statusMap: { [key in WorkflowState]: { text: string; description: string } } = {
  [WorkflowState.IDLE]: { text: 'Idle', description: 'System is ready. Provide a URL and start planning.' },
  [WorkflowState.PLANNING]: { text: 'Planning', description: 'PlannerAgent is generating test cases using its knowledge base (RAG).' },
  [WorkflowState.PLANNED]: { text: 'Plan Complete', description: 'Candidate test cases generated. Ready for ranking.' },
  [WorkflowState.RANKING]: { text: 'Ranking', description: 'RankerAgent is prioritizing test cases based on novelty and difficulty.' },
  [WorkflowState.RANKED]: { text: 'Ranking Complete', description: 'Top 10 test cases selected. Ready for execution.' },
  [WorkflowState.EXECUTING]: { text: 'Executing', description: 'ExecutorAgents are running tests in parallel and capturing artifacts.' },
  [WorkflowState.EXECUTED]: { text: 'Execution Complete', description: 'All tests have been run. Ready for analysis.' },
  [WorkflowState.ANALYZING]: { text: 'Analyzing', description: 'AnalyzerAgent is validating results and generating insights.' },
  [WorkflowState.COMPLETE]: { text: 'Complete', description: 'Process finished. View the report and provide feedback.' },
};

const agentIcons: { [key in Agent]: React.ReactNode } = {
    [Agent.Orchestrator]: <BotIcon className="w-6 h-6" />,
    [Agent.Planner]: <PlanIcon className="w-6 h-6" />,
    [Agent.Ranker]: <RankIcon className="w-6 h-6" />,
    [Agent.Executor]: <ExecuteIcon className="w-6 h-6" />,
    [Agent.Analyzer]: <AnalyzeIcon className="w-6 h-6" />,
};

const agentColors: { [key in Agent]: string } = {
    [Agent.Orchestrator]: 'text-gray-400',
    [Agent.Planner]: 'text-sky-400',
    [Agent.Ranker]: 'text-indigo-400',
    [Agent.Executor]: 'text-green-400',
    [Agent.Analyzer]: 'text-purple-400',
};

export const StatusDisplay: React.FC<StatusDisplayProps> = ({ activeAgent, workflowState }) => {
  const statusInfo = statusMap[workflowState];
  
  return (
    <div className="bg-gray-800/50 rounded-lg p-6 shadow-2xl border border-gray-700">
      <h3 className="text-xl font-bold text-sky-400 mb-4">System Status</h3>
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-full bg-gray-700 ${agentColors[activeAgent]}`}>
            {agentIcons[activeAgent]}
        </div>
        <div>
          <p className={`text-lg font-semibold ${agentColors[activeAgent]}`}>{activeAgent}</p>
          <p className="text-gray-300 font-medium">{statusInfo.text}</p>
        </div>
      </div>
      <p className="mt-4 text-sm text-gray-400">{statusInfo.description}</p>
    </div>
  );
};
