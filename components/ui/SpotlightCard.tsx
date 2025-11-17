import React from 'react';

type SpotlightCardProps = {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
};

const SpotlightCard = React.forwardRef<HTMLDivElement, SpotlightCardProps>(({
  children,
  className = '',
  spotlightColor: _spotlightColor,
}, forwardedRef) => (
  <div
    ref={forwardedRef}
    className={`relative rounded-3xl border border-slate-200/40 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 overflow-hidden ${className}`}
  >
    {children}
  </div>
));

SpotlightCard.displayName = 'SpotlightCard';

export default SpotlightCard;
