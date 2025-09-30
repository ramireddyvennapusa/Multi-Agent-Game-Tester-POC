
import React, { useState, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { ControlPanel } from './components/ControlPanel';
import { StatusDisplay } from './components/StatusDisplay';
import { TestCaseList } from './components/TestCaseList';
import { ExecutionView } from './components/ExecutionView';
import { ReportView } from './components/ReportView';
import { FeedbackForm } from './components/FeedbackForm';
import { LogPanel } from './components/LogPanel';
import { WorkflowState, TestCase, ExecutionResult, AnalysisReport, Agent } from './types';
import { 
  startPlanning, 
  startRanking, 
  startExecution, 
  startAnalysis, 
  submitFeedback 
} from './services/apiService';

const App: React.FC = () => {
  const [workflowState, setWorkflowState] = useState<WorkflowState>(WorkflowState.IDLE);
  const [gameUrl, setGameUrl] = useState<string>('https://play.ezygamers.com/game/2048');
  const [plannedCases, setPlannedCases] = useState<TestCase[]>([]);
  const [rankedCases, setRankedCases] = useState<TestCase[]>([]);
  const [executionResults, setExecutionResults] = useState<ExecutionResult[]>([]);
  const [analysisReport, setAnalysisReport] = useState<AnalysisReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = useCallback((message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()} - ${message}`]);
  }, []);

  const handleStartPlanning = useCallback(async () => {
    if (!gameUrl) {
      setError('Please enter a game URL.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setWorkflowState(WorkflowState.PLANNING);
    addLog(`[Orchestrator] Starting test plan generation for ${gameUrl}`);
    addLog(`[PlannerAgent] Generating candidate test cases...`);

    try {
      const { testCases, ragUsage } = await startPlanning(gameUrl);
      setPlannedCases(testCases);
      if (ragUsage) {
        addLog(`[PlannerAgent] RAG system retrieved ${ragUsage.count} relevant tests from knowledge base: "${ragUsage.query}"`);
      }
      addLog(`[PlannerAgent] Generated ${testCases.length} candidate test cases.`);
      setWorkflowState(WorkflowState.PLANNED);
    } catch (e) {
      const err = e as Error;
      setError(err.message);
      setWorkflowState(WorkflowState.IDLE);
    } finally {
      setIsLoading(false);
    }
  }, [gameUrl, addLog]);

  const handleStartRanking = useCallback(async () => {
    setIsLoading(true);
    setWorkflowState(WorkflowState.RANKING);
    addLog(`[RankerAgent] Ranking ${plannedCases.length} test cases...`);
    try {
      const topCases = await startRanking(plannedCases);
      setRankedCases(topCases);
      addLog(`[RankerAgent] Selected top ${topCases.length} test cases for execution.`);
      setWorkflowState(WorkflowState.RANKED);
    } catch (e) {
      const err = e as Error;
      setError(err.message);
      setWorkflowState(WorkflowState.PLANNED);
    } finally {
      setIsLoading(false);
    }
  }, [plannedCases, addLog]);

  const handleStartExecution = useCallback(async () => {
    setIsLoading(true);
    setWorkflowState(WorkflowState.EXECUTING);
    addLog(`[Orchestrator] Dispatching ${rankedCases.length} tests to ExecutorAgents.`);
    try {
      const results = await startExecution(rankedCases);
      setExecutionResults(results);
      addLog(`[ExecutorAgents] All tests executed. Results captured.`);
      setWorkflowState(WorkflowState.EXECUTED);
    } catch (e) {
      const err = e as Error;
      setError(err.message);
      setWorkflowState(WorkflowState.RANKED);
    } finally {
      setIsLoading(false);
    }
  }, [rankedCases, addLog]);

  const handleStartAnalysis = useCallback(async () => {
    setIsLoading(true);
    setWorkflowState(WorkflowState.ANALYZING);
    addLog(`[AnalyzerAgent] Analyzing ${executionResults.length} execution results...`);
    try {
      const report = await startAnalysis(executionResults);
      setAnalysisReport(report);
      addLog(`[AnalyzerAgent] Analysis complete. Report generated.`);
      addLog(`[AnalyzerAgent] Stored feedback in RAG knowledge base to improve future planning.`);
      setWorkflowState(WorkflowState.COMPLETE);
    } catch (e) {
      const err = e as Error;
      setError(err.message);
      setWorkflowState(WorkflowState.EXECUTED);
    } finally {
      setIsLoading(false);
    }
  }, [executionResults, addLog]);

  const handleFeedbackSubmit = useCallback(async (feedback: string) => {
    addLog(`[User] Submitting feedback: "${feedback}"`);
    await submitFeedback(feedback);
    addLog(`[Orchestrator] User feedback stored in RAG knowledge base.`);
    alert('Feedback submitted successfully!');
  }, [addLog]);

  const handleReset = useCallback(() => {
    setWorkflowState(WorkflowState.IDLE);
    setGameUrl('https://play.ezygamers.com/game/2048');
    setPlannedCases([]);
    setRankedCases([]);
    setExecutionResults([]);
    setAnalysisReport(null);
    setError(null);
    setLogs([]);
    addLog('System reset to initial state.');
  }, [addLog]);

  const activeAgent = useMemo(() => {
    const mapping: { [key in WorkflowState]?: Agent } = {
      [WorkflowState.PLANNING]: Agent.Planner,
      [WorkflowState.RANKING]: Agent.Ranker,
      [WorkflowState.EXECUTING]: Agent.Executor,
      [WorkflowState.ANALYZING]: Agent.Analyzer,
    };
    return mapping[workflowState] || Agent.Orchestrator;
  }, [workflowState]);
  
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header />
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-1 flex flex-col gap-6">
            <ControlPanel
              gameUrl={gameUrl}
              setGameUrl={setGameUrl}
              workflowState={workflowState}
              isLoading={isLoading}
              onStartPlanning={handleStartPlanning}
              onStartRanking={handleStartRanking}
              onStartExecution={handleStartExecution}
              onStartAnalysis={handleStartAnalysis}
              onReset={handleReset}
            />
             {error && <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-md" role="alert">{error}</div>}
            <StatusDisplay activeAgent={activeAgent} workflowState={workflowState} />
            <LogPanel logs={logs} />
          </div>
          <div className="lg:col-span-2 bg-gray-800/50 rounded-lg p-6 shadow-2xl border border-gray-700">
            {workflowState === WorkflowState.IDLE && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <h2 className="text-2xl font-bold text-sky-400">Welcome to the Multi-Agent Game Tester</h2>
                <p className="mt-2 text-gray-400">Enter a game URL and click "Generate Test Plan" to begin.</p>
                <p className="mt-4 text-sm text-gray-500">This POC simulates a complex agent-based testing workflow, including RAG-powered test generation, ranking, parallel execution, and analysis.</p>
              </div>
            )}
            {plannedCases.length > 0 && workflowState <= WorkflowState.PLANNED && <TestCaseList title="📝 Planned Test Cases" testCases={plannedCases} />}
            {rankedCases.length > 0 && workflowState <= WorkflowState.RANKED && <TestCaseList title="🏆 Top 10 Ranked Test Cases" testCases={rankedCases} />}
            {workflowState === WorkflowState.EXECUTING && <ExecutionView testCases={rankedCases} />}
            {executionResults.length > 0 && workflowState <= WorkflowState.EXECUTED && <ReportView report={{ summary: "Execution Complete", results: executionResults }} />}
            {analysisReport && workflowState === WorkflowState.COMPLETE && (
              <div>
                <ReportView report={analysisReport} />
                <FeedbackForm onSubmit={handleFeedbackSubmit} />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
