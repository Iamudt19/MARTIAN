import confetti from 'canvas-confetti';

export function triggerCompletionCelebration() {
  const duration = 5 * 1000;
  const animationEnd = Date.now() + duration;
  const colors = ['#2E140B', '#C84B1E', '#C26D1F', '#FBF4EC', '#F5D0B5'];

  const frame = () => {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: colors,
      disableForReducedMotion: true,
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: colors,
      disableForReducedMotion: true,
    });

    if (Date.now() < animationEnd) {
      requestAnimationFrame(frame);
    }
  };

  confetti({
    particleCount: 120,
    spread: 100,
    origin: { y: 0.6 },
    colors: colors,
  });

  frame();
}
