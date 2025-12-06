import React, { useState } from 'react';

interface GameLayoutProps {
  children: React.ReactNode;
  scale?: number;
}

export const GameLayout: React.FC<GameLayoutProps> = ({ children, scale = 1.0 }) => {
  const [height] = useState(() => 
    (typeof CSS !== 'undefined' && CSS.supports('height', '100dvh')) ? '100dvh' : '100vh'
  );

  // Effect removed as strict sync check is done in initializer


  return (
    <div
      style={{
        width: '100vw',
        height: height,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
        overflow: 'hidden',
        position: 'fixed', // Prevent scrolling
        top: 0,
        left: 0,
      }}
    >
      <div
        style={{
          position: 'relative',
          // Aspect ratio logic:
          // If screen is wider than 16:9 (e.g. 21:9), height limits us: h = 100%, w = h * 16/9
          // If screen is taller than 16:9 (e.g. 4:3), width limits us: w = 100%, h = w * 9/16
          width: 'min(100vw, 177.78vh)', 
          height: 'min(100vh, 56.25vw)',
          // Note: using vh/vw in calc inside min might refer to viewport size.
          // Ideally we want to use the 'height' state variable, but standard vh is usually fine for the inner box calculation 
          // as long as the outer container constrains it.
          // For strictness, let's stick to standard vh/vw for aspect ratio math as it's cleaner than injecting vars.
          
          boxShadow: '0 0 50px rgba(0,0,0,0.5)',
          overflow: 'hidden',
          transform: `scale(${scale})`,
          transition: 'transform 0.3s ease-in-out',
        }}
      >
        {children}
      </div>
    </div>
  );
};
