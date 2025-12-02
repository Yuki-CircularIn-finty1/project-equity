import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BackgroundLayerProps {
  backgroundId: string;
}

// Cache for loaded backgrounds to avoid re-fetching
const backgroundCache = new Map<string, string>();

// Lazy load backgrounds on-demand - moved outside component as it's static
const backgrounds = import.meta.glob<{ default: string }>('../assets/images/backgrounds/*.png');

const BackgroundLayerComponent: React.FC<BackgroundLayerProps> = ({ backgroundId }) => {
  
  const [backgroundSrc, setBackgroundSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const loadingRef = useRef(false);
  
  // Check if this is the title screen
  const isTitleScreen = backgroundId === 'bg_title';

  useEffect(() => {
    // Skip if no backgroundId or already loading
    if (!backgroundId || loadingRef.current) return;

    // Check cache first
    const cached = backgroundCache.get(backgroundId);
    if (cached) {
      setBackgroundSrc(cached);
      setIsLoading(false);
      setError(false);
      return;
    }

    // Load background on-demand
    const loadBackground = async () => {
      loadingRef.current = true;
      setIsLoading(true);
      setError(false);

      try {
        const path = `../assets/images/backgrounds/${backgroundId}.png`;
        const loader = backgrounds[path];
        
        if (!loader) {
          console.warn(`Background not found: ${backgroundId}`);
          setError(true);
          setIsLoading(false);
          loadingRef.current = false;
          return;
        }

        const module = await loader();
        const src = module.default;
        
        // Cache the loaded background
        backgroundCache.set(backgroundId, src);
        setBackgroundSrc(src);
        setError(false);
      } catch (e) {
        console.error(`Failed to load background: ${backgroundId}`, e);
        setError(true);
      } finally {
        setIsLoading(false);
        loadingRef.current = false;
      }
    };

    loadBackground();
  }, [backgroundId]);

  return (
    <div style={{ 
      position: 'absolute', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%', 
      zIndex: 0, 
      backgroundColor: '#000',
      overflow: 'hidden'
    }}>
      <AnimatePresence mode="wait">
        {!isLoading && backgroundSrc && (
          <motion.div
            key={backgroundId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `url(${backgroundSrc})`,
              // Title screen: contain to show all text, others: cover for immersion
              backgroundSize: isTitleScreen ? 'contain' : 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />
        )}
      </AnimatePresence>
      
      {/* Loading indicator - hidden for title screen to always show title text */}
      {isLoading && !isTitleScreen && (
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          color: 'rgba(255,255,255,0.5)',
          fontSize: '1.2rem'
        }}>
          Loading...
        </div>
      )}
      
      {/* Error indicator (dev only) */}
      {error && backgroundId && (
        <div style={{ 
          position: 'absolute', 
          top: 10, 
          left: 10, 
          color: 'rgba(255,100,100,0.8)', 
          zIndex: 1,
          padding: '10px',
          backgroundColor: 'rgba(0,0,0,0.7)',
          borderRadius: '3px'
        }}>
          ⚠️ Missing: {backgroundId}
        </div>
      )}
    </div>
  );
};

// Memoize - only re-render if backgroundId changes
export const BackgroundLayer = React.memo(BackgroundLayerComponent);


