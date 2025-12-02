import type { Scene } from '../engine/types';

export interface Chapter {
  scenes: Scene[];
}

/**
 * Validates that all character images referenced in a chapter actually exist
 * @param chapter - The chapter data to validate
 * @param availableImages - Array of available character image IDs (without .png extension)
 * @returns Array of missing character image IDs
 */
export function validateCharacterAssets(chapter: Chapter, availableImages: string[]): string[] {
  const missingImages: string[] = [];
  const usedCharacters = new Set<string>();
  
  // Collect all character IDs used in chapter
  for (const scene of chapter.scenes) {
    // Legacy single character
    if (scene.characterImgId) {
      usedCharacters.add(scene.characterImgId);
    }
    
    // Multi-slot characters
    if (scene.characters) {
      Object.values(scene.characters).forEach(char => {
        if (char) {
          const id = typeof char === 'string' ? char : char.image;
          usedCharacters.add(id);
        }
      });
    }
  }
  
  // Check if all used characters exist in available images
  for (const charId of usedCharacters) {
    if (!availableImages.includes(charId)) {
      missingImages.push(charId);
    }
  }
  
  return missingImages;
}

/**
 * Get list of all available character images from import.meta.glob result
 * @param characterImages - The result from import.meta.glob
 * @returns Array of character IDs (filenames without extension)
 */
export function getAvailableCharacterIds(characterImages: Record<string, { default: string }>): string[] {
  return Object.keys(characterImages).map(path => {
    // Extract filename from path like '../assets/images/characters/k_neutral.png'
    const filename = path.split('/').pop() || '';
    return filename.replace('.png', '');
  });
}
