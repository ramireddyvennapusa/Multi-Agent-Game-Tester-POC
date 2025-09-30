
import React, { useState, useEffect } from 'react';
import { TestCase } from '../types';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';

interface ExecutionViewProps {
  testCases: TestCase[];
}

type ExecutionStatus = 'RUNNING' | 'PASSED' | 'FAILED';

const Spinner: React.FC = () => (
    <svg className="animate-spin h-5 w-5 text-sky-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const statusIcons: { [key in ExecutionStatus]: React.ReactNode } = {
  RUNNING: <Spinner />,
  PASSED: <CheckCircleIcon className="w-6 h-6 text-green-400" />,
  FAILED: <XCircleIcon className="w-6 h-6 text-red-400" />,
};

export const ExecutionView: React.FC<ExecutionViewProps> = ({ testCases }) => {
  const [statuses, setStatuses] = useState<Record<string, ExecutionStatus>>({});

  useEffect(() => {
    const newStatuses: Record<string, ExecutionStatus> = {};
    testCases.forEach(tc => {
        newStatuses[tc.id] = 'RUNNING';
    });
    setStatuses(newStatuses);

    // Simulate test execution completion
    const timers = testCases.map((tc, index) => 
        setTimeout(() => {
            setStatuses(prev => ({ ...prev, [tc.id]: Math.random() > 0.2 ? 'PASSED' : 'FAILED' }));
        }, 1000 + index * 300 + Math.random() * 500)
    );
    
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testCases]);

  return (
    <div className="animate-fade-in">
      <h3 className="text-2xl font-bold text-sky-400 mb-4">🚀 Live Test Execution</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testCases.map((tc) => (
          <div key={tc.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex items-center gap-4">
             <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                {statuses[tc.id] && statusIcons[statuses[tc.id]]}
             </div>
            <div className="flex-1">
              <p className="text-gray-300 text-sm">{tc.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
