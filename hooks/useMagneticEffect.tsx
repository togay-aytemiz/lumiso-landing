import { RefObject, useEffect } from 'react';

interface MagneticEffectOptions {
  strength?: number;
}

const useMagneticEffect = (
  elementRef: RefObject<HTMLElement>,
  options: MagneticEffectOptions = {}
) => {
  const { strength = 0.4 } = options;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = element.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      const deltaX = (clientX - centerX);
      const deltaY = (clientY - centerY);

      const translateX = deltaX * strength;
      const translateY = deltaY * strength;
      
      element.style.transition = 'transform 0.1s linear';
      // Use translate3d for hardware acceleration
      element.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
    };

    const handleMouseLeave = () => {
      // Use a spring-like transition for the return
      element.style.transition = 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)';
      element.style.transform = 'translate3d(0, 0, 0)';
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [elementRef, strength]);
};

export default useMagneticEffect;
