import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/lib/appContext';

const Rest = () => {
  const { state, setActiveTask } = useApp();
  const navigate = useNavigate();

  const handleNewTask = () => {
    setActiveTask(null);
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm animate-fade-in">

        {/* Status dot */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-2 rounded-full bg-primary opacity-60" />
          <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">Descanso</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl font-semibold text-foreground leading-tight mb-2">
          Buen trabajo, {state.userName}.
        </h1>
        <p className="text-sm text-muted-foreground mb-10">
          Descansá tranquilo. Cuando estés listo, volvé para tu próxima tarea.
        </p>

        {/* Divider */}
        <div className="h-px bg-border mb-8" />

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

export default Rest;
