import confetti from 'canvas-confetti';

export const triggerConfetti = () => {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999
  };

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ['#ef4444', '#dc2626', '#f87171']
  });
  fire(0.2, {
    spread: 60,
    colors: ['#ffffff', '#fbbf24', '#10b981']
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    colors: ['#38bdf8', '#818cf8', '#c084fc']
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
};
