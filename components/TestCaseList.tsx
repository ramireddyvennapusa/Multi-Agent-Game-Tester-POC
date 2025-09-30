
import React from 'react';
import { TestCase } from '../types';
import { RagIcon } from './icons/RagIcon';

interface TestCaseListProps {
  title: string;
  testCases: TestCase[];
}

export const TestCaseList: React.FC<TestCaseListProps> = ({ title, testCases }) => {
  return (
    <div className="animate-fade-in">
      <h3 className="text-2xl font-bold text-sky-400 mb-4">{title}</h3>
      <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
        {testCases.map((tc) => (
          <div key={tc.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex items-start gap-4">
            {tc.rank ? (
                <div className="text-lg font-bold text-indigo-400">{tc.rank.toString().padStart(2, '0')}</div>
            ) : (
                <div className="text-lg font-bold text-gray-500">--</div>
            )}
            <div className="flex-1">
              <p className="text-gray-200">{tc.description}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-xs font-semibold bg-gray-700 text-gray-300 px-2 py-1 rounded">
                  {tc.type}
                </span>
                {tc.isRag && (
                  <div className="flex items-center gap-1 text-xs font-semibold text-cyan-400 bg-cyan-900/50 px-2 py-1 rounded">
                    <RagIcon className="w-3 h-3" />
                    <span>RAG Enhanced</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
