import React from 'react';
import { TimerStatus } from '@/hooks/useTimer';

interface VisualTimerProps {
  secondsLeft: number;
  totalSeconds: number;
  status: TimerStatus;
}

export function VisualTimer({ secondsLeft, totalSeconds, status }: VisualTimerProps) {
  const progress = totalSeconds > 0 ? (totalSeconds - secondsLeft) / totalSeconds : 0;
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const isWarning = secondsLeft <= 180 && secondsLeft > 0 && status === 'running';
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  const getStrokeColor = () => {
    if (status === 'paused' || status === 'idle') return 'hsl(var(--timer-paused))';
    if (isWarning) return 'hsl(var(--timer-warning))';
    return 'hsl(var(--timer-running))';
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="280" height="280" className="transform -rotate-90">
        <circle
          cx="140"
          cy="140"
          r={radius}
          fill="none"
          stroke="hsl(var(--timer-bg))"
          strokeWidth="8"
        />
        <circle
          cx="140"
          cy="140"
          r={radius}
          fill="none"
          stroke={getStrokeColor()}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-linear"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-5xl font-bold tabular-nums transition-colors duration-300 ${
          isWarning ? 'text-timer-warning' : status === 'paused' ? 'text-timer-paused' : 'text-foreground'
        }`}>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
        <span className="text-sm text-muted-foreground mt-1">
          {status === 'idle' && 'Listo para empezar'}
          {status === 'running' && (isWarning ? '¡Casi terminás!' : 'En progreso')}
          {status === 'paused' && 'En pausa'}
          {status === 'finished' && '¡Tiempo!'}
        </span>
      </div>
    </div>
  );
}
