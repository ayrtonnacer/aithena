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
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center animate-fade-in">
        <p className="text-5xl mb-6">🌿</p>
        <h1 className="text-3xl font-bold text-foreground mb-3">
          Buen trabajo, {state.userName}.
        </h1>
        <p className="text-lg text-muted-foreground max-w-sm">
          Descansá tranquilo. Cuando estés listo, volvé para tu próxima tarea.
        </p>
        <button
          onClick={handleNewTask}
          className="mt-8 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 active:scale-95 transition-all"
        >
          Nueva tarea
        </button>
      </div>
    </div>
  );
};

export default Rest;
