import { useState, useEffect, lazy, Suspense } from 'react';
import iconSave from './assets/images/ui/icon_save.png';
import iconLoad from './assets/images/ui/icon_load.png';
import iconConfig from './assets/images/ui/icon_config.png';

import { BackgroundLayer } from './components/BackgroundLayer';
import { CharacterLayer } from './components/CharacterLayer';
import { TextBox } from './components/TextBox';
import { ChoiceList } from './components/ChoiceList';
// Lazy load heavy UI components for code splitting
const SaveLoadUI = lazy(() => import('./components/SaveLoadUI'));
const ConfigUI = lazy(() => import('./components/ConfigUI'));
import { GameLayout } from './components/layout/GameLayout';
import { GameProvider } from './context/GameContext';
import { useGame } from './context/useGame';
import { GameErrorBoundary } from './components/ErrorBoundary';
import './styles/global.css';
import './styles/App.css';

// Separate component to consume context
const GameContent = () => {
  const { 
    currentScene, 
    gameState, 
    gameStarted, 
    error, 
    startGame, 
    next, 
    makeChoice, 
    loadGame, 
    setChapter,
    selectedChapterId,
    windowScale,
    setScale,
    bgmVolume, setBgmVolume, seVolume, setSeVolume,
    language, setLanguage
  } = useGame();

  const [showSaveLoad, setShowSaveLoad] = useState<'save' | 'load' | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [isUiVisible, setIsUiVisible] = useState(true);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted) return;
      
      if (e.code === 'Space' || e.code === 'Enter') {
        // Prevent default scrolling for Space
        if (e.code === 'Space') e.preventDefault();
        // If UI is hidden, space/enter should show it or advance? 
        // Typically advances text, so force show UI then advance?
        // Or just advance. Let's keep native behavior but maybe ensure UI is visible if expecting text?
        // For now: just call next() which advances internal state.
        next();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, next]);

  // Startup Asset Validation (Dev Mode Only)
  useEffect(() => {
    if (import.meta.env.DEV) {
      import('./utils/assetValidator').then(() => {
        // Skipped in refactor
        console.log('🔍 Validating character assets on startup... (Skipped in refactor)');
      });
    }
  }, []);

  if (error) {
    return <div style={{ color: 'red', padding: 20 }}>Error: {error}</div>;
  }

  // Title screen
  if (!gameStarted) { // Assuming !gameStarted implies title screen
    return (
      <GameLayout scale={windowScale}>
        <BackgroundLayer backgroundId="bg_title" />
        <div className="title-menu-container">
          <div className="title-menu-buttons-row">
            <button 
              onClick={startGame}
              className="title-button"
            >
              ● New Game
            </button>

            <button 
              onClick={() => setShowSaveLoad('load')}
              className="title-button"
            >
              📂 Load Game
            </button>
          </div>

          <div className="title-menu-secondary-row">
            <div className="chapter-grid">
              {Array.from({ length: 8 }, (_, i) => i + 1).map((num) => {
                const chapterId = `chapter${num}`;
                const isSelected = selectedChapterId === chapterId;
                
                // Chapter configuration
                const isPlayable = num <= 4; // Only Ch 1-4 are playable
                const getIcon = (n: number) => {
                  if (n === 1) return '📖';
                  if (n === 2) return '⚖️';
                  if (n === 3) return '🔮';
                  if (n === 4) return '🦉';
                  return '🔒';
                };

                return (
                  <button
                    key={chapterId}
                    onClick={() => isPlayable && setChapter(chapterId)}
                    disabled={!isPlayable}
                    className="secondary-button"
                    style={{
                      backgroundColor: isSelected 
                        ? 'rgba(80, 80, 180, 0.6)' 
                        : isPlayable 
                          ? 'rgba(15, 15, 35, 0.85)' 
                          : 'rgba(10, 10, 20, 0.5)',
                      borderColor: isSelected 
                        ? 'rgba(200, 200, 255, 0.9)' 
                        : isPlayable 
                          ? 'rgba(180, 180, 240, 0.5)' 
                          : 'rgba(60, 60, 80, 0.3)',
                      color: isSelected 
                        ? '#fff' 
                        : isPlayable 
                          ? '#aaa' 
                          : '#555',
                      boxShadow: isSelected 
                        ? '0 0 15px rgba(100, 100, 255, 0.4)' 
                        : isPlayable 
                          ? '0 4px 10px rgba(0, 0, 0, 0.4)' 
                          : 'none',
                    }}
                  >
                    {getIcon(num)} Ch {num}
                  </button>
                );
              })}
            </div>

            <button 
              onClick={() => setShowConfig(true)} 
              className="secondary-button"
            >
              ⚙️ Config
            </button>
          </div>
        </div>
        {showSaveLoad && (
          <Suspense fallback={<div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white' }}>Loading...</div>}>
            <SaveLoadUI 
              mode={showSaveLoad} 
              onClose={() => setShowSaveLoad(null)} 
              onLoad={(state) => {
                loadGame(state);
                setShowSaveLoad(null);
              }}
            />
          </Suspense>
        )}
        {showConfig && (
          <Suspense fallback={<div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white' }}>Loading...</div>}>
            <ConfigUI 
              bgmVolume={bgmVolume} 
              setBgmVolume={setBgmVolume} 
              seVolume={seVolume} 
              setSeVolume={setSeVolume} 
              windowScale={windowScale}
              setWindowScale={setScale}
              language={language}
              setLanguage={setLanguage}
              onClose={() => setShowConfig(false)} 
            />
          </Suspense>
        )}
      </GameLayout>
    );
  }

  if (!currentScene) {
    return <div>Loading...</div>;
  }

  return (
    <GameLayout scale={windowScale}>
      <div className="game-container">
        <div 
          className={`visual-area ${!isUiVisible ? 'full-screen' : ''}`}
          onClick={() => setIsUiVisible(!isUiVisible)}
        >
          <BackgroundLayer backgroundId={currentScene.backgroundId} />
          <CharacterLayer 
            characterImgId={currentScene.characterImgId} 
            characters={currentScene.characters}
          />
          
          <div 
            className={`menu-buttons-container ${!isUiVisible ? 'hidden' : ''}`}
            onClick={(e) => e.stopPropagation()} // Prevent toggling UI when clicking buttons
          >
            <button 
              onClick={() => setShowSaveLoad('save')} 
              className="icon-button"
              title="Save"
            >
              <img src={iconSave} alt="Save" />
            </button>
            <button 
              onClick={() => setShowSaveLoad('load')} 
              className="icon-button"
              title="Load"
            >
              <img src={iconLoad} alt="Load" />
            </button>
            <button 
              onClick={() => setShowConfig(true)}
              className="icon-button"
              title="Config"
            >
              <img src={iconConfig} alt="Config" />
            </button>
          </div>

          <div onClick={(e) => e.stopPropagation()}>
            {currentScene.choices && currentScene.choices.length > 0 && (
              <ChoiceList choices={currentScene.choices} onSelect={makeChoice} language={language} />
            )}
          </div>
        </div>

        <div className={`story-area ${!isUiVisible ? 'hidden' : ''}`}>
          <TextBox 
            text={currentScene.text} 
            characterName={currentScene.characterId}
            onNext={next}
            language={language}
          />
        </div>
      </div>
      
      {currentScene.type === 'ending' && (
        <div className="ending-overlay">
          <div className="ending-text">
            ENDING REACHED
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="ending-button"
          >
            Return to Title
          </button>
        </div>
      )}

      {showSaveLoad && (
        <Suspense fallback={<div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', zIndex: 200 }}>Loading...</div>}>
          <SaveLoadUI 
            mode={showSaveLoad} 
            gameState={gameState || undefined}
            onClose={() => setShowSaveLoad(null)} 
            onLoad={(state) => {
              loadGame(state);
              setShowSaveLoad(null);
            }}
          />
        </Suspense>
      )}
      {showConfig && (
        <Suspense fallback={<div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', zIndex: 200 }}>Loading...</div>}>
          <ConfigUI 
            bgmVolume={bgmVolume} 
            setBgmVolume={setBgmVolume} 
            seVolume={seVolume} 
            setSeVolume={setSeVolume} 
            windowScale={windowScale}
            setWindowScale={setScale}
            language={language}
            setLanguage={setLanguage}
            onClose={() => setShowConfig(false)} 
          />
        </Suspense>
      )}
    </GameLayout>
  );
};

function App() {
  return (
    <GameProvider>
      <GameErrorBoundaryWrapper>
        <GameContent />
      </GameErrorBoundaryWrapper>
    </GameProvider>
  );
}

// Wrapper to access game context for error boundary
const GameErrorBoundaryWrapper = ({ children }: { children: React.ReactNode }) => {
  const { gameState, loadGame } = useGame();
  
  return (
    <GameErrorBoundary
      getCurrentState={() => gameState}
      onRecover={loadGame}
    >
      {children}
    </GameErrorBoundary>
  );
};

export default App;

