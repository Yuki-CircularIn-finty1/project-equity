import { useContext } from 'react';
import { _GameContext } from './GameContext';

export const useGame = () => {
  const context = useContext(_GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
