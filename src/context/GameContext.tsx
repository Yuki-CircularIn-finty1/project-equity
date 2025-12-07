import React, { createContext, useReducer, useEffect, useRef, useCallback, useMemo } from 'react';
import { StoryEngine } from '../engine/storyEngine';
import { validateChapter } from '../engine/validator';
import type { GameState, Scene } from '../engine/types';
import chapter1Data from '../data/chapters/chapter1.json';
import chapter2Data from '../data/chapters/chapter2.json';
import chapter3Data from '../data/chapters/chapter3.json';
import chapter4Data from '../data/chapters/chapter4.json';
import chapter5Data from '../data/chapters/chapter5.json';
import { useAutoSave } from '../hooks/useAutoSave';
import { useAudioController } from '../hooks/useAudioController';

// Define the shape of the context state
interface GameContextState {
  engine: StoryEngine | null;
  currentScene: Scene | null;
  gameState: GameState | null;
  error: string | null;
  gameStarted: boolean;
  selectedChapterId: string;
  windowScale: number;
  language: 'ja' | 'en';
}

// Define actions
type GameAction =
  | { type: 'INIT_GAME'; payload: { engine: StoryEngine; scene: Scene; state: GameState } }
  | { type: 'UPDATE_STATE'; payload: { scene: Scene; state: GameState } }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'START_GAME' }
  | { type: 'RESET_GAME' }
  | { type: 'SET_CHAPTER'; payload: string }
  | { type: 'SET_SCALE'; payload: number }
  | { type: 'SET_LANGUAGE'; payload: 'ja' | 'en' };

// Initial state
const initialState: GameContextState = {
  engine: null,
  currentScene: null,
  gameState: null,
  error: null,
  gameStarted: false,
  selectedChapterId: 'chapter1',
  windowScale: 1.0,
  language: 'ja',
};

