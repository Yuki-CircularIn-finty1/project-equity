---
description: How to add a new chapter to the sound novel game
---

# Add New Chapter Workflow

This workflow guides you through the process of adding a new chapter to the sound novel game. It emphasizes **metacognition** (deeply understanding the content) and **logging** (tracking your work).

## 1. Metacognition & Preparation

Before writing any code, you must deeply understand the chapter you are about to add.

1.  **Read the Source Material**: Read the text file for the new chapter (e.g., `4章.txt`).
2.  **Analyze the Narrative**:
    - What is the emotional tone of this chapter?
    - Who are the key characters involved?
    - What are the major plot points?
    - _Self-Correction_: Does this chapter require new game mechanics or just standard text/choices?
3.  **Asset Audit**:
    - Identify necessary Backgrounds (BGs). Do they already exist?
    - Identify necessary Background Music (BGM). Does it match the tone?
    - Identify necessary Sound Effects (SE). Are there specific sounds described in the text?

## 2. Asset Implementation

If new assets are required, add them now.

1.  **Images**: Place new background images in `src/assets/images/`.
2.  **Audio**: Place new audio files in `src/assets/audio/`.
3.  **Type Generation**: Run the asset type generator to update TypeScript definitions.
    ```powershell
    npx tsx scripts/generate-asset-types.ts
    ```

## 3. Data Creation

Create the structured data for the chapter.

1.  **Create JSON**: Create a new file `src/data/chapters/chapterX.json` (replace X with the chapter number).
2.  **Structure Content**: Follow the schema defined in `src/engine/types.ts` (or existing chapters).
    - `scenes`: Array of scene objects.
    - `id`: Unique scene ID (e.g., `scene_chapterX_start`).
    - `text`: The narrative text.
    - `backgroundId`: Reference to the background image.
    - `bgm`: (Optional) Reference to the background music.
    - `choices`: (Optional) Array of choices for branching paths.
3.  **Review**: Read through the JSON. Does the flow match your narrative analysis from Step 1?

## 4. Code Registration

Register the new chapter in the game engine.

1.  **Import Data**: Open `src/context/GameContext.tsx`.
2.  **Add Import**: Import the new JSON file.
    ```typescript
    import chapterXData from "../data/chapters/chapterX.json";
    ```
3.  **Update Logic**: Update the `useEffect` hook that initializes the engine to include the new chapter.
    ```typescript
    // Inside GameProvider component
    const data =
      state.selectedChapterId === "chapter3"
        ? chapter3Data
        : state.selectedChapterId === "chapter2"
        ? chapter2Data
        : state.selectedChapterId === "chapterX"
        ? chapterXData // Add this line
        : chapter1Data;
    ```
4.  **Update UI**: Ensure the chapter selection UI (e.g., in `App.tsx` or a menu component) allows the user to select the new chapter.

## 5. Verification

Verify that the chapter works as intended.

1.  **Build**: Run `npm run build` to check for type errors.
2.  **Run**: Start the dev server with `npm run dev`.
3.  **Playtest**: Play through the new chapter.
    - Do the backgrounds load?
    - Does the music play?
    - Do the choices work?
    - _Metacognition Check_: Does the experience feel right emotionally?

## 6. Logging

Document your work.

1.  **Update Changelog**: Open `CHANGELOG.md` and add an entry for the new chapter.

    ```markdown
    ### Added

    - Chapter X implementation
    ```

2.  **Reflect**: Briefly note any challenges encountered or design decisions made during this process in your internal logs or task comments.
