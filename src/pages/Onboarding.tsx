import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/lib/appContext';

const Onboarding = () => {
  const [name, setName] = useState('');
  const { setUserName } = useApp();
  const navigate = useNavigate();

  const handleContinue = () => {
    if (name.trim()) {
      setUserName(name.trim());
      navigate('/home');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center max-w-sm w-full animate-fade-in">
        <p className="text-5xl mb-6">🌿</p>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
          ¿Cómo te llamás?
        </h1>
        <p className="text-muted-foreground mb-10">
          Para saber con quién estoy hablando.
        </p>

        <div className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
            placeholder="Tu nombre"
            className="w-full px-5 py-3.5 rounded-lg bg-card border border-border text-foreground
              placeholder:text-muted-foreground text-center text-lg
              focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all duration-200"
            autoFocus
          />

          <button
            onClick={handleContinue}
            disabled={!name.trim()}
            className="w-full py-3.5 rounded-lg bg-primary text-primary-foreground font-medium text-lg
              hover:opacity-90 transition-all duration-200
              disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Continuar →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
