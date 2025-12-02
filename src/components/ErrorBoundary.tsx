import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import type { GameState } from '../engine/types';

interface Props {
  children: ReactNode;
  getCurrentState?: () => GameState | null;
  onRecover?: (state: GameState) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class GameErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Game Error Caught:', error, errorInfo);
    
    this.setState({ errorInfo });

    // Try to save current game state as emergency backup
    try {
      if (this.props.getCurrentState) {
        const gameState = this.props.getCurrentState();
        if (gameState) {
          localStorage.setItem('emergency_save', JSON.stringify({
            gameState,
            timestamp: Date.now(),
            error: error.message,
          }));
          console.log('Emergency save created');
        }
      }
    } catch (e) {
      console.error('Failed to create emergency save:', e);
    }
  }

  handleRecover = () => {
    try {
      const emergencySave = localStorage.getItem('emergency_save');
      if (emergencySave && this.props.onRecover) {
        const { gameState } = JSON.parse(emergencySave);
        this.props.onRecover(gameState);
        this.setState({ hasError: false, error: null, errorInfo: null });
        localStorage.removeItem('emergency_save');
      } else {
        this.handleReset();
      }
    } catch (e) {
      console.error('Failed to recover from emergency save:', e);
      this.handleReset();
    }
  };

  handleReset = () => {
    localStorage.removeItem('emergency_save');
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#1a1a1a',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          zIndex: 9999,
        }}>
          <div style={{
            maxWidth: '600px',
            textAlign: 'center',
          }}>
            <h1 style={{
              fontSize: '3rem',
              marginBottom: '20px',
              color: '#ff6b6b',
            }}>
              ⚠️ Oops!
            </h1>
            
            <p style={{
              fontSize: '1.2rem',
              marginBottom: '30px',
              color: '#ccc',
            }}>
              Something went wrong. Don't worry, your progress has been saved.
            </p>

            {import.meta.env.DEV && this.state.error && (
              <div style={{
                backgroundColor: 'rgba(255,107,107,0.1)',
                border: '1px solid rgba(255,107,107,0.3)',
                borderRadius: '5px',
                padding: '15px',
                marginBottom: '30px',
                textAlign: 'left',
                fontSize: '0.9rem',
                fontFamily: 'monospace',
                color: '#ff6b6b',
              }}>
                <strong>Error:</strong> {this.state.error.message}
                {this.state.errorInfo && (
                  <details style={{ marginTop: '10px' }}>
                    <summary style={{ cursor: 'pointer', marginBottom: '10px' }}>
                      Stack Trace
                    </summary>
                    <pre style={{
                      fontSize: '0.8rem',
                      overflow: 'auto',
                      maxHeight: '200px',
                      whiteSpace: 'pre-wrap',
                    }}>
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div style={{
              display: 'flex',
              gap: '15px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}>
              {localStorage.getItem('emergency_save') && this.props.onRecover && (
                <button
                  onClick={this.handleRecover}
                  style={{
                    padding: '15px 30px',
                    fontSize: '1.1rem',
                    backgroundColor: '#4ecdc4',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: 'background-color 0.3s',
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#45b8b0'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4ecdc4'}
                >
                  🔄 Recover Game
                </button>
              )}
              
              <button
                onClick={this.handleReset}
                style={{
                  padding: '15px 30px',
                  fontSize: '1.1rem',
                  backgroundColor: '#555',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'background-color 0.3s',
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#666'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#555'}
              >
                🔁 Restart App
              </button>
            </div>

            <p style={{
              marginTop: '30px',
              fontSize: '0.9rem',
              color: '#888',
            }}>
              If this problem persists, please refresh the page.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
