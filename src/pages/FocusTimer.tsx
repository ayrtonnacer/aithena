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

  // Reset timer when step changes
  useEffect(() => {
    if (currentStep) {
      timer.reset(currentStep.estimatedDurationMinutes * 60);
    }
  }, [task?.currentStepIndex]);

  if (!task || !currentStep) return null;

  const handleFinishStep = () => {
    // Save actual duration
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

    // Check if last step
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

  // Transition screen
  if (showTransition) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center max-w-md animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-success animate-check-bounce" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">¡Paso completado!</h2>
          <p className="text-muted-foreground mb-2">Terminaste: {currentStep.title}</p>

          {nextStep && (
            <p className="text-sm text-muted-foreground mb-8">
              Siguiente: <span className="text-foreground font-medium">{nextStep.title}</span>
              <span className="text-muted-foreground"> · {nextStep.estimatedDurationMinutes} min</span>
            </p>
          )}

          <p className="text-lg text-foreground mb-6">¿Pasamos al siguiente paso?</p>

          <div className="space-y-3">
            <button
              onClick={handleNextStep}
              className="w-full py-4 rounded-lg bg-primary text-primary-foreground font-bold text-lg
                hover:opacity-90 transition-all duration-300"
            >
              Sí, sigamos
            </button>
            <button
              onClick={handleRest}
              className="w-full py-3 rounded-lg bg-secondary text-secondary-foreground font-medium
                hover:bg-secondary/80 transition-all duration-300"
            >
              No, descanso
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress */}
      <div className="px-6 pt-6 max-w-2xl mx-auto w-full">
        <TaskProgressBar completedSteps={completedSteps} totalSteps={task.steps.length} />
      </div>

      {/* Main timer area */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center animate-fade-in">
          <p className="text-sm text-muted-foreground mb-1">
            Paso {currentStep.stepNumber} de {task.steps.length}
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {currentStep.title}
          </h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            {currentStep.description}
          </p>

          <VisualTimer
            secondsLeft={timer.secondsLeft}
            totalSeconds={timer.totalSeconds}
            status={timer.status}
          />

          {/* Controls */}
          <div className="flex items-center justify-center gap-3 mt-8 flex-wrap">
            {timer.status === 'idle' && (
              <button
                onClick={timer.start}
                className="flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-primary-foreground
                  font-bold text-lg hover:opacity-90 transition-all duration-300"
              >
                <Play size={20} /> Iniciar
              </button>
            )}

            {timer.status === 'running' && (
              <button
                onClick={timer.pause}
                className="flex items-center gap-2 px-8 py-3 rounded-full bg-secondary text-secondary-foreground
                  font-bold hover:bg-secondary/80 transition-all duration-300"
              >
                <Pause size={20} /> Pausar
              </button>
            )}

            {timer.status === 'paused' && (
              <button
                onClick={timer.resume}
                className="flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-primary-foreground
                  font-bold hover:opacity-90 transition-all duration-300"
              >
                <Play size={20} /> Reanudar
              </button>
            )}

            {(timer.status === 'running' || timer.status === 'paused' || timer.status === 'finished') && (
              <>
                <button
                  onClick={() => timer.addTime(300)}
                  className="flex items-center gap-1 px-5 py-3 rounded-full bg-secondary text-secondary-foreground
                    font-medium hover:bg-secondary/80 transition-all duration-300"
                >
                  <Plus size={16} /> 5 min
                </button>

                <button
                  onClick={handleFinishStep}
                  className="flex items-center gap-2 px-8 py-3 rounded-full bg-success text-success-foreground
                    font-bold hover:opacity-90 transition-all duration-300"
                >
                  <Check size={20} /> Terminé este paso
                </button>
              </>
            )}
          </div>

          {/* Next step hint */}
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
