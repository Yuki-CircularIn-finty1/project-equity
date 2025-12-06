import React from 'react';
import type { CharacterConfig } from '../engine/types';

interface CharacterLayerProps {
  characterImgId?: string; // Legacy support
  characters?: {
    left?: string | CharacterConfig;
    center?: string | CharacterConfig;
    right?: string | CharacterConfig;
  };
}

import { motion, AnimatePresence } from 'framer-motion';

const CharacterLayerComponent: React.FC<CharacterLayerProps> = ({ characterImgId, characters }) => {
  // Load all character images from assets using relative path
  const characterImages = import.meta.glob<{ default: string }>('../assets/images/characters/*.png', { eager: true });

  const getCharacterSrc = (id: string) => {
    const path = `../assets/images/characters/${id}.png`;
    const module = characterImages[path];
    return module ? module.default : null;
  };

  // Helper to normalize input to CharacterConfig with strict validation
  const normalizeConfig = (input: unknown): CharacterConfig => {
    // Guardrail: Handle null/undefined
    if (!input) {
      return { image: '', scale: 1.0, opacity: 1.0 };
    }

    // Guardrail: Handle string input
    if (typeof input === 'string') {
      return { image: input, scale: 1.0, opacity: 1.0 };
    }

    // Guardrail: Handle object input with type safety
    if (typeof input === 'object') {
      const config = input as CharacterConfig;
      return {
        image: config.image || '', // Fallback to empty string
        scale: typeof config.scale === 'number' ? config.scale : 1.0,
        opacity: typeof config.opacity === 'number' ? config.opacity : 1.0,
        xOffset: typeof config.xOffset === 'string' ? config.xOffset : undefined,
        yOffset: typeof config.yOffset === 'string' ? config.yOffset : undefined,
        filter: typeof config.filter === 'string' ? config.filter : undefined,
        enforceBoundaries: typeof config.enforceBoundaries === 'boolean' ? config.enforceBoundaries : undefined,
        boundaryPadding: typeof config.boundaryPadding === 'number' ? config.boundaryPadding : undefined
      };
    }

    // Fallback for unknown types
    return { image: '', scale: 1.0, opacity: 1.0 };
  };

  // Helper to render a character in a specific slot
  const renderCharacter = (input: string | CharacterConfig | undefined, position: 'left' | 'center' | 'right') => {
    if (!input) return null;

    const config = normalizeConfig(input);
    const { image, scale, opacity, xOffset, yOffset, filter } = config;

    // Guardrails
    // Guardrails: Fail-safe for missing image ID
    if (!image) {
      if (import.meta.env.DEV) {
        console.warn(`CharacterLayer: Missing image ID for position ${position}`);
      }
      return null;
    }

    const finalScale = Math.max(0.1, Math.min(5.0, (scale ?? 1.0) * 1.1));
    const finalOpacity = Math.max(0.0, Math.min(1.0, opacity ?? 1.0));

    const src = getCharacterSrc(image);
    // Guardrails: Fail-safe for invalid image path
    if (!src) {
      if (import.meta.env.DEV) {
        console.warn(`CharacterLayer: Image not found for ${image} at position ${position}`);
      }
      return null;
    }

    // Boundary enforcement configuration
    const enforceBoundaries = config.enforceBoundaries ?? true;

    
    // Strict Grid Layout System
    // Left: 8-33% (Width: 25%)
    // Center: 38-63% (Width: 25%)
    // Right: 68-93% (Width: 25%)
    
    const calculateBoundedPosition = (): { 
      leftOrRight: 'left' | 'right';
      position: string; 
      translateX: string;
      maxWidth: string;
      warnings: string[] 
    } => {
      const warnings: string[] = [];
      
      if (!enforceBoundaries) {
        // Fallback for disabled boundaries (legacy behavior)
        const legacyMap = { left: 15, center: 50, right: 85 };
        return {
          leftOrRight: 'left',
          position: `${legacyMap[position]}%`,
          translateX: '-50%',
          maxWidth: 'none',
          warnings: []
        };
      }

      if (position === 'left') {
        // Slot A: 8-33%
        // Anchor: Left Edge at 8%
        return {
          leftOrRight: 'left',
          position: '8%',
          translateX: '0%',
          maxWidth: '25%', // Enforce 25% width limit
          warnings
        };
      } else if (position === 'right') {
        // Slot C: 68-93%
        // Anchor: Right Edge at 7% (100% - 93%)
        return {
          leftOrRight: 'right',
          position: '7%', // 100 - 93 = 7% from right
          translateX: '0%',
          maxWidth: '25%', // Enforce 25% width limit
          warnings
        };
      } else {
        // Slot B: 38-63%
        // Anchor: Center at 50.5% (Midpoint of 38 and 63)
        return {
          leftOrRight: 'left',
          position: '50.5%',
          translateX: '-50%',
          maxWidth: '25%', // Enforce 25% width limit
          warnings
        };
      }
    };
    
    const { leftOrRight, position: boundedPosition, translateX: boundedTranslateX, maxWidth, warnings } = calculateBoundedPosition();
    
    // Log warnings in development
    if (warnings.length > 0 && import.meta.env.DEV) {
      warnings.forEach(warning => console.warn(`[CharacterLayer] ${warning}`));
    }
    
    // Build transform string
    const transformParts = [boundedTranslateX];
    
    if (!enforceBoundaries && xOffset) {
      transformParts.push(`translateX(${xOffset})`);
    }
    
    if (yOffset) {
      transformParts.push(`translateY(${yOffset})`);
    }
    
    const finalTransform = transformParts.join(' ').trim();
    
    // Build style object with correct positioning property
    const positionStyle: React.CSSProperties = {
      position: 'absolute',
      bottom: '10%',
      transform: finalTransform,
      maxHeight: '100%',
      width: 'auto',
      maxWidth: maxWidth, // Apply width constraint
      objectFit: 'contain',
      pointerEvents: 'none',
      filter: filter || undefined,
    };
    
    // Use either 'left' or 'right' positioning based on anchor point
    if (leftOrRight === 'left') {
      positionStyle.left = boundedPosition;
    } else {
      positionStyle.right = boundedPosition;
    }
    
    // Ensure center character is always on top
    if (position === 'center') {
      positionStyle.zIndex = 20;
    } else {
      positionStyle.zIndex = 10;
    }

    return (
      <motion.img
        key={`${position}-${image}`}
        src={src}
        alt={`Character at ${position}`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: finalOpacity, scale: finalScale }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        style={positionStyle}
      />
    );
  };

  // Render using multi-slot system or fallback to legacy
  if (characters && (characters.left || characters.center || characters.right)) {
    return (
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 10,
        overflow: 'hidden'
      }}>
        <AnimatePresence>
          {renderCharacter(characters.left, 'left')}
          {renderCharacter(characters.center, 'center')}
          {renderCharacter(characters.right, 'right')}
        </AnimatePresence>
      </div>
    );
  }

  // Legacy single character rendering
  if (characterImgId) {
    const src = getCharacterSrc(characterImgId);

    if (!src) {
      return (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 10
        }}>
          <div style={{ position: 'absolute', top: 10, left: 10, color: 'rgba(255,255,255,0.5)' }}>
            Debug: Missing character {characterImgId}
          </div>
        </div>
      );
    }

    return (
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        pointerEvents: 'none',
        zIndex: 10,
        overflow: 'hidden'
      }}>
        <AnimatePresence>
          <motion.img
            key={characterImgId}
            src={src}
            alt="Character"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            style={{
              maxHeight: '100%',
              width: 'auto',
              objectFit: 'contain'
            }}
          />
        </AnimatePresence>
      </div>
    );
  }

  // No characters to display
  return null;
};

// Memoize to prevent re-renders when props haven't changed
export const CharacterLayer = React.memo(CharacterLayerComponent, (prevProps, nextProps) => {
  // Custom comparison for deep equality of characters object
  return (
    prevProps.characterImgId === nextProps.characterImgId &&
    JSON.stringify(prevProps.characters) === JSON.stringify(nextProps.characters)
  );
});
