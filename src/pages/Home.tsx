import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/lib/appContext';
import { generateMockBreakdown } from '@/lib/mockBreakdown';
import { Task } from '@/lib/types';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 18) return 'Buenas tardes';
  return 'Buenas noches';
}

const Home = () => {
  const { state, setActiveTask } = useApp();
  const navigate = useNavigate();
  const [taskInput, setTaskInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (state.activeTask) {
      const allDone = state.activeTask.steps.every(s => s.completed);
      if (allDone) navigate('/completion');
      else navigate('/focus');
    }
  }, []);

  const handleBreakdown = async () => {
    if (!taskInput.trim()) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const steps = generateMockBreakdown(taskInput);
    const task: Task = {
      id: `task-${Date.now()}`,
      name: taskInput.trim(),
      steps,
      currentStepIndex: 0,
      createdAt: new Date().toISOString(),
      totalEstimatedMinutes: steps.reduce((sum, s) => sum + s.estimatedDurationMinutes, 0),
      totalActualSeconds: 0,
    };
    setActiveTask(task);
    setIsLoading(false);
    navigate('/breakdown');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm animate-fade-in">

        {/* Greeting */}
        <p className="text-xs font-medium tracking-widest uppercase text-primary mb-2">
          {getGreeting()}
        </p>

        {/* Name + headline */}
        <h1 className="text-3xl font-semibold text-foreground leading-tight mb-1">
          {state.userName}
        </h1>
        <p className="text-sm text-muted-foreground mb-10">
          ¿Qué tarea necesitás hacer ahora?
        </p>

        {/* Divider line minimalista */}
        <div className="h-px bg-border mb-8" />

        {/* Input area */}
        <div className="space-y-3">
          <input
            type="text"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleBreakdown()}
            placeholder="Escribí tu tarea"
            className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground text-base focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 shadow-sm"
            autoFocus
            disabled={isLoading}
          />

          <button
            onClick={handleBreakdown}
            disabled={isLoading || !taskInput.trim()}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm tracking-wide transition-all duration-200 hover:bg-primary/90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Analizando...
              </>
            ) : (
              'Desglosar tarea'
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Home;
