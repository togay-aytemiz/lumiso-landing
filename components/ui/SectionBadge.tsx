import React from 'react';

type SectionBadgeVariant = 'muted' | 'glass';

interface SectionBadgeProps {
  children: React.ReactNode;
  variant?: SectionBadgeVariant;
  className?: string;
}

const variantClasses: Record<SectionBadgeVariant, string> = {
  muted:
    'bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300',
  glass: 'bg-white/10 border border-white/20 text-white backdrop-blur-sm',
};

const SectionBadge: React.FC<SectionBadgeProps> = ({
  children,
  variant = 'muted',
  className = '',
}) => {
  const baseClasses =
    'inline-flex items-center px-4 py-1 rounded-full text-sm font-medium shadow-sm';
  const composedClassName = [baseClasses, variantClasses[variant], className]
    .filter(Boolean)
    .join(' ');

  return <span className={composedClassName}>{children}</span>;
};

export default SectionBadge;
