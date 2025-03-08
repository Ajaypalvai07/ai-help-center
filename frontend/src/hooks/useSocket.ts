import { useEffect, useState } from 'react';

// Mock WebSocket functionality for frontend-only development
class MockSocket {
  private listeners: { [key: string]: Function[] } = {};
  private _connected = false;
  private timeoutId: NodeJS.Timeout | null = null;

  get isConnected() {
    return this._connected;
  }

  constructor() {
    // Simulate connection after a brief delay
    setTimeout(() => {
      this._connected = true;
      this.emit('connect');
    }, 100);
  }

  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  emit(event: string, ...args: any[]) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(...args));
    }

    // Simulate typing indicator behavior
    if (event === 'typing') {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
      
      // Notify all listeners about typing
      if (this.listeners['typing']) {
        this.listeners['typing'].forEach(callback => callback());
      }

      // Clear typing indicator after 1 second
      this.timeoutId = setTimeout(() => {
        if (this.listeners['typing']) {
          this.listeners['typing'].forEach(callback => callback(false));
        }
      }, 1000);
    }
  }

  close() {
    this._connected = false;
    if (this.listeners['disconnect']) {
      this.listeners['disconnect'].forEach(callback => callback());
    }
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}

export function useSocket() {
  const [socket, setSocket] = useState<MockSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const newSocket = new MockSocket();

    newSocket.on('connect', () => {
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('typing', () => {
      setTyping(true);
      setTimeout(() => setTyping(false), 1000);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return { socket, isConnected, typing };
}