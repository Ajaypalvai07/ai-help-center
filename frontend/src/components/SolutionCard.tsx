// import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import type { Solution } from '../types';
import { useStore } from '../store/useStore';

interface SolutionCardProps {
  solution: Solution;
  onStepComplete: (stepId: string) => void;
}

export default function SolutionCard({ solution, onStepComplete }: SolutionCardProps) {
  const updateMetrics = useStore(state => state.updateMetrics);

  const handleStepComplete = (stepId: string) => {
    onStepComplete(stepId);
    
    // Check if all steps are completed
    const allCompleted = solution.steps.every(step => step.completed);
    if (allCompleted) {
      updateMetrics({ resolvedIssues: 1 });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {solution.title || solution.answer}
        </h3>
        
        <div className="space-y-4">
          {solution.steps.map((step) => (
            <div
              key={step.id}
              className={`flex items-start gap-4 p-4 rounded-lg transition-colors ${
                step.completed
                  ? 'bg-green-50 dark:bg-green-900/20'
                  : 'bg-gray-50 dark:bg-gray-700/50'
              }`}
            >
              <button
                onClick={() => handleStepComplete(step.id)}
                className="flex-shrink-0 mt-0.5"
              >
                {step.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-400" />
                )}
              </button>
              
              <div className="flex-1">
                <p className={`text-sm ${
                  step.completed
                    ? 'text-green-800 dark:text-green-200'
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {step.content}
                </p>
                
                {step.codeSnippet && (
                  <pre className="mt-2 p-3 bg-gray-800 text-gray-200 rounded-md overflow-x-auto">
                    <code>{step.codeSnippet}</code>
                  </pre>
                )}
                
                {step.estimatedTime && (
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Estimated time: {step.estimatedTime}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}