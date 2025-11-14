import React from 'react';

export const InstagramIcon: React.FC = () => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <radialGradient id="insta-gradient" cx="0.3" cy="1" r="1">
                <stop offset="0%" stopColor="#FDCB52"/>
                <stop offset="50%" stopColor="#FD1D1D"/>
                <stop offset="100%" stopColor="#833AB4"/>
            </radialGradient>
        </defs>
        <rect width="24" height="24" rx="6" fill="url(#insta-gradient)"/>
        <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="2"/>
        <circle cx="17.5" cy="6.5" r="1.5" fill="white"/>
    </svg>
);