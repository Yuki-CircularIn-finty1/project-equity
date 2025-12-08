# Project Equity

A browser-based visual novel (sound novel) game engine built with React, TypeScript, and Vite.

> **Project Status**: Active Development | Chapters 1-5 Complete (Bilingual) | Planning Chapters 6-8

## Features

- 📖 Multi-chapter story system
- 🎨 Advanced character rendering with multi-slot positioning (left/center/right)
- 🎵 Background music and sound effects
- 💾 Save/Load system
- ⚙️ Configurable settings (text speed, volume)
- 🎭 Dynamic character effects (scale, opacity, filters)
- 🌐 Browser-based, no installation required
- 🗣️ Bilingual support (Japanese/English)

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Clone or download the project
cd sound-novel-game

# Install dependencies
npm install

# Start development server
npm run dev
```

The game will be available at `http://localhost:5173`

## Development Commands

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview
```

## Project Structure

```
project-equity/
├── src/
│   ├── assets/          # Images, audio, fonts
│   │   ├── audio/       # Background music and sound effects
│   │   └── images/      # Backgrounds and character sprites
│   ├── components/      # React components
│   ├── data/            # Chapter data (JSON)
│   │   └── chapters/    # Chapter JSON files
│   ├── engine/          # Core game logic
│   ├── hooks/           # Custom React hooks
│   └── App.tsx          # Main application
├── docs/                # Documentation
│   ├── PROJECT_GUIDE.md
│   ├── CHAPTER_AUTHORING_GUIDE.md
│   └── ASSET_GUIDELINES.md
├── public/              # Static assets
├── CREDITS.md           # Asset attribution
├── CONTRIBUTING.md      # Contribution guidelines
└── package.json
```

## Adding New Content

### Adding a New Chapter

1. Create a new JSON file in `src/data/chapters/`
2. Follow the schema defined in `src/engine/types.ts`
3. Import and register in `src/App.tsx`

Example chapter structure:

```json
{
  "scenes": [
    {
      "id": "scene1",
      "text": {
        "ja": "物語のテキスト",
        "en": "Story text here"
      },
      "backgroundId": "bg_room",
      "nextSceneId": "scene2",
      "characters": {
        "center": "character_neutral"
      }
    }
  ]
}
```

_Note: `text` can be a simple string (for single language) or an object with `ja` and `en` keys._

### Adding Character Sprites

1. Place PNG files in `src/assets/images/characters/`
2. Use transparent backgrounds
3. Reference by filename (without extension) in chapter JSON

**Advanced character configuration:**

```json
{
  "center": {
    "image": "character_id",
    "scale": 0.8,
    "opacity": 0.5,
    "filter": "grayscale(50%)"
  }
}
```

### Adding Background Images

1. Place PNG files in `src/assets/images/backgrounds/`
2. Reference by filename (without extension) as `backgroundId`

### Adding Audio

- **BGM**: Place in `src/assets/audio/bgm/`
- **SE**: Place in `src/assets/audio/se/`
- Supported formats: MP3

## Character System

The game supports a sophisticated multi-slot character system:

- **Positions**: `left`, `center`, `right`
- **Properties**: scale, opacity, xOffset, yOffset, filter
- **Backward Compatible**: Simple string IDs or full config objects

## Configuration

Edit `src/engine/types.ts` to modify:

- Default text speed
- Volume levels
- Game state structure

## Building for Production

```bash
npm run build
```

Output will be in the `dist/` directory. Deploy these files to any static web host.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Zod** - Runtime validation

## Documentation

- [Project Guide](docs/PROJECT_GUIDE.md) - Complete project structure and architecture guide
- [Chapter Authoring Guide](docs/CHAPTER_AUTHORING_GUIDE.md) - Complete guide for creating chapters 5-8
- [Asset Guidelines](docs/ASSET_GUIDELINES.md) - Asset specifications and optimization
- [Contributing](CONTRIBUTING.md) - How to contribute to the project
- [Credits](CREDITS.md) - Asset attribution and licenses

## License

MIT License - See [LICENSE.md](LICENSE.md) for details.

Third-party assets have their own licenses - see [CREDITS.md](CREDITS.md).

## Credits

Game Engine: [Your name/team]
