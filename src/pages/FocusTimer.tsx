import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/lib/appContext';
import { useTimer } from '@/hooks/useTimer';
import { usePexelsImage } from '@/hooks/usePexelsImage';
import { VisualTimer } from '@/components/VisualTimer';
import { TaskProgressBar } from '@/components/TaskProgressBar';
import { Play, Pause, Plus, Check } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

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

  // Build a search query from step title for a contextual photo
  const imageQuery = currentStep?.title;
  const { photo, loading: photoLoading } = usePexelsImage(imageQuery);

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

  /* ── TRANSITION SCREEN ── */
  if (showTransition) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm animate-fade-in">

          {/* Check icon */}
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Check className="w-6 h-6 text-primary" />
          </div>

          <p className="text-xs font-medium tracking-widest uppercase text-primary mb-2">
            Paso completado
          </p>
          <h2 className="text-2xl font-semibold text-foreground leading-tight mb-1">
            {currentStep.title}
          </h2>

          {nextStep && (
            <div className="mt-8 p-4 rounded-xl bg-card border border-border">
              <p className="text-xs text-muted-foreground mb-1">Siguiente</p>
              <p className="text-sm font-medium text-foreground">{nextStep.title}</p>
              <span className="inline-block mt-1 text-xs text-primary font-medium">{nextStep.estimatedDurationMinutes} min</span>
            </div>
          )}

          <div className="mt-8 space-y-2">
            <button
              onClick={handleNextStep}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm tracking-wide hover:bg-primary/90 active:scale-[0.98] transition-all duration-200"
            >
              Siguiente paso
            </button>
            <button
              onClick={handleRest}
              className="w-full py-3 rounded-xl bg-secondary text-secondary-foreground font-medium text-sm tracking-wide hover:bg-secondary/80 active:scale-[0.98] transition-all duration-200"
            >
              Descansar
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── MAIN TIMER SCREEN ── */
  return (
    <div className="min-h-screen bg-background flex flex-col px-6 pt-10 pb-8">
      <div className="w-full max-w-sm mx-auto flex flex-col gap-6 animate-fade-in">

        {/* Progress */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
              Paso {currentStep.stepNumber} de {task.steps.length}
            </p>
            <p className="text-xs text-muted-foreground">
              {completedSteps}/{task.steps.length} completados
            </p>
          </div>
          <TaskProgressBar completedSteps={completedSteps} totalSteps={task.steps.length} />
        </div>

        {/* Step title */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground leading-tight mb-1">
            {currentStep.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            {currentStep.description}
          </p>
        </div>

        {/* Visual support image */}
        {photoLoading ? (
          <Skeleton className="w-full h-40 rounded-xl" />
        ) : photo ? (
          <div className="w-full rounded-xl overflow-hidden border border-border">
            <img
              src={photo.src}
              alt={photo.alt || currentStep.title}
              className="w-full h-40 object-cover"
              loading="lazy"
            />
            <p className="text-[10px] text-muted-foreground px-2 py-1">
              Foto: {photo.photographer} · Pexels
            </p>
          </div>
        ) : null}

        {/* Timer */}
        <div className="flex justify-center">
          <VisualTimer
            secondsLeft={timer.secondsLeft}
            totalSeconds={(currentStep?.estimatedDurationMinutes ?? 15) * 60}
            status={timer.status}
          />
        </div>

        {/* Controls */}
        <div className="space-y-2">
          {timer.status === 'idle' && (
            <button
              onClick={timer.start}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm tracking-wide flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-[0.98] transition-all duration-200"
            >
              <Play className="w-4 h-4" />
              Iniciar
            </button>
          )}
          {timer.status === 'running' && (
            <button
              onClick={timer.pause}
              className="w-full py-3 rounded-xl bg-secondary text-secondary-foreground font-medium text-sm tracking-wide flex items-center justify-center gap-2 hover:bg-secondary/80 active:scale-[0.98] transition-all duration-200"
            >
              <Pause className="w-4 h-4" />
              Pausar
            </button>
          )}
          {timer.status === 'paused' && (
            <button
              onClick={timer.resume}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm tracking-wide flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-[0.98] transition-all duration-200"
            >
              <Play className="w-4 h-4" />
              Reanudar
            </button>
          )}

          {(timer.status === 'running' || timer.status === 'paused' || timer.status === 'finished') && (
            <div className="flex gap-2">
              <button
                onClick={() => timer.addTime(300)}
                className="flex-1 py-3 rounded-xl bg-secondary text-secondary-foreground font-medium text-sm flex items-center justify-center gap-1 hover:bg-secondary/80 active:scale-[0.98] transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                5 min
              </button>
              <button
                onClick={handleFinishStep}
                className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm flex items-center justify-center gap-1 hover:bg-primary/90 active:scale-[0.98] transition-all duration-200"
              >
                <Check className="w-4 h-4" />
                Terminé
              </button>
            </div>
          )}
        </div>

        {/* Next step peek */}
        {nextStep && (
          <div className="p-4 rounded-xl bg-card border border-border">
            <p className="text-xs text-muted-foreground mb-1">Después</p>
            <p className="text-sm font-medium text-foreground">{nextStep.title}</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default FocusTimer;
