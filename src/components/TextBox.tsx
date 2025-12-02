import React, { useState } from 'react';
import { TypewriterText, type TypewriterHandle } from './TypewriterText';

interface TextBoxProps {
  text: string;
  characterName?: string;
  onNext: () => void;
}

export const TextBox: React.FC<TextBoxProps> = ({ text = "", characterName, onNext }) => {
  const [isTyping, setIsTyping] = useState(true);
  const typewriterRef = React.useRef<TypewriterHandle>(null);

  const handleClick = () => {
    if (isTyping) {
      typewriterRef.current?.finish();
    } else {
      onNext();
    }
  };

  return (
    <div 
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label="Next scene"
      style={{
        position: 'relative', // Changed from absolute
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent', // Container has background
        color: 'white',
        padding: '20px 40px', // Increased horizontal padding
        cursor: 'pointer',
        fontFamily: 'sans-serif',
        fontSize: '24px',
        lineHeight: '1.5',
        boxSizing: 'border-box', // Ensure padding doesn't overflow
      }}
    >
      {characterName && (
        <div style={{ fontWeight: 'bold', marginBottom: '10px', color: '#ffcc00' }}>
          {characterName}
        </div>
      )}
      <div>
        <TypewriterText 
          key={text}
          ref={typewriterRef}
          text={text} 
          speed={30} 
          onStart={() => setIsTyping(true)}
          onComplete={() => setIsTyping(false)} 
        />
        {!isTyping && (
          <span style={{ 
            display: 'inline-block', 
            marginLeft: '5px', 
            animation: 'blink 1s infinite' 
          }}>
            ▼
          </span>
        )}
      </div>
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};
