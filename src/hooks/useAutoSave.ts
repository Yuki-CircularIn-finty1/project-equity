import { useEffect } from 'react';
import type { GameState } from '../engine/types';

const AUTO_SAVE_KEY = 'sound_novel_autosave';

export const useAutoSave = (gameState: GameState | null) => {
  useEffect(() => {
    if (gameState) {
      try {
        localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(gameState));
      } catch (e) {
        console.error('Failed to auto-save game state:', e);
      }
    }
  }, [gameState]);

  const loadAutoSave = (): GameState | null => {
    try {
      const saved = localStorage.getItem(AUTO_SAVE_KEY);
      if (saved) {
        return JSON.parse(saved) as GameState;
      }
    } catch (e) {
      console.error('Failed to load auto-save:', e);
    }
    return null;
  };

  const hasAutoSave = (): boolean => {
    return !!localStorage.getItem(AUTO_SAVE_KEY);
  };

  return { loadAutoSave, hasAutoSave };
};
