import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/lib/appContext';
import bgMomentum from '@/assets/bg-momentum.jpg';

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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <img
        src={bgMomentum}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-overlay/40" />

      <div className="relative z-10 text-center max-w-md w-full px-6 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
          ¡Hola! ¿Cómo te llamás?
        </h1>
        <p className="text-primary-foreground/80 mb-8 text-lg">
          Ingresá tu nombre o como preferís que te llamen.
        </p>

        <div className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
            placeholder="Tu nombre"
            className="w-full px-6 py-4 rounded-full bg-primary-foreground/20 backdrop-blur-md
              border border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/50
              text-center text-xl focus:outline-none focus:ring-2 focus:ring-primary-foreground/50
              transition-all duration-300"
            autoFocus
          />

          <button
            onClick={handleContinue}
            disabled={!name.trim()}
            className="w-full py-4 rounded-full bg-primary-foreground/90 text-foreground font-bold text-lg
              hover:bg-primary-foreground transition-all duration-300
              disabled:opacity-40 disabled:cursor-not-allowed
              flex items-center justify-center gap-2"
          >
            Continuar
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
