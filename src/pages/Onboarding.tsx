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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm animate-fade-in">

        {/* Wordmark */}
        <div className="flex items-center gap-2 mb-12">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-xs font-semibold tracking-widest uppercase text-primary">Aithena</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl font-semibold text-foreground leading-tight mb-2">
          ¿Cómo te llamás?
        </h1>
        <p className="text-sm text-muted-foreground mb-10">
          Para saber con quién estoy hablando.
        </p>

        {/* Divider */}
        <div className="h-px bg-border mb-8" />

        {/* Form */}
        <div className="space-y-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
            placeholder="Tu nombre"
            className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground text-base focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 shadow-sm"
            autoFocus
          />
          <button
            onClick={handleContinue}
            disabled={!name.trim()}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm tracking-wide transition-all duration-200 hover:bg-primary/90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continuar
          </button>
        </div>

      </div>
    </div>
  );
};

export default Onboarding;
