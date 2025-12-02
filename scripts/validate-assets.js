/**
 * Build-time Asset Validation Script
 * Validates that all character images referenced in chapter JSONs actually exist
 * Run with: node scripts/validate-assets.js
 */

const fs = require('fs');
const path = require('path');

const CHAPTERS_DIR = path.join(__dirname, '../src/data/chapters');
const IMAGES_DIR = path.join(__dirname, '../src/assets/images/characters');

function validateAssets() {
  console.log('🔍 Validating character assets...\n');
  
  // Get all available character images
  const imageFiles = fs.readdirSync(IMAGES_DIR)
    .filter(f => f.endsWith('.png'))
    .map(f => f.replace('.png', ''));
  
  console.log(`📦 Found ${imageFiles.length} character images in ${IMAGES_DIR}`);
  
  // Get all chapter files
  const chapterFiles = fs.readdirSync(CHAPTERS_DIR)
    .filter(f => f.endsWith('.json'));
  
  console.log(`📖 Found ${chapterFiles.length} chapter files in ${CHAPTERS_DIR}\n`);
  
  let hasErrors = false;
  let totalScenes = 0;
  const usedImages = new Set();
  
  // Validate each chapter
  chapterFiles.forEach(chapterFile => {
    const chapterPath = path.join(CHAPTERS_DIR, chapterFile);
    const chapter = JSON.parse(fs.readFileSync(chapterPath, 'utf8'));
    
    console.log(`📄 Checking ${chapterFile}...`);
    totalScenes += chapter.scenes.length;
    
    const missingInChapter = new Set();
    
    chapter.scenes.forEach((scene, index) => {
      // Check legacy characterImgId
      if (scene.characterImgId) {
        usedImages.add(scene.characterImgId);
        if (!imageFiles.includes(scene.characterImgId)) {
          missingInChapter.add(scene.characterImgId);
          console.error(`  ❌ Scene ${index} (${scene.id}): Missing "${scene.characterImgId}.png"`);
          hasErrors = true;
        }
      }
      
      // Check multi-slot characters
      if (scene.characters) {
        ['left', 'center', 'right'].forEach(position => {
          const char = scene.characters[position];
          if (char) {
            const charId = typeof char === 'string' ? char : char.image;
            usedImages.add(charId);
            if (!imageFiles.includes(charId)) {
              missingInChapter.add(charId);
              console.error(`  ❌ Scene ${index} (${scene.id}): Missing "${charId}.png" at position "${position}"`);
              hasErrors = true;
            }
          }
        });
      }
    });
    
    if (missingInChapter.size === 0) {
      console.log(`  ✅ All images found (${chapter.scenes.length} scenes)`);
    } else {
      console.log(`  ⚠️  Missing ${missingInChapter.size} unique image(s): ${Array.from(missingInChapter).join(', ')}`);
    }
    console.log('');
  });
  
  // Summary
  console.log('═'.repeat(60));
  console.log('📊 Validation Summary:');
  console.log(`   Total scenes checked: ${totalScenes}`);
  console.log(`   Unique images used: ${usedImages.size}`);
  console.log(`   Available images: ${imageFiles.length}`);
  
  // Check for unused images
  const unusedImages = imageFiles.filter(img => !usedImages.has(img));
  if (unusedImages.length > 0) {
    console.log(`\n💡 Note: ${unusedImages.length} image(s) are not used in any chapter:`);
    unusedImages.forEach(img => console.log(`   - ${img}.png`));
  }
  
  console.log('═'.repeat(60));
  
  if (hasErrors) {
    console.error('\n❌ VALIDATION FAILED: Some character images are missing!');
    console.error('   Please add the missing images or update the chapter data.\n');
    process.exit(1);
  } else {
    console.log('\n✅ VALIDATION PASSED: All character images are available!\n');
  }
}

// Run validation
try {
  validateAssets();
} catch (error) {
  console.error('\n🚨 ERROR during validation:', error.message);
  process.exit(1);
}
