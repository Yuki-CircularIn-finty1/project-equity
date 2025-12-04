interface ConfigUIProps {
  bgmVolume: number;
  setBgmVolume: (vol: number) => void;
  seVolume: number;
  setSeVolume: (vol: number) => void;
  windowScale: number;
  setWindowScale: (scale: number) => void;
  language: 'ja' | 'en';
  setLanguage: (lang: 'ja' | 'en') => void;
  textSpeed?: number;
  setTextSpeed?: (speed: number) => void;
  onClose: () => void;
}

const ConfigUI = ({ 
  bgmVolume, 
  setBgmVolume, 
  seVolume, 
  setSeVolume, 
  windowScale,
  setWindowScale,
  language,
  setLanguage,
  onClose 
}: ConfigUIProps) => {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.8)',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100 // Always on top
    }}>
      <h2>Configuration</h2>
      
      <div style={{ width: '300px', marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          BGM Volume: {Math.round(bgmVolume * 100)}%
        </label>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.1" 
          value={bgmVolume} 
          onChange={(e) => setBgmVolume(parseFloat(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ width: '300px', marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          SE Volume: {Math.round(seVolume * 100)}%
        </label>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.1" 
          value={seVolume} 
          onChange={(e) => setSeVolume(parseFloat(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ width: '300px', marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          Language
        </label>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
          <button
            onClick={() => setLanguage('ja')}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: language === 'ja' ? '#4a90e2' : 'rgba(255,255,255,0.2)',
              border: '1px solid #fff',
              color: 'white',
              cursor: 'pointer',
              borderRadius: '3px'
            }}
          >
            日本語
          </button>
          <button
            onClick={() => setLanguage('en')}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: language === 'en' ? '#4a90e2' : 'rgba(255,255,255,0.2)',
              border: '1px solid #fff',
              color: 'white',
              cursor: 'pointer',
              borderRadius: '3px'
            }}
          >
            English
          </button>
        </div>
      </div>

      <div style={{ width: '300px', marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          Screen Scale: {Math.round(windowScale * 100)}%
        </label>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
          {[0.5, 0.75, 1.0, 1.25].map((scale) => (
            <button
              key={scale}
              onClick={() => setWindowScale(scale)}
              style={{
                flex: 1,
                padding: '5px',
                backgroundColor: windowScale === scale ? '#4a90e2' : 'rgba(255,255,255,0.2)',
                border: '1px solid #fff',
                color: 'white',
                cursor: 'pointer',
                borderRadius: '3px'
              }}
            >
              {scale}x
            </button>
          ))}
        </div>
      </div>

      <button 
        onClick={onClose}
        style={{
          marginTop: '20px',
          padding: '10px 30px',
          fontSize: '1.2em',
          cursor: 'pointer'
        }}
      >
        Close
      </button>
    </div>
  );
};

export default ConfigUI;
