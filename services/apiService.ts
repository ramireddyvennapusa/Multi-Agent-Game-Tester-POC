import { TestCase, ExecutionResult, AnalysisReport, TestCaseType } from '../types';

const mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const initialTestCases: Omit<TestCase, 'id' | 'isRag'>[] = [
    { description: "Verify main game board loads correctly.", type: TestCaseType.NAVIGATION, expectedResult: "Game board is visible and interactive." },
    { description: "Attempt a valid move according to game rules.", type: TestCaseType.PUZZLE_SOLVING, expectedResult: "Game state updates correctly." },
    { description: "Enter non-numeric characters into a score-related input.", type: TestCaseType.INVALID_INPUT, expectedResult: "Input is rejected or sanitized." },
    { description: "Reach the maximum possible score.", type: TestCaseType.BOUNDARY, expectedResult: "Game handles max score condition gracefully (e.g., 'You Win!' message)." },
    { description: "Rapidly input 100 moves in 5 seconds.", type: TestCaseType.STRESS, expectedResult: "UI remains responsive and game state is consistent." },
    { description: "Navigate to the 'How to Play' section and back.", type: TestCaseType.NAVIGATION, expectedResult: "Can successfully navigate to help and return to the game." },
    { description: "Try to make a move that is blocked or illegal.", type: TestCaseType.PUZZLE_SOLVING, expectedResult: "The move is prevented and user may receive feedback." },
    // FIX: Corrected a typo in the TestCaseType enum from INVALID_input to INVALID_INPUT.
    { description: "Leave the input field empty and submit.", type: TestCaseType.INVALID_INPUT, expectedResult: "An error message is displayed for the empty field." },
    { description: "Test the game with the lowest possible screen resolution.", type: TestCaseType.BOUNDARY, expectedResult: "The game layout adapts and remains playable." },
    { description: "Leave the game idle for 5 minutes and then resume.", type: TestCaseType.STRESS, expectedResult: "Game state is preserved and can be resumed without issues." },
    { description: "Check if the 'New Game' button resets the score and board.", type: TestCaseType.USABILITY, expectedResult: "Game resets to its initial state." },
    { description: "Solve a simple puzzle and verify score calculation.", type: TestCaseType.PUZZLE_SOLVING, expectedResult: "Score is updated accurately." },
    { description: "Use browser back/forward buttons during gameplay.", type: TestCaseType.NAVIGATION, expectedResult: "Game state is not corrupted by browser navigation." },
    { description: "Enter an extremely large number where a number is expected.", type: TestCaseType.BOUNDARY, expectedResult: "The system handles the large number without crashing." },
    { description: "Simulate network disconnection and reconnection.", type: TestCaseType.STRESS, expectedResult: "Game either pauses or handles the interruption gracefully." },
];

export const startPlanning = async (gameUrl: string): Promise<{ testCases: TestCase[], ragUsage: { count: number, query: string } | null }> => {
  await mockDelay(2500);
  console.log(`Simulating planning for ${gameUrl}`);

  const useRag = Math.random() > 0.3;
  let ragUsage: { count: number, query: string } | null = null;
  const generatedCases: TestCase[] = [];

  if (useRag) {
      const ragCount = Math.floor(Math.random() * 4) + 2; // 2-5 RAG cases
      ragUsage = { count: ragCount, query: "common UI failures in puzzle games" };
      for (let i = 0; i < ragCount; i++) {
          generatedCases.push({
              id: `rag-${i}`,
              description: `[RAG] Verify accessibility standards for color contrast on game board.`,
              type: TestCaseType.USABILITY,
              expectedResult: "WCAG AA standards are met.",
              isRag: true
          });
      }
  }

  while (generatedCases.length < 20) {
      const baseCase = initialTestCases[Math.floor(Math.random() * initialTestCases.length)];
      generatedCases.push({
          ...baseCase,
          id: `gen-${generatedCases.length}`,
          description: `${baseCase.description} #${generatedCases.length + 1}`,
          isRag: false,
      });
  }

  return { testCases: generatedCases.slice(0, 20), ragUsage };
};

export const startRanking = async (testCases: TestCase[]): Promise<TestCase[]> => {
    await mockDelay(1500);
    console.log(`Simulating ranking for ${testCases.length} cases`);
    
    return testCases
        .map(tc => ({
            ...tc,
            difficulty: Math.random(),
            novelty: tc.isRag ? Math.random() * 0.5 + 0.5 : Math.random(), // RAG cases are more novel
        }))
        .sort((a, b) => (b.novelty! + b.difficulty!) - (a.novelty! + a.difficulty!))
        .slice(0, 10)
        .map((tc, index) => ({ ...tc, rank: index + 1 }));
};

export const startExecution = async (testCases: TestCase[]): Promise<ExecutionResult[]> => {
    await mockDelay(4000);
    console.log(`Simulating execution for ${testCases.length} cases`);
    
    return testCases.map(tc => ({
        testCaseId: tc.id,
        testCaseDescription: tc.description,
        verdict: Math.random() > 0.2 ? 'PASSED' : 'FAILED',
        duration: Math.floor(Math.random() * 5000) + 1000,
        artifacts: {
            screenshotUrl: `https://picsum.photos/seed/${tc.id}/400/300`,
            domSnapshotUrl: '#',
            consoleLogUrl: '#',
            networkCaptureUrl: '#'
        },
        triageNotes: Math.random() > 0.7 ? "Element not found during interaction." : undefined,
    }));
};

export const startAnalysis = async (results: ExecutionResult[]): Promise<AnalysisReport> => {
    await mockDelay(2000);
    console.log(`Simulating analysis for ${results.length} results`);

    const passed = results.filter(r => r.verdict === 'PASSED').length;
    const failed = results.length - passed;
    const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);

    const reproducibility: AnalysisReport['reproducibility'] = {};
    results.forEach(r => {
        reproducibility[r.testCaseId] = {
            attempts: 3, // Mocked value
            successRate: r.verdict === 'PASSED' ? '100%' : '33%', // Mocked value
        }
    });

    return {
        summary: {
            totalTests: results.length,
            passed,
            failed,
            passRate: `${((passed / results.length) * 100).toFixed(1)}%`,
            averageDuration: `${(totalDuration / results.length / 1000).toFixed(2)}s`,
        },
        reproducibility,
        results,
        suggestionsForPlanner: [
            "Increase focus on boundary conditions for user input fields.",
            "Consider adding more complex navigation scenarios involving modals and pop-ups.",
            "A failed test was related to timing; add more stress tests with rapid inputs."
        ]
    };
};


export const submitFeedback = async (feedback: string): Promise<{ success: boolean }> => {
    await mockDelay(500);
    console.log(`Simulating submission of feedback: "${feedback}"`);
    // In a real app, this would be stored in the vector DB for the RAG pipeline
    return { success: true };
};