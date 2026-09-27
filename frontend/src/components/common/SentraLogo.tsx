import React from 'react';

export const SentraLogo: React.FC<{ size?: number; className?: string; withText?: boolean; light?: boolean }> = ({ 
  size = 28, 
  className = "", 
  withText = true,
  light = false 
}) => {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Abstract symbol representing protection, connection, human support & signal detection */}
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 36 36" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-hidden="true"
      >
        {/* Protective Outer Arc */}
        <path 
          d="M18 3C10.5 3 4.5 8.2 4.5 15.5C4.5 24.2 14.5 31.8 18 33C21.5 31.8 31.5 24.2 31.5 15.5C31.5 8.2 25.5 3 18 3Z" 
          stroke={light ? "#38BDF8" : "#0F766E"} 
          strokeWidth="2.2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        {/* Inner Connecting Arcs (Signal & Human Connection) */}
        <path 
          d="M11 15C11 11.134 14.134 8 18 8C21.866 8 25 11.134 25 15C25 19.5 18 24.5 18 24.5C18 24.5 11 19.5 11 15Z" 
          stroke={light ? "#94A3B8" : "#0284C7"} 
          strokeWidth="1.8" 
          strokeLinecap="round" 
        />
        {/* Core Detection Node / Focal Point */}
        <circle 
          cx="18" 
          cy="15" 
          r="3" 
          fill={light ? "#38BDF8" : "#0F766E"} 
        />
      </svg>

      {withText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-baseline gap-1.5">
            <span className={`text-lg font-bold tracking-tight font-sans ${light ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
              SENTRA
            </span>
            <span className={`text-[10px] uppercase font-mono tracking-widest ${light ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
              Gov Support Platform
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
