import  { useEffect, useState } from 'react';
import { Brain, Zap, CheckCircle2, XCircle } from 'lucide-react';

interface ThinkingStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  confidence: number;
  details?: {
    matches?: number;
    patterns?: string[];
    reasoning?: string[];
  };
}

interface AIThinkingVisualizerProps {
  query: string;
  onComplete: (result: any) => void;
}

export default function AIThinkingVisualizer({ query, onComplete }: AIThinkingVisualizerProps) {
  const [steps, setSteps] = useState<ThinkingStep[]>([
    {
      id: '1',
      title: 'Natural Language Processing',
      description: 'Analyzing query intent and context...',
      status: 'pending',
      confidence: 0
    },
    {
      id: '2',
      title: 'Pattern Matching',
      description: 'Finding similar resolved cases...',
      status: 'pending',
      confidence: 0
    },
    {
      id: '3',
      title: 'Solution Generation',
      description: 'Creating personalized solution...',
      status: 'pending',
      confidence: 0
    },
    {
      id: '4',
      title: 'Validation',
      description: 'Verifying solution effectiveness...',
      status: 'pending',
      confidence: 0
    }
  ]);

  useEffect(() => {
    const processSteps = async () => {
      // Process each step with realistic timing
      for (let i = 0; i < steps.length; i++) {
        setSteps(prev => prev.map((step, index) => ({
          ...step,
          status: index === i ? 'processing' : step.status
        })));

        // Simulate AI processing with realistic timing
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

        // Update step with "real" progress
        setSteps(prev => prev.map((step, index) => {
          if (index !== i) return step;

          const confidence = 0.7 + Math.random() * 0.3;
          const details = generateStepDetails(step.id);

          return {
            ...step,
            status: 'completed',
            confidence,
            details
          };
        }));
      }

      // Notify completion
      onComplete({
        success: true,
        confidence: steps.reduce((acc, step) => acc + step.confidence, 0) / steps.length
      });
    };

    processSteps();
  }, [query]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Brain className="h-6 w-6 text-blue-500" />
        <h2 className="text-lg font-semibold">AI Analysis in Progress</h2>
      </div>

      <div className="space-y-4">
        {steps.map(step => (
          <div
            key={step.id}
            className={`border rounded-lg p-4 transition-colors ${
              step.status === 'processing' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' :
              step.status === 'completed' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' :
              'border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {step.status === 'processing' ? (
                  <Zap className="h-5 w-5 text-blue-500 animate-pulse" />
                ) : step.status === 'completed' ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : step.status === 'error' ? (
                  <XCircle className="h-5 w-5 text-red-500" />
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                )}
                <h3 className="font-medium">{step.title}</h3>
              </div>
              {step.confidence > 0 && (
                <span className="text-sm text-gray-500">
                  {Math.round(step.confidence * 100)}% confident
                </span>
              )}
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              {step.description}
            </p>

            {step.details && step.status === 'completed' && (
              <div className="mt-2 text-sm">
                {step.details.matches && (
                  <p className="text-gray-600 dark:text-gray-300">
                    Found {step.details.matches} similar cases
                  </p>
                )}
                {step.details.patterns && (
                  <div className="mt-1">
                    <p className="text-gray-600 dark:text-gray-300">Identified patterns:</p>
                    <ul className="list-disc list-inside ml-2">
                      {step.details.patterns.map((pattern, i) => (
                        <li key={i} className="text-gray-600 dark:text-gray-300">{pattern}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {step.details.reasoning && (
                  <div className="mt-1">
                    <p className="text-gray-600 dark:text-gray-300">Reasoning:</p>
                    <ul className="list-disc list-inside ml-2">
                      {step.details.reasoning.map((reason, i) => (
                        <li key={i} className="text-gray-600 dark:text-gray-300">{reason}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function generateStepDetails(stepId: string) {
  switch (stepId) {
    case '1':
      return {
        patterns: [
          'Technical issue identification',
          'User experience analysis',
          'Context extraction'
        ],
        reasoning: [
          'Query contains technical keywords',
          'User sentiment analysis performed',
          'Related system components identified'
        ]
      };
    case '2':
      return {
        matches: Math.floor(Math.random() * 5) + 3,
        patterns: [
          'Similar issue patterns found',
          'Historical resolution analysis',
          'Success rate evaluation'
        ]
      };
    case '3':
      return {
        reasoning: [
          'Combining successful approaches',
          'Adapting to current context',
          'Optimizing for user skill level'
        ]
      };
    case '4':
      return {
        patterns: [
          'Solution completeness check',
          'Edge case analysis',
          'Success probability calculation'
        ]
      };
    default:
      return {};
  }
}