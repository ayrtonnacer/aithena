import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiCelebrationProps {
  trigger: boolean;
}

export function ConfettiCelebration({ trigger }: ConfettiCelebrationProps) {
  useEffect(() => {
    if (!trigger) return;

    const duration = 3500;
    const end = Date.now() + duration;

    const pastelColors = ['#a8d8b9', '#f7d6a8', '#b5c7e3', '#f0b8c8', '#d4c5f9'];

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: pastelColors,
        gravity: 0.8,
        scalar: 0.9,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: pastelColors,
        gravity: 0.8,
        scalar: 0.9,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, [trigger]);

  return null;
}
