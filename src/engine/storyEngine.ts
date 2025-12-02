import type { GameState, Scene } from './types';
import type { ChapterData } from './validator';
import { GameError } from './errors';

export class StoryEngine {
  private scenes: Map<string, Scene>;
  private state: GameState;

  constructor(chapterData: ChapterData, initialState?: GameState) {
    // Type assertion is safe because ChapterData scenes match Scene structure
    this.scenes = new Map(chapterData.scenes.map(scene => [scene.id, scene as Scene]));
    this.state = initialState || {
      currentSceneId: chapterData.scenes[0].id,
      flags: {},
      history: [],
      log: [],
    };
  }

  getCurrentScene(): Scene {
    const scene = this.scenes.get(this.state.currentSceneId);
    if (!scene) {
      throw new GameError('SCENE_NOT_FOUND', `Scene ${this.state.currentSceneId} not found`);
    }
    return scene;
  }

  makeChoice(choiceId: string) {
    const scene = this.getCurrentScene();
    if (!scene.choices) {
      throw new GameError('INVALID_ACTION', 'Current scene has no choices');
    }
    const choice = scene.choices.find(c => c.id === choiceId);
    if (!choice) {
      throw new GameError('INVALID_CHOICE', `Choice ${choiceId} not found`);
    }

    // TODO: Check conditions if any

    this.transitionTo(choice.nextSceneId);
  }

  proceed() {
    const scene = this.getCurrentScene();
    if (scene.choices && scene.choices.length > 0) {
      throw new GameError('WAITING_FOR_CHOICE', 'Cannot proceed without making a choice');
    }
    if (scene.type === 'ending') {
       // Game over or ending reached
       return;
    }
    if (!scene.nextSceneId) {
      throw new GameError('SCENE_FLOW_ERROR', 'No next scene defined');
    }
    this.transitionTo(scene.nextSceneId);
  }

  private transitionTo(nextSceneId: string) {
    if (!this.scenes.has(nextSceneId)) {
      throw new GameError('SCENE_NOT_FOUND', `Next scene ${nextSceneId} not found`);
    }
    
    // Add current scene text to log before transitioning
    const currentScene = this.getCurrentScene();
    this.state.log.push({
      characterName: currentScene.characterId,
      text: currentScene.text
    });

    this.state.history.push(this.state.currentSceneId);
    this.state.currentSceneId = nextSceneId;
  }

  getState(): GameState {
    return { ...this.state };
  }

  loadState(state: GameState) {
    // Basic validation
    if (!this.scenes.has(state.currentSceneId)) {
       throw new GameError('INVALID_STATE', `Scene ${state.currentSceneId} in save data does not exist`);
    }
    this.state = { ...state };
  }
}
