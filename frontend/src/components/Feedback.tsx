import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import { feedback } from '../lib/api';

interface FeedbackProps {
  messageId: string;
  onFeedbackSubmit?: () => void;
}

export default function Feedback({ messageId, onFeedbackSubmit }: FeedbackProps) {
  const [showDetail, setShowDetail] = useState(false);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if feedback was already submitted for this message
  useEffect(() => {
    const submittedFeedbacks = JSON.parse(localStorage.getItem('submittedFeedbacks') || '{}');
    if (submittedFeedbacks[messageId]) {
      setSubmitted(true);
    }
  }, [messageId]);

  const handleFeedback = async (type: 'thumbs_up' | 'thumbs_down') => {
    try {
      setError(null);
      await feedback.submit({
        message_id: messageId,
        rating: type === 'thumbs_up' ? 5 : 1,
        feedback_type: type,
        comment: comment.trim() || undefined
      });
      
      // Store feedback submission in localStorage
      const submittedFeedbacks = JSON.parse(localStorage.getItem('submittedFeedbacks') || '{}');
      submittedFeedbacks[messageId] = {
        type,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('submittedFeedbacks', JSON.stringify(submittedFeedbacks));
      
      setSubmitted(true);
      if (onFeedbackSubmit) {
        onFeedbackSubmit();
      }
    } catch (error: any) {
      console.error('Error submitting feedback:', error);
      setError(error.message || 'Failed to submit feedback');
    }
  };

  if (submitted) {
    return (
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Thank you for your feedback!
      </div>
    );
  }

  return (
    <div className="mt-2">
      {error && (
        <div className="text-sm text-red-600 dark:text-red-400 mb-2">
          {error}
        </div>
      )}
      
      <div className="flex items-center space-x-4">
        <button
          onClick={() => handleFeedback('thumbs_up')}
          className="p-1 hover:bg-green-100 dark:hover:bg-green-900/20 rounded-full transition-colors"
        >
          <ThumbsUp className="h-5 w-5 text-green-600 dark:text-green-400" />
        </button>
        
        <button
          onClick={() => handleFeedback('thumbs_down')}
          className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-full transition-colors"
        >
          <ThumbsDown className="h-5 w-5 text-red-600 dark:text-red-400" />
        </button>
        
        <button
          onClick={() => setShowDetail(!showDetail)}
          className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-full transition-colors"
        >
          <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </button>
      </div>

      {showDetail && (
        <div className="mt-2">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add additional feedback..."
            className="w-full p-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            rows={3}
          />
        </div>
      )}
    </div>
  );
} 