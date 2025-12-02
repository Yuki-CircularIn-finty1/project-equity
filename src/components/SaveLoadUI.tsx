import { useState, useEffect } from 'react';
import { saveGame, loadGame, type SaveData } from '../engine/saveLoad';
import type { GameState } from '../engine/types';

interface SaveLoadUIProps {
  mode: 'save' | 'load';
  gameState?: GameState;
  onClose: () => void;
  onLoad: (state: GameState) => void;
}

const SaveLoadUI = ({ mode, gameState, onClose, onLoad }: SaveLoadUIProps) => {
  const [slots, setSlots] = useState<{ id: number | 'auto'; data: SaveData | null }[]>([]);

  useEffect(() => {
    const loadSlots = () => {
      const loadedSlots: { id: number | 'auto'; data: SaveData | null }[] = [];
      
      // Add Auto Save slot only in Load mode
      if (mode === 'load') {
        try {
          const autoSaveData = localStorage.getItem('sound_novel_autosave');
          if (autoSaveData) {
            loadedSlots.push({ id: 'auto', data: JSON.parse(autoSaveData) });
          } else {
            loadedSlots.push({ id: 'auto', data: null });
          }
        } catch {
          loadedSlots.push({ id: 'auto', data: null });
        }
      }

      // Add Manual Save slots (1-10)
      for (let i = 1; i <= 10; i++) {
        try {
          const data = loadGame(i);
          loadedSlots.push({ id: i, data });
        } catch {
          loadedSlots.push({ id: i, data: null });
        }
      }
      setSlots(loadedSlots);
    };
    loadSlots();
  }, [mode]);

  const handleAction = (slotId: number | 'auto') => {
    if (slotId === 'auto') {
      if (mode === 'load') {
        const slot = slots.find(s => s.id === 'auto');
        if (slot?.data) {
          onLoad(slot.data.gameState);
          onClose();
        } else {
          alert('No auto-save data found');
        }
      }
      return;
    }

    if (mode === 'save' && gameState) {
      saveGame(slotId, gameState);
      // Refresh slots
      const data = loadGame(slotId);
      setSlots(prev => prev.map(s => s.id === slotId ? { ...s, data } : s));
      alert(`Saved to slot ${slotId}`);
    } else if (mode === 'load') {
      try {
        const data = loadGame(slotId);
        if (data) {
          onLoad(data.gameState);
          onClose();
        } else {
           alert('Empty slot');
        }
      } catch {
        alert('Error loading slot');
      }
    }
  };

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(10, 10, 20, 0.85)',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      backdropFilter: 'blur(8px)',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      <h2 style={{ 
        fontSize: '2.5rem', 
        marginBottom: '30px', 
        borderBottom: '2px solid rgba(100, 100, 255, 0.4)',
        paddingBottom: '15px',
        width: '80%',
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: '4px',
        textShadow: '0 2px 10px rgba(0,0,0,0.5)',
        fontWeight: '300'
      }}>
        {mode === 'save' ? 'Save Game' : 'Load Game'}
      </h2>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '20px',
        maxHeight: '65%',
        overflowY: 'auto',
        width: '85%',
        padding: '20px',
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(100, 100, 255, 0.5) rgba(0,0,0,0.2)'
      }}>
        {slots.map(slot => (
          <button
            key={slot.id}
            onClick={() => handleAction(slot.id)}
            style={{
              padding: '25px',
              backgroundColor: slot.id === 'auto' ? 'rgba(60, 80, 180, 0.25)' : 'rgba(30, 30, 50, 0.4)',
              border: slot.id === 'auto' ? '1px solid rgba(120, 140, 255, 0.6)' : '1px solid rgba(80, 80, 120, 0.3)',
              color: 'white',
              textAlign: 'left',
              cursor: 'pointer',
              borderRadius: '12px',
              transition: 'all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = slot.id === 'auto' ? 'rgba(80, 100, 220, 0.35)' : 'rgba(50, 50, 80, 0.6)';
              e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.3)';
              e.currentTarget.style.borderColor = slot.id === 'auto' ? 'rgba(150, 170, 255, 0.8)' : 'rgba(120, 120, 180, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = slot.id === 'auto' ? 'rgba(60, 80, 180, 0.25)' : 'rgba(30, 30, 50, 0.4)';
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.2)';
              e.currentTarget.style.borderColor = slot.id === 'auto' ? '1px solid rgba(120, 140, 255, 0.6)' : '1px solid rgba(80, 80, 120, 0.3)';
            }}
          >
            <div style={{ 
              fontWeight: '700', 
              fontSize: '1.2rem', 
              color: slot.id === 'auto' ? '#aaccff' : '#e0e0e0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              letterSpacing: '1px'
            }}>
              <span>{slot.id === 'auto' ? '🔄 AUTO SAVE' : `SLOT ${slot.id}`}</span>
              {slot.data?.gameState?.currentSceneId && (
                <span style={{ 
                  fontSize: '0.75rem', 
                  opacity: 0.8, 
                  backgroundColor: 'rgba(0,0,0,0.3)', 
                  padding: '2px 8px', 
                  borderRadius: '4px',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  #{slot.data.gameState.currentSceneId}
                </span>
              )}
            </div>
            
            <div style={{ 
              fontSize: '0.9rem', 
              color: slot.data ? '#ccc' : '#666',
              fontStyle: slot.data ? 'normal' : 'italic'
            }}>
              {slot.data ? new Date(slot.data.timestamp).toLocaleString() : 'Empty Slot'}
            </div>
          </button>
        ))}
      </div>
      
      <button 
        onClick={onClose}
        style={{
          marginTop: '30px',
          padding: '12px 50px',
          fontSize: '1.3em',
          cursor: 'pointer',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          color: 'white',
          borderRadius: '50px',
          transition: 'all 0.3s ease',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          fontWeight: 'bold',
          backdropFilter: 'blur(4px)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
          e.currentTarget.style.borderColor = 'white';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 0 15px rgba(255,255,255,0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        Close
      </button>
    </div>
  );
};

export default SaveLoadUI;
