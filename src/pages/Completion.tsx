import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/lib/appContext';
import { ConfettiCelebration } from '@/components/ConfettiCelebration';

const Completion = () => {
  const { state, addToHistory } = useApp();
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);

  const task = state.activeTask;

  useEffect(() => {
    if (!task) {
      navigate('/home');
      return;
    }
    const timeout = setTimeout(() => setShowConfetti(true), 300);
    return () => clearTimeout(timeout);
  }, []);

  if (!task) return null;

  const completedSteps = task.steps.filter(s => s.completed).length;
  const totalEstMinutes = task.totalEstimatedMinutes;
  const totalActMinutes = Math.round(task.totalActualSeconds / 60);

  const handleNewTask = () => {
    addToHistory({
      name: task.name,
      date: new Date().toISOString(),
      totalTimeMinutes: totalActMinutes,
      stepsCompleted: completedSteps,
      totalSteps: task.steps.length,
    });
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      {showConfetti && <ConfettiCelebration />}

      <div className="w-full max-w-sm animate-fade-in">

        {/* Status dot + label */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-xs font-semibold tracking-widest uppercase text-primary">Completado</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl font-semibold text-foreground leading-tight mb-1">
          ¡Listo, {state.userName}!
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          {task.name}
        </p>

        {/* Divider */}
        <div className="h-px bg-border mb-6" />

        {/* Stats – estilo Oura cards */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="p-4 rounded-xl bg-card border border-border">
            <p className="text-xs text-muted-foreground mb-1">Estimado</p>
            <p className="text-xl font-semibold text-foreground tabular-nums">{totalEstMinutes}</p>
            <p className="text-xs text-muted-foreground">min</p>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border">
            <p className="text-xs text-muted-foreground mb-1">Real</p>
            <p className="text-xl font-semibold text-foreground tabular-nums">{totalActMinutes}</p>
            <p className="text-xs text-muted-foreground">min</p>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border">
            <p className="text-xs text-muted-foreground mb-1">Pasos</p>
            <p className="text-xl font-semibold text-foreground tabular-nums">{completedSteps}/{task.steps.length}</p>
            <p className="text-xs text-muted-foreground">ok</p>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleNewTask}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm tracking-wide hover:bg-primary/90 active:scale-[0.98] transition-all duration-200"
        >
          Nueva tarea
        </button>
      </div>
    </div>
  );
};

export default Completion;
