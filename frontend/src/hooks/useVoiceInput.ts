import { useState, useCallback } from 'react';

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionEvent {
  results: {
    length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
  };
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
}

export function useVoiceInput() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  const startRecording = useCallback(async () => {
    try {
      // Initialize speech recognition
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      const newRecognition = new SpeechRecognitionAPI();
      newRecognition.continuous = true;
      newRecognition.interimResults = true;

      newRecognition.onresult = (event: SpeechRecognitionEvent) => {
        const results = Array.from(event.results);
        const transcript = results
          .map(result => result[0].transcript)
          .join('');
        setTranscript(transcript);
      };

      newRecognition.onend = () => {
        setIsRecording(false);
      };

      newRecognition.start();
      setRecognition(newRecognition);
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      setIsRecording(false);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (recognition) {
      recognition.stop();
      setRecognition(null);
    }
    setIsRecording(false);
  }, [recognition]);

  return {
    isRecording,
    startRecording,
    stopRecording,
    transcript,
    setTranscript // Export this to allow clearing the transcript
  };
}