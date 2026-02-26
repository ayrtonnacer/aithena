import React from 'react';

interface TaskProgressBarProps {
  completedSteps: number;
  totalSteps: number;
}

export function TaskProgressBar({ completedSteps, totalSteps }: TaskProgressBarProps) {
  const percentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  return (
    <div className="w-full">
      {/* Segmented dots – estilo Oura */}
      <div className="flex items-center gap-1">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={[
              'h-1 flex-1 rounded-full transition-all duration-500',
              i < completedSteps
                ? 'bg-primary'
                : 'bg-secondary'
            ].join(' ')}
          />
        ))}
      </div>
    </div>
  );
}
