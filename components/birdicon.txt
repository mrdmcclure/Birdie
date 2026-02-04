
import React from 'react';

export const BirdIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
    <path d="M2 20c0-2.8 2.2-5 5-5h10c2.8 0 5 2.2 5 5v1h-20v-1Z" />
    <path d="m7 15-1.5-3" />
    <path d="m17 15 1.5-3" />
    <path d="M12 11v2" />
  </svg>
);
