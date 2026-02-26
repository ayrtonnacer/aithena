import React, { useEffect, useRef } from 'react';
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

  // Hourglass geometry
  const W = 160;
  const H = 220;
  const cx = W / 2;
  const neckY = H / 2;
  const neckW = 10;
  const topY = 18;
  const botY = H - 18;
  const shoulderW = 62;

  const topFill = 1 - progress;
  const botFill = progress;

  const topBulbH = neckY - topY - 8;
  const topSandH = topFill * topBulbH;
  const topSandY = neckY - 8 - topSandH;
  const topSandFrac = topSandH / topBulbH;
  const topSandW = neckW + (shoulderW - neckW) * topSandFrac;

  const botBulbH = botY - neckY - 8;
  const botSandH = botFill * botBulbH;
  const botSandY = botY - botSandH;
  const botSandFrac = botSandH / botBulbH;
  const botSandW = neckW + (shoulderW - neckW) * botSandFrac;

  // Color palette – azul Aithena
  const sandColor   = isWarning  ? '#f97316'
                    : isFinished ? '#22c55e'
                    : isPaused   ? '#94a3b8'
                    : '#2563eb';  // primary blue
  const sandColorLight = isWarning  ? '#fed7aa'
                       : isFinished ? '#bbf7d0'
                       : isPaused   ? '#e2e8f0'
                       : '#93c5fd';  // blue-300
  const glassColor  = isWarning  ? '#ea580c'
                    : isFinished ? '#16a34a'
                    : isPaused   ? '#64748b'
                    : '#1d4ed8';  // blue-700

  const streamVisible = status === 'running' && topFill > 0.01;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Hourglass SVG */}
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none">
        <defs>
          <clipPath id="top-clip">
            <polygon points={`${cx - shoulderW},${topY} ${cx + shoulderW},${topY} ${cx + neckW},${neckY} ${cx - neckW},${neckY}`} />
          </clipPath>
          <clipPath id="bot-clip">
            <polygon points={`${cx - neckW},${neckY} ${cx + neckW},${neckY} ${cx + shoulderW},${botY} ${cx - shoulderW},${botY}`} />
          </clipPath>
          <linearGradient id="glass-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="white" stopOpacity="0.08" />
            <stop offset="50%" stopColor="white" stopOpacity="0.18" />
            <stop offset="100%" stopColor="white" stopOpacity="0.04" />
          </linearGradient>
          <linearGradient id="sand-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={sandColorLight} stopOpacity="0.9" />
            <stop offset="100%" stopColor={sandColor} stopOpacity="1" />
          </linearGradient>
          <style>{`
            @keyframes sandDrop {
              0%   { transform: translateY(0px); opacity: 0.9; }
              100% { transform: translateY(${neckY + 6 + botSandH}px); opacity: 0; }
            }
            @keyframes sandDrop2 {
              0%   { transform: translateY(4px); opacity: 0.7; }
              100% { transform: translateY(${neckY + 6 + botSandH}px); opacity: 0; }
            }
            @keyframes pulseGlow {
              0%, 100% { opacity: 0.6; }
              50%       { opacity: 1; }
            }
            .sand-stream-1 { animation: sandDrop  0.9s linear infinite; }
            .sand-stream-2 { animation: sandDrop2 0.9s linear infinite 0.3s; }
            .sand-stream-3 { animation: sandDrop  0.9s linear infinite 0.6s; }
            .glow-pulse    { animation: pulseGlow 2s ease-in-out infinite; }
          `}</style>
        </defs>

        {/* Glass outline – top */}
        <polygon
          points={`${cx - shoulderW},${topY} ${cx + shoulderW},${topY} ${cx + neckW},${neckY} ${cx - neckW},${neckY}`}
          fill="none" stroke={glassColor} strokeWidth="2" strokeLinejoin="round" opacity="0.35"
        />
        {/* Glass outline – bottom */}
        <polygon
          points={`${cx - neckW},${neckY} ${cx + neckW},${neckY} ${cx + shoulderW},${botY} ${cx - shoulderW},${botY}`}
          fill="none" stroke={glassColor} strokeWidth="2" strokeLinejoin="round" opacity="0.35"
        />

        {/* Top sand */}
        {topFill > 0.01 && (
          <polygon
            clipPath="url(#top-clip)"
            points={`${cx - topSandW},${topSandY} ${cx + topSandW},${topSandY} ${cx + neckW},${neckY - 2} ${cx - neckW},${neckY - 2}`}
            fill="url(#sand-grad)"
          />
        )}

        {/* Bottom sand */}
        {botFill > 0.005 && (
          <polygon
            clipPath="url(#bot-clip)"
            points={`${cx - botSandW},${botSandY} ${cx + botSandW},${botSandY} ${cx + shoulderW},${botY} ${cx - shoulderW},${botY}`}
            fill="url(#sand-grad)"
          />
        )}

        {/* Falling stream */}
        {streamVisible && (
          <g>
            <rect className="sand-stream-1" x={cx - 1} y={neckY} width={2} height={8} fill={sandColor} opacity="0.8" />
            <rect className="sand-stream-2" x={cx - 1} y={neckY} width={2} height={6} fill={sandColorLight} opacity="0.6" />
            <rect className="sand-stream-3" x={cx - 1} y={neckY} width={2} height={5} fill={sandColor} opacity="0.5" />
          </g>
        )}

        {/* Glass shimmer */}
        <polygon
          points={`${cx - shoulderW},${topY} ${cx + shoulderW},${topY} ${cx + neckW},${neckY} ${cx - neckW},${neckY}`}
          fill="url(#glass-grad)"
        />
        <polygon
          points={`${cx - neckW},${neckY} ${cx + neckW},${neckY} ${cx + shoulderW},${botY} ${cx - shoulderW},${botY}`}
          fill="url(#glass-grad)"
        />

        {/* Caps */}
        <rect x={cx - shoulderW - 4} y={topY - 6} width={(shoulderW + 4) * 2} height={7} rx="3" fill={glassColor} opacity="0.5" />
        <rect x={cx - shoulderW - 4} y={botY - 1} width={(shoulderW + 4) * 2} height={7} rx="3" fill={glassColor} opacity="0.5" />

        {/* Finished checkmark */}
        {isFinished && (
          <text x={cx} y={neckY + 6} textAnchor="middle" dominantBaseline="middle"
            fontSize="22" fill="#22c55e" fontWeight="600" fontFamily="Inter, sans-serif">
            ✓
          </text>
        )}
      </svg>

      {/* Time display */}
      <div className="text-center">
        <p className="text-4xl font-semibold tabular-nums text-foreground tracking-tight">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </p>
        <p className="text-xs font-medium text-muted-foreground mt-1">
          {isIdle      && 'Listo para empezar'}
          {status === 'running' && (isWarning ? '¡Casi terminás!' : 'En progreso')}
          {isPaused    && 'En pausa'}
          {isFinished  && '¡Tiempo!'}
        </p>
      </div>
    </div>
  );
}
