/**
 * game/scenes/BootScene.ts
 *
 * The very first scene. Initialises the global game state
 * in Phaser's registry (a key-value store shared between scenes)
 * and immediately transitions to PreloadScene.
 */
import Phaser from 'phaser';
import { SceneKey } from '@/types/game';
import { DEFAULT_GAME_STATE } from '../config/gameConfig';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: SceneKey.Boot });
  }

  create(): void {
    // Seed the registry so every scene can read / write shared state
    const reg = this.registry;
    reg.set('score',     DEFAULT_GAME_STATE.score);
    reg.set('lives',     DEFAULT_GAME_STATE.lives);
    reg.set('coins',     DEFAULT_GAME_STATE.coins);
    reg.set('level',     DEFAULT_GAME_STATE.level);
    reg.set('highScore', DEFAULT_GAME_STATE.highScore);
    reg.set('paused',    false);

    // Go straight to the preloader
    this.scene.start(SceneKey.Preload);
  }
}
