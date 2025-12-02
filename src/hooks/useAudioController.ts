import { useState, useRef, useEffect, useCallback } from 'react';

// Define available audio assets using import.meta.glob
// This allows us to dynamically load audio files from the assets directory
const bgmAssets = import.meta.glob<{ default: string }>('/src/assets/audio/bgm/*.{mp3,wav,ogg}', { eager: true });
const seAssets = import.meta.glob<{ default: string }>('/src/assets/audio/se/*.{mp3,wav,ogg}', { eager: true });

// Audio pool to prevent memory leaks from unlimited SE instances
class AudioPool {
  private pool: Map<string, HTMLAudioElement[]> = new Map();
  private readonly maxPoolSize = 5; // Limit instances per sound

  acquire(src: string, volume: number): HTMLAudioElement {
    const pool = this.pool.get(src) || [];
    
    // Find an available (paused/ended) audio instance
    const available = pool.find(audio => audio.paused || audio.ended);
    
    if (available) {
      available.currentTime = 0;
      available.volume = volume;
      return available;
    }
    
    // Create new instance if pool not full
    if (pool.length < this.maxPoolSize) {
      const audio = new Audio(src);
      audio.volume = volume;
      pool.push(audio);
      this.pool.set(src, pool);
      return audio;
    }
    
    // Reuse oldest instance if pool is full
    const oldest = pool[0];
    oldest.pause();
    oldest.currentTime = 0;
    oldest.volume = volume;
    return oldest;
  }

  cleanup() {
    this.pool.forEach(pool => {
      pool.forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    });
    this.pool.clear();
  }
}

export const useAudioController = () => {
  const [bgmVolume, setBgmVolume] = useState(0.5);
  const [seVolume, setSeVolume] = useState(0.5);
  const [currentBgmId, setCurrentBgmId] = useState<string | null>(null);
  
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const audioPoolRef = useRef<AudioPool>(new AudioPool());
  const seTimersRef = useRef<number[]>([]);

  const getAudioSrc = (type: 'bgm' | 'se', id: string) => {
    const assets = type === 'bgm' ? bgmAssets : seAssets;
    // Try different extensions if exact match fails, or assume id includes extension?
    // Let's assume ID matches the filename without extension for simplicity, 
    // and we search for a match.
    
    const path = Object.keys(assets).find(p => p.includes(`/${id}.`));
    return path ? assets[path].default : null;
  };

  const playBgm = useCallback((id: string) => {
    if (currentBgmId === id) return; // Already playing

    // Stop current BGM properly
    if (bgmRef.current) {
      bgmRef.current.pause();
      bgmRef.current.src = ''; // Release memory
      bgmRef.current = null;
    }

    const src = getAudioSrc('bgm', id);
    if (!src) {
      console.warn(`BGM not found: ${id}`);
      setCurrentBgmId(null);
      return;
    }

    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = bgmVolume;
    audio.play().catch(e => console.error('Failed to play BGM:', e));
    
    bgmRef.current = audio;
    setCurrentBgmId(id);
  }, [currentBgmId, bgmVolume]);

  const stopBgm = useCallback(() => {
    if (bgmRef.current) {
      bgmRef.current.pause();
      bgmRef.current.src = ''; // Release memory
      bgmRef.current = null;
    }
    setCurrentBgmId(null);
  }, []);

  const playSe = useCallback((id: string, options?: { repeat?: number, interval?: number }) => {
    const src = getAudioSrc('se', id);
    if (!src) {
      console.warn(`SE not found: ${id}`);
      return;
    }

    const repeatCount = options?.repeat || 1;
    const interval = options?.interval || 200;

    // Play SE using audio pool to prevent memory leaks
    const play = (count: number) => {
      if (count <= 0) return;

      const audio = audioPoolRef.current.acquire(src, seVolume);
      audio.play().catch(e => console.error('Failed to play SE:', e));
      
      if (count > 1) {
        const timerId = window.setTimeout(() => play(count - 1), interval);
        seTimersRef.current.push(timerId);
      }
    };

    play(repeatCount);
  }, [seVolume]);

  // Cleanup on unmount
  useEffect(() => {
    const audioPool = audioPoolRef.current; // Capture ref value
    
    return () => {
      // Clean up BGM
      if (bgmRef.current) {
        bgmRef.current.pause();
        bgmRef.current.src = '';
        bgmRef.current = null;
      }
      
      // Clear all SE timers
      seTimersRef.current.forEach(timerId => clearTimeout(timerId));
      seTimersRef.current = [];
      
      // Cleanup audio pool
      audioPool.cleanup();
    };
  }, []);

  // Update volume of currently playing BGM if volume state changes
  useEffect(() => {
    if (bgmRef.current) {
      bgmRef.current.volume = bgmVolume;
    }
  }, [bgmVolume]);

  return {
    playBgm,
    stopBgm,
    playSe,
    bgmVolume,
    setBgmVolume,
    seVolume,
    setSeVolume
  };
};

