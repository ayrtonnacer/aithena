import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/lib/appContext';
import { useTimer } from '@/hooks/useTimer';
import { VisualTimer } from '@/components/VisualTimer';
import { TaskProgressBar } from '@/components/TaskProgressBar';
import { Play, Pause, Plus, Check } from 'lucide-react';

const FocusTimer = () => {
  const { state, updateActiveTask } = useApp();
  const navigate = useNavigate();
  const [showTransition, setShowTransition] = useState(false);

  const task = state.activeTask;

  useEffect(() => {
    if (!task) navigate('/home');
  }, [task, navigate]);

  const currentStep = task?.steps[task.currentStepIndex];
  const nextStep = task?.steps[(task?.currentStepIndex ?? 0) + 1];
  const completedSteps = task?.steps.filter(s => s.completed).length ?? 0;

  const timer = useTimer((currentStep?.estimatedDurationMinutes ?? 15) * 60);

  useEffect(() => {
    if (currentStep) {
      timer.reset(currentStep.estimatedDurationMinutes * 60);
    }
  }, [task?.currentStepIndex]);

  if (!task || !currentStep) return null;

  const handleFinishStep = () => {
    updateActiveTask(t => {
      const steps = t.steps.map((s, i) =>
        i === t.currentStepIndex
          ? { ...s, completed: true, actualDurationSeconds: timer.elapsedSeconds }
          : s
      );
      return {
        ...t,
        steps,
        totalActualSeconds: t.totalActualSeconds + timer.elapsedSeconds,
      };
    });

    const isLastStep = task.currentStepIndex === task.steps.length - 1;
    if (isLastStep) {
      navigate('/completion');
    } else {
      setShowTransition(true);
    }
  };

  const handleNextStep = () => {
    updateActiveTask(t => ({ ...t, currentStepIndex: t.currentStepIndex + 1 }));
    setShowTransition(false);
  };

  const handleRest = () => {
    navigate('/home');
  };

  if (showTransition) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center max-w-sm animate-fade-in">
          <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
            <Check className="w-7 h-7 text-success animate-check-bounce" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">¡Paso completado!</h2>
          <p className="text-muted-foreground mb-2">{currentStep.title}</p>

          {nextStep && (
            <p className="text-sm text-muted-foreground mb-8">
              Siguiente: <span className="text-foreground font-medium">{nextStep.title}</span>
              <span className="text-muted-foreground"> · {nextStep.estimatedDurationMinutes} min</span>
            </p>
          )}

          <div className="space-y-3">
            <button
              onClick={handleNextStep}
              className="w-full py-3.5 rounded-lg bg-primary text-primary-foreground font-medium text-lg
                hover:opacity-90 transition-all duration-200"
            >
              Siguiente paso →
            </button>
            <button
              onClick={handleRest}
              className="w-full py-3 rounded-lg bg-secondary text-secondary-foreground font-medium
                hover:bg-secondary/80 transition-all duration-200"
            >
              Descansar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="px-6 pt-6 max-w-lg mx-auto w-full">
        <TaskProgressBar completedSteps={completedSteps} totalSteps={task.steps.length} />
      </div>

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center animate-fade-in">
          <p className="text-sm text-muted-foreground mb-1">
            Paso {currentStep.stepNumber} de {task.steps.length}
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {currentStep.title}
          </h1>
          <p className="text-muted-foreground mb-8 max-w-sm mx-auto text-sm">
            {currentStep.description}
          </p>

          <VisualTimer
            secondsLeft={timer.secondsLeft}
            totalSeconds={timer.totalSeconds}
            status={timer.status}
          />

          <div className="flex items-center justify-center gap-3 mt-8 flex-wrap">
            {timer.status === 'idle' && (
              <button
                onClick={timer.start}
                className="flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-primary-foreground
                  font-medium text-lg hover:opacity-90 transition-all duration-200"
              >
                <Play size={18} /> Iniciar
              </button>
            )}

            {timer.status === 'running' && (
              <button
                onClick={timer.pause}
                className="flex items-center gap-2 px-8 py-3 rounded-lg bg-secondary text-secondary-foreground
                  font-medium hover:bg-secondary/80 transition-all duration-200"
              >
                <Pause size={18} /> Pausar
              </button>
            )}

            {timer.status === 'paused' && (
              <button
                onClick={timer.resume}
                className="flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-primary-foreground
                  font-medium hover:opacity-90 transition-all duration-200"
              >
                <Play size={18} /> Reanudar
              </button>
            )}

            {(timer.status === 'running' || timer.status === 'paused' || timer.status === 'finished') && (
              <>
                <button
                  onClick={() => timer.addTime(300)}
                  className="flex items-center gap-1 px-5 py-3 rounded-lg bg-secondary text-secondary-foreground
                    font-medium hover:bg-secondary/80 transition-all duration-200"
                >
                  <Plus size={16} /> 5 min
                </button>

                <button
                  onClick={handleFinishStep}
                  className="flex items-center gap-2 px-8 py-3 rounded-lg bg-success text-success-foreground
                    font-medium hover:opacity-90 transition-all duration-200"
                >
                  <Check size={18} /> Terminé
                </button>
              </>
            )}
          </div>

          {nextStep && (
            <p className="mt-10 text-sm text-muted-foreground">
              Siguiente: <span className="text-foreground">{nextStep.title}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FocusTimer;
