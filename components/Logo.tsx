import React from 'react';

const LIGHT_LOGO_SRC = '/logo-light.svg';
const DARK_LOGO_SRC = '/logo-dark.svg';
const LOGO_BASE_WIDTH = 71;
const LOGO_BASE_HEIGHT = 22;
const LOGO_DISPLAY_HEIGHT = 32;
const LOGO_DISPLAY_WIDTH = Math.round(
  (LOGO_BASE_WIDTH / LOGO_BASE_HEIGHT) * LOGO_DISPLAY_HEIGHT
);

export interface LogoProps {
  className?: string;
  forceTheme?: 'light' | 'dark';
}

const Logo: React.FC<LogoProps> = ({ className = '', forceTheme }) => {
  const lightClasses = forceTheme
    ? forceTheme === 'light'
      ? 'block'
      : 'hidden'
    : 'block dark:hidden';
  const darkClasses = forceTheme
    ? forceTheme === 'dark'
      ? 'block'
      : 'hidden'
    : 'hidden dark:block';

  return (
    <div
      className={`relative flex items-center ${className}`}
      style={{ width: LOGO_DISPLAY_WIDTH, height: LOGO_DISPLAY_HEIGHT }}
    >
      <img
        src={LIGHT_LOGO_SRC}
        alt="Lumiso logo for light mode"
        width={LOGO_BASE_WIDTH}
        height={LOGO_BASE_HEIGHT}
        decoding="async"
        className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ${lightClasses}`}
      />
      <img
        src={DARK_LOGO_SRC}
        alt="Lumiso logo for dark mode"
        width={LOGO_BASE_WIDTH}
        height={LOGO_BASE_HEIGHT}
        decoding="async"
        className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ${darkClasses}`}
      />
    </div>
  );
};

export default Logo;
