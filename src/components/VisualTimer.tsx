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
  const isFinished = status === 'finished';
  const isIdle = status === 'idle';
  const isPaused = status === 'paused';

  // SVG circle params
  const size = 220;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  // Colors
  const trackColor = '#1e293b'; // slate-800
  const progressColor = isFinished
    ? '#22c55e'   // green
    : isWarning
    ? '#f97316'   // orange
    : isPaused
    ? '#94a3b8'   // slate
    : '#2563eb';  // blue

  const glowColor = isFinished
    ? 'rgba(34,197,94,0.35)'
    : isWarning
    ? 'rgba(249,115,22,0.35)'
    : isPaused
    ? 'rgba(148,163,184,0.2)'
    : 'rgba(37,99,235,0.35)';

  const statusLabel = isIdle
    ? 'Listo para empezar'
    : status === 'running'
    ? isWarning ? '\u00a1Casi termin\u00e1s!' : 'En progreso'
    : isPaused
    ? 'En pausa'
    : '\u00a1Tiempo!';

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Glow ring behind */}
        {!isIdle && (
          <div
            className="absolute inset-0 rounded-full"
            style={{
              boxShadow: `0 0 32px 8px ${glowColor}`,
              borderRadius: '50%',
              transition: 'box-shadow 0.6s ease',
            }}
          />
        )}

        <svg
          width={size}
          height={size}
          style={{ transform: 'rotate(-90deg)' }}
        >
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={trackColor}
            strokeWidth={strokeWidth}
          />
          {/* Progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={progressColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.4s ease' }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          {isFinished ? (
            <span style={{ fontSize: 48, lineHeight: 1 }}>\u2713</span>
          ) : (
            <span
              className="font-mono font-bold tabular-nums"
              style={{
                fontSize: 44,
                color: progressColor,
                letterSpacing: '-0.02em',
                transition: 'color 0.4s ease',
              }}
            >
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          )}

          {/* Progress percent */}
          {!isIdle && !isFinished && (
            <span
              className="text-xs font-medium"
              style={{ color: '#64748b' }}
            >
              {Math.round(progress * 100)}%
            </span>
          )}
        </div>
      </div>

      {/* Status label */}
      <span
        className="text-sm font-medium"
        style={{ color: '#94a3b8', letterSpacing: '0.02em' }}
      >
        {statusLabel}
      </span>
    </div>
  );
}
