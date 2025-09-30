
import React, { useRef, useEffect } from 'react';

interface LogPanelProps {
  logs: string[];
}

export const LogPanel: React.FC<LogPanelProps> = ({ logs }) => {
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-gray-800/50 rounded-lg p-6 shadow-2xl border border-gray-700">
      <h3 className="text-xl font-bold text-sky-400 mb-4">Orchestrator Logs</h3>
      <div ref={logContainerRef} className="bg-black/50 h-64 rounded-md p-3 text-xs font-mono overflow-y-auto">
        {logs.map((log, index) => (
          <p key={index} className={`whitespace-pre-wrap ${log.includes('[RAG system]') ? 'text-cyan-400' : 'text-gray-400'}`}>
            {log}
          </p>
        ))}
      </div>
    </div>
  );
};
