/**
 * game/GameManager.ts
 *
 * Owns and manages the Phaser.Game instance lifecycle.
 * This is a class (not a React component) so that Phaser's
 * imperative API stays completely separate from React.
 *
 * Usage:
 *   const manager = new GameManager(divElement);
 *   manager.destroy(); // call on React component unmount
 */
import Phaser from 'phaser';
import { buildPhaserConfig } from './config/gameConfig';
import {
  BootScene,
  PreloadScene,
  MainMenuScene,
  GameScene,
  HUDScene,
  PauseScene,
  GameOverScene,
  WinScene,
} from './scenes';

export class GameManager {
  private game: Phaser.Game;

  constructor(parent: HTMLElement) {
    // Instantiate all scenes (order matters — Boot is first)
    const scenes = [
      new BootScene(),
      new PreloadScene(),
      new MainMenuScene(),
      new GameScene(),
      new HUDScene(),
      new PauseScene(),
      new GameOverScene(),
      new WinScene(),
    ];

    const config = buildPhaserConfig(parent, scenes);
    this.game = new Phaser.Game(config);
  }

  destroy(): void {
    this.game.destroy(true);
  }

  get instance(): Phaser.Game {
    return this.game;
  }
}
