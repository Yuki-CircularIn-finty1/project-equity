# Source Materials

This directory contains the original source materials used to create the Project Equity sound novel game.

## Directory Structure

```
source-materials/
├── chapters/
│   ├── text/              # Original chapter text files
│   │   ├── chapter1.txt   # Chapter 1 source
│   │   ├── chapter2.txt   # Chapter 2 source
│   │   ├── chapter3.txt   # Chapter 3 source
│   │   ├── chapter4.txt   # Chapter 4 source
│   │   └── templates/     # Templates for new chapters
│   └── characters/        # Character personality profiles (MBTI/Enneagram)
│       ├── HARUKA_INFP_Type_4.json
│       ├── KURUMI_ENFJ_Type_2.json
│       ├── K_ENTJ_Type_8.json
│       ├── TEN_ISFP_Type_9.json
│       └── TOMOYA_ESTP_Type_7.json
└── planning/              # Project planning documents
    ├── requirements_v0.1.txt
    └── repository_structure_v0.1.txt
```

## Workflow

### Adding a New Chapter (Chapters 5-8)

1. **Create Source Text**

   - Write the chapter text in a `.txt` file
   - Save as `chapterN.txt` in `chapters/text/`
   - Use existing chapters as reference for structure

2. **Convert to JSON**

   - Use the chapter text to create a corresponding JSON file
   - Save as `chapterN.json` in `src/data/chapters/`
   - Follow the schema in `src/engine/types.ts`

3. **Prepare Assets**

   - Add required background images to `src/assets/images/backgrounds/`
   - Add required character sprites to `src/assets/images/characters/`
   - Add BGM tracks to `src/assets/audio/bgm/`
   - Add sound effects to `src/assets/audio/se/`
   - **Don't forget to update `CREDITS.md` with asset attribution!**

4. **Validate**
   - Run `npm run generate-assets` to update asset types
   - Run `npm run build` to check for errors
   - Test the chapter in the game

## Character Profiles

Character JSON files contain personality information (MBTI type and Enneagram type) used for maintaining consistent characterization across chapters.

## Notes

- Keep source text files as the "source of truth"
- JSON chapter files are derived from text files
- Always maintain both text and JSON versions for reference
- Update this README if the workflow changes
