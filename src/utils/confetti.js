import confetti from 'canvas-confetti';

export function fireConfetti() {
  confetti({
    particleCount: 200,
    spread: 80,
    origin: { y: 0.5 },
    colors: ['#FACC15', '#FDE68A', '#1E293B', '#FFFFFF', '#F59E0B'],
  });
}

export function fireSmallConfetti(x, y) {
  confetti({
    particleCount: 30,
    spread: 50,
    origin: { x, y },
    colors: ['#FACC15', '#FDE68A', '#FFFFFF'],
    scalar: 0.6,
  });
}
