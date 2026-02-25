import React from 'react';

interface TaskProgressBarProps {
  completedSteps: number;
  totalSteps: number;
}

export function TaskProgressBar({ completedSteps, totalSteps }: TaskProgressBarProps) {
  const percentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">Progreso</span>
        <span className="text-sm font-medium text-foreground">
          {completedSteps}/{totalSteps} pasos
        </span>
      </div>
      <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
