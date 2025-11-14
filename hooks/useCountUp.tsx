import { useState, useEffect } from 'react';

// Easing function for a more natural animation
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const useCountUp = (target: number, start: boolean, duration: number = 2000): number => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (start) {
      let startTime: number | null = null;
      let animationFrameId: number;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsedTime = timestamp - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const easedProgress = easeOutCubic(progress);

        const newCount = Math.floor(easedProgress * target);
        setCount(newCount);
        
        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animate);
        } else {
            // Ensure final value is exact
            setCount(target);
        }
      };

      animationFrameId = requestAnimationFrame(animate);

      return () => cancelAnimationFrame(animationFrameId);
    }
  }, [start, target, duration]);

  return count;
};

export default useCountUp;
