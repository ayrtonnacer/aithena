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
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center max-w-md w-full animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          {getGreeting()}, {state.userName}.
        </h1>
        <p className="text-muted-foreground mb-10">
          ¿Qué tarea necesitás hacer ahora?
        </p>

        <div className="space-y-4">
          <input
            type="text"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleBreakdown()}
            placeholder="Escribí tu tarea"
            className="w-full px-5 py-3.5 rounded-lg bg-card border border-border text-foreground
              placeholder:text-muted-foreground text-center text-lg
              focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all duration-200"
            autoFocus
            disabled={isLoading}
          />

          <button
            onClick={handleBreakdown}
            disabled={!taskInput.trim() || isLoading}
            className="w-full py-3.5 rounded-lg bg-primary text-primary-foreground font-medium text-lg
              hover:opacity-90 transition-all duration-200
              disabled:opacity-30 disabled:cursor-not-allowed
              flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Pensando los pasos...
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
