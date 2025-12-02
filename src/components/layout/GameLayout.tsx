import React from 'react';

interface GameLayoutProps {
  children: React.ReactNode;
  scale?: number;
}

export const GameLayout: React.FC<GameLayoutProps> = ({ children, scale = 1.0 }) => {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: 'min(100vw, 177.78vh)',
          height: 'min(100vh, 56.25vw)',
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
