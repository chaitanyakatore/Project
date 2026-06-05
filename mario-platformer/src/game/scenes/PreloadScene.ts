/**
 * game/scenes/PreloadScene.ts
 *
 * Generates all placeholder textures via the sprite generator utilities,
 * shows a loading bar, then starts the MainMenuScene.
 *
 * If you add real sprite sheets later, load them here with:
 *   this.load.spritesheet('player', '/assets/sprites/player.png', { frameWidth: 32, frameHeight: 32 });
 */
import Phaser from 'phaser';
import { SceneKey } from '@/types/game';
import { generateAllSprites } from '../utils/spriteGenerator';
import { GAME_WIDTH, GAME_HEIGHT } from '../config/gameConfig';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: SceneKey.Preload });
  }

  preload(): void {
    // Draw a simple loading bar
    const barW = 300;
    const barH = 20;
    const barX = (GAME_WIDTH - barW) / 2;
    const barY = GAME_HEIGHT / 2 - 10;

    const bg   = this.add.graphics();
    const fill = this.add.graphics();

    bg.fillStyle(0x222222);
    bg.fillRect(barX - 2, barY - 2, barW + 4, barH + 4);

    this.add.text(GAME_WIDTH / 2, barY - 30, 'LOADING...', {
      fontFamily: '"Press Start 2P"',
      fontSize: '12px',
      color: '#ffffff',
    }).setOrigin(0.5);

    // Progress callback
    this.load.on('progress', (value: number) => {
      fill.clear();
      fill.fillStyle(0xFBD000);
      fill.fillRect(barX, barY, barW * value, barH);
    });

    // If you have real audio files, load them here:
    // this.load.audio('bgm_main', '/assets/audio/bgm.mp3');
  }

  create(): void {
    // Generate all programmatic placeholder sprites
    generateAllSprites(this);

    // Small delay so the player sees 100% loading bar
    this.time.delayedCall(300, () => {
      this.scene.start(SceneKey.MainMenu);
    });
  }
}
