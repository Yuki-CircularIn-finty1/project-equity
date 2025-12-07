---
description: How to add a new chapter to the sound novel game
---

# Add New Chapter Workflow

This workflow guides you through the process of adding a new chapter to the sound novel game. It emphasizes **metacognition** (deeply understanding the content), **bilingual support**, and **comprehensive verification**.

## 1. Metacognition & Preparation

Before writing any code, you must deeply understand the chapter you are about to add and prepare for bilingual implementation.

1.  **Read the Source Material**: Read the text file for the new chapter (e.g., `4章.txt`).
2.  **Analyze the Narrative**:
    - **Emotional Tone**: What is the mood? (Determines BGM)
    - **Key Characters**: Who appears? Do they need new expressions? (Determines Character Assets)
    - **Soundscapes**: Are there specific sounds (clinking glass, rain, footsteps)? (Determines SE)
    - **Branching**: Are there choices? What flags do they set or check?
3.  **Translation Strategy**:
    - Use a translation tool or LLM to prepare the English translation for the narrative text.
    - Ensure the translation captures the nuance of the original Japanese.
4.  **Asset Audit**:
    - **Backgrounds (BGs)**: Check `src/assets/images/backgrounds`. Do you need new ones?
    - **Characters**: Check `src/assets/images/characters`. Do you need new poses/expressions?
    - **Audio**: Check `src/assets/audio/bgm` and `src/assets/audio/se`. Do you need new tracks?

## 2. Asset Implementation

If new assets are required, add them now before creating the data.

1.  **Images**:
    - Backgrounds: Place in `src/assets/images/backgrounds/`.
    - Characters: Place in `src/assets/images/characters/`.
2.  **Audio**:
    - BGM: Place in `src/assets/audio/bgm/`.
    - SE: Place in `src/assets/audio/se/`.
3.  **Type Generation (Critical)**:
    Run the asset type generator to update TypeScript definitions. This ensures you get autocomplete for your new asset IDs.
    // turbo
    ```powershell
    npx tsx scripts/generate-asset-types.ts
    ```

## 3. Data Creation

Create the structured data for the chapter using the JSON format.

1.  **Create JSON**: Create a new file `src/data/chapters/chapterX.json` (replace X with the chapter number).
2.  **Structure Content**: Follow the schema defined in `src/engine/types.ts`.
    
    **Basic Scene Structure:**
    ```json
    {
      "id": "scene_unique_id",
      "text": {
        "ja": "日本語のテキスト...",
        "en": "English text..."
      },
      "backgroundId": "bg_your_background_id",
      "nextSceneId": "scene_next_id"
    }
    ```

    **Advanced Features:**
    - **Characters**: Use the `characters` object to position sprites.
      ```json
      "characters": {
        "center": "character_image_id",
        "left": { "image": "other_char_id", "scale": 0.9 }
      }
      ```
    - **Audio**:
      ```json
      "bgm": "bgm_track_id",
      "se": "se_effect_id",
      "seRepeat": 1, // Optional: number of repeats
      "seInterval": 500 // Optional: ms between repeats
      ```
    - **Choices**:
      ```json
      "choices": [
        {
          "id": "choice_a",
          "text": { "ja": "選択肢A", "en": "Choice A" },
          "nextSceneId": "scene_outcome_a"
        }
      ]
      ```

## 4. Code Registration

Register the new chapter in the game engine context.

1.  **Open Context File**: Open `src/context/GameContext.tsx`.
2.  **Import Data**: Import your new JSON file at the top.
    ```typescript
    import chapterXData from '../data/chapters/chapterX.json';
    ```
3.  **Update Initialization Logic**: Locate the `useEffect` hook inside `GameProvider` (approx. line 113) and update the ternary logic.
    > [!WARNING]
    > Be careful with the nested ternary syntax. Ensure syntax correctness.
    
    ```typescript
    const data = state.selectedChapterId === 'chapter4' ? chapter4Data
               : state.selectedChapterId === 'chapterX' ? chapterXData // Add your new chapter
               : state.selectedChapterId === 'chapter3' ? chapter3Data
               // ... existing code
    ```

## 5. Verification

Verify that the chapter works as intended in both languages.

1.  **Build Check**: Run `npm run build` to ensure no TypeScript errors (especially regarding missing asset IDs).
2.  **Dev Server**: Start with `npm run dev`.
3.  **Playtest Checklist**:
    - [ ] **Assets**: Do backgrounds and characters load correctly?
    - [ ] **Audio**: Does BGM loop? Do SEs play at the right time?
    - [ ] **Flow**: Do logical jumps (choices) work?
    - [ ] **Bilingual**: Switch language to English. Is the text correct? Does it fit in the box?
    - [ ] **Autosave**: Does the game autosave correctly during the chapter?

## 6. Logging & Documentation

Document your work.

1.  **Update Changelog**: Open `CHANGELOG.md` and add an entry.
    ```markdown
    ### Added
    - Chapter X implementation (Bilingual support included)
    ```
2.  **Reflect**: Note any improvements for the next chapter implementation in your task notes.
