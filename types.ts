
export enum WorkflowState {
  IDLE = 'IDLE',
  PLANNING = 'PLANNING',
  PLANNED = 'PLANNED',
  RANKING = 'RANKING',
  RANKED = 'RANKED',
  EXECUTING = 'EXECUTING',
  EXECUTED = 'EXECUTED',
  ANALYZING = 'ANALYZING',
  COMPLETE = 'COMPLETE',
}

export enum Agent {
    Orchestrator = 'Orchestrator',
    Planner = 'PlannerAgent',
    Ranker = 'RankerAgent',
    Executor = 'ExecutorAgents',
    Analyzer = 'AnalyzerAgent',
}

export enum TestCaseType {
    NAVIGATION = 'Navigation',
    PUZZLE_SOLVING = 'Puzzle Solving',
    INVALID_INPUT = 'Invalid Input',
    BOUNDARY = 'Boundary Condition',
    STRESS = 'Stress Test',
    USABILITY = 'Usability',
}

export interface TestCase {
  id: string;
  description: string;
  type: TestCaseType;
  expectedResult: string;
  isRag: boolean;
  rank?: number;
  difficulty?: number;
  novelty?: number;
}

export interface ExecutionResult {
  testCaseId: string;
  testCaseDescription: string;
  verdict: 'PASSED' | 'FAILED' | 'SKIPPED';
  duration: number; // in milliseconds
  artifacts: {
    screenshotUrl?: string;
    domSnapshotUrl?: string;
    consoleLogUrl?: string;
    networkCaptureUrl?: string;
  };
  triageNotes?: string;
}

export interface AnalysisReport {
  summary: {
    totalTests: number;
    passed: number;
    failed: number;
    passRate: string;
    averageDuration: string;
  };
  reproducibility: {
    [testCaseId: string]: {
        attempts: number;
        successRate: string;
    };
  };
  results: ExecutionResult[];
  suggestionsForPlanner: string[];
}
