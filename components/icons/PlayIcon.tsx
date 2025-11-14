import React from 'react';

export const PlayIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="currentColor"/>
    <path d="M9.5 16.5V7.5L16.5 12L9.5 16.5Z" fill="white"/>
  </svg>
);
