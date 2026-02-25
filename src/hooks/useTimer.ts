import { useState, useRef, useCallback, useEffect } from 'react';

export type TimerStatus = 'idle' | 'running' | 'paused' | 'finished';

interface UseTimerReturn {
  secondsLeft: number;
  totalSeconds: number;
  status: TimerStatus;
  start: () => void;
  pause: () => void;
  resume: () => void;
  addTime: (seconds: number) => void;
  reset: (newDurationSeconds: number) => void;
  elapsedSeconds: number;
}

export function useTimer(initialDurationSeconds: number): UseTimerReturn {
  const [secondsLeft, setSecondsLeft] = useState(initialDurationSeconds);
  const [totalSeconds, setTotalSeconds] = useState(initialDurationSeconds);
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    clearTimer();
    setStatus('running');
    intervalRef.current = window.setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearTimer();
          setStatus('finished');
          return 0;
        }
        return prev - 1;
      });
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
  }, [clearTimer]);

  const pause = useCallback(() => {
    clearTimer();
    setStatus('paused');
  }, [clearTimer]);

  const resume = useCallback(() => {
    if (status !== 'paused') return;
    start();
  }, [status, start]);

  const addTime = useCallback((seconds: number) => {
    setSecondsLeft(prev => prev + seconds);
    setTotalSeconds(prev => prev + seconds);
    if (status === 'finished') {
      setStatus('paused');
    }
  }, [status]);

  const reset = useCallback((newDurationSeconds: number) => {
    clearTimer();
    setSecondsLeft(newDurationSeconds);
    setTotalSeconds(newDurationSeconds);
    setElapsedSeconds(0);
    setStatus('idle');
  }, [clearTimer]);

  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  return { secondsLeft, totalSeconds, status, start, pause, resume, addTime, reset, elapsedSeconds };
}
