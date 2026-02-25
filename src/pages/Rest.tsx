import React from 'react';
import { useApp } from '@/lib/appContext';

const Rest = () => {
  const { state } = useApp();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center animate-fade-in">
        <p className="text-5xl mb-6">🌿</p>
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Buen trabajo, {state.userName}.
        </h1>
        <p className="text-xl text-muted-foreground max-w-md">
          Descansá tranquilo. Cuando estés listo, volvé para tu próxima tarea.
        </p>
      </div>
    </div>
  );
};

export default Rest;
