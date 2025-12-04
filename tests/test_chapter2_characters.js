// Test script to identify all scenes with 3 characters in chapter2
const chapter2 = require('./src/data/chapters/chapter2.json');

const threeCharScenes = chapter2.scenes.filter(scene => {
  return scene.characters && Object.keys(scene.characters).length === 3;
});

console.log(`\n=== CHAPTER 2: Scenes with 3 characters (${threeCharScenes.length} total) ===\n`);

threeCharScenes.forEach((scene, idx) => {
  console.log(`${idx + 1}. Scene ID: ${scene.id}`);
  console.log(`   Characters:`);
  if (scene.characters.left) {
    const left = typeof scene.characters.left === 'string' ? scene.characters.left : scene.characters.left.image;
    console.log(`     LEFT: ${left}`);
  }
  if (scene.characters.center) {
    const center = typeof scene.characters.center === 'string' ? scene.characters.center : scene.characters.center.image;
    const opacity = typeof scene.characters.center === 'object' ? ` (opacity: ${scene.characters.center.opacity})` : '';
    console.log(`     CENTER: ${center}${opacity}`);
  }
  if (scene.characters.right) {
    const right = typeof scene.characters.right === 'string' ? scene.characters.right : scene.characters.right.image;
    console.log(`     RIGHT: ${right}`);
  }
  console.log('');
});

console.log('\n=== KEY TEST CASES ===');
console.log('These scenes are critical for boundary testing:');
console.log('- scene_c2_meet_8: First appearance of all 3 main characters');
console.log('- scene_c2_ten_*: Scenes with Ten character (includes opacity variations)');
console.log('- scene_c2_slap_*: Scenes with all characters during dramatic moments');
console.log('- scene_c2_dialogue_*: Extended dialogue with 3 characters\n');
