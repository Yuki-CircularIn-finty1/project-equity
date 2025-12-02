# Asset Guidelines

Specifications and best practices for preparing assets for Project Equity.

## Quick Reference

| Asset Type | Format            | Location                         | Naming Convention              |
| ---------- | ----------------- | -------------------------------- | ------------------------------ |
| Background | PNG               | `src/assets/images/backgrounds/` | `bg_{location}_{variant}.png`  |
| Character  | PNG (transparent) | `src/assets/images/characters/`  | `{character}_{expression}.png` |
| BGM        | MP3               | `src/assets/audio/bgm/`          | Descriptive lowercase          |
| SE         | MP3               | `src/assets/audio/se/`           | `se_{description}.mp3`         |
| UI Icons   | PNG (transparent) | `src/assets/images/ui/`          | `icon_{name}.png`              |

---

## Image Assets

### Background Images

**Purpose**: Scene backgrounds and locations

**Specifications:**

- **Format**: PNG
- **Resolution**: 1920x1080 recommended (16:9 aspect ratio)
- **File Size**: < 500KB per image (optimize with compression)
- **Color Mode**: RGB

**Best Practices:**

- Use consistent art style across all backgrounds
- Ensure readability with text overlay (avoid busy patterns in lower third)
- Test across different screen sizes
- Optimize file size without visible quality loss

**Naming Examples:**

```
bg_park_day.png
bg_park_night.png
bg_club_room.png
bg_train_interior.png
bg_shinjuku_station.png
```

### Character Sprites

**Purpose**: Character visual representation with expressions

**Specifications:**

- **Format**: PNG with alpha channel (transparency)
- **Resolution**: Height 800-1200px, proportional width
- **File Size**: < 300KB per sprite
- **Color Mode**: RGBA (with transparency)
- **Position**: Character centered in frame

**Best Practices:**

- Maintain consistent character proportions across sprites
- Leave transparent space above head (for name tags)
- Expressions should be clearly distinguishable
- Keep character facing slightly toward center (for better composition)

**Naming Convention:**

```
{character}_{expression}.png

Examples:
haruka_neutral.png        # Default/talking expression
haruka_smile.png          # Happy
haruka_despair.png        # Sad/desperate
haruka_cooking.png        # Action/activity specific
k_serious.png             # Character K, serious expression
k_no_hat.png              # Variant appearance
```

**Expression Guide:**

- `neutral` - Default, calm expression
- `smile` - Happy, friendly
- `sad` - Unhappy, downcast
- `angry` - Upset, fierce
- `surprised` - Shocked, startled
- `despair` - Deep sadness
- Activity-specific suffixes are allowed

### UI Icons

**Purpose**: Interface elements (save, load, config buttons)

**Specifications:**

- **Format**: PNG with alpha channel
- **Resolution**: 128x128 to 256x256px
- **File Size**: < 50KB
- **Style**: Consistent visual language

**Naming Examples:**

```
icon_save.png
icon_load.png
icon_config.png
```

---

## Audio Assets

### Background Music (BGM)

**Purpose**: Atmospheric music that loops continuously

**Specifications:**

- **Format**: MP3
- **Bitrate**: 128-192 kbps (balance quality vs file size)
- **Sample Rate**: 44.1 kHz
- **Length**: 60-300 seconds (1-5 minutes recommended)
- **Looping**: Must loop seamlessly (fade in/out at ends)
- **File Size**: < 5MB per track

**Best Practices:**

- Ensure seamless looping (no clicks/pops)
- Test at different volume levels
- Consider mood and pacing
- Avoid tracks with distinct beginnings/endings
- Master with consistent volume levels

**Volume Guidelines:**

- Normalized peak: -6dB to -3dB
- RMS (average): -18dB to -12dB
- Allows for mix headroom with dialogue

**Naming Examples:**

```
ghost_doodle.mp3
omoideguiter.mp3
牙.mp3 (OK to use original names if non-English)
```

### Sound Effects (SE)

**Purpose**: Short audio cues for actions and events

**Specifications:**

- **Format**: MP3
- **Bitrate**: 96-128 kbps (SE files should be smaller)
- **Sample Rate**: 44.1 kHz
- **Length**: 0.5-5 seconds typically
- **File Size**: < 200KB per effect

**Best Practices:**

- Keep files short and punchy
- Normalize volume (not too loud compared to BGM)
- Use sparingly for impact
- Test in context with BGM playing

**Categories and Naming:**

**Environmental SE:**

```
se_wind.mp3
se_rain.mp3
se_footsteps.mp3
```

**Action SE:**

```
se_hit.mp3
se_impact.mp3
se_door_close.mp3
```

**Character-Specific SE:**

