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
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <ConfettiCelebration show={showConfetti} />
      <div className="text-center animate-fade-in max-w-sm w-full">
        <p className="text-5xl mb-4">🎉</p>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          ¡Listo, {state.userName}!
        </h1>
        <p className="text-muted-foreground mb-6">
          Terminaste: <span className="font-semibold text-foreground">{task.name}</span>
        </p>

        <div className="bg-card border rounded-xl p-4 mb-8 text-sm text-left space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tiempo estimado</span>
            <span className="font-medium">{totalEstMinutes} min</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tiempo real</span>
            <span className="font-medium">{totalActMinutes} min</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Pasos completados</span>
            <span className="font-medium">{completedSteps}/{task.steps.length}</span>
          </div>
        </div>

        <button
          onClick={handleNewTask}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 active:scale-95 transition-all"
        >
          Nueva tarea
        </button>
      </div>
    </div>
  );
};

export default Completion;
