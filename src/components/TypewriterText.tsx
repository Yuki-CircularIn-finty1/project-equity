import { useState, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';

export interface TypewriterHandle {
  finish: () => void;
  isComplete: () => boolean;
}

interface Props {
  text: string;
  speed?: number;
  onStart?: () => void;
  onComplete?: () => void;
}

export const TypewriterText = forwardRef<TypewriterHandle, Props>(({ text, speed = 30, onStart, onComplete }, ref) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const rafIdRef = useRef<number | null>(null);
  const indexRef = useRef(0);
  const lastUpdateRef = useRef(0);
  const onCompleteRef = useRef(onComplete);
  const onStartRef = useRef(onStart);

  useEffect(() => {
    onCompleteRef.current = onComplete;
    onStartRef.current = onStart;
  }, [onComplete, onStart]);

  useImperativeHandle(ref, () => ({
    finish: () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      setDisplayedText(text);
      setIsComplete(true);
      onCompleteRef.current?.();
    },
    isComplete: () => isComplete
  }));

  useEffect(() => {
    // Reset state for new text
    indexRef.current = 0;
    lastUpdateRef.current = 0;
    
    // eslint-disable-next-line -- Intentional reset for typewriter animation
    setDisplayedText('');
    setIsComplete(false);
    
    // Notify start callback
    onStartRef.current?.();

    // Use requestAnimationFrame for smoother animation
    const animate = (timestamp: number) => {
      if (!lastUpdateRef.current) {
        lastUpdateRef.current = timestamp;
      }

      const elapsed = timestamp - lastUpdateRef.current;

      // Update every 'speed' milliseconds, but add multiple characters for efficiency
      if (elapsed >= speed) {
        const BATCH_SIZE = 3; // Add 3 characters at once for better performance
        const charsToAdd = Math.floor(elapsed / speed);
        const nextIndex = Math.min(indexRef.current + charsToAdd * BATCH_SIZE, text.length);
        
        if (nextIndex > indexRef.current) {
          setDisplayedText(text.slice(0, nextIndex));
          indexRef.current = nextIndex;
        }
        
        lastUpdateRef.current = timestamp;
      }

      if (indexRef.current < text.length) {
        rafIdRef.current = requestAnimationFrame(animate);
      } else {
        setIsComplete(true);
        onCompleteRef.current?.();
      }
    };

    // Start animation on next frame to avoid setState in effect body
    rafIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [text, speed]);

  return <>{displayedText}</>;
});

