import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiCelebrationProps {
  trigger: boolean;
}

export function ConfettiCelebration({ trigger }: ConfettiCelebrationProps) {
  useEffect(() => {
    if (!trigger) return;

    // Paleta saturada y viva – contrasta bien contra fondo blanco
    const colors = [
      '#2563eb', // azul primary Aithena
      '#f59e0b', // amarillo ámbar
      '#ef4444', // rojo vivo
      '#10b981', // verde esmeralda
      '#8b5cf6', // violeta
      '#f97316', // naranja
      '#ec4899', // rosa fuerte
      '#06b6d4', // cyan
    ];

    // Ola 1: salva masiva desde el centro
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { x: 0.5, y: 0.55 },
      colors,
      gravity: 0.9,
      scalar: 1.1,
      ticks: 220,
    });

    // Ola 2 (delay 200ms): desde la izquierda
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 70,
        origin: { x: 0, y: 0.65 },
        colors,
        gravity: 0.85,
        scalar: 1.0,
        ticks: 200,
      });
    }, 200);

    // Ola 3 (delay 350ms): desde la derecha
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 70,
        origin: { x: 1, y: 0.65 },
        colors,
        gravity: 0.85,
        scalar: 1.0,
        ticks: 200,
      });
    }, 350);

    // Lluvia continua por 3s
    const duration = 3000;
    const end = Date.now() + duration;

    const rain = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors,
        gravity: 0.9,
        scalar: 0.95,
        ticks: 160,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors,
        gravity: 0.9,
        scalar: 0.95,
        ticks: 160,
      });
      if (Date.now() < end) {
        requestAnimationFrame(rain);
      }
    };

    setTimeout(rain, 500);

  }, [trigger]);

  return null;
}
