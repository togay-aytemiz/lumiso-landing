import React from 'react';

interface GradientTextProps {
  colors?: string[];
  animationSpeed?: number;
  showBorder?: boolean;
  className?: string;
  children: React.ReactNode;
}

const GradientText: React.FC<GradientTextProps> = ({
  colors = ['#40ffaa', '#4079ff', '#40ffaa'],
  animationSpeed = 4,
  showBorder = false,
  className = '',
  children,
}) => {
  const gradientStops = colors.length > 0 ? colors : ['#40ffaa'];
  const gradientBackground = `linear-gradient(120deg, ${gradientStops.join(', ')})`;

  const wrapperClasses = [
    showBorder ? 'rounded-full border border-white/30 px-3 py-1 dark:border-white/20' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={wrapperClasses}>
      <span
        className="gradient-text-inner gradient-text-animated"
        style={{
          backgroundImage: gradientBackground,
          animationDuration: `${animationSpeed}s`,
        }}
      >
        {children}
      </span>
    </span>
  );
};

export default GradientText;
