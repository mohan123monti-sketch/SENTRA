import React from 'react';

export const SentraLogo: React.FC<{ size?: number; className?: string; withText?: boolean; light?: boolean }> = ({ 
  size = 28, 
  className = "", 
  withText = true,
  light = false 
}) => {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Uploaded Logo Image */}
      <img 
        src="/logo.png" 
        alt="SENTRA Logo" 
        style={{ width: size, height: size, objectFit: 'contain' }}
        className="shrink-0 drop-shadow-sm"
      />

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
