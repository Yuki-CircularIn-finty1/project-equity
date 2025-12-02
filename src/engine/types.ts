import type { BackgroundId, BgmId, SeId } from '../types/assets';

export interface Choice {
  id: string;
  text: string;
  nextSceneId: string;
  condition?: string; // Optional flag condition
}

export interface CharacterConfig {
  image: string;
  scale?: number; // Default 1.0
  opacity?: number; // Default 1.0
  xOffset?: string; // CSS string, e.g. "10px"
  yOffset?: string; // CSS string
  filter?: string; // CSS filter string
  enforceBoundaries?: boolean; // Default true - keep character within viewport bounds
  boundaryPadding?: number; // Percentage of viewport width for safe zone (default 2%)
}

export interface Scene {
  id: string;
  text: string;
  backgroundId: BackgroundId; // Type-safe background ID
  nextSceneId?: string;
  choices?: Choice[];
  type?: 'normal' | 'ending';
  characterId?: string;
  characterImgId?: string; // DEPRECATED: Use characters instead
  characters?: {
    left?: string | CharacterConfig;
    center?: string | CharacterConfig;
    right?: string | CharacterConfig;
  }; // Map of position to character image ID or config
  characterExpression?: string;
  bgm?: BgmId; // Type-safe BGM ID
  se?: SeId;  // Type-safe SE ID
  seRepeat?: number; // Number of times to repeat SE
  seInterval?: number; // Interval in ms between repeats
  autoPlay?: boolean;
  windowScale?: number; // 0.5 to 1.5, default 1.0
}

export interface GameState {
  currentSceneId: string;
  flags: Record<string, boolean | number | string>;
  history: string[]; // List of visited scene IDs
  log: { characterName?: string; text: string }[]; // Dialogue history
}

export interface Config {
  textSpeed: number; // ms per character
  bgmVolume: number; // 0.0 to 1.0
  seVolume: number; // 0.0 to 1.0
  autoPlay: boolean;
  windowScale: number; // 0.5 to 1.5, default 1.0
}
