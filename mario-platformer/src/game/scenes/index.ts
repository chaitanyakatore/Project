/**
 * game/scenes/index.ts
 *
 * Barrel export for all scenes. Import from here to keep GameManager clean.
 */
export { BootScene }     from './BootScene';
export { PreloadScene }  from './PreloadScene';
export { MainMenuScene } from './MainMenuScene';
export { GameScene }     from './GameScene';
export { HUDScene }      from './HUDScene';
export { PauseScene }    from './PauseScene';
export { GameOverScene, WinScene } from './EndScenes';
