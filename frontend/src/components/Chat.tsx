import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageSquare, Send, ArrowLeft, Mic, MicOff, Loader2 } from 'lucide-react';
import { categories, chat } from '../lib/api';
import { useStore } from '../store';
import { useVoiceInput } from '../hooks/useVoiceInput';
import Feedback from './Feedback';
import MultimediaInput from './MultimediaInput';

// Constants for storage
const MAX_MESSAGE_AGE = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const MAX_MESSAGES = 50; // Maximum number of messages to store

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
  category: string;
}

interface ChatResponse {
  id: string;
  content: string;
  confidence: number;
  created_at: string;
  user_message_id: string;
}

interface StoredMessages {
  messages: Message[];
  timestamp: number;
}

// Sanitize message content to prevent XSS
const sanitizeMessage = (content: string): string => {
  return content.replace(/[<>]/g, '');
};

// Add checkSession function
const checkSession = () => {
  const store = useStore.getState();
  if (!store.auth.lastActivity) return false;
  
  const inactiveTime = Date.now() - store.auth.lastActivity;
  return inactiveTime < 30 * 60 * 1000; // 30 minutes
};

export default function Chat() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const savedData = sessionStorage.getItem(`chat_${categoryId}`);
      if (savedData) {
        const { messages, timestamp }: StoredMessages = JSON.parse(savedData);
        if (Date.now() - timestamp < MAX_MESSAGE_AGE) {
          return messages;
        }
      }
      return [];
    } catch (error) {
      console.error('Error loading messages:', error);
      return [];
    }
  });
  
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { auth, chat: chatState, setChatState, updateLastActivity } = useStore();
  const [category, setCategory] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isRecording, startRecording, stopRecording, transcript, setTranscript } = useVoiceInput();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Check session on component mount and activity
  useEffect(() => {
    const checkActivity = () => {
      if (!checkSession()) {
        navigate('/', { replace: true });
      }
    };

    checkActivity();
    const interval = setInterval(checkActivity, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [navigate]);

  // Save messages to session storage and store
  useEffect(() => {
    if (categoryId && messages.length > 0) {
      const recentMessages = messages.slice(-MAX_MESSAGES);
      
      const storageData: StoredMessages = {
        messages: recentMessages,
        timestamp: Date.now()
      };
      sessionStorage.setItem(`chat_${categoryId}`, JSON.stringify(storageData));
      
      setChatState({
        categoryId,
        lastMessage: recentMessages[recentMessages.length - 1],
        messageCount: recentMessages.length
      });
    }
  }, [messages, categoryId, setChatState]);

  // Handle category state
  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate('/', { replace: true });
      return;
    }

    loadCategory();
    updateLastActivity();
  }, [categoryId, auth.isAuthenticated, navigate, updateLastActivity]);

  // Clear expired messages on component mount
  useEffect(() => {
    const clearExpiredMessages = () => {
      const keys = Object.keys(sessionStorage);
      keys.forEach(key => {
        if (key.startsWith('chat_')) {
          try {
            const data = JSON.parse(sessionStorage.getItem(key) || '');
            if (Date.now() - data.timestamp > MAX_MESSAGE_AGE) {
              sessionStorage.removeItem(key);
            }
          } catch (error) {
            sessionStorage.removeItem(key);
          }
        }
      });
    };

    clearExpiredMessages();
  }, []);

  // Handle page refresh
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (categoryId) {
        sessionStorage.setItem('lastChatCategory', categoryId);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [categoryId]);

  // Restore chat on refresh
  useEffect(() => {
    const lastCategory = sessionStorage.getItem('lastChatCategory');
    if (!categoryId && lastCategory) {
      navigate(`/chat/${lastCategory}`, { replace: true });
    }
  }, [categoryId, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadCategory = async () => {
    try {
      if (!categoryId) {
        const lastCategory = sessionStorage.getItem('lastChatCategory');
        if (lastCategory) {
          navigate(`/chat/${lastCategory}`, { replace: true });
          return;
        }
        setError('Invalid category');
        navigate('/aihelpcentre');
        return;
      }

      const data = await categories.getOne(categoryId);
      if (!data) {
        setError('Category not found');
        navigate('/aihelpcentre');
        return;
      }

      setCategory(data);
      setError(null);
    } catch (error) {
      console.error('Error loading category:', error);
      setError('Failed to load category');
      navigate('/aihelpcentre');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || loading) return;

    updateLastActivity();
    const sanitizedMessage = sanitizeMessage(newMessage.trim());
    const tempId = Date.now().toString();
    const userMessage: Message = {
      id: tempId,
      content: sanitizedMessage,
      role: 'user',
      timestamp: new Date().toISOString(),
      category: category?.name || 'General'
    };

    try {
      setLoading(true);
      setMessages(prev => [...prev, userMessage]);
      setNewMessage('');

      const response = await chat.analyze({
        content: sanitizedMessage,
        category: category?.name || 'General'
      });

      // Update the user message with server-generated ID if available
      if (response.user_message_id) {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === tempId ? { ...msg, id: response.user_message_id } : msg
          )
        );
      }

      const assistantMessage: Message = {
        id: response.id || Date.now().toString(),
        content: sanitizeMessage(response.content),
        role: 'assistant',
        timestamp: response.created_at,
        category: category?.name || 'General'
      };

      setMessages(prev => [...prev, assistantMessage]);
      scrollToBottom();
    } catch (error: any) {
      console.error('Error sending message:', error);
      setError(error?.message || 'Failed to send message');
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (isRecording) {
      stopRecording();
      // Keep the transcript in the input field after stopping
      setNewMessage(transcript);
    } else {
      setTranscript(''); // Clear previous transcript
      startRecording();
    }
  };

  // Update newMessage in real-time as user speaks
  useEffect(() => {
    if (isRecording && transcript) {
      setNewMessage(transcript);
    }
  }, [transcript, isRecording]);

  const handleMultimediaComplete = (text: string) => {
    if (inputRef.current) {
      inputRef.current.value = text;
    }
  };

  const handleMultimediaError = (error: string) => {
    setError(error);
    setTimeout(() => setError(null), 3000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-lg">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/aihelpcentre')}
                className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
              <MessageSquare className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Help Center</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {category?.name || 'Loading...'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 text-center">
          {error}
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-blue-50/50 to-purple-50/50 dark:from-gray-900/50 dark:to-gray-800/50">
        {messages.length === 0 && !loading && (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg shadow-lg">
            Start a conversation by typing a message or using voice input
          </div>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 shadow-lg backdrop-blur-sm ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  : 'bg-white/90 dark:bg-gray-700/90 dark:text-white'
              } transform transition-all duration-200 hover:scale-[1.02]`}
            >
              <p>{message.content}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
              {message.role === 'assistant' && (
                <Feedback
                  messageId={message.id}
                  onFeedbackSubmit={() => {
                    // Optionally refresh messages or update UI
                  }}
                />
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/90 dark:bg-gray-700/90 rounded-lg p-4 shadow-lg backdrop-blur-sm flex items-center space-x-2 transform transition-all duration-200">
              <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
              <span className="text-gray-600 dark:text-gray-300">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="p-4 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-750 dark:to-gray-800 border-t dark:border-gray-700">
        <div className="flex items-center space-x-2 max-w-4xl mx-auto">
          <button
            onClick={handleVoiceInput}
            className={`p-2 rounded-full transition-colors ${
              isRecording
                ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                : 'bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 text-white'
            }`}
            title={isRecording ? 'Stop recording' : 'Start recording'}
          >
            {isRecording ? (
              <MicOff className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
            placeholder={isRecording ? 'Listening...' : 'Type your message...'}
            className="flex-1 p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            disabled={loading}
          />
          <button
            onClick={handleSubmit}
            disabled={!newMessage.trim() || loading}
            className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}