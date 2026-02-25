import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/lib/appContext';
import { TaskProgressBar } from '@/components/TaskProgressBar';
import { Trash2, ArrowUp, ArrowDown } from 'lucide-react';

const TaskBreakdown = () => {
  const { state, updateActiveTask } = useApp();
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState<string | null>(null);

  const task = state.activeTask;

  React.useEffect(() => {
    if (!task) navigate('/home');
  }, [task, navigate]);

  if (!task) return null;

  const completedSteps = task.steps.filter(s => s.completed).length;

  const updateStepTitle = (id: string, title: string) => {
    updateActiveTask(t => ({
      ...t,
      steps: t.steps.map(s => s.id === id ? { ...s, title } : s),
    }));
  };

  const updateStepDuration = (id: string, minutes: number) => {
    updateActiveTask(t => ({
      ...t,
      steps: t.steps.map(s => s.id === id ? { ...s, estimatedDurationMinutes: Math.max(1, minutes) } : s),
      totalEstimatedMinutes: t.steps.reduce((sum, s) => sum + (s.id === id ? Math.max(1, minutes) : s.estimatedDurationMinutes), 0),
    }));
  };

  const deleteStep = (id: string) => {
    if (task.steps.length <= 1) return;
    updateActiveTask(t => ({
      ...t,
      steps: t.steps.filter(s => s.id !== id).map((s, i) => ({ ...s, stepNumber: i + 1 })),
    }));
  };

  const moveStep = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= task.steps.length) return;
    updateActiveTask(t => {
      const steps = [...t.steps];
      [steps[index], steps[newIndex]] = [steps[newIndex], steps[index]];
      return { ...t, steps: steps.map((s, i) => ({ ...s, stepNumber: i + 1 })) };
    });
  };

  const startFirstStep = () => {
    navigate('/focus');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-10 animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground mb-1">{task.name}</h1>
        <p className="text-muted-foreground mb-6">
          {task.steps.length} pasos · ~{task.totalEstimatedMinutes} minutos estimados
        </p>

        <TaskProgressBar completedSteps={completedSteps} totalSteps={task.steps.length} />

        <div className="mt-8 space-y-3">
          {task.steps.map((step, index) => (
            <div
              key={step.id}
              className="group flex items-start gap-3 p-4 rounded-lg bg-card border border-border
                transition-all duration-200 hover:shadow-sm"
            >
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary
                flex items-center justify-center text-sm font-bold mt-0.5">
                {step.stepNumber}
              </span>

              <div className="flex-1 min-w-0">
                {editingId === step.id ? (
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => updateStepTitle(step.id, e.target.value)}
                    onBlur={() => setEditingId(null)}
                    onKeyDown={(e) => e.key === 'Enter' && setEditingId(null)}
                    className="w-full bg-transparent border-b border-primary text-foreground font-medium
                      focus:outline-none pb-1"
                    autoFocus
                  />
                ) : (
                  <p
                    className="font-medium text-foreground cursor-pointer hover:text-primary transition-colors"
                    onClick={() => setEditingId(step.id)}
                  >
                    {step.title}
                  </p>
                )}
                <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <input
                  type="number"
                  value={step.estimatedDurationMinutes}
                  onChange={(e) => updateStepDuration(step.id, parseInt(e.target.value) || 1)}
                  className="w-14 text-center text-sm bg-secondary text-secondary-foreground rounded-md py-1
                    border-none focus:outline-none focus:ring-1 focus:ring-primary"
                  min={1}
                />
                <span className="text-xs text-muted-foreground">min</span>

                <div className="flex flex-col ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => moveStep(index, -1)} className="p-0.5 text-muted-foreground hover:text-foreground" aria-label="Mover arriba">
                    <ArrowUp size={14} />
                  </button>
                  <button onClick={() => moveStep(index, 1)} className="p-0.5 text-muted-foreground hover:text-foreground" aria-label="Mover abajo">
                    <ArrowDown size={14} />
                  </button>
                </div>

                {task.steps.length > 1 && (
                  <button
                    onClick={() => deleteStep(step.id)}
                    className="p-1 ml-1 text-muted-foreground hover:text-destructive transition-colors
                      opacity-0 group-hover:opacity-100"
                    aria-label="Eliminar paso"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={startFirstStep}
          className="w-full mt-8 py-4 rounded-lg bg-primary text-primary-foreground font-bold text-lg
            hover:opacity-90 transition-all duration-300"
        >
          Comenzar primer paso
        </button>
      </div>
    </div>
  );
};

export default TaskBreakdown;
