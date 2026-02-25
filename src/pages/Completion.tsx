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
    // Trigger confetti
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

  const handleClose = () => {
    addToHistory({
      name: task.name,
      date: new Date().toISOString(),
      totalTimeMinutes: totalActMinutes,
      stepsCompleted: completedSteps,
      totalSteps: task.steps.length,
    });
    navigate('/rest');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <ConfettiCelebration trigger={showConfetti} />

      <div className="text-center max-w-md animate-fade-in">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          ¡Listo, {state.userName}!
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Terminaste: <span className="text-foreground font-medium">{task.name}</span>
        </p>

        {/* Summary */}
        <div className="bg-card rounded-xl border border-border p-6 mb-8 text-left space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tiempo estimado</span>
            <span className="font-medium text-foreground">{totalEstMinutes} min</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tiempo real</span>
            <span className="font-medium text-foreground">{totalActMinutes} min</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Pasos completados</span>
            <span className="font-medium text-foreground">{completedSteps}/{task.steps.length}</span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleNewTask}
            className="w-full py-4 rounded-lg bg-primary text-primary-foreground font-bold text-lg
              hover:opacity-90 transition-all duration-300"
          >
            Nueva tarea
          </button>
          <button
            onClick={handleClose}
            className="w-full py-3 rounded-lg bg-secondary text-secondary-foreground font-medium
              hover:bg-secondary/80 transition-all duration-300"
          >
            Cerrar por hoy
          </button>
        </div>
      </div>
    </div>
  );
};

export default Completion;
