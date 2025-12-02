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



// Title screen menu - positioned bottom-center to avoid covering character artwork
const TITLE_MENU_CONTAINER_STYLE = {
  position: 'absolute' as const,
  bottom: '2%', // Lowered to maximize character visibility
  left: '50%',
  transform: 'translateX(-50%)',
  width: '70%', // Narrower width for more side margin
  maxWidth: '480px', // Smaller max width
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'stretch' as const,
  gap: '12px', // Reduced gap
  zIndex: 10,
  padding: '20px',
  background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
  borderRadius: '20px 20px 0 0',
};

// Large, easy-to-click buttons for better UX
const TITLE_BUTTON_STYLE = {
  minWidth: 'auto', // Allow flex sizing
  padding: '12px 20px', // Reduced padding for smaller button size
  fontSize: '1.1rem', // Kept same font size
  cursor: 'pointer',
  backgroundColor: 'rgba(15, 15, 35, 0.90)',
  border: '3px solid rgba(180, 180, 240, 0.7)',
  borderRadius: '12px',
  color: '#ffffff',
  fontWeight: '700' as const,
  letterSpacing: '2px',
  textTransform: 'uppercase' as const,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
  fontFamily: 'inherit',
  textAlign: 'center' as const,
};

// Smaller but consistent style for secondary options (Chapters, Config)
const SECONDARY_BUTTON_STYLE = {
  padding: '8px 12px', // Reduced padding
  fontSize: '1.0rem', // Consistent with main buttons
  cursor: 'pointer',
  backgroundColor: 'rgba(15, 15, 35, 0.85)',
  border: '1px solid rgba(180, 180, 240, 0.5)',
  borderRadius: '8px',
  color: '#e0e0ff',
  fontWeight: '600' as const,
  letterSpacing: '1px',
  textTransform: 'uppercase' as const,
  transition: 'all 0.2s ease',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.4)',
  fontFamily: 'inherit',
  minWidth: 'auto',
  textAlign: 'center' as const,
};

const GAME_CONTAINER_STYLE = {
  display: 'flex',
  flexDirection: 'column' as const,
  width: '100%',
  height: '100%'
};

const VISUAL_AREA_STYLE = {
  position: 'relative' as const,
  flex: '3',
  overflow: 'hidden' as const,
  width: '100%'
};

const STORY_AREA_STYLE = {
  position: 'relative' as const,
  flex: '1',
  backgroundColor: '#000',
  borderTop: '2px solid #333',
  width: '100%',
  zIndex: 20
};

const MENU_BUTTONS_CONTAINER_STYLE = {
  position: 'absolute' as const,
  top: 10,
  right: 10,
  zIndex: 20
};

const ENDING_OVERLAY_STYLE = {
  position: 'absolute' as const,
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column' as const,
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
  backgroundColor: 'rgba(0,0,0,0.5)',
  zIndex: 30
};

const ENDING_TEXT_STYLE = {
  color: 'yellow',
  fontSize: '48px',
  fontWeight: 'bold' as const,
  marginBottom: '40px',
  textShadow: '2px 2px 4px black'
};

