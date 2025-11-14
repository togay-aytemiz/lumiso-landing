import React, { useRef, ReactElement, cloneElement } from 'react';
import useMagneticEffect from '../hooks/useMagneticEffect';

interface MagneticWrapperProps {
  children: ReactElement; // Must be a single React element that can accept a ref
  strength?: number;
}

const MagneticWrapper: React.FC<MagneticWrapperProps> = ({ children, strength = 0.5 }) => {
  const magneticRef = useRef<HTMLElement>(null);
  useMagneticEffect(magneticRef, { strength });
  
  // The child must be able to accept a ref. Standard DOM elements like `a` or `button` are fine.
  // If the child is a custom functional component, it must be wrapped in `forwardRef`.
  // FIX: Cast `children` to `React.ReactElement<any>` to resolve a TypeScript error.
  // This helps TypeScript correctly infer the props type for `cloneElement`,
  // allowing the `ref` property to be passed without a type mismatch. This is a
  // common workaround for a known limitation in React's type definitions.
  return cloneElement(children as React.ReactElement<any>, { ref: magneticRef });
};

export default MagneticWrapper;