// Reducer
function gameReducer(state: GameContextState, action: GameAction): GameContextState {
  switch (action.type) {
    case 'INIT_GAME':
      return {
        ...state,
        engine: action.payload.engine,
        currentScene: action.payload.scene,
        gameState: action.payload.state,
        error: null,
      };
    case 'UPDATE_STATE':
      return {
        ...state,
        currentScene: action.payload.scene,
        gameState: action.payload.state,
        error: null,
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'START_GAME':
      return { ...state, gameStarted: true };
    case 'RESET_GAME':
      return { ...state, gameStarted: false, error: null };
    case 'SET_CHAPTER':
      return { ...state, selectedChapterId: action.payload };
    case 'SET_SCALE':
      return { ...state, windowScale: action.payload };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    default:
      return state;
  }
}

// Context definition
interface GameContextValue extends GameContextState {
  startGame: () => void;
  next: () => void;
  makeChoice: (choiceId: string) => void;
  loadGame: (state: GameState) => void;
  continueGame: () => void;
  setChapter: (chapterId: string) => void;
  setScale: (scale: number) => void;
  setLanguage: (lang: 'ja' | 'en') => void;
  hasAutoSave: () => boolean;
  bgmVolume: number;
  setBgmVolume: (vol: number) => void;
  seVolume: number;
  setSeVolume: (vol: number) => void;
  log: { characterName?: string; text: string | { ja: string; en: string } }[];
}

const GameContext = createContext<GameContextValue | undefined>(undefined);

// Export only for useGame hook
// eslint-disable-next-line react-refresh/only-export-components
export { GameContext as _GameContext };

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const engineRef = useRef<StoryEngine | null>(null);
  
  const { playBgm, stopBgm, playSe, bgmVolume, setBgmVolume, seVolume, setSeVolume } = useAudioController();

  // Initialize engine on mount or chapter change
  useEffect(() => {
    try {
      const data = state.selectedChapterId === 'chapter5' ? chapter5Data
                 : state.selectedChapterId === 'chapter4' ? chapter4Data
                 : state.selectedChapterId === 'chapter3' ? chapter3Data
                 : state.selectedChapterId === 'chapter2' ? chapter2Data 
                 : chapter1Data;
      const chapter = validateChapter(data);
      const engine = new StoryEngine(chapter);
      engineRef.current = engine;
      
      dispatch({
        type: 'INIT_GAME',
        payload: {
          engine,
          scene: engine.getCurrentScene(),
          state: engine.getState(),
        },
      });
    } catch (e) {
      dispatch({ type: 'SET_ERROR', payload: e instanceof Error ? e.message : 'Failed to init' });
    }
  }, [state.selectedChapterId]);

  const { loadAutoSave, hasAutoSave } = useAutoSave(state.gameState);

  const updateEngineState = useCallback(() => {
    if (!engineRef.current) return;
    try {
      dispatch({
        type: 'UPDATE_STATE',
        payload: {
          scene: engineRef.current.getCurrentScene(),
          state: engineRef.current.getState(),
        },
      });
    } catch (e) {
      dispatch({ type: 'SET_ERROR', payload: e instanceof Error ? e.message : 'Error updating state' });
    }
  }, []);

  // Audio Triggers
  useEffect(() => {
    if (!state.gameStarted) return;
    
    if (state.currentScene) {
      if (state.currentScene.bgm) {
        playBgm(state.currentScene.bgm);
      } else if (state.currentScene.bgm === "") {
        stopBgm();
      }
      if (state.currentScene.se) {
        playSe(state.currentScene.se, {
          repeat: state.currentScene.seRepeat,
          interval: state.currentScene.seInterval
        });
      }
    }
  }, [state.currentScene, state.gameStarted, playBgm, stopBgm, playSe]);

  const startGame = useCallback(() => {
    dispatch({ type: 'START_GAME' });
  }, []);

  const next = useCallback(() => {
    if (!engineRef.current || !state.currentScene) return;
    if (state.currentScene.choices && state.currentScene.choices.length > 0) return;

    try {
      engineRef.current.proceed();
      updateEngineState();
    } catch (e) {
      console.error(e);
    }
  }, [state.currentScene, updateEngineState]);

  const makeChoice = useCallback((choiceId: string) => {
    if (!engineRef.current) return;
    try {
      engineRef.current.makeChoice(choiceId);
      updateEngineState();
    } catch (e) {
      dispatch({ type: 'SET_ERROR', payload: e instanceof Error ? e.message : 'Error making choice' });
    }
  }, [updateEngineState]);

  const loadGame = useCallback((savedState: GameState) => {
    if (!engineRef.current) return;
    try {
      engineRef.current.loadState(savedState);
      updateEngineState();
      dispatch({ type: 'START_GAME' });
    } catch (e) {
      dispatch({ type: 'SET_ERROR', payload: e instanceof Error ? e.message : 'Error loading game' });
    }
  }, [updateEngineState]);

  const continueGame = useCallback(() => {
    const savedState = loadAutoSave();
    if (savedState) {
      loadGame(savedState);
    }
  }, [loadAutoSave, loadGame]);

  const setChapter = useCallback((chapterId: string) => {
    dispatch({ type: 'SET_CHAPTER', payload: chapterId });
  }, []);

  const setScale = useCallback((scale: number) => {
    dispatch({ type: 'SET_SCALE', payload: scale });
  }, []);

  const setLanguage = useCallback((lang: 'ja' | 'en') => {
    dispatch({ type: 'SET_LANGUAGE', payload: lang });
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const value: GameContextValue = useMemo(() => ({
    ...state,
    startGame,
    next,
    makeChoice,
    loadGame,
    continueGame,
    setChapter,
    setScale,
    setLanguage,
    hasAutoSave,
    bgmVolume,
    setBgmVolume,
    seVolume,
    setSeVolume,
    log: state.gameState?.log || [],
  }), [
    state,
    startGame,
    next,
    makeChoice,
    loadGame,
    continueGame,
    setChapter,
    setScale,
    setLanguage,
    hasAutoSave,
    bgmVolume,
    setBgmVolume,
    seVolume,
    setSeVolume
  ]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
