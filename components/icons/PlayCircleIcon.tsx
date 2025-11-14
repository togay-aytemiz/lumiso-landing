import React from 'react';

export const PlayCircleIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
    <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="36" fill="currentColor" />
        <path d="M55 40L32.5 53.4256V26.5744L55 40Z" fill="white"/>
    </svg>
);