import React, { useState } from 'react';
import { TypewriterText, type TypewriterHandle } from './TypewriterText';

interface TextBoxProps {
  text: string | { ja: string; en: string };
  characterName?: string;
  onNext: () => void;
  language?: 'ja' | 'en';
}

export const TextBox: React.FC<TextBoxProps> = ({ text = "", characterName, onNext, language = 'ja' }) => {
  const [isTyping, setIsTyping] = useState(true);
  const typewriterRef = React.useRef<TypewriterHandle>(null);

  const displayText = typeof text === 'string' 
    ? text 
    : (language === 'en' ? text.en : text.ja);

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
      className="text-box"
    >
      {characterName && (
        <div className="text-box-name">
          {characterName}
        </div>
      )}
      <div>
        <TypewriterText 
          key={displayText}
          ref={typewriterRef}
          text={displayText} 
          speed={30} 
          onStart={() => setIsTyping(true)}
          onComplete={() => setIsTyping(false)} 
        />
        {!isTyping && (
          <span className="text-cursor">
            ▼
          </span>
        )}
      </div>
    </div>
  );
};
