import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/lib/appContext';
import { generateMockBreakdown } from '@/lib/mockBreakdown';
import { Task } from '@/lib/types';
import bgMomentum from '@/assets/bg-momentum.jpg';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 18) return 'Buenas tardes';
  return 'Buenas noches';
}

function formatTime(): string {
  const now = new Date();
  return now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
}

const Home = () => {
  const { state, setActiveTask } = useApp();
  const navigate = useNavigate();
  const [taskInput, setTaskInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [time, setTime] = useState(formatTime());

  React.useEffect(() => {
    const interval = setInterval(() => setTime(formatTime()), 10000);
    return () => clearInterval(interval);
  }, []);

  // If there's an active task, resume it
  React.useEffect(() => {
    if (state.activeTask) {
      const allDone = state.activeTask.steps.every(s => s.completed);
      if (allDone) {
        navigate('/completion');
      } else {
        navigate('/focus');
      }
    }
  }, []);

  const handleBreakdown = async () => {
    if (!taskInput.trim()) return;
    setIsLoading(true);

    // Simulate AI processing delay
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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <img src={bgMomentum} alt="" className="absolute inset-0 w-full h-full object-cover" aria-hidden="true" />
      <div className="absolute inset-0 bg-overlay/35" />

      <div className="relative z-10 text-center max-w-xl w-full px-6 animate-fade-in">
        <p className="text-6xl md:text-7xl font-bold text-primary-foreground mb-2 tabular-nums">
          {time}
        </p>
        <h1 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
          {getGreeting()}, {state.userName}.
        </h1>
        <p className="text-xl text-primary-foreground/80 mb-10">
          ¿Cuál es la tarea que necesitás hacer ahora?
        </p>

        <div className="space-y-4">
          <input
            type="text"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleBreakdown()}
            placeholder="Escribí la tarea que necesitás hacer ahora"
            className="w-full px-6 py-4 rounded-full bg-primary-foreground/20 backdrop-blur-md
              border border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/50
              text-center text-lg focus:outline-none focus:ring-2 focus:ring-primary-foreground/50
              transition-all duration-300"
            autoFocus
            disabled={isLoading}
          />

          <button
            onClick={handleBreakdown}
            disabled={!taskInput.trim() || isLoading}
            className="w-full py-4 rounded-full bg-primary text-primary-foreground font-bold text-lg
              hover:opacity-90 transition-all duration-300
              disabled:opacity-40 disabled:cursor-not-allowed
              flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Estoy pensando los pasos...
              </>
            ) : (
              'Desglosar tarea'
            )}
          </button>
        </div>

        <p className="mt-12 text-primary-foreground/50 text-sm italic">
          "Andá con confianza en la dirección de tus sueños."
        </p>
      </div>
    </div>
  );
};

export default Home;
