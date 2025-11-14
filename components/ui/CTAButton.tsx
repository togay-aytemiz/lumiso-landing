import React from 'react';

type CTAButtonVariant = 'primary' | 'gradient' | 'ghost';

interface CTAButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: CTAButtonVariant;
  fullWidth?: boolean;
  className?: string;
}

const variantClasses: Record<CTAButtonVariant, string> = {
  primary:
    'bg-brand-teal-500 text-white hover:bg-brand-teal-600 shadow-lg shadow-brand-teal-500/40',
  gradient:
    'bg-gradient-to-r from-brand-teal-500 to-cyan-500 text-white hover:from-brand-teal-600 hover:to-cyan-600 shadow-lg shadow-brand-teal-500/40',
  ghost:
    'bg-white/10 border border-white/20 text-white hover:bg-white/20 backdrop-blur-sm',
};

const CTAButton: React.FC<CTAButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = false,
  className = '',
  ...rest
}) => {
  const baseClasses =
    'inline-flex items-center justify-center px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal-400 focus-visible:ring-offset-2';
  const widthClass = fullWidth ? 'w-full' : '';
  const composedClassName = [baseClasses, variantClasses[variant], widthClass, className]
    .filter(Boolean)
    .join(' ');

  return (
    <a className={composedClassName} {...rest}>
      {children}
    </a>
  );
};

export default CTAButton;
