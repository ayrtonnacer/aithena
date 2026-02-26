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

  // Sand fill levels
  // Top bulb: starts full, empties as time passes
  // Bottom bulb: starts empty, fills as time passes
  const topFill = 1 - progress;   // 1 = full, 0 = empty
  const botFill = progress;        // 0 = empty, 1 = full

  // Top bulb sand polygon (trapezoid shape inside top half)
  // Top half inner region: from (cx-shoulderW, topY+4) narrowing to neck
  // Sand surface at a height proportional to topFill
  const topBulbH = neckY - topY - 8;
  const topSandH = topFill * topBulbH;
  const topSandY = neckY - 8 - topSandH;
  // Width at topSandY: interpolate from neckW at neckY to shoulderW at topY
  const topSandFrac = topSandH / topBulbH;
  const topSandW = neckW + (shoulderW - neckW) * topSandFrac;

  // Bottom bulb sand polygon
  const botBulbH = botY - neckY - 8;
  const botSandH = botFill * botBulbH;
  const botSandY = botY - botSandH;
  const botSandFrac = botSandH / botBulbH;
  const botSandW = neckW + (shoulderW - neckW) * botSandFrac;

  const sandColor = isWarning ? '#f97316' : isFinished ? '#22c55e' : isPaused ? '#94a3b8' : '#f59e0b';
  const sandColorLight = isWarning ? '#fed7aa' : isFinished ? '#bbf7d0' : isPaused ? '#e2e8f0' : '#fde68a';
  const glassColor = isWarning ? '#ea580c' : isFinished ? '#16a34a' : isPaused ? '#64748b' : '#d97706';
  const streamVisible = status === 'running' && topFill > 0.01;

  // Stream x positions for animation
  const streamKey = status;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Hourglass SVG */}
      <div className="relative">
        <svg
          width={W}
          height={H}
          viewBox={`0 0 ${W} ${H}`}
          className="drop-shadow-md"
        >
          <defs>
            {/* Clip paths for sand inside bulbs */}
            <clipPath id="topBulbClip">
              <polygon points={`
                ${cx - shoulderW},${topY + 4}
                ${cx + shoulderW},${topY + 4}
                ${cx + neckW},${neckY - 6}
                ${cx - neckW},${neckY - 6}
              `} />
            </clipPath>
            <clipPath id="botBulbClip">
              <polygon points={`
                ${cx - neckW},${neckY + 6}
                ${cx + neckW},${neckY + 6}
                ${cx + shoulderW},${botY - 4}
                ${cx - shoulderW},${botY - 4}
              `} />
            </clipPath>
            {/* Gradient for glass body */}
            <linearGradient id="glassGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="white" stopOpacity="0.25" />
              <stop offset="40%" stopColor="white" stopOpacity="0.05" />
              <stop offset="100%" stopColor="white" stopOpacity="0.15" />
            </linearGradient>
            {/* Sand texture gradient */}
            <linearGradient id="sandGradTop" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={sandColorLight} />
              <stop offset="100%" stopColor={sandColor} />
            </linearGradient>
            <linearGradient id="sandGradBot" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={sandColor} />
              <stop offset="100%" stopColor={sandColorLight} />
            </linearGradient>
            {/* Stream animation */}
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
                50% { opacity: 1; }
              }
              .sand-stream-1 {
                animation: sandDrop 0.9s linear infinite;
              }
              .sand-stream-2 {
                animation: sandDrop2 0.9s linear infinite 0.3s;
              }
              .sand-stream-3 {
                animation: sandDrop 0.9s linear infinite 0.6s;
              }
              .glow-pulse {
                animation: pulseGlow 2s ease-in-out infinite;
              }
            `}</style>
          </defs>

          {/* === GLASS OUTLINE === */}
          {/* Top bulb outline */}
          <polygon
            points={`
              ${cx - shoulderW},${topY}
              ${cx + shoulderW},${topY}
              ${cx + neckW},${neckY}
              ${cx - neckW},${neckY}
            `}
            fill="none"
            stroke={glassColor}
            strokeWidth="3"
            strokeLinejoin="round"
            opacity="0.35"
          />
          {/* Bottom bulb outline */}
          <polygon
            points={`
              ${cx - neckW},${neckY}
              ${cx + neckW},${neckY}
              ${cx + shoulderW},${botY}
              ${cx - shoulderW},${botY}
            `}
            fill="none"
            stroke={glassColor}
            strokeWidth="3"
            strokeLinejoin="round"
            opacity="0.35"
          />

          {/* === TOP SAND (clipped) === */}
          {topFill > 0.01 && (
            <rect
              x={cx - shoulderW}
              y={topSandY}
              width={shoulderW * 2}
              height={topSandH + 12}
              fill="url(#sandGradTop)"
              clipPath="url(#topBulbClip)"
            />
          )}

          {/* === BOTTOM SAND (clipped) === */}
          {botFill > 0.005 && (
            <rect
              x={cx - shoulderW}
              y={botSandY - 2}
              width={shoulderW * 2}
              height={botSandH + 12}
              fill="url(#sandGradBot)"
              clipPath="url(#botBulbClip)"
            />
          )}

          {/* === FALLING SAND STREAM === */}
          {streamVisible && (
            <g key={streamKey}>
              {/* Stream particles */}
              <circle cx={cx} cy={neckY - 4} r="2.5" fill={sandColor} className="sand-stream-1" />
              <circle cx={cx - 1} cy={neckY - 2} r="2" fill={sandColorLight} className="sand-stream-2" />
              <circle cx={cx + 1} cy={neckY} r="1.8" fill={sandColor} className="sand-stream-3" />
              {/* Thin stream line */}
              <line
                x1={cx} y1={neckY + 2}
                x2={cx} y2={neckY + Math.min(botSandH + 8, botBulbH)}
                stroke={sandColor}
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.5"
              />
            </g>
          )}

          {/* === GLASS SHIMMER OVERLAY === */}
          <polygon
            points={`
              ${cx - shoulderW},${topY}
              ${cx + shoulderW},${topY}
              ${cx + neckW},${neckY}
              ${cx - neckW},${neckY}
            `}
            fill="url(#glassGrad)"
          />
          <polygon
            points={`
              ${cx - neckW},${neckY}
              ${cx + neckW},${neckY}
              ${cx + shoulderW},${botY}
              ${cx - shoulderW},${botY}
            `}
            fill="url(#glassGrad)"
          />

          {/* === TOP & BOTTOM CAPS === */}
          <rect x={cx - shoulderW - 4} y={topY - 8} width={(shoulderW + 4) * 2} height={10} rx="4"
            fill={glassColor} opacity="0.7" />
          <rect x={cx - shoulderW - 4} y={botY - 2} width={(shoulderW + 4) * 2} height={10} rx="4"
            fill={glassColor} opacity="0.7" />

          {/* Finished checkmark or idle dots */}
          {isFinished && (
            <text x={cx} y={neckY + 5} textAnchor="middle" fontSize="22" fill="#16a34a" fontWeight="bold">
              ✓
            </text>
          )}
        </svg>
      </div>

      {/* === TIME DISPLAY === */}
      <div className="text-center">
        <div
          className="text-5xl font-bold tabular-nums tracking-tight transition-colors duration-300"
          style={{ color: isWarning ? '#f97316' : isFinished ? '#22c55e' : isPaused ? '#94a3b8' : 'hsl(var(--foreground))' }}
        >
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
        <div className="text-sm font-medium mt-1" style={{ color: isWarning ? '#f97316' : '#94a3b8' }}>
          {isIdle && 'Listo para empezar'}
          {status === 'running' && (isWarning ? '¡Casi terminás!' : 'En progreso')}
          {isPaused && 'En pausa'}
          {isFinished && '¡Tiempo!'}
        </div>
      </div>
    </div>
  );
}
