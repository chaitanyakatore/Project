/**
 * game/scenes/PauseScene.ts
 *
 * Semi-transparent pause overlay. Runs on top of GameScene.
 * Sends resume/quit events back to GameScene.
 */
import Phaser from 'phaser';
import { SceneKey } from '@/types/game';
import { GAME_WIDTH, GAME_HEIGHT } from '../config/gameConfig';

export class PauseScene extends Phaser.Scene {
  constructor() {
    super({ key: SceneKey.Pause });
  }

  create(): void {
    // Dim overlay
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.7).setOrigin(0);

    // Title
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 80, 'PAUSED', {
      fontFamily: '"Press Start 2P"',
      fontSize: '28px',
      color: '#FBD000',
      stroke: '#000',
      strokeThickness: 6,
    }).setOrigin(0.5);

    // Resume button
    this.createButton(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'RESUME', () => {
      this.resumeGame();
    });

    // Restart button
    this.createButton(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 60, 'RESTART LEVEL', () => {
      this.scene.stop(SceneKey.Pause);
      this.scene.stop(SceneKey.HUD);
      this.scene.start(SceneKey.Game);
      this.scene.start(SceneKey.HUD);
    });

    // Main menu button
    this.createButton(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 120, 'MAIN MENU', () => {
      this.scene.stop(SceneKey.Pause);
      this.scene.stop(SceneKey.HUD);
      this.scene.stop(SceneKey.Game);
      this.scene.start(SceneKey.MainMenu);
    });

    // P / ESC to resume
    this.input.keyboard!.on('keydown-P',   () => this.resumeGame());
    this.input.keyboard!.on('keydown-ESC', () => this.resumeGame());
  }

  private resumeGame(): void {
    // Tell GameScene to unpause its physics
    const gameScene = this.scene.get(SceneKey.Game) as Phaser.Scene & { resume: () => void };
    gameScene.resume?.();
    this.scene.stop(SceneKey.Pause);
  }

  private createButton(
    x: number, y: number,
    label: string,
    onClick: () => void
  ): Phaser.GameObjects.Text {
    const btn = this.add.text(x, y, label, {
      fontFamily: '"Press Start 2P"',
      fontSize: '14px',
      color: '#ffffff',
      stroke: '#000',
      strokeThickness: 4,
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btn.on('pointerover', () => btn.setStyle({ color: '#FBD000' }));
    btn.on('pointerout',  () => btn.setStyle({ color: '#ffffff' }));
    btn.on('pointerdown', onClick);
    return btn;
  }
}
