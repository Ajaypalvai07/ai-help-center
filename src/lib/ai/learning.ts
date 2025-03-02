import type { Solution, Message, UserPreferences } from '../../types';
import { analyzeSentiment } from './sentiment';
// import { analyzeCode } from './code';
import { config } from '../../config';
import api from '../api';

interface FeedbackData {
  resolved: boolean;
  comment?: string;
  feedback: 'helpful' | 'not_helpful';
}

interface AnalysisContext {
  previousMessages: Message[];
  userPreferences: UserPreferences;
}

class AILearningEngine {
  private apiUrl: string;
  private headers: Record<string, string>;

  constructor() {
    if (!config.huggingFaceApiKey) {
      throw new Error('Hugging Face API key is not configured');
    }
    this.apiUrl = `https://api-inference.huggingface.co/models/${config.huggingFaceModel}`;
    this.headers = {
      'Authorization': `Bearer ${config.huggingFaceApiKey}`,
      'Content-Type': 'application/json'
    };
  }

  async learn(message: Message, solution: Solution, feedback: FeedbackData) {
    try {
      // Send feedback to the API
      await api.chat.submitFeedback(message.id!, {
        messageId: message.id,
        query: message.content,
        solution: solution,
        feedback: feedback.feedback,
        sentiment: await analyzeSentiment(feedback.comment || ''),
        success: feedback.resolved,
        timestamp: new Date()
      });

      // Generate improved solution if needed
      if (!feedback.resolved) {
        await this.generateImprovedSolution(message, solution, feedback);
      }
    } catch (error) {
      console.error('Error in AI learning:', error);
      throw new Error('Failed to process feedback and learning');
    }
  }

  async suggestSolution(query: string, context: AnalysisContext) {
    try {
      // Get the category from the most recent message in context, or use a default
      const category = context.previousMessages.length > 0 
        ? context.previousMessages[context.previousMessages.length - 1].category 
        : 'general';

      // Get solution from the API
      const response = await api.chat.analyzeMessage({
        id: crypto.randomUUID(),
        content: query,
        category: category,
        user_id: 'ai-assistant',
        type: 'user',
        created_at: new Date().toISOString(),
        status: 'pending'
      });

      return {
        solution: response.solution,
        confidence: response.confidence,
        similar_cases: response.similar_cases
      };
    } catch (error) {
      console.error('Error suggesting solution:', error);
      throw new Error('Failed to generate solution');
    }
  }

  private async generateImprovedSolution(message: Message, oldSolution: Solution, feedback: FeedbackData) {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          inputs: JSON.stringify({
            originalQuery: message.content,
            failedSolution: oldSolution,
            feedback: feedback
          })
        })
      });

      if (!response.ok) {
        throw new Error(`Hugging Face API error: ${response.statusText}`);
      }

      const improvedSolution = await response.json();

      if (!improvedSolution) {
        throw new Error('Failed to generate improved solution');
      }

      // Log the improved solution for now
      console.log('Generated improved solution:', improvedSolution);
    } catch (error) {
      console.error('Error generating improved solution:', error);
      throw new Error('Failed to generate improved solution');
    }
  }
}

export const aiLearningEngine = new AILearningEngine();