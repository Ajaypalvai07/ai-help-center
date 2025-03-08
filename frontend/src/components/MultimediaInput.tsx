import React, { useState, useRef } from 'react';
import { Mic, Image, Loader2 } from 'lucide-react';
import api from '../lib/api';

interface MultimediaInputProps {
  onUploadComplete: (text: string) => void;
  onError: (error: string) => void;
}

interface AnalysisResponse {
  id: string;
  status: 'processing' | 'completed' | 'error';
  result?: {
    text: string;
    confidence: number;
  };
  error?: string;
}

interface UploadResponse {
  id: string;
  status: string;
}

export default function MultimediaInput({ onUploadComplete, onError }: MultimediaInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        await handleVoiceUpload(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      onError('Failed to start recording. Please check your microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleVoiceUpload = async (blob: Blob) => {
    try {
      setIsUploading(true);
      const file = new File([blob], 'voice-input.wav', { type: 'audio/wav' });
      const response = await api.multimedia.uploadVoice(file) as UploadResponse;
      
      // Poll for analysis results
      const result = await pollAnalysisResult(response.id);
      if (result.status === 'completed' && result.result?.text) {
        onUploadComplete(result.result.text);
      } else {
        onError('Failed to process voice input');
      }
    } catch (error) {
      console.error('Error uploading voice:', error);
      onError('Failed to upload voice recording');
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const response = await api.multimedia.uploadImage(file) as UploadResponse;
      
      // Poll for analysis results
      const result = await pollAnalysisResult(response.id);
      if (result.status === 'completed' && result.result?.text) {
        onUploadComplete(result.result.text);
      } else {
        onError('Failed to process image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      onError('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const pollAnalysisResult = async (analysisId: string): Promise<AnalysisResponse> => {
    const maxAttempts = 10;
    const delay = 1000; // 1 second

    for (let i = 0; i < maxAttempts; i++) {
      const result = await api.multimedia.getAnalysis(analysisId) as AnalysisResponse;
      if (result.status === 'completed' || result.status === 'error') {
        return result;
      }
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    throw new Error('Analysis timed out');
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`p-2 rounded-full transition-colors ${
          isRecording 
            ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400'
            : 'bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400'
        }`}
        disabled={isUploading}
      >
        {isUploading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Mic className={`h-5 w-5 ${isRecording ? 'animate-pulse' : ''}`} />
        )}
      </button>

      <button
        onClick={() => fileInputRef.current?.click()}
        className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400 transition-colors"
        disabled={isUploading}
      >
        {isUploading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Image className="h-5 w-5" />
        )}
      </button>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleImageUpload(file);
          }
        }}
      />
    </div>
  );
} 