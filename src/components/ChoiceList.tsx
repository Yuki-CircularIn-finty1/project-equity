import React from 'react';
import type { Choice } from '../engine/types';

interface ChoiceListProps {
  choices: Choice[];
  onSelect: (choiceId: string) => void;
}

const ChoiceListComponent: React.FC<ChoiceListProps> = ({ choices, onSelect }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        zIndex: 30, // Above text box (z-20)
      }}
    >
      {choices.map((choice) => (
        <button
          key={choice.id}
          onClick={() => onSelect(choice.id)}
          style={{
            padding: '15px 50px',
            fontSize: '22px',
            fontWeight: 'bold',
            backgroundColor: 'rgba(240, 248, 255, 0.95)', // AliceBlue, nearly opaque
            color: '#002244', // Dark Navy text
            border: '3px solid #4a90e2', // Blue border
            borderRadius: '50px', // Pill shape
            cursor: 'pointer',
            minWidth: '400px',
            boxShadow: '0 0 15px rgba(74, 144, 226, 0.5)', // Blue glow
            transition: 'all 0.2s ease',
            textAlign: 'center',
            fontFamily: '"Helvetica Neue", Arial, sans-serif'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#ffffff';
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 0 25px rgba(74, 144, 226, 0.8)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(240, 248, 255, 0.95)';
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 0 15px rgba(74, 144, 226, 0.5)';
          }}
        >
          {choice.text}
        </button>
      ))}
    </div>
  );
};

// Memoize - only re-render if choices array changes
export const ChoiceList = React.memo(ChoiceListComponent, (prevProps, nextProps) => {
  // Deep comparison of choices array
  return JSON.stringify(prevProps.choices) === JSON.stringify(nextProps.choices);
});
