
import React, { useState } from 'react';

interface FeedbackFormProps {
  onSubmit: (feedback: string) => void;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({ onSubmit }) => {
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback.trim()) {
      onSubmit(feedback.trim());
      setFeedback('');
    }
  };

  return (
    <div className="mt-8 bg-gray-800/50 rounded-lg p-6 border border-gray-700">
      <h4 className="text-xl font-semibold text-gray-200 mb-3">Provide Feedback</h4>
      <p className="text-sm text-gray-400 mb-4">Your feedback helps improve the PlannerAgent's decision-making for future test runs. Was a critical test case missed? Was a generated test irrelevant?</p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          rows={4}
          placeholder="e.g., 'The planner should have generated more tests for mobile responsiveness.'"
        />
        <button
          type="submit"
          disabled={!feedback.trim()}
          className="mt-3 w-full sm:w-auto inline-flex items-center justify-center font-bold py-2 px-6 rounded-lg shadow-lg bg-sky-600 hover:bg-sky-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit Feedback
        </button>
      </form>
    </div>
  );
};