const ENDING_BUTTON_STYLE = {
  padding: '1rem 3rem',
  fontSize: '1.5rem',
  cursor: 'pointer',
  backgroundColor: 'rgba(255,255,255,0.9)',
  border: 'none',
  borderRadius: '5px',
  color: '#333',
  fontWeight: 'bold' as const
};

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
    bgmVolume, setBgmVolume, seVolume, setSeVolume
  } = useGame();

  const [showSaveLoad, setShowSaveLoad] = useState<'save' | 'load' | null>(null);
  const [showConfig, setShowConfig] = useState(false);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted) return;
      
      if (e.code === 'Space' || e.code === 'Enter') {
        // Prevent default scrolling for Space
        if (e.code === 'Space') e.preventDefault();
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
        <div style={TITLE_MENU_CONTAINER_STYLE}>
          <div style={{ display: 'flex', gap: '15px', width: '100%' }}>
            <button 
              onClick={startGame}
              style={{
                ...TITLE_BUTTON_STYLE,
                minWidth: 'auto',
                width: '100%',
                padding: '8px 10px', // Reduced height
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(70, 70, 140, 0.95)';
                e.currentTarget.style.borderColor = 'rgba(230, 230, 255, 1)';
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(120, 120, 255, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(15, 15, 35, 0.90)';
                e.currentTarget.style.borderColor = 'rgba(180, 180, 240, 0.7)';
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
              }}
            >
              ● New Game
            </button>

            <button 
              onClick={() => setShowSaveLoad('load')}
              style={{
                ...TITLE_BUTTON_STYLE,
                minWidth: 'auto',
                width: '100%',
                padding: '8px 10px', // Reduced height
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(70, 70, 140, 0.95)';
                e.currentTarget.style.borderColor = 'rgba(230, 230, 255, 1)';
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(120, 120, 255, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(15, 15, 35, 0.90)';
                e.currentTarget.style.borderColor = 'rgba(180, 180, 240, 0.7)';
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
              }}
            >
              📂 Load Game
            </button>
          </div>

          <div style={{ 
            marginTop: '8px', // Significantly reduced margin
            display: 'flex', 
            flexDirection: 'column', 
            gap: '15px', 
            alignItems: 'flex-end',
            width: '100%' // Ensure alignment
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', width: '100%' }}>
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
                    style={{
                      ...SECONDARY_BUTTON_STYLE,
                      minWidth: 'auto',
                      padding: '12px 4px',
                      fontSize: '0.9rem',
                      backgroundColor: isSelected 
                        ? 'rgba(80, 80, 180, 0.6)' 
                        : isPlayable 
                          ? 'rgba(15, 15, 35, 0.85)' 
                          : 'rgba(10, 10, 20, 0.5)', // Darker for locked
                      borderColor: isSelected 
                        ? 'rgba(200, 200, 255, 0.9)' 
                        : isPlayable 
                          ? 'rgba(180, 180, 240, 0.5)' 
                          : 'rgba(60, 60, 80, 0.3)', // Dim border for locked
                      color: isSelected 
                        ? '#fff' 
                        : isPlayable 
                          ? '#aaa' 
                          : '#555', // Grey text for locked
                      boxShadow: isSelected 
                        ? '0 0 15px rgba(100, 100, 255, 0.4)' 
                        : isPlayable 
                          ? '0 4px 10px rgba(0, 0, 0, 0.4)' 
                          : 'none',
                      cursor: isPlayable ? 'pointer' : 'not-allowed',
                      opacity: isPlayable ? 1 : 0.6,
                    }}
                    onMouseEnter={(e) => {
                      if (isPlayable && !isSelected) {
                        e.currentTarget.style.backgroundColor = 'rgba(40, 40, 80, 0.9)';
                        e.currentTarget.style.borderColor = 'white';
                        e.currentTarget.style.color = 'white';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (isPlayable && !isSelected) {
                        e.currentTarget.style.backgroundColor = 'rgba(15, 15, 35, 0.85)';
                        e.currentTarget.style.borderColor = 'rgba(180, 180, 240, 0.5)';
                        e.currentTarget.style.color = '#aaa';
                      }
                    }}
                  >
                    {getIcon(num)} Ch {num}
                  </button>
                );
              })}
            </div>

            <button 
              onClick={() => setShowConfig(true)} 
              style={SECONDARY_BUTTON_STYLE}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(40, 40, 80, 0.9)';
                e.currentTarget.style.borderColor = 'white';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(15, 15, 35, 0.85)';
                e.currentTarget.style.borderColor = 'rgba(180, 180, 240, 0.5)';
                e.currentTarget.style.color = '#e0e0ff';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
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
      <div style={GAME_CONTAINER_STYLE}>
        <div style={VISUAL_AREA_STYLE}>
          <BackgroundLayer backgroundId={currentScene.backgroundId} />
          <CharacterLayer 
            characterImgId={currentScene.characterImgId} 
            characters={currentScene.characters}
          />
          
          <div style={MENU_BUTTONS_CONTAINER_STYLE}>
            <button 
              onClick={() => setShowSaveLoad('save')} 
              style={{ 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer', 
                padding: '5px',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              title="Save"
            >
              <img src={iconSave} alt="Save" style={{ width: '40px', height: '40px' }} />
            </button>
            <button 
              onClick={() => setShowSaveLoad('load')} 
              style={{ 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer', 
                padding: '5px',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              title="Load"
            >
              <img src={iconLoad} alt="Load" style={{ width: '40px', height: '40px' }} />
            </button>
            <button 
              onClick={() => setShowConfig(true)}
              style={{ 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer', 
                padding: '5px',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              title="Config"
            >
              <img src={iconConfig} alt="Config" style={{ width: '40px', height: '40px' }} />
            </button>
          </div>

          {currentScene.choices && currentScene.choices.length > 0 && (
            <ChoiceList choices={currentScene.choices} onSelect={makeChoice} />
          )}
        </div>

        <div style={STORY_AREA_STYLE}>
          <TextBox 
            text={currentScene.text} 
            characterName={currentScene.characterId}
            onNext={next}
          />
        </div>
      </div>
      
      {currentScene.type === 'ending' && (
        <div style={ENDING_OVERLAY_STYLE}>
          <div style={ENDING_TEXT_STYLE}>
            ENDING REACHED
          </div>
          <button 
            onClick={() => window.location.reload()}
            style={ENDING_BUTTON_STYLE}
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
