/**
 * Asset Preloader Utility
 * Preloads images for upcoming scenes to prevent pop-in during transitions
 */

export interface PreloadOptions {
  priority?: 'high' | 'low';
  timeout?: number; // ms
}

interface PreloadResult {
  url: string;
  success: boolean;
  error?: string;
}

/**
 * Preload a single image
 */
export const preloadImage = (url: string, options: PreloadOptions = {}): Promise<PreloadResult> => {
  return new Promise((resolve) => {
    const { timeout = 5000 } = options;
    
    const img = new Image();
    let timeoutId: number | null = null;

    const cleanup = () => {
      if (timeoutId) clearTimeout(timeoutId);
      img.onload = null;
      img.onerror = null;
    };

    img.onload = () => {
      cleanup();
      resolve({ url, success: true });
    };

    img.onerror = () => {
      cleanup();
      resolve({ url, success: false, error: 'Failed to load image' });
    };

    // Set timeout
    if (timeout > 0) {
      timeoutId = window.setTimeout(() => {
        cleanup();
        resolve({ url, success: false, error: 'Timeout' });
      }, timeout);
    }

    // Start loading
    img.src = url;
  });
};

/**
 * Preload multiple images in parallel
 */
export const preloadImages = async (
  urls: string[],
  options: PreloadOptions = {}
): Promise<PreloadResult[]> => {
  const promises = urls.map((url) => preloadImage(url, options));
  return Promise.all(promises);
};

/**
 * Preload assets for a specific scene
 * Returns a map of asset types to their preload results
 */
export const preloadSceneAssets = async (sceneData: {
  backgroundId?: string;
  characters?: {
    left?: string;
    center?: string;
    right?: string;
  };
  characterImgId?: string;
}): Promise<{
  background?: PreloadResult;
  characters: PreloadResult[];
}> => {
  const backgroundImages = import.meta.glob<{ default: string }>(
    '../assets/images/backgrounds/*.png',
    { eager: true }
  );
  const characterImages = import.meta.glob<{ default: string }>(
    '../assets/images/characters/*.png',
    { eager: true }
  );

  const results: {
    background?: PreloadResult;
    characters: PreloadResult[];
  } = {
    characters: [],
  };

  // Preload background
  if (sceneData.backgroundId) {
    const bgPath = `../assets/images/backgrounds/${sceneData.backgroundId}.png`;
    const bgUrl = backgroundImages[bgPath]?.default;
    if (bgUrl) {
      results.background = await preloadImage(bgUrl, { priority: 'high' });
    }
  }

  // Collect character image URLs
  const characterUrls: string[] = [];

  // Multi-slot characters
  if (sceneData.characters) {
    const positions = ['left', 'center', 'right'] as const;
    positions.forEach((pos) => {
      const charData = sceneData.characters?.[pos];
      if (!charData) return;
      
      let imageId: string;
      
      if (typeof charData === 'string') {
        imageId = charData;
      } else if (typeof charData === 'object' && 'image' in charData) {
        // CharacterConfig object
        imageId = (charData as { image: string }).image;
      } else {
        return;
      }
      
      const charPath = `../assets/images/characters/${imageId}.png`;
      const charUrl = characterImages[charPath]?.default;
      if (charUrl) characterUrls.push(charUrl);
    });
  }

  // Legacy single character
  if (sceneData.characterImgId) {
    const charPath = `../assets/images/characters/${sceneData.characterImgId}.png`;
    const charUrl = characterImages[charPath]?.default;
    if (charUrl) characterUrls.push(charUrl);
  }

  // Preload all character images in parallel
  if (characterUrls.length > 0) {
    results.characters = await preloadImages(characterUrls, { priority: 'high' });
  }

  return results;
};

/**
 * Create a preloader hook that can be used in components
 * Usage: const preload = useAssetPreloader();
 * preload.scene(nextSceneData);
 */
export const createPreloader = () => {
  const cache = new Set<string>();

  return {
    /**
     * Preload assets for a scene, avoiding duplicates
     */
    scene: async (sceneData: Parameters<typeof preloadSceneAssets>[0]) => {
      const results = await preloadSceneAssets(sceneData);
      
      // Add to cache
      if (results.background?.success) cache.add(results.background.url);
      results.characters.forEach((result) => {
        if (result.success) cache.add(result.url);
      });

      return results;
    },
    
    /**
     * Check if an asset is already cached
     */
    isCached: (url: string) => cache.has(url),
    
    /**
     * Clear the cache
     */
    clearCache: () => cache.clear(),
  };
};
