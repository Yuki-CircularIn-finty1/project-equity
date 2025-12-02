import React from 'react';

interface LogEntry {
  characterName?: string;
  text: string;
}

interface BacklogUIProps {
  log: LogEntry[];
  onClose: () => void;
}

export const BacklogUI: React.FC<BacklogUIProps> = ({ log, onClose }) => {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
      boxSizing: 'border-box',
      color: '#fff',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>Backlog</h2>
        <button 
          onClick={onClose}
          style={{
            padding: '5px 15px',
            fontSize: '1.2rem',
            cursor: 'pointer',
            backgroundColor: 'transparent',
            border: '1px solid #fff',
            color: '#fff',
            borderRadius: '5px'
          }}
        >
          Close
        </button>
      </div>
      <div style={{
        flex: 1,
        overflowY: 'auto',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        padding: '10px',
        borderRadius: '5px',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
      }}>
        {log.length === 0 ? (
          <div style={{ fontStyle: 'italic', opacity: 0.7 }}>No history yet.</div>
        ) : (
          log.map((entry, index) => (
            <div key={index} style={{ marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
              {entry.characterName && (
                <div style={{ fontWeight: 'bold', color: '#ffcc00', marginBottom: '5px' }}>
                  {entry.characterName}
                </div>
              )}
              <div style={{ lineHeight: '1.5' }}>{entry.text}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
