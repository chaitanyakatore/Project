/**
 * game/scenes/GameOverScene.ts
 *
 * Shown when the player runs out of lives.
 * Displays final score and high score, then allows retry or menu.
 */
import Phaser from 'phaser';
import { SceneKey } from '@/types/game';
import { GAME_WIDTH, GAME_HEIGHT, DEFAULT_GAME_STATE } from '../config/gameConfig';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: SceneKey.GameOver });
  }

  create(): void {
    // Background
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x1a1a1a).setOrigin(0);

    // Scanline feel
    for (let y = 0; y < GAME_HEIGHT; y += 4) {
      this.add.rectangle(0, y, GAME_WIDTH, 2, 0x000000, 0.2).setOrigin(0);
    }

    const score     = this.registry.get('score') as number ?? 0;
    const highScore = this.registry.get('highScore') as number ?? 0;

    // Title
    this.add.text(GAME_WIDTH / 2, 80, 'GAME OVER', {
      fontFamily: '"Press Start 2P"',
      fontSize: '32px',
      color: '#E52521',
      stroke: '#000',
      strokeThickness: 6,
    }).setOrigin(0.5);

    // Score
    this.add.text(GAME_WIDTH / 2, 180, `SCORE\n${String(score).padStart(6, '0')}`, {
      fontFamily: '"Press Start 2P"',
      fontSize: '16px',
      color: '#FBD000',
      stroke: '#000',
      strokeThickness: 4,
      align: 'center',
      lineSpacing: 12,
    }).setOrigin(0.5);

    // High score
    this.add.text(GAME_WIDTH / 2, 260, `BEST\n${String(highScore).padStart(6, '0')}`, {
      fontFamily: '"Press Start 2P"',
      fontSize: '12px',
      color: '#ffffff',
      stroke: '#000',
      strokeThickness: 3,
      align: 'center',
      lineSpacing: 10,
    }).setOrigin(0.5);

    // Try again button
    this.createButton(GAME_WIDTH / 2, 340, 'TRY AGAIN', () => {
      // Reset score / lives in registry
      this.registry.set('score', DEFAULT_GAME_STATE.score);
      this.registry.set('lives', DEFAULT_GAME_STATE.lives);
      this.registry.set('coins', DEFAULT_GAME_STATE.coins);
      this.registry.set('level', DEFAULT_GAME_STATE.level);
      this.scene.start(SceneKey.Game);
      this.scene.start(SceneKey.HUD);
    });

    // Main menu
    this.createButton(GAME_WIDTH / 2, 400, 'MAIN MENU', () => {
      this.registry.set('score', DEFAULT_GAME_STATE.score);
      this.registry.set('lives', DEFAULT_GAME_STATE.lives);
      this.registry.set('coins', DEFAULT_GAME_STATE.coins);
      this.registry.set('level', DEFAULT_GAME_STATE.level);
      this.scene.start(SceneKey.MainMenu);
    });
  }

  private createButton(x: number, y: number, label: string, onClick: () => void): void {
    const btn = this.add.text(x, y, label, {
      fontFamily: '"Press Start 2P"',
      fontSize: '14px',
      color: '#FBD000',
      stroke: '#000',
      strokeThickness: 4,
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btn.on('pointerover', () => btn.setStyle({ color: '#ffffff' }));
    btn.on('pointerout',  () => btn.setStyle({ color: '#FBD000' }));
    btn.on('pointerdown', onClick);
  }
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * game/scenes/WinScene.ts (exported from same file for convenience)
 *
 * Shown when the player reaches the goal flag.
 */
export class WinScene extends Phaser.Scene {
  constructor() {
    super({ key: SceneKey.Win });
  }

  create(): void {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000033).setOrigin(0);

    const score = this.registry.get('score') as number ?? 0;

    // Stars decoration
    for (let i = 0; i < 40; i++) {
      const x = Phaser.Math.Between(0, GAME_WIDTH);
      const y = Phaser.Math.Between(0, GAME_HEIGHT * 0.6);
      const star = this.add.circle(x, y, Phaser.Math.Between(1, 3), 0xFFFFFF);
      this.tweens.add({
        targets: star,
        alpha: 0.2,
        duration: Phaser.Math.Between(500, 1500),
        yoyo: true,
        repeat: -1,
      });
    }

    this.add.text(GAME_WIDTH / 2, 100, 'YOU WIN!', {
      fontFamily: '"Press Start 2P"',
      fontSize: '36px',
      color: '#FBD000',
      stroke: '#000',
      strokeThickness: 7,
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 200, 'CONGRATULATIONS!', {
      fontFamily: '"Press Start 2P"',
      fontSize: '12px',
      color: '#ffffff',
      stroke: '#000',
      strokeThickness: 4,
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 260, `FINAL SCORE\n${String(score).padStart(6, '0')}`, {
      fontFamily: '"Press Start 2P"',
      fontSize: '16px',
      color: '#FBD000',
      stroke: '#000',
      strokeThickness: 4,
      align: 'center',
      lineSpacing: 14,
    }).setOrigin(0.5);

    this.createButton(GAME_WIDTH / 2, 360, 'PLAY AGAIN', () => {
      this.registry.set('score', 0);
      this.registry.set('lives', 3);
      this.registry.set('coins', 0);
      this.registry.set('level', 1);
      this.scene.start(SceneKey.Game);
      this.scene.start(SceneKey.HUD);
    });

    this.createButton(GAME_WIDTH / 2, 418, 'MAIN MENU', () => {
      this.scene.start(SceneKey.MainMenu);
    });
  }

  private createButton(x: number, y: number, label: string, onClick: () => void): void {
    const btn = this.add.text(x, y, label, {
      fontFamily: '"Press Start 2P"',
      fontSize: '14px',
      color: '#43B047',
      stroke: '#000',
      strokeThickness: 4,
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btn.on('pointerover', () => btn.setStyle({ color: '#FBD000' }));
    btn.on('pointerout',  () => btn.setStyle({ color: '#43B047' }));
    btn.on('pointerdown', onClick);
  }
}