```
se_ball_appear.mp3       # Ten's ability
se_power_activate.mp3
```

**UI SE (if needed):**

```
se_button_click.mp3
se_page_turn.mp3
```

---

## Asset Optimization

### Image Optimization

**Tools:**

- [TinyPNG](https://tinypng.com/) - Compress PNG files
- [ImageOptim](https://imageoptim.com/) - Mac optimization tool
- [Squoosh](https://squoosh.app/) - Web-based image optimizer

**Process:**

1. Export at target resolution
2. Run through compression tool
3. Check visual quality
4. Target: 30-70% size reduction without visible quality loss

### Audio Optimization

**Tools:**

- [Audacity](https://www.audacityteam.org/) - Free audio editor
- [Ocenaudio](https://www.ocenaudio.com/) - Simple audio editor

**Process for BGM:**

1. Trim silence at start/end
2. Normalize to -6dB peak
3. Apply fade in (0.5s) and fade out (1-2s for seamless loop)
4. Export as MP3 at 128-192 kbps

**Process for SE:**

1. Trim unnecessary silence
2. Normalize to appropriate volume
3. Export as MP3 at 96-128 kbps

---

## Asset Attribution

### CRITICAL: Update CREDITS.md

**Every time you add a new asset from an external source**, you MUST update `CREDITS.md`:

```markdown
### filename.mp3

- **Source**: https://source-url.com
- **Author**: Creator Name
- **License**: CC-BY 4.0 (or other license)
- **Attribution**: "Sound effect by Creator Name"
- **Date Added**: 2025-12-02
```

### License Types Quick Reference

| License             | Commercial Use | Attribution Required | Modifications Allowed |
| ------------------- | -------------- | -------------------- | --------------------- |
| CC0                 | ✅ Yes         | ❌ No                | ✅ Yes                |
| CC-BY 4.0           | ✅ Yes         | ✅ Yes               | ✅ Yes                |
| CC-BY-SA 4.0        | ✅ Yes         | ✅ Yes               | ✅ Yes (Share-Alike)  |
| Free for Commercial | ✅ Yes         | Varies               | Varies                |

**Always read the full license terms before using an asset.**

---

## Asset Discovery Resources

### Free Audio Sources

- [Freesound](https://freesound.org/) - Large library of SE
- [Free Music Archive](https://freemusicarchive.org/) - BGM
- [Incompetech](https://incompetech.com/) - Royalty-free BGM
- [DOVA-SYNDROME](https://dova-s.jp/) - Japanese free music
- [効果音ラボ](https://soundeffect-lab.info/) - Japanese SE library

### Free Image Sources

- [Unsplash](https://unsplash.com/) - Photos (can be used as base for backgrounds)
- [Pexels](https://www.pexels.com/) - Photos and videos
- [Pixabay](https://pixabay.com/) - Images and videos

**Note**: Most character sprites should be original artwork or commissioned.

---

## File Organization Checklist

Before committing new assets:

- [ ] Files named according to convention
- [ ] Files in correct directory
- [ ] Images optimized (file size reasonable)
- [ ] Audio files normalized and compressed
- [ ] CREDITS.md updated with attribution
- [ ] `npm run generate-assets` executed successfully
- [ ] Assets tested in game

---

## Troubleshooting

### Asset Not Loading

1. **Check filename** - Exact match required (case-sensitive on some systems)
2. **Run generate-assets** - `npm run generate-assets`
3. **Check file location** - Must be in correct subdirectory
4. **Restart dev server** - `npm run dev` after adding assets

### Image Display Issues

- **Too small/large**: Check source resolution
- **Pixelated**: Provide higher resolution source
- **Wrong colors**: Verify RGB/RGBA color mode

### Audio Issues

- **No sound**: Check browser console for loading errors
- **Choppy playback**: Reduce bitrate or file size
- **Doesn't loop**: Add fade in/out for seamless loop
- **Too loud/quiet**: Normalize audio levels

---

## Advanced: Batch Processing

### Bulk Image Optimization (PowerShell)

```powershell
# Example: Compress all PNGs in a directory
cd src/assets/images/backgrounds
foreach ($file in Get-ChildItem *.png) {
    # Use your preferred optimization tool here
}
```

### Bulk Audio Normalization

Use Audacity macros or command-line tools like `ffmpeg`:

```bash
# Normalize audio to -6dB peak
ffmpeg -i input.mp3 -af "loudnorm=I=-16:LRA=11:TP=-1.5" output.mp3
```

---

## Updates and Maintenance

This document should be updated when:

- New asset types are added
- Optimization thresholds change
- New tools are discovered
- Best practices evolve based on project experience

**Last Updated**: 2025-12-02
**Based on**: Chapters 1-4 development experience
