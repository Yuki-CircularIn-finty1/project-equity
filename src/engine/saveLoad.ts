import type { GameState } from './types';
import { GameError } from './errors';

const SAVE_KEY_PREFIX = 'sound_novel_save_';

export interface SaveData {
  gameState: GameState;
  timestamp: number;
}

export const saveGame = (slotId: number, state: GameState) => {
  try {
    const data: SaveData = {
      gameState: state,
      timestamp: Date.now()
    };
    const json = JSON.stringify(data);
    localStorage.setItem(`${SAVE_KEY_PREFIX}${slotId}`, json);
  } catch {
    throw new GameError('SAVE_FAILED', 'Failed to save game data');
  }
};

export const loadGame = (slotId: number): SaveData | null => {
  try {
    const json = localStorage.getItem(`${SAVE_KEY_PREFIX}${slotId}`);
    if (!json) return null;
    return JSON.parse(json) as SaveData;
  } catch {
    throw new GameError('LOAD_FAILED', 'Failed to load game data');
  }
};

export const listSaves = (): { slotId: number; timestamp: number }[] => {
  // This is a simplified version. In a real app, we might store metadata separately.
  // For now, we just check for existence.
  const saves = [];
  for (let i = 1; i <= 3; i++) {
    if (localStorage.getItem(`${SAVE_KEY_PREFIX}${i}`)) {
      saves.push({ slotId: i, timestamp: Date.now() }); // Timestamp is fake here for now
    }
  }
  return saves;
};
