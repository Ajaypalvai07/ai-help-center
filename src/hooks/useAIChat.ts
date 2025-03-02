import { useState } from 'react';
import { useStore } from '../store/useStore';
import api from '../lib/api';
import type { Message, MessageResponse, Step } from '../types';

export function useAIChat() {
  const [processingAI, setProcessingAI] = useState(false);
  const { addMessage, setSolution, updateMetrics } = useStore();

  const sendMessage = async (message: Message): Promise<MessageResponse> => {
    setProcessingAI(true);
    try {
      const response = await api.chat.analyzeMessage(message);
      
      // Convert steps array to proper format if they're strings
      const formattedSteps: Step[] = (response.solution?.steps || []).map((step: string | Step, index: number) => {
        if (typeof step === 'string') {
          return {
            id: `step-${index + 1}`,
            content: step,
            completed: false
          };
        }
        return step;
      });

      // Ensure we have a valid solution structure
      const solution = {
        ...response.solution,
        answer: response.solution.answer || '',
        steps: formattedSteps,
        references: response.solution.references || [],
        confidence: response.confidence || 0,
        similar_cases: response.similar_cases || []
      };

      const aiMessage: Message = {
        id: crypto.randomUUID(),
        content: solution.answer,
        type: 'ai',
        created_at: new Date().toISOString(),
        status: 'sent',
        category: message.category,
        user_id: 'ai-assistant',
        solution
      };
      
      addMessage(aiMessage);
      setSolution(solution);
      
      return response;
    } catch (error) {
      console.error('Error processing message:', error);
      updateMetrics({ escalatedIssues: 1 });
      throw error;
    } finally {
      setProcessingAI(false);
    }
  };

  const calculateResolutionTime = (startTime: string): number => {
    const endTime = new Date().toISOString();
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    const resolutionTime = Math.round((endDate.getTime() - startDate.getTime()) / 1000 / 60);
    return resolutionTime;
  };

  return {
    sendMessage,
    processingAI
  };
}