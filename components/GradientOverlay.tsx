import React from 'react';

interface GradientOverlayProps {
  className?: string;
}

const GradientOverlay: React.FC<GradientOverlayProps> = ({ className = '' }) => {
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-950/70 via-slate-950/25 to-transparent" />
    </div>
  );
};

export default GradientOverlay;
