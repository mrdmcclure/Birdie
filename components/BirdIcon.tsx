import React from 'react';

export const BirdIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Head Tuft */}
    <path 
      d="M45 20C45 20 42 10 50 5C58 10 55 20 55 20" 
      stroke="currentColor" 
      strokeWidth="4" 
      strokeLinecap="round" 
    />
    
    {/* Body */}
    <path 
      d="M30 40C30 25 45 15 60 15C75 15 85 25 85 40C85 60 75 80 50 80C25 80 15 60 15 45C15 40 20 40 30 40Z" 
      fill="currentColor" 
      fillOpacity="0.1" 
    />
    <path 
      d="M30 40C30 25 45 15 60 15C75 15 85 25 85 40C85 60 75 80 50 80C25 80 15 60 15 45C15 40 20 40 30 40Z" 
      stroke="currentColor" 
      strokeWidth="4" 
      strokeLinejoin="round" 
    />

    {/* Wing */}
    <path 
      d="M35 50C35 50 20 55 20 65C20 75 35 70 45 60" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
    />

    {/* Eye */}
    <circle cx="62" cy="35" r="5" fill="currentColor" />
    <circle cx="64" cy="33" r="1.5" fill="white" />

    {/* Beak */}
    <path 
      d="M85 40L95 45L83 50" 
      fill="#FCD34D" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinejoin="round" 
    />

    {/* Legs */}
    <path d="M40 80V90M40 90L35 95M40 90L45 95" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <path d="M60 80V90M60 90L55 95M60 90L65 95" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);
