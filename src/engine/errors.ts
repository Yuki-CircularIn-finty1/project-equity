export class GameError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = 'GameError';
  }
}

export class ScenarioLoadError extends GameError {
  constructor(message: string) {
    super('SCENARIO_LOAD_ERROR', message);
  }
}

export class AssetLoadError extends GameError {
  constructor(assetType: string, path: string) {
    super('ASSET_LOAD_ERROR', `Failed to load ${assetType}: ${path}`);
  }
}

export class ValidationError extends GameError {
  constructor(message: string) {
    super('VALIDATION_ERROR', message);
  }
}
